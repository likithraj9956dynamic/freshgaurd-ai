// ============================================================
// FreshGuard AI — Dataset-Sourced Store 17 Inventory
// Source: dataset/inventory.csv (FB-17 Marathahalli)
// ============================================================

import type { InventoryItem } from '../types';
import { PRODUCTS } from './products';

// Raw inventory values for Store 17 (FB-17) from dataset/inventory.csv
const rawInvFB17: Array<{ sku: string; stock: number; reorder: number }> = [
  { sku: 'SKU-001', stock: 1, reorder: 3 },
  { sku: 'SKU-002', stock: 2, reorder: 3 },
  { sku: 'SKU-003', stock: 0, reorder: 6 },
  { sku: 'SKU-004', stock: 3, reorder: 5 },
  { sku: 'SKU-005', stock: 12, reorder: 8 },
  { sku: 'SKU-006', stock: 9, reorder: 4 },
  { sku: 'SKU-007', stock: 2, reorder: 4 },
  { sku: 'SKU-008', stock: 4, reorder: 4 },
  { sku: 'SKU-009', stock: 1, reorder: 3 },
  { sku: 'SKU-010', stock: 5, reorder: 3 },
  { sku: 'SKU-011', stock: 14, reorder: 6 },
  { sku: 'SKU-012', stock: 6, reorder: 3 },
  { sku: 'SKU-013', stock: 3, reorder: 5 },
  { sku: 'SKU-014', stock: 12, reorder: 7 },
  { sku: 'SKU-015', stock: 2, reorder: 4 },
  { sku: 'SKU-016', stock: 0, reorder: 3 },
  { sku: 'SKU-017', stock: 8, reorder: 3 },
  { sku: 'SKU-018', stock: 2, reorder: 3 },
  { sku: 'SKU-019', stock: 10, reorder: 4 },
  { sku: 'SKU-020', stock: 4, reorder: 3 },
  { sku: 'SKU-021', stock: 1, reorder: 3 },
  { sku: 'SKU-022', stock: 14, reorder: 7 },
  { sku: 'SKU-023', stock: 22, reorder: 9 },
  { sku: 'SKU-024', stock: 2, reorder: 4 },
  { sku: 'SKU-025', stock: 3, reorder: 5 },
  { sku: 'SKU-026', stock: 19, reorder: 6 },
  { sku: 'SKU-027', stock: 38, reorder: 14 },
  { sku: 'SKU-028', stock: 8, reorder: 3 },
  { sku: 'SKU-029', stock: 31, reorder: 11 },
  { sku: 'SKU-030', stock: 14, reorder: 4 },
  { sku: 'SKU-031', stock: 32, reorder: 10 },
  { sku: 'SKU-032', stock: 25, reorder: 8 },
  { sku: 'SKU-033', stock: 16, reorder: 6 },
  { sku: 'SKU-034', stock: 18, reorder: 5 },
  { sku: 'SKU-035', stock: 22, reorder: 8 },
  { sku: 'SKU-036', stock: 19, reorder: 6 },
  { sku: 'SKU-037', stock: 24, reorder: 7 },
  { sku: 'SKU-038', stock: 18, reorder: 6 },
  { sku: 'SKU-039', stock: 20, reorder: 7 },
  { sku: 'SKU-040', stock: 28, reorder: 9 },
  { sku: 'SKU-041', stock: 15, reorder: 5 },
  { sku: 'SKU-042', stock: 22, reorder: 7 },
];

export const STORE_17_INVENTORY: InventoryItem[] = rawInvFB17.map((item, idx) => {
  const prod = PRODUCTS.find((p) => p.sku === item.sku) || PRODUCTS[idx % PRODUCTS.length];
  const isOutOfStock = item.stock === 0;
  const isLow = item.stock <= item.reorder;
  const daysOfSupply = Number((item.stock / 2.5).toFixed(1));

  return {
    id: `inv_${item.sku.toLowerCase()}`,
    product: prod,
    locationId: `AISLE-${String(Math.floor(idx / 6) + 1).padStart(2, '0')}`,
    storeId: 'FB-17',
    onHand: item.stock,
    onOrder: isLow ? item.reorder * 2 : 0,
    reserved: Math.min(2, item.stock),
    allocated: Math.min(1, item.stock),
    available: Math.max(0, item.stock - 2),
    unit: 'unit' as const,
    lastCountedAt: '2026-11-15T09:00:00Z',
    daysOfSupply,
    status: isOutOfStock ? ('out-of-stock' as const) : (isLow ? ('low' as const) : ('in-stock' as const)),
  };
});
