import { z } from 'zod';

export const runAnalysisSchema = z.object({
  storeId: z.string().optional(),
  comparisonWindowDays: z.number().int().min(3).max(90).default(14),
  runType: z.enum(['full_network', 'single_store', 'scheduled']).default('full_network'),
  triggeredBy: z.string().optional().default('manual_user'),
});

export const analyticsStoreQuerySchema = z.object({
  storeId: z.string().optional(),
  status: z.enum(['healthy', 'warning', 'critical', 'investigating']).optional(),
  sortBy: z.enum(['urgency', 'revenue', 'wastage', 'stockout', 'name']).default('urgency'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
