// ============================================================
// FreshGuard AI — Store Manager: Daily Floor Directives Ledger
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORE_MANAGER_TASKS } from '../../mocks/tasks';
import type { StoreTask } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  ScanBarcode,
  ArrowRight,
  Filter,
  CheckCheck
} from 'lucide-react';

export function StoreTasksPage() {
  const [tasks, setTasks] = useState<StoreTask[]>(STORE_MANAGER_TASKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const advanceTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === 'pending') return { ...t, status: 'acknowledged' as const };
        if (t.status === 'acknowledged') return { ...t, status: 'in-progress' as const };
        if (t.status === 'in-progress')
          return { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        return t;
      })
    );
  };

  const markAllUrgentCompleted = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.priority === 'urgent' && t.status !== 'completed'
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const pending = tasks.filter((t) => t.status !== 'completed');
  const completed = tasks.filter((t) => t.status === 'completed');

  const displayedTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
              <ClipboardList className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>STORE 017 · FLOOR TASK EXECUTION DIRECTIVES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
              Daily Directives Ledger
            </h1>

            <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
              Operational floor commands dispatched from Head Office. Advance each action item through
              <span className="text-[#FDFBF7] font-semibold"> Acknowledged → In-Progress → Completed</span> to log verified resolution back to the network.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={markAllUrgentCompleted}
              className="btn-royal-outline text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4 text-[#16A34A]" />
              <span>Resolve Urgent Tasks</span>
            </button>
            <Link
              to="/store/product-lookup"
              className="btn-royal-gold text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <ScanBarcode className="w-4 h-4" />
              <span>Scan Barcode</span>
            </Link>
          </div>
        </div>

        {/* Task Counter Matrix */}
        <div className="grid grid-cols-3 gap-4 pt-6 max-w-md">
          <div className="p-3 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">ASSIGNED</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{tasks.length}</span>
          </div>
          <div className="p-3 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">ACTIVE PENDING</span>
            <span className="text-xl font-editorial text-[#E0C588]">{pending.length}</span>
          </div>
          <div className="p-3 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">RESOLVED</span>
            <span className="text-xl font-editorial text-[#16A34A]">{completed.length}</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`text-xs px-3.5 py-1.5 rounded transition-all font-mono ${
              filter === 'all'
                ? 'bg-[#C5A059] text-[#041410] font-semibold'
                : 'text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`text-xs px-3.5 py-1.5 rounded transition-all font-mono ${
              filter === 'pending'
                ? 'bg-[#C5A059] text-[#041410] font-semibold'
                : 'text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5'
            }`}
          >
            Pending Resolution ({pending.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`text-xs px-3.5 py-1.5 rounded transition-all font-mono ${
              filter === 'completed'
                ? 'bg-[#C5A059] text-[#041410] font-semibold'
                : 'text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5'
            }`}
          >
            Completed Archive ({completed.length})
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#8E9B90]">
          DEMONSTRATION DIRECTIVES ACTIVE
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {displayedTasks.map((t) => {
          const isDone = t.status === 'completed';
          return (
            <div
              key={t.id}
              className={`royal-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                isDone ? 'opacity-70 border-white/5 bg-[#071C16]/50' : 'border-[#C5A059]/30'
              }`}
            >
              <div className="space-y-2.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      t.priority === 'urgent'
                        ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/40'
                        : 'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/30'
                    }`}
                  >
                    {t.priority} PRIORITY
                  </span>
                  <span className="text-xs font-mono text-[#C5A059]">STORE #{t.storeId}</span>
                  <span className="text-xs text-[#8E9B90]">
                    Status:{' '}
                    <strong
                      className={`uppercase text-[10px] font-mono ${
                        isDone ? 'text-[#16A34A]' : 'text-[#FDFBF7]'
                      }`}
                    >
                      {t.status}
                    </strong>
                  </span>
                  {t.completedAt && (
                    <span className="text-[10px] font-mono text-[#16A34A]">
                      ✓ Resolved at {new Date(t.completedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-editorial text-[#FDFBF7]">
                  {t.title}
                </h2>

                <p className="text-xs text-[#8E9B90] leading-relaxed">
                  {t.instruction}
                </p>

                {t.affectedProducts.length > 0 && (
                  <div className="text-xs text-[#8E9B90] pt-1">
                    <span className="text-[#E0C588] font-mono text-[11px]">Affected SKUs: </span>
                    <span className="text-[#FDFBF7]">{t.affectedProducts.join(', ')}</span>
                  </div>
                )}

                {t.evidence && t.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    {t.evidence.map((ev, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[#8E9B90] font-mono">
                        {ev.label}: <strong className="text-white">{ev.detail}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex items-center gap-3">
                {!isDone ? (
                  <button
                    onClick={() => advanceTask(t.id)}
                    className="btn-royal-gold text-xs px-4 py-2.5"
                  >
                    {t.status === 'pending' && 'Acknowledge Directive'}
                    {t.status === 'acknowledged' && 'Commence Floor Work'}
                    {t.status === 'in-progress' && 'Mark Completed ✓'}
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold px-3 py-1.5 rounded border border-[#16A34A]/30 bg-[#16A34A]/10">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
