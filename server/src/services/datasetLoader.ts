/**
 * FreshGuard AI — Dataset Loader
 *
 * Reads CSV files from the dataset/ directory into typed in-memory data structures.
 * All datasets are loaded once at startup and cached. Provides typed accessors
 * for every table so that service layers can query real data instead of mocks.
 */
import fs from 'fs';
import path from 'path';
import { CsvParser } from './csvParser';

// ─── Type Definitions ───────────────────────────────────────

export interface DatasetStore {
  store: string;
  location: string;
  franchisee: string;
  format: string;
  operatingStatus: string;
}

export interface DatasetProduct {
  sku: string;
  product: string;
  category: string;
  price: number;
  perishability: string;
  shelfLifeDays: number;
}

export interface DatasetSale {
  date: string;
  store: string;
  sku: string;
  qtySold: number;
  revenue: number;
}

export interface DatasetInventory {
  store: string;
  sku: string;
  stock: number;
  reorderLevel: number;
}

export interface DatasetWastage {
  store: string;
  sku: string;
  qtyWasted: number;
  reason: string;
  date: string;
}

export interface DatasetPurchaseOrder {
  po: string;
  supplier: string;
  store: string;
  sku: string;
  qty: number;
  expectedDate: string;
  status: string;
}

export interface DatasetCustomer {
  store: string;
  date: string;
  footfall: number;
  transactions: number;
  avgBillValue: number;
}

export interface DatasetStaff {
  store: string;
  date: string;
  staffPresent: number;
  staffingLevel: number;
  transactionsPerStaff: number;
}

export interface DatasetCompliance {
  store: string;
  inspectionDate: string;
  checklistScore: number;
  openIssues: number;
  issueNotes: string;
}

// ─── Singleton Cache ────────────────────────────────────────

let _loaded = false;
let _stores: DatasetStore[] = [];
let _products: DatasetProduct[] = [];
let _sales: DatasetSale[] = [];
let _inventory: DatasetInventory[] = [];
let _wastage: DatasetWastage[] = [];
let _purchaseOrders: DatasetPurchaseOrder[] = [];
let _customers: DatasetCustomer[] = [];
let _staff: DatasetStaff[] = [];
let _compliance: DatasetCompliance[] = [];

// Lookup maps for fast access
let _productBySku: Map<string, DatasetProduct> = new Map();
let _storeLookup: Map<string, DatasetStore> = new Map();

// ─── Resolve dataset directory ──────────────────────────────

function resolveDatasetDir(): string {
  // Try multiple possible locations relative to current working directory
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, 'dataset'),
    path.join(cwd, '..', 'dataset'),
    path.resolve('dataset'),
    path.resolve('..', 'dataset'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  // Fallback
  return path.join(cwd, 'dataset');
}

function readCsv(dir: string, filename: string): Record<string, string>[] {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[DatasetLoader] ⚠ File not found: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return CsvParser.parse(raw);
}

// ─── Load All Datasets ──────────────────────────────────────

