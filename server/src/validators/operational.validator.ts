import { z } from 'zod';

export const salesQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  productId: z.string().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('50').transform((v) => Math.min(200, Math.max(1, parseInt(v, 10) || 50))),
});

export const inventoryQuerySchema = z.object({
  lowStockOnly: z.string().optional().transform((v) => v === 'true' || v === '1'),
  category: z.string().optional(),
  productId: z.string().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('50').transform((v) => Math.min(200, Math.max(1, parseInt(v, 10) || 50))),
});

export const wastageQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
  productId: z.string().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('50').transform((v) => Math.min(200, Math.max(1, parseInt(v, 10) || 50))),
});

export const purchaseOrderQuerySchema = z.object({
  status: z.enum(['pending', 'shipped', 'delivered', 'delayed', 'cancelled']).optional(),
  supplierName: z.string().optional(),
  page: z.string().optional().default('1').transform((v) => Math.max(1, parseInt(v, 10) || 1)),
  limit: z.string().optional().default('50').transform((v) => Math.min(200, Math.max(1, parseInt(v, 10) || 50))),
});

export const importPayloadSchema = z.object({
  datasetType: z.enum(['daily_sales', 'inventory', 'wastage', 'purchase_orders', 'products', 'stores']),
  source: z.string().optional().default('csv_ingestion'),
  csvContent: z.string().optional(),
  records: z.array(z.record(z.any())).optional(),
}).refine((data) => data.csvContent !== undefined || (data.records !== undefined && data.records.length > 0), {
  message: 'Either csvContent (CSV string) or records (array of objects) must be provided',
});
