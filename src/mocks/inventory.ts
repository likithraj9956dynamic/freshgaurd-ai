// ============================================================
// FreshGuard AI — Mock Data: Store 17 Inventory
// ============================================================

import type { InventoryItem } from '../types';
import { PRODUCTS } from './products';

export const STORE_17_INVENTORY: InventoryItem[] = [
  { id: 'inv1', product: PRODUCTS[0], locationId: 'A-01', storeId: '1012', onHand: 34, onOrder: 12, reserved: 8, allocated: 6, available: 26, unit: 'unit', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 4, status: 'out-of-stock' },
  { id: 'inv2', product: PRODUCTS[1], locationId: 'A-02', storeId: '1012', onHand: 52, onOrder: 8, reserved: 12, allocated: 10, available: 40, unit: 'lb', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 7, status: 'low' },
  { id: 'inv3', product: PRODUCTS[2], locationId: 'B-03', storeId: '1012', onHand: 8, onOrder: 20, reserved: 5, allocated: 4, available: 3, unit: 'lb', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 2, status: 'out-of-stock' },
  { id: 'inv4', product: PRODUCTS[3], locationId: 'B-03', storeId: '1012', onHand: 14, onOrder: 30, reserved: 8, allocated: 6, available: 6, unit: 'lb', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 3, status: 'out-of-stock' },
  { id: 'inv5', product: PRODUCTS[4], locationId: 'C-01', storeId: '1012', onHand: 58, onOrder: 10, reserved: 14, allocated: 12, available: 44, unit: 'gal', lastCountedAt: '2026-10-05T10:00:00Z', daysOfSupply: 12, status: 'in-stock' },
  { id: 'inv6', product: PRODUCTS[5], locationId: 'C-02', storeId: '1012', onHand: 32, onOrder: 6, reserved: 8, allocated: 6, available: 24, unit: 'count', lastCountedAt: '2026-10-05T10:00:00Z', daysOfSupply: 8, status: 'low' },
  { id: 'inv7', product: PRODUCTS[6], locationId: 'D-02', storeId: '1012', onHand: 26, onOrder: 4, reserved: 6, allocated: 4, available: 20, unit: 'unit', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 9, status: 'low' },
  { id: 'inv8', product: PRODUCTS[7], locationId: 'D-02', storeId: '1012', onHand: 12, onOrder: 8, reserved: 4, allocated: 3, available: 8, unit: 'flat', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 11, status: 'low' },
  { id: 'inv9', product: PRODUCTS[8], locationId: 'E-01', storeId: '1012', onHand: 5, onOrder: 8, reserved: 2, allocated: 2, available: 3, unit: 'lb', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 2, status: 'out-of-stock' },
  { id: 'inv10', product: PRODUCTS[9], locationId: 'E-02', storeId: '1012', onHand: 28, onOrder: 4, reserved: 6, allocated: 4, available: 22, unit: 'oz', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 14, status: 'in-stock' },
  { id: 'inv11', product: PRODUCTS[10], locationId: 'F-03', storeId: '1012', onHand: 42, onOrder: 6, reserved: 10, allocated: 8, available: 32, unit: 'unit', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 6, status: 'low' },
  { id: 'inv12', product: PRODUCTS[11], locationId: 'F-03', storeId: '1012', onHand: 18, onOrder: 4, reserved: 4, allocated: 3, available: 14, unit: 'unit', lastCountedAt: '2026-10-06T09:00:00Z', daysOfSupply: 16, status: 'in-stock' },
];
