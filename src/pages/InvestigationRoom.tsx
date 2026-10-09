// ============================================================
// FreshGuard AI — Page: Investigation Room (Graph & Evidence)
// ============================================================

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import type { Investigation } from '../types';
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

  if (isLoading) return <LoadingState message="Summoning multi-source causal graph..." />;
  if (!investigation) return <EmptyState title="Investigation Not Found" description="The requested case dossier does not exist in diagnostic archives." />;

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* ============================================================
          HEADER: THE CAUSAL INVESTIGATION CHAMBER
          ============================================================ */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <Search className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              CASE DOSSIER · {investigation.affectedStore}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7]">
            {investigation.title}
          </h1>

          <p className="text-sm sm:text-base text-[#8E9B90] font-light leading-relaxed">
            {investigation.evidenceSummary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="badge-royal-critical">
                {investigation.severity.toUpperCase()} PRIORITY
              </span>
              <span className="text-xs font-mono text-[#E0C588]">
                MODEL CONFIDENCE: {investigation.confidence}% ({investigation.confidenceLevel})
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
              className="btn-royal-gold text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Causal Breakdown</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 1: SIGNAL RELATIONSHIP GRAPH & EVIDENCE LIST
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Signal Causal Graph */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
                CORRELATION & CAUSATION
              </span>
              <h2 className="text-2xl font-editorial text-[#FDFBF7]">
                Operational Signal Graph
              </h2>
            </div>
          </div>

          <div className="royal-card p-4">
            <InvestigationGraphSection />
          </div>
        </div>

        {/* Right: Audited Evidence Panel & Challenge Questions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="royal-card p-6 space-y-6">
            <EvidencePanel investigation={investigation} />

            <div className="pt-4 border-t border-white/5">
              <ChallengeThisPanel />
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/decisions/dec-1')}
                className="btn-royal-gold w-full text-xs justify-center"
              >
                Proceed to Decision Chamber <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
