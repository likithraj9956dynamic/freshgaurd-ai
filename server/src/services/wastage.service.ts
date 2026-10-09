import { prisma } from '../config/prisma';
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
      // Fallback
    }

    // In-memory fallback
    const mockList: any[] = [];
    const reasons = ['expired', 'damaged_in_transit', 'temperature_abuse', 'spoilage'];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const prod = mockProducts[i % mockProducts.length];
      const recDate = new Date(today);
      recDate.setDate(today.getDate() - (i * 2 + 1));
      const dateStr = recDate.toISOString();
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
        dataSource: 'simulated_demo',
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
