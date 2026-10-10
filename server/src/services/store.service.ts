import { prisma } from '../config/prisma';
import { mockStores } from './seed.service';
import {
  getDatasetStores,
  getDatasetCustomers,
  getDatasetStaff,
  getDatasetCompliance,
  resolveStoreId,
  isDatasetLoaded,
  loadDatasets,
} from './datasetLoader';

export class StoreService {
  static async getAllStores() {
    // First try DB
    try {
      const stores = await prisma.store.findMany({ orderBy: { name: 'asc' } });
      if (stores && stores.length > 0) return stores;
    } catch { /* Fallback */ }

    // Use dataset stores
    loadDatasets();
    if (isDatasetLoaded()) {
      const dsStores = getDatasetStores();
      if (dsStores.length > 0) {
        return dsStores.map((s) => ({
          id: s.store,
          name: `FreshBasket ${s.location}`,
          location: s.location,
          state: 'KA',
          country: 'IN',
          storeFormat: s.format,
          status: s.operatingStatus.startsWith('Open') ? 'active' : 'inactive',
          createdAt: new Date(),
        }));
      }
    }

    return mockStores;
  }

  static async getStoreById(storeId: string) {
    try {
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (store) return store;
    } catch { /* Fallback */ }

    // Dataset lookup
    loadDatasets();
    if (isDatasetLoaded()) {
      const dsStores = getDatasetStores();
      const resolved = resolveStoreId(storeId);
      const ds = dsStores.find((s) => s.store === resolved || s.store === storeId);
      if (ds) {
        return {
          id: ds.store,
          name: `FreshBasket ${ds.location}`,
          location: ds.location,
          state: 'KA',
          country: 'IN',
          storeFormat: ds.format,
          status: ds.operatingStatus.startsWith('Open') ? 'active' : 'inactive',
          createdAt: new Date(),
        };
      }
    }

    return mockStores.find((s) => s.id === storeId) || null;
  }

  /**
   * Get customer footfall/transaction data for a store
   */
  static getStoreCustomerData(storeId: string) {
    loadDatasets();
    return getDatasetCustomers().filter((c) => c.store === storeId);
  }

  /**
   * Get staffing data for a store
   */
  static getStoreStaffData(storeId: string) {
    loadDatasets();
    return getDatasetStaff().filter((s) => s.store === storeId);
  }

  /**
   * Get compliance/inspection records for a store
   */
  static getStoreComplianceData(storeId: string) {
    loadDatasets();
    return getDatasetCompliance().filter((c) => c.store === storeId);
  }
}