export function loadDatasets(): void {
  if (_loaded) return;

  const dir = resolveDatasetDir();
  console.log(`[DatasetLoader] Loading datasets from: ${dir}`);

  if (!fs.existsSync(dir)) {
    console.error(`[DatasetLoader] ❌ Dataset directory not found: ${dir}`);
    _loaded = true;
    return;
  }

  // Stores
  const rawStores = readCsv(dir, 'stores.csv');
  _stores = rawStores.map((r) => ({
    store: r.store || '',
    location: r.location || '',
    franchisee: r.franchisee || '',
    format: r.format || '',
    operatingStatus: r.operating_status || r.operatingstatus || '',
  }));

  // Products
  const rawProducts = readCsv(dir, 'products.csv');
  _products = rawProducts.map((r) => ({
    sku: r.sku || '',
    product: r.product || '',
    category: r.category || '',
    price: parseFloat(r.price) || 0,
    perishability: r.perishability || '',
    shelfLifeDays: parseInt(r.shelf_life_days || r.shelflifedays || '0', 10),
  }));

  // Sales
  const rawSales = readCsv(dir, 'sales.csv');
  _sales = rawSales.map((r) => ({
    date: r.date || '',
    store: r.store || '',
    sku: r.sku || '',
    qtySold: parseInt(r.qty_sold || r.qtysold || '0', 10),
    revenue: parseFloat(r.revenue) || 0,
  }));

  // Inventory
  const rawInventory = readCsv(dir, 'inventory.csv');
  _inventory = rawInventory.map((r) => ({
    store: r.store || '',
    sku: r.sku || '',
    stock: parseInt(r.stock || '0', 10),
    reorderLevel: parseInt(r.reorder_level || r.reorderlevel || '0', 10),
  }));

  // Wastage
  const rawWastage = readCsv(dir, 'wastage.csv');
  _wastage = rawWastage.map((r) => ({
    store: r.store || '',
    sku: r.sku || '',
    qtyWasted: parseInt(r.qty_wasted || r.qtywasted || '0', 10),
    reason: r.reason || '',
    date: r.date || '',
  }));

  // Purchase Orders
  const rawPOs = readCsv(dir, 'purchase_orders.csv');
  _purchaseOrders = rawPOs.map((r) => ({
    po: r.po || '',
    supplier: r.supplier || '',
    store: r.store || '',
    sku: r.sku || '',
    qty: parseInt(r.qty || '0', 10),
    expectedDate: r.expected_date || r.expecteddate || '',
    status: r.status || '',
  }));

  // Customers
  const rawCustomers = readCsv(dir, 'customers.csv');
  _customers = rawCustomers.map((r) => ({
    store: r.store || '',
    date: r.date || '',
    footfall: parseInt(r.footfall || '0', 10),
    transactions: parseInt(r.transactions || '0', 10),
    avgBillValue: parseFloat(r.avg_bill_value || r.avgbillvalue || '0'),
  }));

  // Staff
  const rawStaff = readCsv(dir, 'staff.csv');
  _staff = rawStaff.map((r) => ({
    store: r.store || '',
    date: r.date || '',
    staffPresent: parseInt(r.staff_present || r.staffpresent || '0', 10),
    staffingLevel: parseInt(r.staffing_level || r.staffinglevel || '0', 10),
    transactionsPerStaff: parseFloat(r.transactions_per_staff || r.transactionsperstaff || '0'),
  }));

  // Compliance
  const rawCompliance = readCsv(dir, 'compliance.csv');
  _compliance = rawCompliance.map((r) => ({
    store: r.store || '',
    inspectionDate: r.inspection_date || r.inspectiondate || '',
    checklistScore: parseInt(r.checklist_score || r.checklistscore || '0', 10),
    openIssues: parseInt(r.open_issues || r.openissues || '0', 10),
    issueNotes: r.issue_notes || r.issuenotes || '',
  }));

  // Build lookup maps
  _productBySku = new Map(_products.map((p) => [p.sku, p]));
  _storeLookup = new Map(_stores.map((s) => [s.store, s]));

  _loaded = true;

  console.log(`[DatasetLoader] ✅ Loaded:`);
  console.log(`  Stores:          ${_stores.length}`);
  console.log(`  Products:        ${_products.length}`);
  console.log(`  Sales:           ${_sales.length}`);
  console.log(`  Inventory:       ${_inventory.length}`);
  console.log(`  Wastage:         ${_wastage.length}`);
  console.log(`  Purchase Orders: ${_purchaseOrders.length}`);
  console.log(`  Customers:       ${_customers.length}`);
  console.log(`  Staff:           ${_staff.length}`);
  console.log(`  Compliance:      ${_compliance.length}`);
}

// ─── Public Accessors ───────────────────────────────────────

export function getDatasetStores(): DatasetStore[] {
  loadDatasets();
  return _stores;
}

