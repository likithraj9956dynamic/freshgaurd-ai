// ============================================================
// FreshGuard AI — Mock Data: Purchase Orders
// ============================================================

import type { PurchaseOrder, PurchaseOrderItem } from '../types';

export const STORE_17_PURCHASE_ORDER: PurchaseOrder = {
  id: 'po1012',
  storeId: '1012',
  supplier: 'Cascade Fresh Distributors',
  orderNumber: 'CF-10482',
  orderDate: '2026-10-02',
  expectedDelivery: '2026-10-06T14:00:00Z',
  status: 'delayed',
  items: [
    { productId: 'p1', productName: 'Organic Baby Spinach 5oz', quantity: 60, unit: 'unit', unitPrice: 1.85, allocated: 34, remaining: 26 },
    { productId: 'p3', productName: 'Ground Beef 80/20 1lb', quantity: 22, unit: 'lb', unitPrice: 4.20, allocated: 8, remaining: 14 },
    { productId: 'p4', productName: 'Chicken Breast 1lb', quantity: 30, unit: 'lb', unitPrice: 3.40, allocated: 14, remaining: 16 },
    { productId: 'p8', productName: 'Artisan Bagels 6ct', quantity: 24, unit: 'flat', unitPrice: 2.40, allocated: 12, remaining: 12 },
  ],
  totalItems: 136,
  totalValue: 378.15,
  notes: 'Standard order, expected with vehicle ETA 15:00 today.',
  priority: 'high',
};
