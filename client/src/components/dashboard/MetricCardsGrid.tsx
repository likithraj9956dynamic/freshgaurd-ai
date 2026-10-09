import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  FileCheck2,
  ListTodo,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

interface MetricCardsGridProps {
  onCardClick?: (cardType: string) => void;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({ onCardClick }) => {
  const cards = [
    {
      id: 'stores-attention',
      title: 'Stores needing attention',
      value: '04 of 28',
      subtext: '2 urgent · ranked by estimated impact',
      icon: AlertTriangle,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600 bg-amber-50',
      urgentTag: '2 URGENT',
    },
    {
      id: 'at-risk-sales',
      title: 'At-risk sales, today',
      value: '₹42.6k',
      subtext: '+8.1% vs yesterday · estimated exposure',
      icon: TrendingUp,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      iconColor: 'text-red-600 bg-red-50',
      trend: '+8.1%',
      trendPositiveRisk: true, // Upward risk exposure
    },
    {
      id: 'open-reviews',
      title: 'Open human reviews',
      value: '02',
      subtext: '1 due before 11:00 · nothing auto-executes',
      icon: FileCheck2,
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconColor: 'text-emerald-700 bg-emerald-50',
      urgentTag: 'HUMAN GATED',
    },
    {
      id: 'task-completion',
      title: 'Task completion',
      value: '0%',
      subtext: "0 of 3 done · today's manager checks",
      icon: ListTodo,
      badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
      iconColor: 'text-slate-600 bg-slate-50',
      progressTrack: '0 / 3',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="group relative p-5 rounded-2xl bg-white border border-surface-border shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header: Title & Icon Badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconColor} border border-slate-200/60`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Metric Value */}
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </span>

                {card.trend && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 inline-flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    {card.trend}
                  </span>
                )}

                {card.urgentTag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {card.urgentTag}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom Subtext */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
