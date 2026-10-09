// ============================================================
// FreshGuard AI — Page: Store Manager Daily Directives
// ============================================================

import React, { useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import { LoadingState } from '../components/state';
import type { StoreTask } from '../types';
import {
  Smartphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

export function StoreManagerPage() {
  const { data, isLoading } = useDemos();
  const [tasks, setTasks] = useState<StoreTask[]>([]);

  React.useEffect(() => {
    if (data?.tasks) setTasks(data.tasks);
  }, [data]);

  if (isLoading) return <LoadingState message="Accessing store floor directives..." />;

  const pending = tasks.filter((t) => t.status !== 'completed');
  const completed = tasks.filter((t) => t.status === 'completed');

  const advance = (id: string) => {
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

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <Smartphone className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              STORE MANAGER WORKSPACE · DAILY TASK DIRECTIVES
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7]">
            Daily Task Execution Ledger
          </h1>

          <p className="text-sm sm:text-base text-[#8E9B90] font-light leading-relaxed">
            Floor directives routed from Head Office intelligence. Store managers advance tasks through
            Acknowledged → In-Progress → Completed to report on-the-ground operational resolution.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-3 max-w-md">
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">ASSIGNED</span>
              <span className="text-xl font-editorial text-[#FDFBF7]">{tasks.length}</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">ACTIVE</span>
              <span className="text-xl font-editorial text-[#E0C588]">{pending.length}</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">COMPLETED</span>
              <span className="text-xl font-editorial text-[#16A34A]">{completed.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Task Flow */}
      <section className="space-y-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
            FLOOR ASSIGNMENTS
          </span>
          <h2 className="text-2xl font-editorial text-[#FDFBF7]">
            Active Tasks Awaiting Resolution ({pending.length})
          </h2>
        </div>

        <div className="space-y-4">
          {pending.map((t) => (
            <div key={t.id} className="royal-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    t.priority === 'urgent' ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/40' :
                    'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/30'
                  }`}>
                    {t.priority} PRIORITY
                  </span>
                  <span className="text-xs font-mono text-[#C5A059]">STORE #{t.storeId}</span>
                  <span className="text-xs text-[#8E9B90]">Status: <strong className="text-[#FDFBF7] uppercase text-[10px]">{t.status}</strong></span>
                </div>

                <h3 className="text-lg font-editorial text-[#FDFBF7]">
                  {t.title}
                </h3>

                <p className="text-xs text-[#8E9B90] leading-relaxed">
                  {t.instruction}
                </p>

                {t.affectedProducts.length > 0 && (
                  <div className="text-[11px] text-[#8E9B90]">
                    <span className="text-[#E0C588]">Affected SKU:</span> {t.affectedProducts.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <button
                  onClick={() => advance(t.id)}
                  className="btn-royal-gold text-xs"
                >
                  {t.status === 'pending' && 'Acknowledge Directive'}
                  {t.status === 'acknowledged' && 'Commence Floor Work'}
                  {t.status === 'in-progress' && 'Mark Completed ✓'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Archive */}
      {completed.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-xl font-editorial text-[#8E9B90]">
            Resolved Directives Archive ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map((t) => (
              <div key={t.id} className="p-4 rounded border border-white/5 bg-[#071C16]/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#16A34A] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t.title}
                  </span>
                  <p className="text-[#8E9B90] text-[11px] mt-0.5">{t.instruction}</p>
                </div>
                <span className="text-[10px] font-mono text-[#8E9B90]">
                  RESOLVED {t.completedAt ? new Date(t.completedAt).toLocaleTimeString() : 'RECENTLY'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
