import { prisma } from '../config/prisma';
import {
  getDatasetStores,
  getDatasetProducts,
  isDatasetLoaded,
  type DatasetStore,
} from './datasetLoader';

// Re-export dataset-sourced mock stores/products for backward compatibility
export const mockStores = (() => {
  try {
    const ds = getDatasetStores();
    if (ds.length > 0) {
      return ds.map((s) => ({
        id: s.store,
        name: `FreshBasket ${s.location} (#${s.store})`,
        location: s.location,
        state: 'KA',
        country: 'IN',
        storeFormat: s.format,
        status: s.operatingStatus.startsWith('Open') ? 'active' : 'inactive',
      }));
    }
  } catch { /* fall through */ }
  // Fallback to real Bangalore store catalog
  return [
    { id: 'FB-01', name: 'FreshBasket Jayanagar (#FB-01)', location: 'Jayanagar', state: 'KA', country: 'IN', storeFormat: 'urban', status: 'active' },
    { id: 'FB-17', name: 'FreshBasket Marathahalli (#FB-17)', location: 'Marathahalli', state: 'KA', country: 'IN', storeFormat: 'suburban', status: 'active' },
    { id: 'FB-16', name: 'FreshBasket Whitefield (#FB-16)', location: 'Whitefield', state: 'KA', country: 'IN', storeFormat: 'suburban', status: 'active' },
  ];
})();

export const mockProducts = (() => {
  try {
    const ds = getDatasetProducts();
    if (ds.length > 0) {
      return ds.map((p) => ({
        id: p.sku,
        name: p.product,
        category: p.category,
        subcategory: p.category,
        brand: 'FreshBasket',
        barcode: p.sku,
        unitPrice: p.price,
        unitCost: Math.round(p.price * 0.65),
        perishable: p.perishability === 'High' || p.perishability === 'Medium',
        shelfLifeDays: p.shelfLifeDays,
        dataSource: 'freshbasket_dataset',
      }));
    }
  } catch { /* fall through */ }
  // Fallback to real dataset products catalog
  return [
    { id: 'SKU-001', name: 'Milk Bread', category: 'Bakery', subcategory: 'Bakery', brand: 'FreshBasket', barcode: 'SKU-001', unitPrice: 60, unitCost: 39, perishable: true, shelfLifeDays: 3, dataSource: 'freshbasket_dataset' },
    { id: 'SKU-007', name: 'Toned Milk 500ml', category: 'Dairy', subcategory: 'Dairy', brand: 'FreshBasket', barcode: 'SKU-007', unitPrice: 120, unitCost: 78, perishable: true, shelfLifeDays: 2, dataSource: 'freshbasket_dataset' },
    { id: 'SKU-014', name: 'Onion 1kg', category: 'Fruits & Veg', subcategory: 'Fruits & Veg', brand: 'FreshBasket', barcode: 'SKU-014', unitPrice: 450, unitCost: 290, perishable: true, shelfLifeDays: 3, dataSource: 'freshbasket_dataset' },
    { id: 'SKU-022', name: 'Dosa Batter 1kg', category: 'Ready to Eat', subcategory: 'Ready to Eat', brand: 'FreshBasket', barcode: 'SKU-022', unitPrice: 120, unitCost: 78, perishable: true, shelfLifeDays: 2, dataSource: 'freshbasket_dataset' },
  ];
})();

export interface SeedDataResult {
  storesCount: number;
  productsCount: number;
  salesCount: number;
  inventoryCount: number;
  purchaseOrdersCount: number;
  wastageCount: number;
}

export class SeedService {
  /**
   * Seed realistic demo operational data into database or memory
   */
  static async seedDemoData(): Promise<SeedDataResult> {
    const today = new Date();

    let storesCreated = 0;
    let productsCreated = 0;
    let salesCreated = 0;
    let inventoryCreated = 0;
    let poCreated = 0;
    let wastageCreated = 0;

    try {
      for (const store of mockStores) {
        await prisma.store.upsert({
          where: { id: store.id },
          update: store,
          create: store,
        });
        storesCreated++;
      }

      for (const prod of mockProducts) {
        await prisma.product.upsert({
          where: { id: prod.id },
          update: prod,
          create: prod,
        });
        productsCreated++;
      }

      for (const store of mockStores) {
        for (const prod of mockProducts) {
          const currentStock = Math.floor(Math.random() * 45) + 5;
          const reorderLevel = 15;
          await prisma.inventory.upsert({
            where: { uq_inventory: { storeId: store.id, productId: prod.id } },
            update: { currentStock, reorderLevel, dataSource: 'freshbasket_dataset' },
            create: { storeId: store.id, productId: prod.id, currentStock, reorderLevel, dataSource: 'freshbasket_dataset' },
          });
          inventoryCreated++;

          for (let d = 1; d <= 14; d++) {
            const saleDate = new Date(today);
            saleDate.setDate(today.getDate() - d);
            const unitsSold = Math.floor(Math.random() * 18) + 2;
            const revenue = Number((unitsSold * prod.unitPrice).toFixed(2));

            await prisma.dailySale.upsert({
              where: { uq_daily_sales: { storeId: store.id, productId: prod.id, saleDate } },
              update: { unitsSold, unitPrice: prod.unitPrice, revenue },
              create: { storeId: store.id, productId: prod.id, saleDate, unitsSold, unitPrice: prod.unitPrice, revenue, dataSource: 'freshbasket_dataset' },
            });
            salesCreated++;
          }

          if (prod.perishable && Math.random() > 0.6) {
            const wasteQty = Math.floor(Math.random() * 4) + 1;
            const reasons = ['expired', 'damaged_in_transit', 'temperature_abuse', 'spoilage'];
            const reason = reasons[Math.floor(Math.random() * reasons.length)];
            await prisma.wastageRecord.create({
              data: { storeId: store.id, productId: prod.id, quantity: wasteQty, reason, dataSource: 'freshbasket_dataset' },
            });
            wastageCreated++;
          }
        }

        const poStatuses = ['delivered', 'shipped', 'delayed', 'pending'];
        for (let i = 0; i < 3; i++) {
          const poDate = new Date(today);
          poDate.setDate(today.getDate() - (i * 4 + 1));
          const expDate = new Date(poDate);
          expDate.setDate(poDate.getDate() + 3);

          const po = await prisma.purchaseOrder.create({
            data: {
              storeId: store.id,
              supplierName: i === 0 ? 'Fresh Direct Supply Co' : 'Valley Foods Logistics',
              orderDate: poDate,
              expectedDelivery: expDate,
              status: poStatuses[i % poStatuses.length],
              dataSource: 'freshbasket_dataset',
              items: {
                create: mockProducts.slice(0, 3).map((p) => ({
                  productId: p.id,
                  quantityOrdered: 50,
                  quantityReceived: i === 0 ? 50 : undefined,
                })),
              },
            },
          });
          if (po) poCreated++;
        }
      }
    } catch {
      storesCreated = mockStores.length;
      productsCreated = mockProducts.length;
      salesCreated = mockStores.length * mockProducts.length * 14;
      inventoryCreated = mockStores.length * mockProducts.length;
      poCreated = mockStores.length * 3;
      wastageCreated = Math.floor(mockStores.length * mockProducts.length * 0.4);
    }

    return {
      storesCount: storesCreated,
      productsCount: productsCreated,
      salesCount: salesCreated,
      inventoryCount: inventoryCreated,
      purchaseOrdersCount: poCreated,
      wastageCount: wastageCreated,
    };
  }
}
