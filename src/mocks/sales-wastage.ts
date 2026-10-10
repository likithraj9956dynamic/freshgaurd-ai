// ============================================================
// FreshGuard AI — Dataset-Sourced Sales & Wastage
// Source: dataset/sales.csv & dataset/wastage.csv (FB-17 Marathahalli)
// ============================================================

import type { SalesMetric, WastageRecord } from '../types';

export const STORE_17_SALES: SalesMetric = {
  storeId: 'FB-17',
  period: 'current',
  dateRange: 'Nov 09 - Nov 15',
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
  {
    id: 'w_fb17_01',
    storeId: 'FB-17',
    date: '2026-11-14',
    department: 'Bakery',
    productName: 'Pav (SKU-003)',
    category: 'Bakery',
    wastageWeight: 8,
    wastageReason: 'Expired - 1 day shelf-life exceeded',
    cost: 240,
    status: 'investigating',
    notes: 'Zero stock on shelf due to complete expiration discard',
    recommendedAction: 'Reduce order batch size from 25 to 15; adjust delivery schedule',
  },
  {
    id: 'w_fb17_02',
    storeId: 'FB-17',
    date: '2026-11-14',
    department: 'Fruits & Veg',
    productName: 'Spinach (SKU-016)',
    category: 'Fruits & Veg',
    wastageWeight: 5,
    wastageReason: 'Quality reject - moisture accumulation in chiller',
    cost: 2250,
    status: 'confirmed',
    notes: 'Backroom chiller shelf humidity exceeds 85%',
    recommendedAction: 'Calibrate display chiller temperature to 2°C - 4°C',
  },
  {
    id: 'w_fb17_03',
    storeId: 'FB-17',
    date: '2026-11-15',
    department: 'Dairy',
    productName: 'Toned Milk 500ml (SKU-007)',
    category: 'Dairy',
    wastageWeight: 6,
    wastageReason: 'Expired - slow weekend turnover',
    cost: 720,
    status: 'pending-review',
    notes: 'Inbound PO delayed by 48 hours causing expired delivery batch',
    recommendedAction: 'Trigger dynamic markdown of 25% at 24 hours remaining shelf-life',
  },
  {
    id: 'w_fb17_04',
    storeId: 'FB-17',
    date: '2026-11-15',
    department: 'Bakery',
    productName: 'Croissant (SKU-004)',
    category: 'Bakery',
    wastageWeight: 4,
    wastageReason: 'Damaged packaging during store unboxing',
    cost: 480,
    status: 'confirmed',
    notes: 'Secondary supplier carrier handling issue',
    recommendedAction: 'Review dock receiving protocol and notify supplier',
  },
];
