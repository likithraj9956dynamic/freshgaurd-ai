// ============================================================
// FreshGuard AI — Mock Data: Supplier Intelligence & Orders
// ============================================================

export interface SupplierPurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  storeId: string;
  storeName: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  status: 'pending_confirmation' | 'confirmed' | 'in_transit' | 'delivered' | 'delayed';
  priority: 'routine' | 'high' | 'urgent';
  totalUnits: number;
  totalValue: number;
  deliveryVehicleId?: string;
  driverName?: string;
  driverPhone?: string;
  temperatureLog?: string; // e.g. "3.2°C (Optimal)"
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    category: string;
  }>;
  notes: string;
}

export interface SupplierEmergencyRequest {
  id: string;
  requestNumber: string;
  storeId: string;
  storeName: string;
  requestedBy: string;
  requestedAt: string;
  requiredBy: string;
  status: 'open' | 'accepted' | 'dispatched' | 'declined';
  urgency: 'critical' | 'high';
  reason: string;
  items: Array<{
    productName: string;
    quantity: number;
    unit: string;
  }>;
}

export const SUPPLIER_PURCHASE_ORDERS: SupplierPurchaseOrder[] = [
  {
    id: 'po-10482',
    orderNumber: 'CF-10482',
    supplierId: 'sup-cascade',
    supplierName: 'Cascade Fresh Distributors',
    storeId: '1012',
    storeName: 'FreshBasket Tacoma (#017)',
    orderDate: '2026-10-02T08:00:00Z',
    expectedDelivery: '2026-10-09T14:00:00Z',
    status: 'delayed',
    priority: 'urgent',
    totalUnits: 136,
    totalValue: 378.15,
    deliveryVehicleId: 'FLEET-TRUCK-07 (Refrigerated 24ft)',
    driverName: 'Robert Vance',
    driverPhone: '(253) 555-7812',
    temperatureLog: '3.4°C (Verified Cold Chain)',
    notes: 'Expedited produce & poultry replenishment. Delayed due to I-5 corridor congestion.',
    items: [
      { id: 'i1', productName: 'Organic Baby Spinach 5oz', quantity: 60, unit: 'clamshell', unitPrice: 1.85, category: 'Produce' },
      { id: 'i2', productName: 'Ground Beef 80/20 1lb', quantity: 22, unit: 'pack', unitPrice: 4.20, category: 'Meat' },
      { id: 'i3', productName: 'Chicken Breast 1lb', quantity: 30, unit: 'pack', unitPrice: 3.40, category: 'Meat' },
      { id: 'i4', productName: 'Artisan Bagels 6ct', quantity: 24, unit: 'bag', unitPrice: 2.40, category: 'Bakery' },
    ],
  },
  {
    id: 'po-10495',
    orderNumber: 'CF-10495',
    supplierId: 'sup-cascade',
    supplierName: 'Cascade Fresh Distributors',
    storeId: '1004',
    storeName: 'FreshBasket Capitol Hill (#004)',
    orderDate: '2026-10-08T11:00:00Z',
    expectedDelivery: '2026-10-10T09:30:00Z',
    status: 'confirmed',
    priority: 'high',
    totalUnits: 180,
    totalValue: 564.00,
    deliveryVehicleId: 'FLEET-TRUCK-03 (Chilled)',
    driverName: 'David Mercer',
    driverPhone: '(206) 555-4421',
    temperatureLog: '2.8°C (Compliant)',
    notes: 'Morning priority produce restock for urban branch.',
    items: [
      { id: 'i5', productName: 'Organic Strawberries 1lb', quantity: 80, unit: 'clamshell', unitPrice: 3.10, category: 'Produce' },
      { id: 'i6', productName: 'Fresh Whole Milk 1gal', quantity: 60, unit: 'jug', unitPrice: 3.50, category: 'Dairy' },
      { id: 'i7', productName: 'Sourdough Country Loaf', quantity: 40, unit: 'loaf', unitPrice: 2.65, category: 'Bakery' },
    ],
  },
  {
    id: 'po-10510',
    orderNumber: 'CF-10510',
    supplierId: 'sup-cascade',
    supplierName: 'Cascade Fresh Distributors',
    storeId: '1001',
    storeName: 'FreshBasket Riverside (#001)',
    orderDate: '2026-10-09T07:30:00Z',
    expectedDelivery: '2026-10-11T13:00:00Z',
    status: 'pending_confirmation',
    priority: 'routine',
    totalUnits: 95,
    totalValue: 312.50,
    deliveryVehicleId: 'Unassigned',
    driverName: 'Pending Route Scheduling',
    notes: 'Awaiting supplier confirmation. Standard warehouse cycle order.',
    items: [
      { id: 'i8', productName: 'Organic Gala Apples 3lb', quantity: 45, unit: 'bag', unitPrice: 3.80, category: 'Produce' },
      { id: 'i9', productName: 'Wild Alaskan Salmon Fillet', quantity: 50, unit: 'pack', unitPrice: 2.83, category: 'Seafood' },
    ],
  },
  {
    id: 'po-10440',
    orderNumber: 'CF-10440',
    supplierId: 'sup-cascade',
    supplierName: 'Cascade Fresh Distributors',
    storeId: '1002',
    storeName: 'FreshBasket Cedar Hills (#002)',
    orderDate: '2026-10-06T06:00:00Z',
    expectedDelivery: '2026-10-07T10:00:00Z',
    actualDelivery: '2026-10-07T09:45:00Z',
    status: 'delivered',
    priority: 'high',
    totalUnits: 210,
    totalValue: 685.20,
    deliveryVehicleId: 'FLEET-TRUCK-05',
    driverName: 'Samira Khan',
    driverPhone: '(503) 555-9014',
    temperatureLog: '3.1°C (Delivered & Verified)',
    notes: 'Completed delivery received by store receiving clerk with temperature signature.',
    items: [
      { id: 'i10', productName: 'Organic Avocados 4ct', quantity: 100, unit: 'bag', unitPrice: 3.50, category: 'Produce' },
      { id: 'i11', productName: 'Free Range Large Eggs 18ct', quantity: 110, unit: 'carton', unitPrice: 3.05, category: 'Dairy' },
    ],
  },
];

export const SUPPLIER_EMERGENCY_REQUESTS: SupplierEmergencyRequest[] = [
  {
    id: 'emg-001',
    requestNumber: 'EMG-TAC-091',
    storeId: '1012',
    storeName: 'FreshBasket Tacoma (#017)',
    requestedBy: 'Eleanor Vance (Head Office Operations)',
    requestedAt: '2026-10-09T08:15:00Z',
    requiredBy: 'Today by 16:00 PST',
    status: 'open',
    urgency: 'critical',
    reason: 'Store 17 faces 12 acute stockouts on fast-moving organic greens. Expedited hot-shot delivery requested.',
    items: [
      { productName: 'Organic Baby Spinach 5oz', quantity: 40, unit: 'clamshell' },
      { productName: 'Chicken Breast 1lb', quantity: 20, unit: 'pack' },
    ],
  },
];
