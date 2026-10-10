import { prisma } from '../config/prisma';
import { StoreService } from './store.service';
import { BadRequestError, NotFoundError } from '../utils/errors';

export interface ActionModel {
  id: string;
  storeId: string;
  issueId?: string;
  actionType: 'markdown' | 'urgent_replenishment' | 'inter_store_transfer' | 'store_task';
  title: string;
  proposal: Record<string, any>;
  estimatedImpact: Record<string, any>;
  status: 'proposed' | 'pending_approval' | 'approved' | 'rejected' | 'executing' | 'completed' | 'failed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  executedAt?: string;
  approvals?: Array<{
    id: string;
    decision: string;
    approver: string;
    reason: string;
    decidedAt: string;
  }>;
  executionResult?: Record<string, any>;
}

// In-memory state store for fallback and fast access
const memoryActions = new Map<string, ActionModel>();
const memoryAuditLogs: Array<{ id: string; actionId?: string; actor: string; eventType: string; details: any; createdAt: string }> = [];

export class ActionEngineService {
  /**
   * Propose a new Action
   */
  static async createAction(data: {
    storeId: string;
    issueId?: string;
    actionType: 'markdown' | 'urgent_replenishment' | 'inter_store_transfer' | 'store_task';
    title: string;
    proposal?: Record<string, any>;
    estimatedImpact?: Record<string, any>;
    createdBy?: string;
  }): Promise<ActionModel> {
    const store = await StoreService.getStoreById(data.storeId);
    if (!store) {
      throw new NotFoundError(`Store '${data.storeId}' not found`);
    }

    const actionId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const action: ActionModel = {
      id: actionId,
      storeId: data.storeId,
      issueId: data.issueId,
      actionType: data.actionType,
      title: data.title,
      proposal: data.proposal || {},
      estimatedImpact: data.estimatedImpact || {},
      status: 'pending_approval',
      createdBy: data.createdBy || 'ai_decision_engine',
      createdAt: new Date().toISOString(),
      approvals: [],
    };

    memoryActions.set(actionId, action);

    // Audit Log: Action Proposed
    this.logAudit({
      actionId,
      actor: action.createdBy,
      eventType: 'action_proposed',
      details: { title: action.title, actionType: action.actionType, storeId: action.storeId },
    });

    // Save to DB if possible
    try {
      await prisma.action.create({
        data: {
          id: actionId,
          storeId: action.storeId,
          issueId: action.issueId || null,
          actionType: action.actionType,
          title: action.title,
          proposal: action.proposal as any,
          estimatedImpact: action.estimatedImpact as any,
          status: 'pending_approval',
          createdBy: action.createdBy,
        },
      });
    } catch {
      // Fallback
    }

    return action;
  }

  /**
   * Approve an Action (Strict Human Approval)
   */
  static async approveAction(actionId: string, approver: string, reason: string): Promise<ActionModel> {
    const action = await this.getAction(actionId);

    if (action.status === 'completed' || action.status === 'executing') {
      throw new BadRequestError(`Cannot approve an action that is already ${action.status}`);
    }

    // State transition -> approved
    action.status = 'approved';
    const approvalRecord = {
      id: `appr_${Date.now()}`,
      decision: 'approved',
      approver,
      reason,
      decidedAt: new Date().toISOString(),
    };
    action.approvals = [...(action.approvals || []), approvalRecord];
    memoryActions.set(actionId, action);

    // Audit Log
    this.logAudit({
      actionId,
      actor: approver,
      eventType: 'action_approved',
      details: { reason, decidedAt: approvalRecord.decidedAt },
    });

    // DB Update
    try {
      await prisma.$transaction([
        prisma.action.update({
          where: { id: actionId },
          data: { status: 'approved' },
        }),
        prisma.actionApproval.create({
          data: {
            actionId,
            decision: 'approved',
            approver,
            reason,
          },
        }),
      ]);
    } catch {
      // Fallback
    }

    return action;
  }

