// ============================================================
// FreshGuard AI — Components: What-If Simulator (v1)
// ============================================================

import React from 'react';

interface WhatIfMetrics {
  estimatedSales: number;
  estimatedRevenue: number;
  estimatedGrossMargin: number;
  remainingInventory: number;
  potentialWastage: number;
}

interface WhatIfSimulatorProps {
  markdownPercent: number;
  onMarkdownChange: (value: number) => void;
  baselineMetrics: WhatIfMetrics;
  currentMetrics: WhatIfMetrics;
  label?: string;
}

export function WhatIfSimulator({
  markdownPercent,
  onMarkdownChange,
  baselineMetrics,
  currentMetrics,
}: WhatIfSimulatorProps) {
  const calculateMetrics = (percentage: number): WhatIfMetrics => {
    const markdownFactor = 1 - percentage / 100;

    // Illustrative calculations - these are estimates, not guarantees
    const estimatedSales = baselineMetrics.estimatedSales * (1 + percentage / 100 * 0.02);
    const estimatedRevenue = estimatedSales * (1 - percentage / 100 * 0.15);
    const estimatedGrossMargin = baselineMetrics.estimatedGrossMargin * (1 - percentage / 100 * 0.25);
    const remainingInventory = baselineMetrics.remainingInventory * (1 - percentage / 100 * 0.15);
    const potentialWastage = baselineMetrics.potentialWastage * (1 - percentage / 100 * 0.2);

    return {
      estimatedSales,
      estimatedRevenue,
      estimatedGrossMargin,
      remainingInventory,
      potentialWastage,
    };
  };

  const metrics = calculateMetrics(markdownPercent);

  return (
    <div className="rounded-lg border border-border-subtle bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-4">What-If Simulator</h3>

      <div className="mb-6">
        <label htmlFor="whatif-slider" className="block text-sm font-medium mb-2">
          Markdown Discount: {markdownPercent.toFixed(0)}%
        </label>
        <div className="w-full">
          <input
            id="whatif-slider"
            type="range"
            min={0}
            max={50}
            step={1}
            value={markdownPercent}
            onChange={(e) => onMarkdownChange(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none bg-border cursor-pointer accent-accent"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0% (no discount)</span>
          <span>50% (aggressive discount)</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <MetricBox
          label="Estimated Sales"
          value={`$${metrics.estimatedSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={baselineMetrics.estimatedSales > 0 ? ((metrics.estimatedSales / baselineMetrics.estimatedSales) - 1) * 100 : 0}
          positive={metrics.estimatedSales > 0}
        />
        <MetricBox
          label="Expected Revenue"
          value={`$${metrics.estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={baselineMetrics.estimatedRevenue > 0 ? ((metrics.estimatedRevenue / baselineMetrics.estimatedRevenue) - 1) * 100 : 0}
          positive={metrics.estimatedRevenue > 0}
        />
        <MetricBox
          label="Gross Margin"
          value={`${(metrics.estimatedGrossMargin / 100).toFixed(1)}%`}
          change={baselineMetrics.estimatedGrossMargin > 0 ? ((metrics.estimatedGrossMargin / baselineMetrics.estimatedGrossMargin) - 1) * 100 : 0}
          positive={metrics.estimatedGrossMargin > 0}
        />
        <MetricBox
          label="Remaining Inventory"
          value={`${Math.round(metrics.remainingInventory * 100)}%`}
          change={baselineMetrics.remainingInventory > 0 ? ((metrics.remainingInventory / baselineMetrics.remainingInventory) - 1) * 100 : 0}
          positive={metrics.remainingInventory < 1}
        />
        <MetricBox
          label="Potential Wastage"
          value={`${Math.round(metrics.potentialWastage * 100)}%`}
          change={baselineMetrics.potentialWastage > 0 ? ((metrics.potentialWastage / baselineMetrics.potentialWastage) - 1) * 100 : 0}
          positive={metrics.potentialWastage < baselineMetrics.potentialWastage}
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground border-t border-border-subtle pt-3">
        * These are illustrative estimates based on simple market models. They are not guaranteed outcomes.
        Use with caution and validate against real data before making decisions.
      </p>
    </div>
  );
}

function MetricBox({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: number;
  positive: boolean;
}) {
  return (
    <div className="rounded-md border border-border-subtle p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-medium mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
      </div>
    </div>
  );
}
