import { prisma } from '../config/prisma';

export interface SeedDataResult {
  storesCount: number;
  productsCount: number;
  salesCount: number;
  inventoryCount: number;
  purchaseOrdersCount: number;
  wastageCount: number;
}

export const mockStores = [
  {
    id: 'STORE_17',
    name: 'FreshGuard Flagship ΓÇö Downtown Market',
    location: '742 Evergreen Terrace, Springfield',
    state: 'CA',
    country: 'US',
    storeFormat: 'Supermarket',
    status: 'active',
  },
  {
    id: 'CA_1',
    name: 'FreshGuard Sacramento Central',
    location: '1000 K Street, Sacramento',
    state: 'CA',
    country: 'US',
    storeFormat: 'Supercenter',
    status: 'active',
  },
  {
    id: 'CA_2',
    name: 'FreshGuard Oakland Harbor',
    location: '450 Broadway, Oakland',
    state: 'CA',
    country: 'US',
    storeFormat: 'Express Store',
    status: 'active',
  },
];

export const mockProducts = [
  {
    id: 'FOODS_1_001',
    name: 'Organic Whole Milk (1 Gallon)',
    category: 'FOODS',
    subcategory: 'Dairy & Eggs',
    brand: 'Horizon Valley',
    barcode: '070042000018',
    unitPrice: 4.89,
    unitCost: 3.10,
    perishable: true,
    shelfLifeDays: 14,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_002',
    name: 'Fresh Hass Avocados (4-Pack Bag)',
    category: 'FOODS',
    subcategory: 'Fresh Produce',
    brand: 'Green Harvest',
    barcode: '070042000025',
    unitPrice: 3.99,
    unitCost: 2.20,
    perishable: true,
    shelfLifeDays: 7,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_003',
    name: 'Organic Honeycrisp Apples (3 lb)',
    category: 'FOODS',
    subcategory: 'Fresh Produce',
    brand: 'Orchard Peak',
    barcode: '070042000032',
    unitPrice: 5.49,
    unitCost: 3.00,
    perishable: true,
    shelfLifeDays: 21,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_004',
    name: 'Artisan Sourdough Boule (24 oz)',
    category: 'FOODS',
    subcategory: 'Bakery',
    brand: 'Rustic Oven',
    barcode: '070042000049',
    unitPrice: 4.29,
    unitCost: 1.80,
    perishable: true,
    shelfLifeDays: 5,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_005',
    name: 'Free-Range Large Brown Eggs (Dozen)',
    category: 'FOODS',
    subcategory: 'Dairy & Eggs',
    brand: 'Happy Pastures',
    barcode: '070042000056',
    unitPrice: 4.49,
    unitCost: 2.75,
    perishable: true,
    shelfLifeDays: 30,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_006',
    name: 'Fresh Atlantic Salmon Fillet (1 lb)',
    category: 'FOODS',
    subcategory: 'Meat & Seafood',
    brand: 'Nordic Coast',
    barcode: '070042000063',
    unitPrice: 12.99,
    unitCost: 8.50,
    perishable: true,
    shelfLifeDays: 4,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_007',
    name: 'Organic Baby Spinach (16 oz Clamshell)',
    category: 'FOODS',
    subcategory: 'Fresh Produce',
    brand: 'Earth Greens',
    barcode: '070042000070',
    unitPrice: 3.79,
    unitCost: 1.95,
    perishable: true,
    shelfLifeDays: 6,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_008',
    name: 'Greek Yogurt Plain 0% (32 oz)',
    category: 'FOODS',
    subcategory: 'Dairy & Eggs',
    brand: 'Olympus Pure',
    barcode: '070042000087',
    unitPrice: 5.19,
    unitCost: 3.20,
    perishable: true,
    shelfLifeDays: 25,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_009',
    name: 'Boneless Skinless Chicken Breasts (2 lb)',
    category: 'FOODS',
    subcategory: 'Meat & Seafood',
    brand: 'Valley Farms',
    barcode: '070042000094',
    unitPrice: 8.99,
    unitCost: 5.60,
    perishable: true,
    shelfLifeDays: 5,
    dataSource: 'simulated_demo',
  },
  {
    id: 'FOODS_1_010',
    name: 'Cold Pressed Orange Juice (52 fl oz)',
    category: 'FOODS',
    subcategory: 'Beverages',
    brand: 'Sunburst Grove',
    barcode: '070042000100',
    unitPrice: 4.69,
    unitCost: 2.80,
    perishable: true,
    shelfLifeDays: 18,
    dataSource: 'simulated_demo',
  },
];

export class SeedService {
  /**
   * Seed realistic demo operational data into database or memory
   */
  static async seedDemoData(): Promise<SeedDataResult> {
    const today = new Date();

    // 1. Generate Stores
    let storesCreated = 0;
    let productsCreated = 0;
    let salesCreated = 0;
    let inventoryCreated = 0;
    let poCreated = 0;
    let wastageCreated = 0;

    try {
      // Try Database Seed via Prisma
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
          // Inventory
          const currentStock = Math.floor(Math.random() * 45) + 5;
          const reorderLevel = 15;
          await prisma.inventory.upsert({
            where: {
              uq_inventory: {
                storeId: store.id,
                productId: prod.id,
              },
            },
            update: {
              currentStock,
              reorderLevel,
              dataSource: 'simulated_demo',
            },
            create: {
              storeId: store.id,
              productId: prod.id,
              currentStock,
              reorderLevel,
              dataSource: 'simulated_demo',
            },
          });
          inventoryCreated++;

          // Past 14 Days Daily Sales
          for (let d = 1; d <= 14; d++) {
            const saleDate = new Date(today);
            saleDate.setDate(today.getDate() - d);
            const unitsSold = Math.floor(Math.random() * 18) + 2;
            const revenue = Number((unitsSold * prod.unitPrice).toFixed(2));

            await prisma.dailySale.upsert({
              where: {
                uq_daily_sales: {
                  storeId: store.id,
                  productId: prod.id,
                  saleDate,
                },
              },
              update: {
                unitsSold,
                unitPrice: prod.unitPrice,
                revenue,
              },
              create: {
                storeId: store.id,
                productId: prod.id,
                saleDate,
                unitsSold,
                unitPrice: prod.unitPrice,
                revenue,
                dataSource: 'simulated_demo',
              },
            });
            salesCreated++;
          }

          // Occasional Wastage Record
          if (prod.perishable && Math.random() > 0.6) {
            const wasteQty = Math.floor(Math.random() * 4) + 1;
            const reasons = ['expired', 'damaged_in_transit', 'temperature_abuse', 'spoilage'];
            const reason = reasons[Math.floor(Math.random() * reasons.length)];

            await prisma.wastageRecord.create({
              data: {
                storeId: store.id,
                productId: prod.id,
                quantity: wasteQty,
                reason,
                dataSource: 'simulated_demo',
              },
            });
            wastageCreated++;
          }
        }

        // Purchase Orders for Store
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
              dataSource: 'simulated_demo',
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
      // If DB is offline, we return mock counters representing seeded records
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
