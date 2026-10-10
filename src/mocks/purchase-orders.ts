// ============================================================
// FreshGuard AI — Dataset-Sourced Purchase Orders
// Source: dataset/purchase_orders.csv (Real Orders for FB-17)
// ============================================================

import type { PurchaseOrder } from '../types';
import { STORE_17_ID } from './stores';

export const STORE_17_PURCHASE_ORDER: PurchaseOrder = {
  id: 'PO-7106',
  storeId: STORE_17_ID,
  supplier: 'Namdhari Fresh',
  orderNumber: 'PO-7106',
  orderDate: '2026-11-10',
  expectedDelivery: '2026-11-13T14:00:00Z',
  status: 'delayed',
  items: [
    { productId: 'SKU-023', productName: 'Chapati (10)', quantity: 44, unit: 'pack', unitPrice: 60, allocated: 22, remaining: 22 },
    { productId: 'SKU-014', productName: 'Onion 1kg', quantity: 41, unit: 'kg', unitPrice: 450, allocated: 20, remaining: 21 },
    { productId: 'SKU-022', productName: 'Dosa Batter 1kg', quantity: 32, unit: 'pack', unitPrice: 120, allocated: 16, remaining: 16 },
    { productId: 'SKU-005', productName: 'Banana Cake', quantity: 31, unit: 'pack', unitPrice: 60, allocated: 15, remaining: 16 },
    { productId: 'SKU-011', productName: 'Buttermilk', quantity: 35, unit: 'bottle', unitPrice: 250, allocated: 15, remaining: 20 },
    { productId: 'SKU-042', productName: 'Soft Drink 750ml', quantity: 30, unit: 'bottle', unitPrice: 120, allocated: 15, remaining: 15 },
  ],
  totalItems: 213,
  totalValue: 39140,
  notes: 'Delayed – supplier shipment delayed with no revised delivery date provided (dataset PO-7106 to PO-7111).',
  priority: 'high',
};

export const STORE_17_ALL_PURCHASE_ORDERS: PurchaseOrder[] = [
  STORE_17_PURCHASE_ORDER,
  {
    id: 'PO-7067',
    storeId: STORE_17_ID,
    supplier: 'Mother Bakery Supplies',
    orderNumber: 'PO-7067',
    orderDate: '2026-11-09',
    expectedDelivery: '2026-11-11T10:00:00Z',
    status: 'delivered',
    items: [
      { productId: 'SKU-035', productName: 'Tea 250g', quantity: 88, unit: 'pack', unitPrice: 30, allocated: 88, remaining: 0 },
    ],
    totalItems: 88,
    totalValue: 2640,
    notes: 'Delivered in full.',
    priority: 'normal',
  },
  {
    id: 'PO-7068',
    storeId: STORE_17_ID,
    supplier: 'Nandini Dairy Hub',
    orderNumber: 'PO-7068',
    orderDate: '2026-11-10',
    expectedDelivery: '2026-11-12T09:00:00Z',
    status: 'delivered',
    items: [
      { productId: 'SKU-021', productName: 'Idli Batter 1kg', quantity: 93, unit: 'pack', unitPrice: 80, allocated: 93, remaining: 0 },
    ],
    totalItems: 93,
    totalValue: 7440,
    notes: 'Morning fresh dairy and batter intake completed.',
    priority: 'high',
  },
  {
    id: 'PO-7072',
    storeId: STORE_17_ID,
    supplier: 'Namdhari Fresh',
    orderNumber: 'PO-7072',
    orderDate: '2026-11-15',
    expectedDelivery: '2026-11-18T16:00:00Z',
    status: 'pending',
    items: [
      { productId: 'SKU-012', productName: 'Ghee 200ml', quantity: 57, unit: 'jar', unitPrice: 45, allocated: 0, remaining: 57 },
    ],
    totalItems: 57,
    totalValue: 2565,
    notes: 'Scheduled delivery pending dock assignment.',
    priority: 'normal',
  },
];

