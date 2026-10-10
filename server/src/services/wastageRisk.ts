/**
 * FreshGuard AI — Wastage Risk Model
 *
 * Analyzes historical wastage data to classify products by wastage risk
 * per store. Uses actual data from dataset/wastage.csv and dataset/products.csv.
 *
 * Risk Classification:
 *   - Computes wastage rate = total wasted / (total sold + total wasted)
 *   - Factors in product perishability and shelf life
 *   - Classifies: LOW (< 5%), MEDIUM (5-12%), HIGH (12-25%), CRITICAL (> 25%)
 *
 * Also generates store-level wastage summaries and identifies top waste drivers.
 */

import {
  getDatasetSales,
  getDatasetWastage,
  getDatasetProducts,
  getDatasetInventory,
  getUniqueStoreIds,
  getUniqueSkus,
  resolveStoreId,
  resolveSku,
  loadDatasets,
  isDatasetLoaded,
  type DatasetProduct,
} from './datasetLoader';

// ─── Types ──────────────────────────────────────────────────

export type WastageRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface ProductWastageRisk {
  store: string;
  sku: string;
  productName: string;
  category: string;
  perishability: string;
  shelfLifeDays: number;
  totalSold: number;
  totalWasted: number;
  wastageRate: number; // 0–100%
  estimatedLoss: number; // ₹
  riskLevel: WastageRiskLevel;
  primaryReason: string;
  reasonBreakdown: Record<string, number>;
  recommendation: string;
}

