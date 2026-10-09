// ============================================================
// FreshGuard AI — Page: Strategy Evaluation & Decision Chamber
// Enterprise Operational Decision Modeling & Simulation
// ============================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { useAIStore } from '../services/ai-store';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck2,
  Lock
} from 'lucide-react';

export function DecisionCentrePage() {
  const { decisionId } = useParams<{ decisionId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDemos();

  // Selected Strategy option (defaults to dec-1 or param)
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(decisionId || 'dec-1');
  
  // Interactive Simulation Slider
  const [markdownDiscount, setMarkdownDiscount] = useState<number>(15);
  
  // Explicit Human Approval State
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  if (isLoading) return <LoadingState message="Accessing decision modeling algorithms..." />;

  const decisions = data?.decisions || [];
  const currentDecision = decisions.find((d) => d.id === selectedStrategyId) || decisions[0];

  const baselineMetrics = {
    estimatedSales: 128400,
    estimatedRevenue: 128400,
    estimatedGrossMargin: 60348,
    remainingInventory: 1,
    potentialWastage: 0.46,
  };

  const handleSimulateExecution = () => {
    if (!isApproved) {
      alert('Human Governance Requirement: You must explicitly approve this strategy before executing a simulation.');
      return;
    }
    setIsSimulated(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Executive Governance &amp; Intervention Chamber</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Strategy Evaluation &amp; Simulation
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Compare 3 targeted operational strategies for Store 017. Weigh projected margin benefit, fleet logistics costs,
            and uncertainty. Explicit human sign-off is mandatory prior to simulating automated execution.
          </p>

          <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2 mt-2">
            <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Governance Rule: Simulated actions do not alter physical store inventories or trigger real supplier purchase orders.</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                const store = useAIStore.getState();
                store.openCopilot();
                store.sendCopilotMessage(
                  `Evaluate the operational intervention strategies for Store 017: Option A (Dynamic Markdown Flash Sale), Option B (Inter-store stock transfer from Bellevue #1014), and Option C (Expedited Supplier Purchase Order re-delivery). Which option optimizes margin recovery while minimizing spoilage?`
                );
              }}
              className="btn-primary text-xs px-3.5 py-2 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Strategic Tradeoff Analysis</span>
            </button>
          </div>
        </div>
      </section>

      {/* Comparative Strategy Matrix */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Select Strategic Intervention
          </h2>
          <p className="text-xs text-slate-500">
            Evaluate cost/benefit tradeoffs and risk classifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {decisions.slice(0, 3).map((opt) => {
            const isSelected = opt.id === selectedStrategyId;
            return (
              <div
                key={opt.id}
                onClick={() => {
                  setSelectedStrategyId(opt.id);
                  setIsApproved(false);
                  setIsSimulated(false);
                }}
                className={`bg-white rounded-lg p-5 border cursor-pointer flex flex-col justify-between space-y-4 transition-all relative shadow-sm ${
                  isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      SELECTED
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border inline-block ${
                    opt.riskLevel === 'low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    opt.riskLevel === 'medium' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {opt.riskLevel} RISK PROFILE
                  </span>

                  <h3 className="text-base font-semibold text-slate-900 pt-1">
                    {opt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Strategy ROI Bar */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Est. Gross Benefit</span>
                    <span className="text-emerald-700 font-semibold font-mono">+${opt.estimatedBenefit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Cost</span>
                    <span className="text-rose-700 font-semibold font-mono">-${opt.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Execution Timeline</span>
                    <span className="text-slate-800 font-mono font-medium">{opt.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Confidence</span>
                    <span className="text-slate-800 font-mono font-medium">{opt.confidence}%</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* Sensitivity Analysis & Human Sign-off */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: What-If Parameter Simulator */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Sensitivity &amp; Parameter Modeling
            </h3>
            <p className="text-xs text-slate-500">
              Simulate price markdown sensitivity on inventory velocities
            </p>
          </div>

          <WhatIfSimulator
            markdownPercent={markdownDiscount}
            onMarkdownChange={setMarkdownDiscount}
            baselineMetrics={baselineMetrics}
            currentMetrics={baselineMetrics}
          />
        </div>

        {/* Right: Human Governance & Simulated Execution */}
        <div className="lg:col-span-5 space-y-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Human Sign-Off Protocol
            </h3>
            <p className="text-xs text-slate-500">
              Mandatory supervisory authorization before dispatch simulation
            </p>
          </div>

          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-900">
                Executive Authorization Required
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                By ticking below, you acknowledge having reviewed the supporting telemetry for Store 017
                and authorize simulated dispatch of strategy <strong className="text-slate-900 font-medium">"{currentDecision.title}"</strong>.
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
              <input
                type="checkbox"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="mt-0.5 accent-emerald-700 w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-xs text-slate-800 leading-relaxed font-medium">
                I formally confirm executive approval for this simulated intervention.
              </span>
            </label>

            {/* Execution Trigger */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={!isApproved}
                onClick={handleSimulateExecution}
                className={`w-full py-2.5 px-4 rounded text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isApproved
                    ? 'btn-primary'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                Simulate Action Execution
              </button>

              {isSimulated && (
                <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>SIMULATION COMPLETED SUCCESSFULLY</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    Virtual dispatch confirmed. Expected stock balance recovery within 6 hours. Telemetry tracked under
                    governance audit trail #SIM-2026-X81.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
              AUDIT LOGGED TO: HEAD OFFICE OPERATIONS
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
