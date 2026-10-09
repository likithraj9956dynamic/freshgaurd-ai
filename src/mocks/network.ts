// ============================================================
// FreshGuard AI — Mock Data: Network & Transfers
// ============================================================

import type { NetworkStore, TransferOpportunity } from '../types';

export const NETWORK_STORES: NetworkStore[] = [
  { storeId: '1001', name: 'FreshBasket Riverside', status: 'healthy', location: { city: 'Seattle', state: 'WA' }, inventoryShortage: 2, potentialSurplus: 18, transferScore: 72, health: 82 },
  { storeId: '1002', name: 'FreshBasket Cedar Hills', status: 'healthy', location: { city: 'Portland', state: 'OR' }, inventoryShortage: 0, potentialSurplus: 24, transferScore: 88, health: 91 },
  { storeId: '1003', name: 'FreshBasket Southcenter', status: 'at-risk', location: { city: 'Tacoma', state: 'WA' }, inventoryShortage: 4, potentialSurplus: 8, transferScore: 34, health: 48 },
  { storeId: '1004', name: 'FreshBasket Capitol Hill', status: 'healthy', location: { city: 'Seattle', state: 'WA' }, inventoryShortage: 1, potentialSurplus: 14, transferScore: 68, health: 79 },
  { storeId: '1005', name: 'FreshBasket Beaverton', status: 'healthy', location: { city: 'Beaverton', state: 'OR' }, inventoryShortage: 0, potentialSurplus: 20, transferScore: 81, health: 86 },
  { storeId: '1006', name: 'FreshBasket Renton', status: 'warning', location: { city: 'Renton', state: 'WA' }, inventoryShortage: 2, potentialSurplus: 10, transferScore: 42, health: 61 },
  { storeId: '1007', name: 'FreshBasket Tukwila', status: 'healthy', location: { city: 'Tukwila', state: 'WA' }, inventoryShortage: 1, potentialSurplus: 16, transferScore: 75, health: 83 },
  { storeId: '1008', name: 'FreshBasket Gresham', status: 'healthy', location: { city: 'Gresham', state: 'OR' }, inventoryShortage: 0, potentialSurplus: 22, transferScore: 85, health: 88 },
  { storeId: '1009', name: 'FreshBasket Lake Oswego', status: 'healthy', location: { city: 'Lake Oswego', state: 'OR' }, inventoryShortage: 0, potentialSurplus: 12, transferScore: 70, health: 80 },
  { storeId: '1010', name: 'FreshBasket Salem', status: 'warning', location: { city: 'Salem', state: 'OR' }, inventoryShortage: 3, potentialSurplus: 11, transferScore: 48, health: 64 },
  { storeId: '1011', name: 'FreshBasket Vancouver', status: 'healthy', location: { city: 'Vancouver', state: 'WA' }, inventoryShortage: 1, potentialSurplus: 9, transferScore: 62, health: 75 },
  { storeId: '1012', name: 'FreshBasket Tacoma Store 17', status: 'critical', location: { city: 'Tacoma', state: 'WA' }, inventoryShortage: 12, potentialSurplus: 3, transferScore: 12, health: 28 },
];

export const TRANSFER_OPPORTUNITIES: TransferOpportunity[] = [
  {
    id: 'transfer-1',
    sourceStoreId: '1002',
    sourceStoreName: 'FreshBasket Cedar Hills',
    destinationStoreId: '1012',
    destinationStoreName: 'FreshBasket Tacoma Store 17',
    product: 'Baby Spinach 5oz',
    productSku: 'FRESH-001',
    availableQuantity: 40,
    destinationShortage: 34,
    sourceRequirement: 5,
    distance: '34 miles',
    feasibilityWarning: 'Perishable; delivery within 6 hours required.',
    suggestedAction: 'Expedite transfer of 34 units. Use refrigerated vehicle.',
    verified: false,
  },
  {
    id: 'transfer-2',
    sourceStoreId: '1008',
    sourceStoreName: 'FreshBasket Gresham',
    destinationStoreId: '1012',
    destinationStoreName: 'FreshBasket Tacoma Store 17',
    product: 'Chicken Breast 1lb',
    productSku: 'MEAT-002',
    availableQuantity: 28,
    destinationShortage: 30,
    sourceRequirement: 8,
    distance: '34 miles',
    feasibilityWarning: 'Perishable; check delivery ETA.',
    suggestedAction: 'Transfer 28 units. Source has 8 units required for own shelves.',
    verified: false,
  },
  {
    id: 'transfer-3',
    sourceStoreId: '1005',
    sourceStoreName: 'FreshBasket Beaverton',
    destinationStoreId: '1012',
    destinationStoreName: 'FreshBasket Tacoma Store 17',
    product: 'Artisan Bagels 6ct',
    productSku: 'BAKE-002',
    availableQuantity: 20,
    destinationShortage: 24,
    sourceRequirement: 4,
    distance: '34 miles',
    feasibilityWarning: 'Perishable; short shelf life after delivery.',
    suggestedAction: 'Transfer 20 units. Destination requires 24 but source is 4 short.',
    verified: false,
  },
];
