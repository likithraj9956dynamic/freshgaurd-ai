import { prisma } from '../config/prisma';
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
      // Fallback
    }

    // In-memory fallback
    const mockList = [
      {
        id: `PO-${storeId}-1001`,
        storeId,
        supplierName: 'Fresh Direct Produce Ltd',
        orderDate: '2026-10-01',
        expectedDelivery: '2026-10-04',
        actualDelivery: '2026-10-04',
        status: 'delivered',
        dataSource: 'simulated_demo',
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
        dataSource: 'simulated_demo',
        createdAt: '2026-10-06T09:30:00.000Z',
        items: [
          {
            id: 'poi_3',
            productId: mockProducts[5].id,
            quantityOrdered: 30,
            quantityReceived: null,
            product: mockProducts[5],
          },
        ],
      },
      {
        id: `PO-${storeId}-1003`,
        storeId,
        supplierName: 'Valley Farms Express',
        orderDate: '2026-10-08',
        expectedDelivery: '2026-10-11',
        actualDelivery: null,
        status: 'shipped',
        dataSource: 'simulated_demo',
        createdAt: '2026-10-08T11:15:00.000Z',
        items: [
          {
            id: 'poi_4',
            productId: mockProducts[8].id,
            quantityOrdered: 50,
            quantityReceived: null,
            product: mockProducts[8],
          },
        ],
      },
    ];

    let filtered = mockList;
    if (filters.status) filtered = filtered.filter((po) => po.status === filters.status);

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
