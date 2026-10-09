// ============================================================
// FreshGuard AI — Page: The Decision Chamber
// ============================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { WhatIfSimulator } from '../components/WhatIfSimulator';
import { EDITORIAL_IMAGES } from '../assets/images';
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

  if (isLoading) return <LoadingState message="Summoning decision chamber models..." />;

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
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* ============================================================
          HEADER: THE ROYAL DECISION CHAMBER
          ============================================================ */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              EXECUTIVE GOVERNANCE & INTERVENTION CHAMBER
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7]">
            Strategy Evaluation & Simulation
          </h1>

          <p className="text-sm sm:text-base text-[#8E9B90] font-light leading-relaxed">
            Compare 3 targeted operational strategies for Store 017. Weigh projected benefit, fleet logistics costs,
            and uncertainty. Human sign-off is mandatory prior to simulating automated execution.
          </p>

          <div className="p-3 rounded border border-[#C5A059]/20 bg-[#071C16]/60 text-xs text-[#E0C588] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
            <span>Governance Rule: Simulated actions do not alter physical store inventories or trigger real supplier purchase orders.</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: COMPARISON OF 3 OPERATIONAL STRATEGIES
          ============================================================ */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
            COMPARATIVE STRATEGY MATRIX
          </span>
          <h2 className="text-2xl font-editorial text-[#FDFBF7]">
            Select Strategic Intervention
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className={`royal-card p-6 cursor-pointer flex flex-col justify-between space-y-4 transition-all relative ${
                  isSelected ? 'royal-card-highlight ring-1 ring-[#C5A059]' : 'opacity-80 hover:opacity-100'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <span className="badge-royal-fact">SELECTED</span>
                  </div>
                )}

                <div className="space-y-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    opt.riskLevel === 'low' ? 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30' :
                    opt.riskLevel === 'medium' ? 'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/30' :
                    'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/30'
                  }`}>
                    {opt.riskLevel} RISK PROFILE
                  </span>

                  <h3 className="text-lg font-editorial text-[#FDFBF7] pt-1">
                    {opt.title}
                  </h3>

                  <p className="text-xs text-[#8E9B90] leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                {/* Strategy ROI Bar */}
                <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#8E9B90]">Est. Gross Benefit</span>
                    <span className="text-[#16A34A] font-semibold font-mono">+${opt.estimatedBenefit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9B90]">Estimated Cost</span>
                    <span className="text-[#F87171] font-semibold font-mono">-${opt.estimatedCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9B90]">Execution Timeline</span>
                    <span className="text-[#FDFBF7] font-mono">{opt.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8E9B90]">Model Confidence</span>
                    <span className="text-[#E0C588] font-mono">{opt.confidence}%</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          SECTION 2: DEEP DIVE & WHAT-IF SIMULATOR FOR SELECTED STRATEGY
          ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: What-If Parameter Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
              SENSITIVITY ANALYSIS
            </span>
            <h3 className="text-xl font-editorial text-[#FDFBF7]">
              What-If Parameter Modeling
            </h3>
          </div>

          <WhatIfSimulator
            markdownPercent={markdownDiscount}
            onMarkdownChange={setMarkdownDiscount}
            baselineMetrics={baselineMetrics}
            currentMetrics={baselineMetrics}
          />
        </div>

        {/* Right: Human Governance & Simulated Execution */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
              MANDATORY SIGN-OFF
            </span>
            <h3 className="text-xl font-editorial text-[#FDFBF7]">
              Human Approval Protocol
            </h3>
          </div>

          <div className="royal-card p-6 space-y-5">
            <div className="space-y-2">
              <h4 className="text-base font-editorial text-[#FDFBF7]">
                Executive Sign-off Required
              </h4>
              <p className="text-xs text-[#8E9B90] leading-relaxed">
                By ticking below, you acknowledge having reviewed the supporting telemetry for Store 017
                and authorize simulated dispatch of strategy <strong className="text-[#E0C588]">"{currentDecision.title}"</strong>.
              </p>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 p-3.5 rounded border border-[#C5A059]/20 bg-[#071C16] cursor-pointer hover:border-[#C5A059]/50 transition-colors">
              <input
                type="checkbox"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="mt-0.5 accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-xs text-[#FDFBF7] leading-relaxed">
                I formally confirm executive approval for this simulated intervention.
              </span>
            </label>

            {/* Execution Trigger */}
            <div className="space-y-3">
              <button
                disabled={!isApproved}
                onClick={handleSimulateExecution}
                className={`w-full py-3 px-4 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isApproved
                    ? 'btn-royal-gold'
                    : 'bg-white/5 border border-white/10 text-[#8E9B90]/50 cursor-not-allowed'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                Simulate Action Execution
              </button>

              {isSimulated && (
                <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/10 text-xs text-[#16A34A] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>SIMULATION COMPLETED SUCCESSFULLY</span>
                  </div>
                  <p className="text-[#8E9B90] leading-relaxed pt-1">
                    Virtual dispatch confirmed. Expected stock balance recovery within 6 hours. Telemetry tracked under
                    governance audit trail #SIM-2026-X81.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 text-[11px] text-[#8E9B90]">
              <span className="font-mono text-[#C5A059]">AUDIT LOGGED TO:</span> HEAD OFFICE OPERATIONS
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
