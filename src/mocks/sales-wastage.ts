// ============================================================
// FreshGuard AI — Mock Data: Sales & Wastage
// ============================================================

import type { SalesMetric, WastageRecord } from '../types';

export const STORE_17_SALES: SalesMetric = {
  storeId: '1012',
  period: 'current',
  dateRange: 'Oct 1 - Oct 7',
  dailySales: [4220, 4180, 3950, 3890, 3720, 3580, 3210],
  weeklySales: [128400, 132100, 129800, 128400],
  monthlySales: [542000, 551200, 548900, 539400, 528100, 512000, 514000],
  currentPeriod: 128400,
  previousPeriod: 156500,
  changePercent: -17.95,
  transactions: [842, 851, 812, 798, 771, 742, 685],
  footfall: [2420, 2480, 2390, 2350, 2280, 2210, 2090],
  conversionRate: [34.8, 34.3, 34.0, 33.9, 33.8, 33.6, 32.8],
  avgTransactionValue: 14.20,
  trend: 'down',
  comparison: { periodLabel: 'previous 2 weeks', changePercent: -17.95 },
};

export const STORE_17_WASTAGE: WastageRecord[] = [
  { id: 'w1', storeId: '1012', date: '2026-10-03', department: 'Produce', productName: 'Organic Baby Spinach 5oz', category: 'Produce', wastageWeight: 14.2, wastageReason: 'Spoilage - expired before sale', cost: 4.25, status: 'investigating', notes: '12 fast-moving items below required stock', recommendedAction: 'Increase order frequency; review shelf-life' },
  { id: 'w2', storeId: '1012', date: '2026-10-04', department: 'Produce', productName: 'Baby Carrots 1lb', category: 'Produce', wastageWeight: 9.8, wastageReason: 'Spoilage - overstock', cost: 2.95, status: 'confirmed', notes: 'Stock rotation issue', recommendedAction: 'Improve FIFO' },
  { id: 'w3', storeId: '1012', date: '2026-10-05', department: 'Meat', productName: 'Ground Beef 80/20 1lb', category: 'Meat', wastageWeight: 6.5, wastageReason: 'Spoilage - near expiry', cost: 8.20, status: 'pending-review', notes: 'Investigation started', recommendedAction: 'Review par levels' },
  { id: 'w4', storeId: '1012', date: '2026-10-06', department: 'Dairy', productName: 'Large Eggs 18ct', category: 'Dairy', wastageWeight: 3.2, wastageReason: 'Damaged packaging', cost: 3.20, status: 'confirmed', notes: '2 cartons crushed in transit', recommendedAction: 'Review receiving procedures' },
];
