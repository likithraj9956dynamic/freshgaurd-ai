import { z } from 'zod';

export const createActionSchema = z.object({
  storeId: z.string(),
  issueId: z.string().optional(),
  actionType: z.enum(['markdown', 'urgent_replenishment', 'inter_store_transfer', 'store_task']),
  title: z.string().min(3),
  proposal: z.record(z.any()).optional().default({}),
  estimatedImpact: z.record(z.any()).optional().default({}),
  createdBy: z.string().optional().default('system_proposer'),
});

export const actionDecisionSchema = z.object({
  approver: z.string().min(1, 'Approver name/ID is required'),
  reason: z.string().optional().default('Standard operational sign-off'),
});

export const executeActionSchema = z.object({
  executedBy: z.string().optional().default('store_manager'),
  executionNotes: z.string().optional(),
});
