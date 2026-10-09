// ============================================================
// FreshGuard AI — Types (v2)
// ============================================================

// --- Wastage ---
export interface WastageRecord {
  id: string;
  storeId: string;
  date: string;
  department: string;
  productName: string;
  category: string;
  wastageWeight: number;
  wastageReason: string;
  cost: number;
  status: 'pending-review' | 'confirmed' | 'investigating' | 'resolved';
  notes: string;
  recommendedAction: string;
}

// --- Purchase Order ---
export interface PurchaseOrder {
  id: string;
  storeId: string;
  supplier: string;
  orderNumber: string;
  orderDate: string;
  expectedDelivery: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delayed' | 'delivered' | 'cancelled';
  items: PurchaseOrderItem[];
  totalItems: number;
  totalValue: number;
  notes: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  allocated: number;
  remaining: number;
}

// --- Compliance ---
export interface ComplianceRecord {
  id: string;
  storeId: string;
  section: string;
  requirement: string;
  status: 'compliant' | 'partial' | 'non-compliant';
  riskLevel: 'low' | 'medium' | 'high';
  lastInspected: string;
  nextInspection: string;
  inspector: string;
  notes: string;
}

// --- Issue Evidence ---
export interface IssueEvidence {
  type: 'metric' | 'record' | 'note' | 'comparison';
  label: string;
  value: string;
  detail: string;
  source: string;
  comparison?: {
    current: string;
    previous: string;
    change: string;
  };
}