  /**
   * Reject an Action
   */
  static async rejectAction(actionId: string, approver: string, reason: string): Promise<ActionModel> {
    const action = await this.getAction(actionId);

    if (action.status === 'completed' || action.status === 'executing') {
      throw new BadRequestError(`Cannot reject an action that is already ${action.status}`);
    }

    // State transition -> rejected
    action.status = 'rejected';
    const rejectionRecord = {
      id: `rej_${Date.now()}`,
      decision: 'rejected',
      approver,
      reason,
      decidedAt: new Date().toISOString(),
    };
    action.approvals = [...(action.approvals || []), rejectionRecord];
    memoryActions.set(actionId, action);

    // Audit Log
    this.logAudit({
      actionId,
      actor: approver,
      eventType: 'action_rejected',
      details: { reason, decidedAt: rejectionRecord.decidedAt },
    });

    // DB Update
    try {
      await prisma.$transaction([
        prisma.action.update({
          where: { id: actionId },
          data: { status: 'rejected' },
        }),
        prisma.actionApproval.create({
          data: {
            actionId,
            decision: 'rejected',
            approver,
            reason,
          },
        }),
      ]);
    } catch {
      // Fallback
    }

    return action;
  }

  /**
   * Execute Action (Enforces Approval Requirement and Prevents Duplicate Execution)
   */
  static async executeAction(actionId: string, executedBy: string, notes?: string): Promise<{
    action: ActionModel;
    executionResult: any;
    generatedTasks: any[];
  }> {
    const action = await this.getAction(actionId);

    // 1. STRICT ENFORCEMENT: Check that human approval exists and status is 'approved'
    if (action.status !== 'approved') {
      throw new BadRequestError(
        `Action execution blocked: Action '${actionId}' has NOT received human approval (Current status: '${action.status}'). Every action requires explicit human sign-off before execution.`
      );
    }

    // 2. Set status to executing (concurrency boundary)
    action.status = 'executing';

    // 3. Dispatch Execution Workflows & Generate Store Tasks
    const generatedTasks: any[] = [];
    const executionTimestamp = new Date().toISOString();

    if (action.actionType === 'markdown') {
      generatedTasks.push({
        id: `task_${Date.now()}_1`,
        storeId: action.storeId,
        actionId,
        title: 'Apply 25% Expiry Markdown Shelf Tags',
        instructions: 'Scan Organic Milk & Fresh Produce items with shelf life Γëñ 48 hours. Place yellow discount tags and sync price point with register system.',
        priority: 'urgent',
        status: 'pending',
        assignedTo: 'Store Floor Lead',
        dueDate: new Date().toISOString().split('T')[0],
      });
    } else if (action.actionType === 'urgent_replenishment') {
      generatedTasks.push({
        id: `task_${Date.now()}_2`,
        storeId: action.storeId,
        actionId,
        title: 'Priority Dock Receiving: Expedited Dairy & Seafood',
        instructions: 'Clear receiving bay for express delivery carrier arriving today at 14:00. Verify temperature logs immediately upon offload.',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Receiving Associate',
        dueDate: new Date().toISOString().split('T')[0],
      });
    } else if (action.actionType === 'inter_store_transfer') {
      generatedTasks.push({
        id: `task_${Date.now()}_3`,
        storeId: action.storeId,
        actionId,
        title: 'Receive Inter-Store Stock Balancing Courier',
        instructions: 'Check in 40 transfer units from Whitefield (#FB-16) and restock refrigerated dairy display immediately.',
        priority: 'high',
        status: 'pending',
        assignedTo: 'Inventory Associate',
        dueDate: new Date().toISOString().split('T')[0],
      });
    } else {
      generatedTasks.push({
        id: `task_${Date.now()}_4`,
        storeId: action.storeId,
        actionId,
        title: action.title,
        instructions: 'Execute operational remediation protocol as approved.',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Store Associate',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }

    const executionResult = {
      id: `exec_${Date.now()}`,
      actionId,
      executionType: 'simulated_execution',
      executionStatus: 'success',
      executedBy,
      executedAt: executionTimestamp,
      executionDetails: {
        simulationEnvironment: 'FreshGuard Retail Operations Sandbox',
        notes: notes || 'Simulated execution completed without POS/WMS exceptions',
        tasksCreated: generatedTasks.length,
      },
      generatedTasks,
      auditSummary: `Action '${action.title}' approved by human operator and executed successfully into active store workflows.`,
    };

    // Transition to completed
    action.status = 'completed';
    action.executedAt = executionTimestamp;
    action.executionResult = executionResult;
    memoryActions.set(actionId, action);

    // Audit Log: Action Executed
    this.logAudit({
      actionId,
      actor: executedBy,
      eventType: 'action_executed',
      details: {
        executionType: executionResult.executionType,
        tasksCreated: generatedTasks.length,
        notes,
      },
    });

    // DB Record
    try {
      await prisma.$transaction([
        prisma.action.update({
          where: { id: actionId },
          data: {
            status: 'completed',
            executedAt: new Date(executionTimestamp),
          },
        }),
        prisma.actionExecutionResult.create({
          data: {
            id: executionResult.id,
            actionId,
            executionType: executionResult.executionType,
            executionStatus: 'success',
            executedBy,
            executionDetails: executionResult.executionDetails as any,
            generatedTasks: generatedTasks as any,
            auditSummary: executionResult.auditSummary,
          },
        }),
        ...generatedTasks.map((t) =>
          prisma.storeTask.create({
            data: {
              id: t.id,
              storeId: t.storeId,
              actionId,
              title: t.title,
              instructions: t.instructions,
              priority: t.priority,
              status: t.status,
              assignedTo: t.assignedTo,
              dueDate: new Date(t.dueDate),
            },
          })
        ),
      ]);
    } catch {
      // Fallback
    }

    return {
      action,
      executionResult,
      generatedTasks,
    };
  }

  /**
   * Get Action by ID
   */
  static async getAction(actionId: string): Promise<ActionModel> {
    if (memoryActions.has(actionId)) {
      return memoryActions.get(actionId)!;
    }

    try {
      const dbAction = await prisma.action.findUnique({
        where: { id: actionId },
        include: { approvals: true, executionResults: true },
      });
      if (dbAction) {
        const mapped: ActionModel = {
          id: dbAction.id,
          storeId: dbAction.storeId,
          issueId: dbAction.issueId || undefined,
          actionType: dbAction.actionType as any,
          title: dbAction.title,
          proposal: (dbAction.proposal as any) || {},
          estimatedImpact: (dbAction.estimatedImpact as any) || {},
          status: dbAction.status as any,
          createdBy: dbAction.createdBy || 'system',
          createdAt: dbAction.createdAt.toISOString(),
          executedAt: dbAction.executedAt?.toISOString(),
          approvals: dbAction.approvals.map((a) => ({
            id: a.id.toString(),
            decision: a.decision,
            approver: a.approver,
            reason: a.reason || '',
            decidedAt: a.decidedAt.toISOString(),
          })),
        };
        memoryActions.set(actionId, mapped);
        return mapped;
      }
    } catch {
      // Fallback
    }

    throw new NotFoundError(`Action '${actionId}' not found`);
  }

  /**
   * List all actions
   */
  static async listActions(filters: { storeId?: string; status?: string } = {}) {
    const list = Array.from(memoryActions.values());
    let filtered = list;
    if (filters.storeId) filtered = filtered.filter((a) => a.storeId === filters.storeId);
    if (filters.status) filtered = filtered.filter((a) => a.status === filters.status);
    return filtered;
  }

  /**
   * Internal Audit Logger
   */
  private static async logAudit(entry: {
    actionId?: string;
    actor: string;
    eventType: string;
    details: any;
  }) {
    const logItem = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actionId: entry.actionId,
      actor: entry.actor,
      eventType: entry.eventType,
      details: entry.details,
      createdAt: new Date().toISOString(),
    };
    memoryAuditLogs.push(logItem);

    try {
      await prisma.auditLog.create({
        data: {
          actionId: entry.actionId || null,
          actor: entry.actor,
          eventType: entry.eventType,
          details: entry.details as any,
        },
      });
    } catch {
      // Ignore
    }
  }
}
