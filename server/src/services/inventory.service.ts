import { prisma } from '../config/prisma';
import {
  getInventoryByStore,
  getDatasetInventory,
  getProductBySku,
  loadDatasets,
  type DatasetInventory,
} from './datasetLoader';
import { mockProducts } from './seed.service';

export interface InventoryQueryFilters {
  lowStockOnly?: boolean;
  category?: string;
  productId?: string;
  page?: number;
  limit?: number;
}

export class InventoryService {
  static async getStoreInventory(storeId: string, filters: InventoryQueryFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    // 1. Try Prisma Database first
    try {
      const whereClause: any = { storeId };
      if (filters.productId) whereClause.productId = filters.productId;
      if (filters.category) {
        whereClause.product = { category: filters.category };
      }

      const [inventory, total] = await Promise.all([
        prisma.inventory.findMany({
          where: whereClause,
          include: { product: true },
          orderBy: { currentStock: 'asc' },
          skip,
          take: limit,
        }),
        prisma.inventory.count({ where: whereClause }),
      ]);

      if (inventory && inventory.length > 0) {
        const enriched = inventory.map((item) => ({
          ...item,
          isLowStock: item.currentStock <= item.reorderLevel,
          daysOfSupply: Number((item.currentStock / 8.5).toFixed(1)), // Estimated DOS
        }));

        const filtered = filters.lowStockOnly
          ? enriched.filter((item) => item.isLowStock)
          : enriched;

        return {
          data: filtered,
          meta: {
            total: filters.lowStockOnly ? filtered.length : total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      }
    } catch {
      // Database unavailable, fall through to dataset loader
    }

    // 2. Real Dataset CSV Fallback
    loadDatasets();
    let datasetInv: DatasetInventory[] = getInventoryByStore(storeId);

    if (datasetInv.length === 0) {
      const allInv = getDatasetInventory();
      if (allInv.length > 0) {
        datasetInv = allInv;
      }
    }

    if (datasetInv.length > 0) {
      let filtered = datasetInv;
      if (filters.productId) {
        filtered = filtered.filter((i) => i.sku === filters.productId);
      }

      const enriched = filtered.map((item) => {
        const prod = getProductBySku(item.sku);
        const isLowStock = item.stock <= item.reorderLevel;
        const daysOfSupply = Number((item.stock / 8.5).toFixed(1));

        return {
          id: `${item.store}_${item.sku}`,
          storeId: item.store,
          productId: item.sku,
          currentStock: item.stock,
          reorderLevel: item.reorderLevel,
          isLowStock,
          daysOfSupply,
          updatedAt: new Date().toISOString(),
          dataSource: 'dataset_csv',
          product: prod
            ? {
                id: prod.sku,
                name: prod.product,
                category: prod.category,
                unitPrice: prod.price,
                perishability: prod.perishability,
                shelfLifeDays: prod.shelfLifeDays,
              }
            : {
                id: item.sku,
                name: item.sku,
                category: 'General',
                unitPrice: 0,
              },
        };
      });

      let results = enriched;
      if (filters.category) {
        results = results.filter((i) => i.product.category === filters.category);
      }
      if (filters.lowStockOnly) {
        results = results.filter((i) => i.isLowStock);
      }

      // Sort by currentStock ascending (most critical first)
      results.sort((a, b) => a.currentStock - b.currentStock);

      const total = results.length;
      const paginated = results.slice(skip, skip + limit);

      return {
        data: paginated,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // 3. Fallback to seed products if dataset unavailable
    const mockList = mockProducts.map((prod, idx) => {
      const currentStock = idx % 3 === 0 ? 8 : 35 + (idx * 3);
      const reorderLevel = 15;
      return {
        id: `${storeId}_${prod.id}`,
        storeId,
        productId: prod.id,
        currentStock,
        reorderLevel,
        isLowStock: currentStock <= reorderLevel,
        daysOfSupply: Number((currentStock / 8.5).toFixed(1)),
        updatedAt: new Date().toISOString(),
        dataSource: 'simulated_fallback',
        product: prod,
      };
    });

    let mockFiltered = mockList;
    if (filters.productId) mockFiltered = mockFiltered.filter((i) => i.productId === filters.productId);
    if (filters.category) mockFiltered = mockFiltered.filter((i) => i.product.category === filters.category);
    if (filters.lowStockOnly) mockFiltered = mockFiltered.filter((i) => i.isLowStock);

    const total = mockFiltered.length;
    const paginated = mockFiltered.slice(skip, skip + limit);

    return {
      data: paginated,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
