// ============================================================
// FreshGuard AI — Decision Centre: What-If & Alternatives
// ============================================================

import React from 'react';
import type { DecisionOption } from '../types';
import { WhatIfSimulator } from '../components/WhatIfSimulator';

interface WhatIfMetrics {
  estimatedSales: number;
  estimatedRevenue: number;
  estimatedGrossMargin: number;
  remainingInventory: number;
  potentialWastage: number;
}

export function WhatIfSimulatorSection({
  markdownPercent,
  onMarkdownChange,
  baselineMetrics,
}: {
  markdownPercent: number;
  onMarkdownChange: (v: number) => void;
  baselineMetrics: WhatIfMetrics;
}) {
  const currentMetrics = {
    estimatedSales: 128400,
    estimatedRevenue: 128400,
    estimatedGrossMargin: 60348,
    remainingInventory: 1,
    potentialWastage: 0.46,
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">What-If Simulator</h2>
      <WhatIfSimulator
        markdownPercent={markdownPercent}
        onMarkdownChange={onMarkdownChange}
        baselineMetrics={baselineMetrics}
        currentMetrics={currentMetrics}
      />
    </section>
  );
}

export function AlternativesSection({ options }: { options: DecisionOption[] }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Alternative actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div key={opt.id} className="rounded-lg border border-border-subtle bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{opt.title}</h3>
                <p className="text-sm text-muted-foreground">{opt.description}</p>
              </div>
              <span className={`text-xs font-medium ${opt.riskLevel==='low'?'text-green-600':opt.riskLevel==='medium'?'text-yellow-600':'text-critical'}`}>
                {opt.riskLevel} risk
              </span>
            </div>
            <div className="mt-2 text-xs">
              <p>Est. benefit: ${opt.estimatedBenefit.toLocaleString()}</p>
              <p>Est. cost: ${opt.estimatedCost.toLocaleString()}</p>
              <p>Timeline: {opt.timeline}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ActionsSection() {
  return (
    <div className="flex justify-end gap-2">
      <button
        className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-dark transition-colors"
        onClick={() => alert('Review action button would navigate to actions page in production.')}
      >
        Review action
      </button>
      <button
        className="px-4 py-2 border border-border-subtle rounded-md hover:bg-muted transition-colors text-sm"
        onClick={() => alert('Compare alternatives button would show comparison.')}
      >
        Compare alternatives
      </button>
      <button
        className="px-4 py-2 bg-accent-soft text-accent rounded-md hover:bg-accent-hover transition-colors text-sm"
        onClick={() => alert('Prepare for approval button would open approval dialog.')}
      >
        Prepare for approval
      </button>
    </div>
  );
}
