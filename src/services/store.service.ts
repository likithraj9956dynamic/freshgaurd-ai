import { prisma } from '../config/prisma';
import { mockStores } from './seed.service';

export class StoreService {
  static async getAllStores() {
    try {
      const stores = await prisma.store.findMany({
        orderBy: { name: 'asc' },
      });
      if (stores && stores.length > 0) return stores;
    } catch {
      // Fallback to mock stores
    }
    return mockStores;
  }

  static async getStoreById(storeId: string) {
    try {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });
      if (store) return store;
    } catch {
      // Fallback
    }
    return mockStores.find((s) => s.id === storeId) || null;
  }
}
