import type { IssueEvidence } from './issue';
import type { TaskEvidence } from './network';

// ============================================================
// FreshGuard AI — Types (v3)
// ============================================================

// --- Detected Issue ---
export interface DetectedIssue {
  id: string;
  storeId: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'sales' | 'inventory' | 'wastage' | 'compliance' | 'operations' | 'supply-chain';
  urgencyScore: number;
  mainProblem: string;
  salesChangePercent: number;
  stockoutCount: number;
  wastageIncreasePercent: number;
  complianceIssues: string[];
  recommendedNextStep: string;
  evidence: IssueEvidence[];
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'awaiting-approval';
}

// --- Investigation ---
export interface Investigation {
  id: string;
  issueId: string;
  storeId: string;
  title: string;
  issueTitle: string;
  severity: 'info' | 'warning' | 'critical';
  affectedStore: string;
  evidenceSummary: string;
  hypothesis: InvestigationHypothesis;
  evidenceSources: InvestigationEvidence[];
  suggestedActions: InvestigationAction[];
  confidence: number;
  confidenceLevel: 'low' | 'medium' | 'high' | 'very-high';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'reviewed' | 'approved' | 'closed';
}

export interface InvestigationHypothesis {
  main: string;
  alternatives: string[];
  confidence: number;
  limitations: string[];
}

export interface InvestigationEvidence {
  id: string;
  label: string;
  type: 'metric' | 'record' | 'comparison' | 'note' | 'unknown';
  value: string;
  detail: string;
  source: string;
  isFact: boolean;
  isDerived: boolean;
  isHypothesis: boolean;
}

export interface InvestigationAction {
  id: string;
  title: string;
  description: string;
  type: 'investigate' | 'recommend' | 'escalate' | 'monitor' | 'inform';
  target: string;
  relatedIssueId?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  relatedStoreId?: string;
}

// --- Decision ---
export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  type: 'replenish' | 'transfer' | 'markdown' | 'escalate' | 'task-assign';
  estimatedBenefit: number;
  estimatedCost: number;
  riskLevel: 'low' | 'medium' | 'high';
  impact: {
    sales: number;
    revenue: number;
    margin: number;
    inventory: string;
    wastage: string;
  };
  requirements: string[];
  assumptions: string[];
  confidence: number;
  timeline: string;
  icon: string;
}

// --- Action ---
export interface Action {
  id: string;
  title: string;
  description: string;
  type: 'replenish' | 'transfer' | 'markdown' | 'escalate' | 'task-assign';
  storeId: string;
  storeName: string;
  proposedQuantity: number;
  unit: string;
  reason: string;
  evidenceSummary: string;
  expectedImpact: string;
  estimatedCost: number;
  estimatedSavings: number;
  status: 'pending-approval' | 'approved' | 'rejected' | 'executed' | 'cancelled';
  requestedAt: string;
  requestedBy: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  evidence: ActionEvidence[];
}

export interface ActionEvidence {
  label: string;
  detail: string;
  source: string;
  isFact: boolean;
}

// --- Store Task ---
export interface StoreTask {
  id: string;
  storeId: string;
  title: string;
  description: string;
  instruction: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  affectedProducts: string[];
  dueDate: string;
  status: 'pending' | 'acknowledged' | 'in-progress' | 'completed';
  assignedTo: string;
  completedBy?: string;
  completedAt?: string;
  evidence: TaskEvidence[];
  createdAt: string;
}
