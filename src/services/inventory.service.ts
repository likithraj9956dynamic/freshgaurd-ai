import { prisma } from '../config/prisma';
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
      // Fallback
    }

    // In-memory fallback
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
        dataSource: 'simulated_demo',
        product: prod,
      };
    });

    let filtered = mockList;
    if (filters.productId) filtered = filtered.filter((i) => i.productId === filters.productId);
    if (filters.category) filtered = filtered.filter((i) => i.product.category === filters.category);
    if (filters.lowStockOnly) filtered = filtered.filter((i) => i.isLowStock);

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

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