export interface StoreWastageSummary {
  store: string;
  totalWasted: number;
  totalSold: number;
  wastageRate: number;
  estimatedLoss: number;
  criticalProducts: number;
  highRiskProducts: number;
  topWasteDrivers: { sku: string; productName: string; qtyWasted: number; loss: number }[];
  wastageByReason: Record<string, number>;
  wastageByCategory: Record<string, number>;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface WastageModelStatus {
  trained: boolean;
  trainedAt: string | null;
  totalRiskAssessments: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  avgWastageRate: number;
  totalEstimatedLoss: number;
  wastageRecordsUsed: number;
  salesRecordsUsed: number;
  methodology: string;
}

// ─── Model Cache ────────────────────────────────────────────

let _wastageModelTrained = false;
let _wastageTrainedAt: string | null = null;
let _productRisks: ProductWastageRisk[] = [];
let _storeSummaries: Map<string, StoreWastageSummary> = new Map();

// ─── Risk Classification ────────────────────────────────────

function classifyRisk(wastageRate: number, perishability: string, shelfLifeDays: number): WastageRiskLevel {
  // Adjust thresholds based on perishability
  const perishFactor = perishability === 'High' ? 0.8 : perishability === 'Medium' ? 1.0 : 1.2;
  const shelfFactor = shelfLifeDays <= 2 ? 0.7 : shelfLifeDays <= 5 ? 0.85 : 1.0;

  const adjustedRate = wastageRate / (perishFactor * shelfFactor);

  if (adjustedRate >= 25) return 'critical';
  if (adjustedRate >= 12) return 'high';
  if (adjustedRate >= 5) return 'medium';
  return 'low';
}

function generateRecommendation(risk: WastageRiskLevel, reason: string, product: DatasetProduct): string {
  if (risk === 'critical') {
    if (reason === 'Expired') {
      return `URGENT: Reduce order quantity for ${product.product}. Current shelf life (${product.shelfLifeDays} days) insufficient for current turnover rate. Consider markdown pricing 1 day before expiry.`;
    }
    if (reason === 'Damaged') {
      return `URGENT: Investigate handling and storage for ${product.product}. High damage rate suggests cold chain or transport issues.`;
    }
    return `URGENT: Review replenishment strategy for ${product.product}. Consider reducing reorder qty by 30–40%.`;
  }
  if (risk === 'high') {
    if (reason === 'Expired') {
      return `Review FIFO compliance for ${product.product}. Consider shorter replenishment cycles.`;
    }
    return `Monitor ${product.product} closely. Wastage rate exceeds acceptable threshold.`;
  }
  if (risk === 'medium') {
    return `${product.product} has moderate wastage. Continue monitoring and ensure FIFO rotation.`;
  }
  return `${product.product} wastage is within acceptable limits.`;
}

// ─── Training ───────────────────────────────────────────────

export function trainWastageModel(): void {
  if (_wastageModelTrained) return;
  loadDatasets();

  if (!isDatasetLoaded()) {
    console.warn('[WastageRisk] Dataset not loaded, skipping training');
    return;
  }

  const allSales = getDatasetSales();
  const allWastage = getDatasetWastage();
  const products = getDatasetProducts();
  const storeIds = getUniqueStoreIds();
  const skus = getUniqueSkus();

  console.log(`[WastageRisk] Analyzing wastage across ${storeIds.length} stores × ${skus.length} SKUs...`);

  _productRisks = [];
  _storeSummaries.clear();

  const productMap = new Map(products.map((p) => [p.sku, p]));

  for (const storeId of storeIds) {
    const storeSales = allSales.filter((s) => s.store === storeId);
    const storeWastage = allWastage.filter((w) => w.store === storeId);

    let storeTotalSold = 0;
    let storeTotalWasted = 0;
    let storeEstimatedLoss = 0;
    let criticalCount = 0;
    let highCount = 0;
    const wastageByReason: Record<string, number> = {};
    const wastageByCategory: Record<string, number> = {};
    const topDrivers: { sku: string; productName: string; qtyWasted: number; loss: number }[] = [];

    for (const sku of skus) {
      const product = productMap.get(sku);
      if (!product) continue;

      const skuSales = storeSales.filter((s) => s.sku === sku);
      const skuWastage = storeWastage.filter((w) => w.sku === sku);

      const totalSold = skuSales.reduce((s, r) => s + r.qtySold, 0);
      const totalWasted = skuWastage.reduce((s, r) => s + r.qtyWasted, 0);

      if (totalSold === 0 && totalWasted === 0) continue;

      const wastageRate = (totalSold + totalWasted) > 0
        ? (totalWasted / (totalSold + totalWasted)) * 100
        : 0;

      const estimatedLoss = totalWasted * product.price;

      // Reason breakdown
      const reasonBreakdown: Record<string, number> = {};
      for (const w of skuWastage) {
        reasonBreakdown[w.reason] = (reasonBreakdown[w.reason] || 0) + w.qtyWasted;
      }

      // Find primary reason
      let primaryReason = 'None';
      let maxReasonQty = 0;
      for (const [reason, qty] of Object.entries(reasonBreakdown)) {
        if (qty > maxReasonQty) {
          primaryReason = reason;
          maxReasonQty = qty;
        }
      }

      const riskLevel = classifyRisk(wastageRate, product.perishability, product.shelfLifeDays);
      const recommendation = totalWasted > 0
        ? generateRecommendation(riskLevel, primaryReason, product)
        : `${product.product} has no recorded wastage.`;

      _productRisks.push({
        store: storeId,
        sku,
        productName: product.product,
        category: product.category,
        perishability: product.perishability,
        shelfLifeDays: product.shelfLifeDays,
        totalSold,
        totalWasted,
        wastageRate: Number(wastageRate.toFixed(2)),
        estimatedLoss: Number(estimatedLoss.toFixed(2)),
        riskLevel,
        primaryReason,
        reasonBreakdown,
        recommendation,
      });

      storeTotalSold += totalSold;
      storeTotalWasted += totalWasted;
      storeEstimatedLoss += estimatedLoss;
      if (riskLevel === 'critical') criticalCount++;
      if (riskLevel === 'high') highCount++;

      // Aggregate by reason and category
      for (const [reason, qty] of Object.entries(reasonBreakdown)) {
        wastageByReason[reason] = (wastageByReason[reason] || 0) + qty;
      }
      wastageByCategory[product.category] = (wastageByCategory[product.category] || 0) + totalWasted;

      if (totalWasted > 0) {
        topDrivers.push({ sku, productName: product.product, qtyWasted: totalWasted, loss: estimatedLoss });
      }
    }

    // Sort top drivers
    topDrivers.sort((a, b) => b.loss - a.loss);

    // Determine trend from first half vs second half wastage
    const dates = [...new Set(storeWastage.map((w) => w.date))].sort();
    const midDate = dates[Math.floor(dates.length / 2)] || '';
    const firstHalf = storeWastage.filter((w) => w.date <= midDate).reduce((s, w) => s + w.qtyWasted, 0);
    const secondHalf = storeWastage.filter((w) => w.date > midDate).reduce((s, w) => s + w.qtyWasted, 0);
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    if (firstHalf > 0 && secondHalf > 0) {
      const change = ((secondHalf - firstHalf) / firstHalf) * 100;
      if (change > 10) trend = 'worsening';
      else if (change < -10) trend = 'improving';
    }

    const storeWastageRate = (storeTotalSold + storeTotalWasted) > 0
      ? (storeTotalWasted / (storeTotalSold + storeTotalWasted)) * 100
      : 0;

    _storeSummaries.set(storeId, {
      store: storeId,
      totalWasted: storeTotalWasted,
      totalSold: storeTotalSold,
      wastageRate: Number(storeWastageRate.toFixed(2)),
      estimatedLoss: Number(storeEstimatedLoss.toFixed(2)),
      criticalProducts: criticalCount,
      highRiskProducts: highCount,
      topWasteDrivers: topDrivers.slice(0, 5),
      wastageByReason,
      wastageByCategory,
      trend,
    });
  }

  _wastageModelTrained = true;
  _wastageTrainedAt = new Date().toISOString();

  const totalCritical = _productRisks.filter((r) => r.riskLevel === 'critical').length;
  const totalHigh = _productRisks.filter((r) => r.riskLevel === 'high').length;
  const avgRate = _productRisks.length > 0
    ? _productRisks.reduce((s, r) => s + r.wastageRate, 0) / _productRisks.length
    : 0;

  console.log(`[WastageRisk] ✅ Analyzed ${_productRisks.length} store×product combinations`);
  console.log(`  Critical: ${totalCritical}, High: ${totalHigh}`);
  console.log(`  Avg wastage rate: ${avgRate.toFixed(2)}%`);
}

// ─── Inference ──────────────────────────────────────────────

export function getWastageRiskByStore(storeId: string): ProductWastageRisk[] {
  trainWastageModel();
  const targetStore = resolveStoreId(storeId);
  return _productRisks.filter((r) => r.store === targetStore);
}

export function getWastageRiskBySku(sku: string): ProductWastageRisk[] {
  trainWastageModel();
  const targetSku = resolveSku(sku);
  return _productRisks.filter((r) => r.sku === targetSku);
}

export function getCriticalWastageRisks(): ProductWastageRisk[] {
  trainWastageModel();
  return _productRisks.filter((r) => r.riskLevel === 'critical' || r.riskLevel === 'high');
}

export function getStoreWastageSummary(storeId: string): StoreWastageSummary | null {
  trainWastageModel();
  const targetStore = resolveStoreId(storeId);
  return _storeSummaries.get(targetStore) || null;
}

export function getAllStoreWastageSummaries(): StoreWastageSummary[] {
  trainWastageModel();
  return [..._storeSummaries.values()];
}

// ─── Model Status ───────────────────────────────────────────

export function getWastageModelStatus(): WastageModelStatus {
  trainWastageModel();

  const criticalCount = _productRisks.filter((r) => r.riskLevel === 'critical').length;
  const highCount = _productRisks.filter((r) => r.riskLevel === 'high').length;
  const mediumCount = _productRisks.filter((r) => r.riskLevel === 'medium').length;
  const lowCount = _productRisks.filter((r) => r.riskLevel === 'low').length;
  const avgRate = _productRisks.length > 0
    ? _productRisks.reduce((s, r) => s + r.wastageRate, 0) / _productRisks.length
    : 0;
  const totalLoss = _productRisks.reduce((s, r) => s + r.estimatedLoss, 0);

  return {
    trained: _wastageModelTrained,
    trainedAt: _wastageTrainedAt,
    totalRiskAssessments: _productRisks.length,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    avgWastageRate: Number(avgRate.toFixed(2)),
    totalEstimatedLoss: Number(totalLoss.toFixed(2)),
    wastageRecordsUsed: getDatasetWastage().length,
    salesRecordsUsed: getDatasetSales().length,
    methodology: 'Wastage rate analysis with perishability-adjusted risk thresholds. Rate = wasted / (sold + wasted) × 100. Thresholds adjusted by perishability (High: ×0.8, Medium: ×1.0, Low: ×1.2) and shelf life (≤2d: ×0.7, ≤5d: ×0.85, >5d: ×1.0).',
  };
}
