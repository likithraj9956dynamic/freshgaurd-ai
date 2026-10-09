// ============================================================
// FreshGuard AI — Shared Types (v1)
// ============================================================

// --- Store ---
export type StoreStatus = 'healthy' | 'at-risk' | 'critical' | 'warning';

export interface Store {
  id: string;
  name: string;
  storeNumber: string;
  location: {
    city: string;
    state: string;
    region: string;
    area: string;
    zip: string;
  };
  format: 'urban' | 'suburban' | 'rural' | 'mall';
  openDate: string;
  totalSquareFootage: number;
  departments: string[];
  status: StoreStatus;
  managerName: string;
  managerEmail: string;
  assignedTeamSize: number;
  phone: string;
  address: string;
  trending: 'up' | 'down' | 'stable';
  revenueTarget: number;
  revenueActual: number;
}

// --- Product ---
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  packSize: string;
  unit: 'unit' | 'lb' | 'oz' | 'count' | 'flat' | 'case';
  costPrice: number;
  retailPrice: number;
  marginPercent: number;
  procurementVendor: string;
  reorderPoint: number;
  active: boolean;
  iconHint: string;
}

// --- Inventory Item ---
export interface InventoryItem {
  id: string;
  product: Product;
  locationId: string;
  storeId: string;
  onHand: number;
  onOrder: number;
  reserved: number;
  allocated: number;
  available: number;
  unit: string;
  lastCountedAt: string;
  daysOfSupply: number;
  status: 'in-stock' | 'low' | 'out-of-stock' | 'overage';
}

// --- Sales Metric ---
export interface SalesMetric {
  storeId: string;
  period: string;
  dateRange: string;
  dailySales: number[];
  weeklySales: number[];
  monthlySales: number[];
  currentPeriod: number;
  previousPeriod: number;
  changePercent: number;
  transactions: number[];
  footfall: number[];
  conversionRate: number[];
  avgTransactionValue: number;
  trend: 'up' | 'down' | 'stable';
  comparison: {
    periodLabel: string;
    changePercent: number;
  };
}
