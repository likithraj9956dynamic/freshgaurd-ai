// ============================================================
// FreshGuard AI — Page: Investigation Room (Graph & Evidence)
// Enterprise Multi-Signal Causal Diagnosis & Evidence Audit
// ============================================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { InvestigationGraphSection } from './InvestigationRoomGraph';
import { EvidencePanel } from './InvestigationRoomEvidence';
import { ChallengeThisPanel } from './InvestigationRoomChallenge';
import { useAIStore } from '../services/ai-store';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Scale,
  Layers,
  HelpCircle
} from 'lucide-react';

export function InvestigationRoomPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDemos();

  const currentId = issueId || 'issue-001';
  const investigation = data?.investigations?.find((i) => i.id === 'inv-001' || i.issueId === currentId) || null;

  if (isLoading) return <LoadingState message="Accessing multi-source causal graph..." />;
  if (!investigation) return <EmptyState title="Investigation Not Found" description="The requested case dossier does not exist in diagnostic archives." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Search className="w-3.5 h-3.5 text-emerald-700" />
            <span>Operational Case Dossier · {investigation.affectedStore}</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {investigation.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {investigation.evidenceSummary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                {investigation.severity.toUpperCase()} PRIORITY
              </span>
              <span className="text-xs font-mono text-slate-600">
                Model Confidence: <strong className="text-emerald-700 font-semibold">{investigation.confidence}%</strong> ({investigation.confidenceLevel})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                const store = useAIStore.getState();
                store.openCopilot();
                store.sendCopilotMessage(
                  `Perform an operational root-cause breakdown of "${investigation.title}" at ${investigation.affectedStore}. Differentiate hard telemetry facts from speculative hypotheses, and provide 3 immediate corrective directives.`
                );
              }}
              className="btn-primary text-xs px-3.5 py-1.5 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Causal Breakdown</span>
            </button>
          </div>
        </div>
      </section>

      {/* Signal Relationship Graph & Evidence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Signal Causal Graph */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Operational Signal Graph
            </h2>
            <p className="text-xs text-slate-500">
              Correlations, causal links, and unknown variables
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
            <InvestigationGraphSection />
          </div>
        </div>

        {/* Right: Audited Evidence Panel & Challenge Questions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm space-y-5">
            <EvidencePanel investigation={investigation} />

            <div className="pt-4 border-t border-slate-100">
              <ChallengeThisPanel />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/decisions/dec-1')}
                className="btn-primary w-full text-xs justify-center flex items-center gap-1.5"
              >
                <span>Proceed to Strategy Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
