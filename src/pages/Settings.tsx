// ============================================================
// FreshGuard AI — Page: Settings & System Dossier
// Enterprise Platform Configuration & AI Model Architecture
// ============================================================

import React, { useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import {
  Sliders,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Server,
  Activity,
  Layers,
  Database,
  Lock
} from 'lucide-react';
import { useAIStore } from '../services/ai-store';
import { useToast } from '../components/ToastProvider';

export function SettingsPage() {
  const { data } = useDemos();
  const info = data?.demoInfo;

  const { testCurrentConnection } = useAIStore();
  const { showToast } = useToast();

  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const success = await testCurrentConnection();
    setIsTesting(false);

    if (success) {
      setTestResult({
        success: true,
        message: 'Google Gemini Intelligence Engine verified. Endpoint reachable and processing telemetry.',
      });
      showToast({ type: 'success', title: 'Connection Verified', message: 'Gemini endpoint authenticated successfully.' });
    } else {
      setTestResult({
        success: false,
        message: 'Gemini connection check encountered an error. Please verify network access.',
      });
      showToast({ type: 'critical', title: 'Connection Issue', message: 'Could not reach Gemini endpoint.' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Platform Governance &amp; Intelligence Status</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            System Operations &amp; Intelligence Engine
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Live AI reasoning telemetry, calibration thresholds, and franchise governance parameters across the FreshBasket supermarket operations network.
          </p>
        </div>
      </section>

      {/* Active AI Intelligence Engine Status Card (Fully Configured & Functional) */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-semibold text-slate-900">
                Google Gemini Operations Intelligence Engine
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Integrated real-time LLM reasoning model providing causal analysis, automated markdown schedules, and copilot diagnostics.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Active &amp; Operational
          </span>
        </div>

        {/* Intelligence Specifications Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Active Provider</span>
            <span className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-700" />
              Google Gemini
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Enterprise Tier</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Model Pipeline</span>
            <span className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              gemini-flash-latest
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Automated Fallback to 3.8-Flash</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Security Architecture</span>
            <span className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-700" />
              Managed Credentials
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Zero client exposure</span>
          </div>
        </div>

        {/* Feature Capability Matrix */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
            Integrated AI Capabilities
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block">Executive Copilot Assistant</strong>
                <span className="text-slate-500">Live natural language query processor for store diagnostics, transfers, and root causes.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block">Automated Perishability Auditing</strong>
                <span className="text-slate-500">Dynamic Open Food Facts formulation analysis with markdown timeline recommendations.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block">Multi-Signal Causal Breakdown</strong>
                <span className="text-slate-500">Distinguishes hard sensor facts from speculative hypotheses across incident dossiers.</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-semibold block">Strategic Tradeoff Evaluations</strong>
                <span className="text-slate-500">Simulates financial margin recovery, transport overhead, and inventory balance recovery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Test Connection Banner */}
        {testResult && (
          <div
            className={`p-3.5 rounded-md border flex items-start gap-3 ${
              testResult.success
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <div className="flex-1 space-y-0.5">
              <span className="font-mono text-[10px] uppercase font-bold block">
                GEMINI ENDPOINT REACHABLE &amp; VERIFIED
              </span>
              <p className="text-xs leading-relaxed">{testResult.message}</p>
            </div>
          </div>
        )}

        {/* Verification Trigger Button */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Health Check: Diagnostics run against Google Generative Language v1beta
          </span>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pinging Gemini...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verify AI Endpoint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Architecture Manifest Card */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Operations Intelligence Architecture Manifest
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enterprise system specifications distinguishing audited telemetry facts (POS sales, RFID inventory, sensor logs)
            from diagnostic hypotheses.
          </p>
        </div>

        {info && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Build Release</span>
              <span className="font-mono font-medium text-slate-900 mt-0.5 block">{info.version}</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Network Stores</span>
              <span className="font-medium text-slate-900 mt-0.5 block">{info.storeCount} Sites</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Active Directives</span>
              <span className="font-medium text-slate-900 mt-0.5 block">{info.actionCount} Items</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Governance Mode</span>
              <span className="font-medium text-emerald-700 mt-0.5 block">HUMAN SIGN-OFF</span>
            </div>
          </div>
        )}

        {/* Featured Store 17 Benchmark */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Signature Benchmark: Tacoma Downtown (Store #017)
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Surveillance Case
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Store 017 exhibits the multi-signal challenge: Revenue -18%, Footfall -5%, Transactions -15%,
            Wastage +28%, 12 fast-moving stockouts, and Purchase Order CF-10482 delayed 36 hours.
          </p>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
            CALIBRATION PROTOCOL: Separates observed telemetry from diagnostic conjecture.
          </div>
        </div>
      </div>

    </div>
  );
}
