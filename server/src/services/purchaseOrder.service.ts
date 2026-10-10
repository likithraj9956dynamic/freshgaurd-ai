import { prisma } from '../config/prisma';
import {
  getPurchaseOrdersByStore,
  getDatasetPurchaseOrders,
  getProductBySku,
  loadDatasets,
  type DatasetPurchaseOrder,
} from './datasetLoader';
import { mockProducts } from './seed.service';

export interface PurchaseOrderQueryFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export class PurchaseOrderService {
  static async getStorePurchaseOrders(storeId: string, filters: PurchaseOrderQueryFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    // 1. Try Prisma Database first
    try {
      const whereClause: any = { storeId };
      if (filters.status) whereClause.status = filters.status;

      const [orders, total] = await Promise.all([
        prisma.purchaseOrder.findMany({
          where: whereClause,
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { orderDate: 'desc' },
          skip,
          take: limit,
        }),
        prisma.purchaseOrder.count({ where: whereClause }),
      ]);

      if (orders && orders.length > 0) {
        return {
          data: orders,
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
    let datasetPOs: DatasetPurchaseOrder[] = getPurchaseOrdersByStore(storeId);

    if (datasetPOs.length === 0) {
      const allPOs = getDatasetPurchaseOrders();
      if (allPOs.length > 0) {
        datasetPOs = allPOs;
      }
    }

    if (datasetPOs.length > 0) {
      // Group items by PO number
      const poMap = new Map<string, {
        id: string;
        storeId: string;
        supplierName: string;
        orderDate: string;
        expectedDelivery: string;
        actualDelivery: string | null;
        status: string;
        dataSource: string;
        createdAt: string;
        items: Array<{
          id: string;
          productId: string;
          quantityOrdered: number;
          quantityReceived: number | null;
          product: any;
        }>;
      }>();

      for (const po of datasetPOs) {
        const poKey = po.po || `PO_${po.store}_${po.expectedDate}`;
        const prod = getProductBySku(po.sku);

        if (!poMap.has(poKey)) {
          const isDelayed = po.status.toLowerCase().includes('delayed') || po.status.toLowerCase().includes('pending');
          const isDelivered = po.status.toLowerCase().includes('received') || po.status.toLowerCase().includes('delivered');

          poMap.set(poKey, {
            id: poKey,
            storeId: po.store,
            supplierName: po.supplier || 'Primary Logistics Partner',
            orderDate: po.expectedDate,
            expectedDelivery: po.expectedDate,
            actualDelivery: isDelivered ? po.expectedDate : null,
            status: isDelayed ? 'delayed' : (isDelivered ? 'delivered' : 'pending'),
            dataSource: 'dataset_csv',
            createdAt: `${po.expectedDate}T08:00:00.000Z`,
            items: [],
          });
        }

        const poEntry = poMap.get(poKey)!;
        poEntry.items.push({
          id: `item_${poKey}_${po.sku}`,
          productId: po.sku,
          quantityOrdered: po.qty,
          quantityReceived: poEntry.status === 'delivered' ? po.qty : null,
          product: prod ? {
            id: prod.sku,
            name: prod.product,
            category: prod.category,
            unitPrice: prod.price,
            perishability: prod.perishability,
          } : {
            id: po.sku,
            name: po.sku,
            category: 'General',
            unitPrice: 0,
          },
        });
      }

      let orderList = Array.from(poMap.values());
      if (filters.status) {
        orderList = orderList.filter((o) => o.status.toLowerCase() === filters.status?.toLowerCase());
      }

      // Sort by orderDate descending
      orderList.sort((a, b) => b.orderDate.localeCompare(a.orderDate));

      const total = orderList.length;
      const paginated = orderList.slice(skip, skip + limit);

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

    // 3. Fallback to seed mock POs
    const mockList = [
      {
        id: `PO-${storeId}-1001`,
        storeId,
        supplierName: 'Fresh Direct Produce Ltd',
        orderDate: '2026-10-01',
        expectedDelivery: '2026-10-04',
        actualDelivery: '2026-10-04',
        status: 'delivered',
        dataSource: 'simulated_fallback',
        createdAt: '2026-10-01T08:00:00.000Z',
        items: [
          {
            id: 'poi_1',
            productId: mockProducts[0].id,
            quantityOrdered: 60,
            quantityReceived: 60,
            product: mockProducts[0],
          },
          {
            id: 'poi_2',
            productId: mockProducts[1].id,
            quantityOrdered: 40,
            quantityReceived: 40,
            product: mockProducts[1],
          },
        ],
      },
      {
        id: `PO-${storeId}-1002`,
        storeId,
        supplierName: 'Nordic Seafood & Dairy Co',
        orderDate: '2026-10-06',
        expectedDelivery: '2026-10-08',
        actualDelivery: null,
        status: 'delayed',
        dataSource: 'simulated_fallback',
        createdAt: '2026-10-06T09:30:00.000Z',
        items: [
          {
            id: 'poi_3',
            productId: mockProducts[5]?.id || mockProducts[0].id,
            quantityOrdered: 30,
            quantityReceived: null,
            product: mockProducts[5] || mockProducts[0],
          },
        ],
      },
    ];

    let filtered = mockList;
    if (filters.status) filtered = filtered.filter((o) => o.status === filters.status);

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
