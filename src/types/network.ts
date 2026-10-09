import type { StoreStatus } from './store';

// ============================================================
// FreshGuard AI — Types (v4)
// ============================================================

// --- Task Evidence ---
export interface TaskEvidence {
  label: string;
  detail: string;
  source: string;
}

// --- Network / Transfer (v5) ---
export interface NetworkStore {
  storeId: string;
  name: string;
  status: StoreStatus;
  location: {
    city: string;
    state: string;
  };
  inventoryShortage: number;
  potentialSurplus: number;
  transferScore: number;
  health: number;
}

export interface TransferOpportunity {
  id: string;
  sourceStoreId: string;
  sourceStoreName: string;
  destinationStoreId: string;
  destinationStoreName: string;
  product: string;
  productSku: string;
  availableQuantity: number;
  destinationShortage: number;
  sourceRequirement: number;
  distance: string;
  feasibilityWarning: string;
  suggestedAction: string;
  verified: boolean;
}

// --- Demo Data Info (v6) ---
export interface DemoDataInfo {
  version: string;
  generatedAt: string;
  storeCount: number;
  issueCount: number;
  actionCount: number;
  taskCount: number;
  note: string;
}