export function getDatasetProducts(): DatasetProduct[] {
  loadDatasets();
  return _products;
}

export function getDatasetSales(): DatasetSale[] {
  loadDatasets();
  return _sales;
}

export function getDatasetInventory(): DatasetInventory[] {
  loadDatasets();
  return _inventory;
}

export function getDatasetWastage(): DatasetWastage[] {
  loadDatasets();
  return _wastage;
}

export function getDatasetPurchaseOrders(): DatasetPurchaseOrder[] {
  loadDatasets();
  return _purchaseOrders;
}

export function getDatasetCustomers(): DatasetCustomer[] {
  loadDatasets();
  return _customers;
}

export function getDatasetStaff(): DatasetStaff[] {
  loadDatasets();
  return _staff;
}

export function getDatasetCompliance(): DatasetCompliance[] {
  loadDatasets();
  return _compliance;
}

export function getProductBySku(sku: string): DatasetProduct | undefined {
  loadDatasets();
  return _productBySku.get(sku);
}

export function getStoreById(storeId: string): DatasetStore | undefined {
  loadDatasets();
  return _storeLookup.get(storeId);
}

export function isDatasetLoaded(): boolean {
  return _loaded && _stores.length > 0;
}

// ─── Filtered Accessors ─────────────────────────────────────

export function getSalesByStore(storeId: string): DatasetSale[] {
  loadDatasets();
  return _sales.filter((s) => s.store === storeId);
}

export function getSalesByStoreAndSku(storeId: string, sku: string): DatasetSale[] {
  loadDatasets();
  return _sales.filter((s) => s.store === storeId && s.sku === sku);
}

export function getInventoryByStore(storeId: string): DatasetInventory[] {
  loadDatasets();
  return _inventory.filter((i) => i.store === storeId);
}

export function getWastageByStore(storeId: string): DatasetWastage[] {
  loadDatasets();
  return _wastage.filter((w) => w.store === storeId);
}

export function getPurchaseOrdersByStore(storeId: string): DatasetPurchaseOrder[] {
  loadDatasets();
  return _purchaseOrders.filter((po) => po.store === storeId);
}

export function getCustomersByStore(storeId: string): DatasetCustomer[] {
  loadDatasets();
  return _customers.filter((c) => c.store === storeId);
}

export function getStaffByStore(storeId: string): DatasetStaff[] {
  loadDatasets();
  return _staff.filter((s) => s.store === storeId);
}

export function getComplianceByStore(storeId: string): DatasetCompliance[] {
  loadDatasets();
  return _compliance.filter((c) => c.store === storeId);
}

// ─── Aggregate Helpers ──────────────────────────────────────

export function getUniqueDates(): string[] {
  loadDatasets();
  return [...new Set(_sales.map((s) => s.date))].sort();
}

export function getUniqueStoreIds(): string[] {
  loadDatasets();
  return _stores.map((s) => s.store);
}

export function getUniqueSkus(): string[] {
  loadDatasets();
  return _products.map((p) => p.sku);
}

export function resolveStoreId(storeId: string): string {
  loadDatasets();
  if (_storeLookup.has(storeId)) return storeId;
  const upper = storeId.toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (const s of _stores) {
    const sNorm = s.store.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (sNorm === upper) return s.store;
    const numMatch = upper.match(/\d+/);
    if (numMatch && s.store.endsWith(numMatch[0].padStart(2, '0'))) {
      return s.store;
    }
  }
  return _stores[0]?.store || storeId;
}

export function resolveSku(sku: string): string {
  loadDatasets();
  if (_productBySku.has(sku)) return sku;
  const upper = sku.toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (const p of _products) {
    const pNorm = p.sku.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pNorm === upper) return p.sku;
    const numMatch = upper.match(/\d+/);
    if (numMatch && p.sku.endsWith(numMatch[0].padStart(3, '0'))) {
      return p.sku;
    }
  }
  return _products[0]?.sku || sku;
}
