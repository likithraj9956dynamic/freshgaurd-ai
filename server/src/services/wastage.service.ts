import { prisma } from '../config/prisma';
import {
  getWastageByStore,
  getDatasetWastage,
  getProductBySku,
  loadDatasets,
  type DatasetWastage,
} from './datasetLoader';
import { mockProducts } from './seed.service';

export interface WastageQueryFilters {
  startDate?: string;
  endDate?: string;
  reason?: string;
  productId?: string;
  page?: number;
  limit?: number;
}

export class WastageService {
  static async getStoreWastage(storeId: string, filters: WastageQueryFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    // 1. Try Prisma Database first
    try {
      const whereClause: any = { storeId };
      if (filters.productId) whereClause.productId = filters.productId;
      if (filters.reason) whereClause.reason = filters.reason;
      if (filters.startDate || filters.endDate) {
        whereClause.recordedAt = {};
        if (filters.startDate) whereClause.recordedAt.gte = new Date(filters.startDate);
        if (filters.endDate) whereClause.recordedAt.lte = new Date(filters.endDate);
      }

      const [records, total] = await Promise.all([
        prisma.wastageRecord.findMany({
          where: whereClause,
          include: { product: true },
          orderBy: { recordedAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.wastageRecord.count({ where: whereClause }),
      ]);

      if (records && records.length > 0) {
        return {
          data: records,
          meta: {
            total,
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
    let datasetWaste: DatasetWastage[] = getWastageByStore(storeId);

    if (datasetWaste.length === 0) {
      const allWaste = getDatasetWastage();
      if (allWaste.length > 0) {
        datasetWaste = allWaste;
      }
    }

    if (datasetWaste.length > 0) {
      let filtered = datasetWaste;
      if (filters.productId) {
        filtered = filtered.filter((w) => w.sku === filters.productId);
      }
      if (filters.reason) {
        filtered = filtered.filter((w) => w.reason.toLowerCase() === filters.reason?.toLowerCase());
      }
      if (filters.startDate) {
        filtered = filtered.filter((w) => w.date >= (filters.startDate as string));
      }
      if (filters.endDate) {
        filtered = filtered.filter((w) => w.date <= (filters.endDate as string));
      }

      // Sort by date descending
      filtered.sort((a, b) => b.date.localeCompare(a.date));

      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limit);

      const data = paginated.map((waste, idx) => {
        const prod = getProductBySku(waste.sku);
        const unitCost = prod ? Number((prod.price * 0.7).toFixed(2)) : 3.5;
        const estimatedLoss = Number((waste.qtyWasted * unitCost).toFixed(2));

        return {
          id: `waste_${waste.store}_${waste.sku}_${waste.date}_${idx}`,
          storeId: waste.store,
          productId: waste.sku,
          quantity: waste.qtyWasted,
          reason: waste.reason,
          recordedAt: waste.date,
          estimatedLoss,
          dataSource: 'dataset_csv',
          product: prod
            ? {
                id: prod.sku,
                name: prod.product,
                category: prod.category,
                unitPrice: prod.price,
                unitCost,
                perishability: prod.perishability,
                shelfLifeDays: prod.shelfLifeDays,
              }
            : {
                id: waste.sku,
                name: waste.sku,
                category: 'General',
                unitPrice: 5.0,
                unitCost: 3.5,
              },
        };
      });

      return {
        data,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    // 3. Fallback to seed products if dataset unavailable
    const mockList: any[] = [];
    const reasons = ['expired', 'damaged_in_transit', 'temperature_abuse', 'spoilage'];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const prod = mockProducts[i % mockProducts.length];
      const recDate = new Date(today);
      recDate.setDate(today.getDate() - (i * 2 + 1));
      const dateStr = recDate.toISOString().split('T')[0];
      const reason = reasons[i % reasons.length];
      const quantity = (i % 4) + 1;

      if (filters.reason && reason !== filters.reason) continue;
      if (filters.productId && prod.id !== filters.productId) continue;

      mockList.push({
        id: `waste_${storeId}_${i + 1}`,
        storeId,
        productId: prod.id,
        quantity,
        reason,
        recordedAt: dateStr,
        estimatedLoss: Number((quantity * prod.unitCost).toFixed(2)),
        dataSource: 'simulated_fallback',
        product: prod,
      });
    }

    const total = mockList.length;
    const paginated = mockList.slice(skip, skip + limit);

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
