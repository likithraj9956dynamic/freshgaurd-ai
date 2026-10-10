// ============================================================
// FreshGuard AI — Dataset-Sourced Stores (Real Retail Network)
// Source: dataset/stores.csv (25 Branches)
// ============================================================

import type { Store } from '../types';

const rawStoreData = [
  { store: 'FB-01', location: 'Jayanagar', franchisee: 'Vasavi Retail', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-02', location: 'BTM Layout', franchisee: 'Kaveri Traders', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-03', location: 'Banashankari', franchisee: 'Prakruti Foods', format: 'urban' as const, status: 'at-risk' as const },
  { store: 'FB-04', location: 'Basavanagudi', franchisee: 'Sowbhagya Stores', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-05', location: 'JP Nagar', franchisee: 'Annapoorna Foods', format: 'suburban' as const, status: 'warning' as const },
  { store: 'FB-06', location: 'Koramangala', franchisee: 'Sri Lakshmi Retail', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-07', location: 'HSR Layout', franchisee: 'Vasavi Retail', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-08', location: 'Indiranagar', franchisee: 'Prakruti Foods', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-09', location: 'Domlur', franchisee: 'Sowbhagya Stores', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-10', location: 'Malleshwaram', franchisee: 'Green Leaf Ventures', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-11', location: 'Rajajinagar', franchisee: 'Vasavi Retail', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-12', location: 'Vijayanagar', franchisee: 'Nandi Enterprises', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-13', location: 'RT Nagar', franchisee: 'Green Leaf Ventures', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-14', location: 'Hebbal', franchisee: 'Sri Lakshmi Retail', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-15', location: 'Yelahanka', franchisee: 'Nandi Enterprises', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-16', location: 'Whitefield', franchisee: 'Nandi Enterprises', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-17', location: 'Marathahalli', franchisee: 'Sri Lakshmi Retail', format: 'suburban' as const, status: 'critical' as const },
  { store: 'FB-18', location: 'Bellandur', franchisee: 'Green Leaf Ventures', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-19', location: 'Electronic City', franchisee: 'Vasavi Retail', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-20', location: 'Kengeri', franchisee: 'Nandi Enterprises', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-21', location: 'Nagarbhavi', franchisee: 'Annapoorna Foods', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-22', location: 'Hennur', franchisee: 'Green Leaf Ventures', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-23', location: 'Kalyan Nagar', franchisee: 'Prakruti Foods', format: 'suburban' as const, status: 'healthy' as const },
  { store: 'FB-24', location: 'Sahakar Nagar', franchisee: 'Sri Lakshmi Retail', format: 'urban' as const, status: 'healthy' as const },
  { store: 'FB-25', location: 'Ulsoor', franchisee: 'Sowbhagya Stores', format: 'suburban' as const, status: 'healthy' as const },
];

const stores: Store[] = rawStoreData.map((s, idx) => ({
  id: s.store,
  name: `FreshBasket ${s.location} (#${s.store})`,
  storeNumber: s.store.replace('FB-', ''),
  location: {
    city: 'Bangalore',
    state: 'KA',
    region: 'South Retail Hub',
    area: s.location,
    zip: `5600${String(idx + 1).padStart(2, '0')}`,
  },
  format: s.format,
  openDate: '2020-01-15',
  totalSquareFootage: s.format === 'suburban' ? 28000 : 16000,
  departments: ['Bakery', 'Dairy', 'Fruits & Veg', 'Ready to Eat', 'Staples', 'FMCG'],
  status: s.status,
  managerName: s.franchisee,
  managerEmail: `director.${s.store.toLowerCase()}@freshbasket.com`,
  assignedTeamSize: 24 + (idx % 8),
  phone: `+91-80-555-${String(idx + 1).padStart(4, '0')}`,
  address: `${s.location} Main Commercial Road, Bangalore, KA`,
  trending: s.store === 'FB-17' ? 'down' : 'up',
  revenueTarget: 160000,
  revenueActual: s.store === 'FB-17' ? 128400 : 155000 + ((idx * 2100) % 15000),
}));

export const STORES = stores;
export const STORE_17_ID = 'FB-17';
