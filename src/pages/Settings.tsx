// ============================================================
// FreshGuard AI — Page: Settings & System Dossier
// ============================================================

import React from 'react';
import { useDemos } from '../hooks/useDemos';
import { Sliders, ShieldCheck, Crown, Database, Info } from 'lucide-react';

export function SettingsPage() {
  const { data, isDemo } = useDemos();
  const info = data?.demoInfo;

  return (
    <div className="space-y-12 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              SYSTEM CONFIGURATION & TELEMETRY MANIFEST
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Platform Governance & Parameters
          </h1>

          <p className="text-sm text-[#8E9B90] font-light leading-relaxed">
            FreshGuard AI operates in deterministic simulation mode for executive evaluation.
            Telemetry models calibrate anomaly thresholds across the FreshBasket franchise network.
          </p>
        </div>
      </section>

      {/* Model Spec Card */}
      <div className="royal-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#C5A059]" />
            <h2 className="text-xl font-editorial text-[#FDFBF7]">Royal Operations Intelligence Engine</h2>
          </div>
          <p className="text-xs text-[#8E9B90] leading-relaxed">
            Designed for franchise executives. Distinguishes hard evidence (POS sales, RFID inventory, delivery timestamps)
            from causal hypotheses (supplier delays, shrinkage, stockroom mismanagement).
          </p>
        </div>

        {info && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 text-xs">
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">VERSION</span>
              <span className="font-mono text-[#E0C588] mt-0.5 block">{info.version}</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">STORES MONITORED</span>
              <span className="font-mono text-[#FDFBF7] mt-0.5 block">{info.storeCount} Sites</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">ACTION DIRECTIVES</span>
              <span className="font-mono text-[#FDFBF7] mt-0.5 block">{info.actionCount} Items</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">GOVERNANCE MODE</span>
              <span className="font-mono text-[#16A34A] mt-0.5 block">HUMAN SIGN-OFF</span>
            </div>
          </div>
        )}

        {/* Featured Store 17 Scenario Specs */}
        <div className="p-5 rounded border border-[#C5A059]/20 bg-[#071C16] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#C5A059] uppercase">FEATURED BENCHMARK · STORE 017</span>
            <span className="badge-royal-critical">CRITICAL SURVEILLANCE</span>
          </div>
          <p className="text-xs text-[#8E9B90] leading-relaxed">
            Store 017 (Tacoma Downtown) embodies the signature scenario: Revenue -18%, Footfall -5%, Transactions -15%,
            Wastage +28%, 12 fast-moving stockouts, and Purchase Order CF-10482 delayed.
          </p>
          <div className="text-[11px] text-[#8E9B90] pt-1 border-t border-white/5 font-mono">
            CALIBRATION PROTOCOL: Separates observed telemetry from diagnostic conjecture.
          </div>
        </div>
      </div>

    </div>
  );
}
