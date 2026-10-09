import { z } from 'zod';

export const generateDecisionSchema = z.object({
  storeId: z.string(),
  issueId: z.string().optional(),
  title: z.string().optional(),
});

export const simulateDecisionSchema = z.object({
  optionId: z.string().optional(),
  simulationName: z.string().optional().default('What-If Scenario Simulation'),
  parameters: z.object({
    markdownPct: z.number().min(0).max(80).optional(),
    expediteDays: z.number().min(0).max(14).optional(),
    unitsToTransfer: z.number().min(0).max(500).optional(),
    sourceStoreId: z.string().optional(),
    customCost: z.number().min(0).optional(),
    customBenefit: z.number().min(0).optional(),
  }).optional().default({}),
});
