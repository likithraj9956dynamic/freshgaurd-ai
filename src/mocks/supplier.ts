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
    id: 'PO-7106',
    orderNumber: 'PO-7106',
    supplierId: 'sup-namdhari',
    supplierName: 'Namdhari Fresh Logistics',
    storeId: 'FB-17',
    storeName: 'FreshBasket Marathahalli (#FB-17)',
    orderDate: '2026-11-10T08:00:00Z',
    expectedDelivery: '2026-11-13T14:00:00Z',
    status: 'delayed',
    priority: 'urgent',
    totalUnits: 213,
    totalValue: 39140,
    deliveryVehicleId: 'FLEET-KA-04-TRUCK-07 (Refrigerated)',
    driverName: 'Ramesh Kumar',
    driverPhone: '+91-98801-44512',
    temperatureLog: '3.4°C (Verified Cold Chain)',
    notes: 'Delayed – supplier shipment delayed with no revised date (dataset/purchase_orders.csv PO-7106). Outer ring-road freight delay.',
    items: [
      { id: 'i1', productName: 'Chapati (10) [SKU-023]', quantity: 44, unit: 'pack', unitPrice: 60, category: 'Ready to Eat' },
      { id: 'i2', productName: 'Onion 1kg [SKU-014]', quantity: 41, unit: 'kg', unitPrice: 450, category: 'Fruits & Veg' },
      { id: 'i3', productName: 'Dosa Batter 1kg [SKU-022]', quantity: 32, unit: 'pack', unitPrice: 120, category: 'Ready to Eat' },
      { id: 'i4', productName: 'Banana Cake [SKU-005]', quantity: 31, unit: 'pack', unitPrice: 60, category: 'Bakery' },
      { id: 'i5', productName: 'Buttermilk [SKU-011]', quantity: 35, unit: 'bottle', unitPrice: 250, category: 'Dairy' },
      { id: 'i6', productName: 'Soft Drink 750ml [SKU-042]', quantity: 30, unit: 'bottle', unitPrice: 120, category: 'FMCG' },
    ],
  },
  {
    id: 'PO-7019',
    orderNumber: 'PO-7019',
    supplierId: 'sup-namdhari',
    supplierName: 'Namdhari Fresh Logistics',
    storeId: 'FB-04',
    storeName: 'FreshBasket Basavanagudi (#FB-04)',
    orderDate: '2026-11-12T11:00:00Z',
    expectedDelivery: '2026-11-16T09:30:00Z',
    status: 'delivered',
    priority: 'high',
    totalUnits: 37,
    totalValue: 2960,
    deliveryVehicleId: 'FLEET-KA-01-TRUCK-03 (Chilled)',
    driverName: 'Suresh Gowda',
    driverPhone: '+91-94481-22910',
    temperatureLog: '2.8°C (Compliant)',
    notes: 'Scheduled Butter 100g restock delivered successfully (PO-7019).',
    items: [
      { id: 'i7', productName: 'Butter 100g [SKU-010]', quantity: 37, unit: 'pack', unitPrice: 80, category: 'Dairy' },
    ],
  },
  {
    id: 'PO-7009',
    orderNumber: 'PO-7009',
    supplierId: 'sup-namdhari',
    supplierName: 'Namdhari Fresh Logistics',
    storeId: 'FB-02',
    storeName: 'FreshBasket BTM Layout (#FB-02)',
    orderDate: '2026-11-13T07:30:00Z',
    expectedDelivery: '2026-11-17T13:00:00Z',
    status: 'in_transit',
    priority: 'routine',
    totalUnits: 84,
    totalValue: 37800,
    deliveryVehicleId: 'FLEET-KA-05-TRUCK-11',
    driverName: 'Manjunath B',
    driverPhone: '+91-98450-33419',
    temperatureLog: '3.1°C (En Route)',
    notes: 'Scheduled fresh spinach delivery en route to BTM Hub.',
    items: [
      { id: 'i8', productName: 'Spinach [SKU-016]', quantity: 84, unit: 'bunch', unitPrice: 450, category: 'Fruits & Veg' },
    ],
  },
  {
    id: 'PO-7068',
    orderNumber: 'PO-7068',
    supplierId: 'sup-nandini',
    supplierName: 'Nandini Dairy Hub',
    storeId: 'FB-17',
    storeName: 'FreshBasket Marathahalli (#FB-17)',
    orderDate: '2026-11-10T06:00:00Z',
    expectedDelivery: '2026-11-12T10:00:00Z',
    actualDelivery: '2026-11-12T09:45:00Z',
    status: 'delivered',
    priority: 'high',
    totalUnits: 93,
    totalValue: 7440,
    deliveryVehicleId: 'FLEET-NANDINI-02',
    driverName: 'Shivanna R',
    driverPhone: '+91-99800-11223',
    temperatureLog: '3.1°C (Delivered & Verified)',
    notes: 'Idli Batter intake confirmed by receiving clerk with temperature sign-off.',
    items: [
      { id: 'i9', productName: 'Idli Batter 1kg [SKU-021]', quantity: 93, unit: 'pack', unitPrice: 80, category: 'Ready to Eat' },
    ],
  },
];

export const SUPPLIER_EMERGENCY_REQUESTS: SupplierEmergencyRequest[] = [
  {
    id: 'emg-001',
    requestNumber: 'EMG-FB17-091',
    storeId: 'FB-17',
    storeName: 'FreshBasket Marathahalli (#FB-17)',
    requestedBy: 'Operations Command Center',
    requestedAt: '2026-11-13T08:15:00Z',
    requiredBy: 'Today by 16:00 IST',
    status: 'open',
    urgency: 'critical',
    reason: 'Store FB-17 faces acute stockouts on fast-moving fresh items due to delayed PO-7106. Expedited delivery requested.',
    items: [
      { productName: 'Milk Bread [SKU-001]', quantity: 50, unit: 'pack' },
      { productName: 'Toned Milk 500ml [SKU-007]', quantity: 60, unit: 'pouch' },
      { productName: 'Dosa Batter 1kg [SKU-022]', quantity: 30, unit: 'pack' },
    ],
  },
];

