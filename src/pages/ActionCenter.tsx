// ============================================================
// FreshGuard AI — Page: Action Centre (Governance & Approvals)
// Human-in-the-Loop Operational Directives Sign-Off Ledger
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Human-in-the-Loop Governance Ledger</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Action Centre &amp; Operational Sign-Offs
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Every AI-generated recommendation requires explicit human sign-off before executing or assigning
            directives to store teams. Review financial models, projected impacts, and supporting evidence below.
          </p>
        </div>
      </section>

      {/* Filter and Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Proposed Directives ({filtered.length})
          </h2>
          <span className="text-xs text-slate-500">
            Pending authorization or archived decision history
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="action-filter-select" className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status Filter:</label>
          <select
            id="action-filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded bg-slate-50 text-slate-800 text-xs px-3 py-1.5 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((action) => (
          <div key={action.id} className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                  action.status === 'pending-approval' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  action.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  action.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {action.status.replace('-', ' ')}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 uppercase">
                  {action.priority} PRIORITY
                </span>
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                {action.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {action.description}
              </p>

              {/* Details Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Target Store</span>
                  <span className="font-semibold text-slate-800">{action.storeName}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Transfer / Order</span>
                  <span className="font-semibold text-slate-800">{action.proposedQuantity} {action.unit}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Est. Expense</span>
                  <span className="font-mono font-semibold text-rose-700">-${action.estimatedCost.toLocaleString()}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Est. Margin Recovery</span>
                  <span className="font-mono font-semibold text-emerald-700">+${action.estimatedSavings.toLocaleString()}</span>
                </div>
              </div>

              {/* Expected Impact Callout */}
              <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                <strong className="font-semibold">Expected Impact:</strong> {action.expectedImpact}
              </div>
            </div>

            {/* Governance Sign-Off Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelected(action)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Inspect Telemetry Evidence →
              </button>

              {action.status === 'pending-approval' && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(action.id, 'rejected')}
                    className="px-3 py-1.5 rounded border border-rose-300 text-xs text-rose-700 hover:bg-rose-50 font-medium"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(action.id, 'approved')}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    Approve Directive
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
