import { z } from 'zod';

export const generateBriefingSchema = z.object({
  storeId: z.string().optional(),
  scope: z.enum(['network_overview', 'store_specific']).optional().default('network_overview'),
  voice: z.string().optional().default('alloy'),
});

export const assistantQuerySchema = z.object({
  query: z.string().min(2, 'Query must be at least 2 characters long'),
  storeId: z.string().optional(),
  conversationId: z.string().optional(),
});
