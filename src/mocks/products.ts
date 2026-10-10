// ============================================================
// FreshGuard AI — Dataset-Sourced Products (Real Retail Catalog)
// Source: dataset/products.csv (42 SKUs)
// ============================================================

import type { Product } from '../types';

const rawProducts = [
  { sku: 'SKU-001', name: 'Milk Bread', category: 'Bakery', price: 60, perishability: 'High', shelfLife: 3, icon: 'bread' },
  { sku: 'SKU-002', name: 'Brown Bread', category: 'Bakery', price: 60, perishability: 'High', shelfLife: 3, icon: 'bread' },
  { sku: 'SKU-003', name: 'Pav', category: 'Bakery', price: 30, perishability: 'High', shelfLife: 1, icon: 'bread' },
  { sku: 'SKU-004', name: 'Croissant', category: 'Bakery', price: 120, perishability: 'High', shelfLife: 1, icon: 'croissant' },
  { sku: 'SKU-005', name: 'Banana Cake', category: 'Bakery', price: 60, perishability: 'High', shelfLife: 3, icon: 'cake' },
  { sku: 'SKU-006', name: 'Rusk', category: 'Bakery', price: 60, perishability: 'High', shelfLife: 3, icon: 'bread' },
  { sku: 'SKU-007', name: 'Toned Milk 500ml', category: 'Dairy', price: 120, perishability: 'High', shelfLife: 2, icon: 'milk' },
  { sku: 'SKU-008', name: 'Curd 400g', category: 'Dairy', price: 30, perishability: 'High', shelfLife: 5, icon: 'milk' },
  { sku: 'SKU-009', name: 'Paneer 200g', category: 'Dairy', price: 60, perishability: 'High', shelfLife: 3, icon: 'cheese' },
  { sku: 'SKU-010', name: 'Butter 100g', category: 'Dairy', price: 80, perishability: 'High', shelfLife: 2, icon: 'butter' },
  { sku: 'SKU-011', name: 'Buttermilk', category: 'Dairy', price: 250, perishability: 'High', shelfLife: 2, icon: 'milk' },
  { sku: 'SKU-012', name: 'Ghee 200ml', category: 'Dairy', price: 45, perishability: 'High', shelfLife: 3, icon: 'oil' },
  { sku: 'SKU-013', name: 'Tomato 1kg', category: 'Fruits & Veg', price: 45, perishability: 'High', shelfLife: 4, icon: 'tomato' },
  { sku: 'SKU-014', name: 'Onion 1kg', category: 'Fruits & Veg', price: 450, perishability: 'High', shelfLife: 3, icon: 'onion' },
  { sku: 'SKU-015', name: 'Banana (dozen)', category: 'Fruits & Veg', price: 80, perishability: 'High', shelfLife: 3, icon: 'banana' },
  { sku: 'SKU-016', name: 'Spinach', category: 'Fruits & Veg', price: 450, perishability: 'High', shelfLife: 2, icon: 'leaf' },
  { sku: 'SKU-017', name: 'Coriander', category: 'Fruits & Veg', price: 30, perishability: 'High', shelfLife: 3, icon: 'leaf' },
  { sku: 'SKU-018', name: 'Potato 1kg', category: 'Fruits & Veg', price: 60, perishability: 'High', shelfLife: 2, icon: 'potato' },
  { sku: 'SKU-019', name: 'Apple 1kg', category: 'Fruits & Veg', price: 60, perishability: 'High', shelfLife: 3, icon: 'apple' },
  { sku: 'SKU-020', name: 'Carrot 500g', category: 'Fruits & Veg', price: 80, perishability: 'High', shelfLife: 4, icon: 'carrot' },
  { sku: 'SKU-021', name: 'Idli Batter 1kg', category: 'Ready to Eat', price: 80, perishability: 'High', shelfLife: 1, icon: 'bowl' },
  { sku: 'SKU-022', name: 'Dosa Batter 1kg', category: 'Ready to Eat', price: 120, perishability: 'High', shelfLife: 2, icon: 'bowl' },
  { sku: 'SKU-023', name: 'Chapati (10)', category: 'Ready to Eat', price: 60, perishability: 'High', shelfLife: 1, icon: 'bread' },
  { sku: 'SKU-024', name: 'Veg Sandwich', category: 'Ready to Eat', price: 30, perishability: 'High', shelfLife: 2, icon: 'sandwich' },
  { sku: 'SKU-025', name: 'Fruit Bowl', category: 'Ready to Eat', price: 45, perishability: 'High', shelfLife: 1, icon: 'bowl' },
  { sku: 'SKU-026', name: 'Sona Masoori Rice 5kg', category: 'Staples', price: 30, perishability: 'Low', shelfLife: 180, icon: 'package' },
  { sku: 'SKU-027', name: 'Toor Dal 1kg', category: 'Staples', price: 450, perishability: 'Low', shelfLife: 180, icon: 'package' },
  { sku: 'SKU-028', name: 'Atta 5kg', category: 'Staples', price: 450, perishability: 'Low', shelfLife: 365, icon: 'package' },
  { sku: 'SKU-029', name: 'Sugar 1kg', category: 'Staples', price: 450, perishability: 'Low', shelfLife: 365, icon: 'package' },
  { sku: 'SKU-030', name: 'Sunflower Oil 1L', category: 'Staples', price: 45, perishability: 'Low', shelfLife: 180, icon: 'oil' },
  { sku: 'SKU-031', name: 'Salt 1kg', category: 'Staples', price: 120, perishability: 'Low', shelfLife: 180, icon: 'package' },
  { sku: 'SKU-032', name: 'Ragi Flour 1kg', category: 'Staples', price: 120, perishability: 'Low', shelfLife: 180, icon: 'package' },
  { sku: 'SKU-033', name: 'Biscuits', category: 'FMCG', price: 250, perishability: 'Low', shelfLife: 180, icon: 'cookie' },
  { sku: 'SKU-034', name: 'Instant Noodles', category: 'FMCG', price: 120, perishability: 'Low', shelfLife: 365, icon: 'bowl' },
  { sku: 'SKU-035', name: 'Tea 250g', category: 'FMCG', price: 30, perishability: 'Low', shelfLife: 540, icon: 'coffee' },
  { sku: 'SKU-036', name: 'Coffee Powder 200g', category: 'FMCG', price: 45, perishability: 'Low', shelfLife: 540, icon: 'coffee' },
  { sku: 'SKU-037', name: 'Detergent 1kg', category: 'FMCG', price: 120, perishability: 'Low', shelfLife: 540, icon: 'package' },
  { sku: 'SKU-038', name: 'Soap', category: 'FMCG', price: 60, perishability: 'Low', shelfLife: 365, icon: 'package' },
  { sku: 'SKU-039', name: 'Toothpaste', category: 'FMCG', price: 250, perishability: 'Low', shelfLife: 540, icon: 'package' },
  { sku: 'SKU-040', name: 'Namkeen', category: 'FMCG', price: 450, perishability: 'Low', shelfLife: 540, icon: 'cookie' },
  { sku: 'SKU-041', name: 'Chocolate Bar', category: 'FMCG', price: 450, perishability: 'Low', shelfLife: 180, icon: 'candy' },
  { sku: 'SKU-042', name: 'Soft Drink 750ml', category: 'FMCG', price: 120, perishability: 'Low', shelfLife: 365, icon: 'glass' },
];

export const PRODUCTS: Product[] = rawProducts.map((p, idx) => {
  const cost = Math.round(p.price * 0.7);
  const margin = Math.round(((p.price - cost) / p.price) * 100);
  return {
    id: `p_${p.sku.toLowerCase()}`,
    sku: p.sku,
    name: p.name,
    category: p.category,
    subcategory: p.category,
    brand: 'FreshBasket Reserve',
    packSize: 'Standard',
    unit: 'unit' as const,
    costPrice: cost,
    retailPrice: p.price,
    marginPercent: margin,
    procurementVendor: p.category === 'Dairy' ? 'Kaveri Traders' : p.category === 'Bakery' ? 'Vasavi Bakers' : 'Sri Lakshmi Logistics',
    reorderPoint: p.perishability === 'High' ? 15 : 40,
    active: true,
    iconHint: p.icon,
  };
});
