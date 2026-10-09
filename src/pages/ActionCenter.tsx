// ============================================================
// FreshGuard AI — Page: Action Centre (Governance & Approvals)
// ============================================================

import React, { useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { ActionApprovalDialog } from '../components/ActionApprovalDialogShell';
import type { Action } from '../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export function ActionCenterPage() {
  const { data, isLoading } = useDemos();
  const [actions, setActions] = useState<Action[]>([]);
  const [selected, setSelected] = useState<Action | null>(null);
  const [filter, setFilter] = useState<Action['status'] | 'all'>('all');

  React.useEffect(() => {
    if (data?.actions) setActions(data.actions);
  }, [data]);

  if (isLoading) return <LoadingState message="Accessing executive action ledger..." />;
  if (!actions.length && !data?.actions?.length) {
    return <EmptyState title="No Directives Found" description="All proposed actions have been resolved." />;
  }

  const filtered = filter === 'all' ? actions : actions.filter((a) => a.status === filter);

  const updateStatus = (id: string, status: Action['status']) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    setSelected(null);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              HUMAN-IN-THE-LOOP GOVERNANCE LEDGER
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7]">
            Action Centre & Sign-Offs
          </h1>

          <p className="text-sm sm:text-base text-[#8E9B90] font-light leading-relaxed">
            Every AI-generated recommendation requires explicit human sign-off before executing or assigning
            directives to store teams. Review financial models, projected impacts, and supporting evidence.
          </p>
        </div>
      </section>

      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
            INTERVENTION QUEUE
          </span>
          <h2 className="text-2xl font-editorial text-[#FDFBF7]">
            Proposed Directives ({filtered.length})
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#8E9B90]">STATUS FILTER:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded bg-[#071C16] text-[#FDFBF7] text-xs px-3 py-1.5 border border-[#C5A059]/30 focus:outline-none"
          >
            <option value="all">All Directives</option>
            <option value="pending-approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="executed">Executed</option>
          </select>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((action) => (
          <div key={action.id} className="royal-card p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                  action.status === 'pending-approval' ? 'bg-[#D97706]/20 text-[#F59E0B] border border-[#D97706]/30' :
                  action.status === 'approved' ? 'bg-[#16A34A]/20 text-[#16A34A] border border-[#16A34A]/30' :
                  action.status === 'rejected' ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/30' :
                  'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30'
                }`}>
                  {action.status.replace('-', ' ')}
                </span>
                <span className="text-xs font-mono text-[#C5A059] uppercase">{action.priority} PRIORITY</span>
              </div>

              <h3 className="text-lg font-editorial text-[#FDFBF7]">
                {action.title}
              </h3>
              <p className="text-xs text-[#8E9B90] leading-relaxed">
                {action.description}
              </p>

              {/* Details Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">TARGET STORE</span>
                  <span className="font-semibold text-[#FDFBF7]">{action.storeName}</span>
                </div>
                <div className="p-2.5 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">TRANSFER/ORDER</span>
                  <span className="font-semibold text-[#FDFBF7]">{action.proposedQuantity} {action.unit}</span>
                </div>
                <div className="p-2.5 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">EST. EXPENSE</span>
                  <span className="font-mono text-[#F87171]">-${action.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">EST. REVENUE RECOVERY</span>
                  <span className="font-mono text-[#16A34A]">+{action.estimatedSavings.toLocaleString()}</span>
                </div>
              </div>

              {/* Expected Impact Callout */}
              <div className="p-3 rounded border border-[#C5A059]/20 bg-[#0B3B2C]/40 text-xs text-[#E0C588]">
                <strong>Expected Impact:</strong> {action.expectedImpact}
              </div>
            </div>

            {/* Governance Sign-Off Buttons */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setSelected(action)}
                className="text-xs font-mono text-[#C5A059] hover:underline"
              >
                Inspect Telemetry Evidence →
              </button>

              {action.status === 'pending-approval' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(action.id, 'rejected')}
                    className="px-3 py-1.5 rounded border border-[#9E2A2B]/40 text-xs text-[#F87171] hover:bg-[#9E2A2B]/20"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(action.id, 'approved')}
                    className="btn-royal-gold py-1.5 px-3 text-xs"
                  >
                    Approve Action
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

      <ActionApprovalDialog
        isOpen={!!selected}
        action={selected}
        onApprove={(id) => updateStatus(id, 'approved')}
        onReject={(id) => updateStatus(id, 'rejected')}
        onClose={() => setSelected(null)}
      />

    </div>
  );
}
