import React from 'react';
import {
  AlertCircle,
  ThermometerSnowflake,
  PackageCheck,
  ChevronRight,
  ShieldQuestion,
} from 'lucide-react';

interface SignalsVerifyWidgetProps {
  onSignalClick?: (signalId: string) => void;
}

export const SignalsVerifyWidget: React.FC<SignalsVerifyWidgetProps> = ({
  onSignalClick,
}) => {
  const signals = [
    {
      id: 'sig_store23',
      store: 'Store 23',
      title: 'wastage above local norm',
      description: 'Leafy greens at 6.4% of receipts - 7-day sample',
      badge: 'Medium',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: PackageCheck,
      iconColor: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'sig_store11',
      store: 'Store 11',
      title: 'check overdue',
      description: 'Cold-chain log has no entry in 17h',
      badge: 'Watch',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ThermometerSnowflake,
      iconColor: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Signals to verify
            </span>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            02 unconfirmed
          </span>
        </div>

        {/* Signals List */}
        <div className="mt-3.5 space-y-2.5">
          {signals.map((sig) => {
            const Icon = sig.icon;

            return (
              <div
                key={sig.id}
                onClick={() => onSignalClick && onSignalClick(sig.id)}
                className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer flex items-start justify-between group"
              >
                <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/60 ${sig.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition-colors">
                      {sig.store} · {sig.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {sig.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${sig.badgeClass}`}>
                    {sig.badge}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Requires store floor check</span>
        <button className="font-semibold text-brand-700 hover:underline">
          Assign task &rarr;
        </button>
      </div>
    </div>
  );
};
