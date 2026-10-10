import { prisma } from '../config/prisma';
import {
  getSalesByStore,
  getDatasetSales,
  getProductBySku,
  resolveStoreId,
  resolveSku,
  isDatasetLoaded,
  loadDatasets,
  type DatasetSale,
} from './datasetLoader';
import { mockProducts } from './seed.service';

export interface SalesQueryFilters {
  startDate?: string;
  endDate?: string;
  productId?: string;
  page?: number;
  limit?: number;
}

export class SalesService {
  static async getStoreSales(storeId: string, filters: SalesQueryFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    // 1. Try Prisma Database first
    try {
      const whereClause: any = { storeId };
      if (filters.productId) whereClause.productId = filters.productId;
      if (filters.startDate || filters.endDate) {
        whereClause.saleDate = {};
        if (filters.startDate) whereClause.saleDate.gte = new Date(filters.startDate);
        if (filters.endDate) whereClause.saleDate.lte = new Date(filters.endDate);
      }

      const [sales, total] = await Promise.all([
        prisma.dailySale.findMany({
          where: whereClause,
          include: { product: true },
          orderBy: { saleDate: 'desc' },
          skip,
          take: limit,
        }),
        prisma.dailySale.count({ where: whereClause }),
      ]);

      if (sales && sales.length > 0) {
        return {
          data: sales,
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
    const targetStore = resolveStoreId(storeId);
    let datasetSales: DatasetSale[] = getSalesByStore(targetStore);

    // If storeId not matched directly, fallback to all dataset sales or map
    if (datasetSales.length === 0) {
      const allSales = getDatasetSales();
      if (allSales.length > 0) {
        datasetSales = allSales;
      }
    }

    if (datasetSales.length > 0) {
      let filtered = datasetSales;
      if (filters.productId) {
        const targetSku = resolveSku(filters.productId);
        filtered = filtered.filter((s) => s.sku === targetSku || s.sku === filters.productId);
      }
      if (filters.startDate) {
        filtered = filtered.filter((s) => s.date >= (filters.startDate as string));
      }
      if (filters.endDate) {
        filtered = filtered.filter((s) => s.date <= (filters.endDate as string));
      }

      // Sort by date descending
      filtered.sort((a, b) => b.date.localeCompare(a.date));

      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limit);

      const data = paginated.map((sale) => {
        const prod = getProductBySku(sale.sku);
        return {
          id: `${sale.store}_${sale.sku}_${sale.date}`,
          storeId: sale.store,
          productId: sale.sku,
          saleDate: sale.date,
          unitsSold: sale.qtySold,
          unitPrice: prod?.price || (sale.qtySold > 0 ? Number((sale.revenue / sale.qtySold).toFixed(2)) : 0),
          revenue: sale.revenue,
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
                id: sale.sku,
                name: sale.sku,
                category: 'General',
                unitPrice: sale.qtySold > 0 ? Number((sale.revenue / sale.qtySold).toFixed(2)) : 0,
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

    // 3. Fallback to seed products if dataset is unavailable
    const today = new Date();
    const mockList: any[] = [];
    const productsToUse = filters.productId
      ? mockProducts.filter((p) => p.id === filters.productId)
      : mockProducts;

    for (let d = 0; d < 30; d++) {
      const saleDate = new Date(today);
      saleDate.setDate(today.getDate() - d);
      const dateStr = saleDate.toISOString().split('T')[0];

      if (filters.startDate && dateStr < filters.startDate) continue;
      if (filters.endDate && dateStr > filters.endDate) continue;

      for (const prod of productsToUse) {
        const unitsSold = 10 + ((d * 7 + prod.name.length) % 25);
        const revenue = Number((unitsSold * prod.unitPrice).toFixed(2));
        mockList.push({
          id: `${storeId}_${prod.id}_${dateStr}`,
          storeId,
          productId: prod.id,
          saleDate: dateStr,
          unitsSold,
          unitPrice: prod.unitPrice,
          revenue,
          dataSource: 'simulated_fallback',
          product: prod,
        });
      }
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
