// ============================================================
// FreshGuard AI — Components: SummaryCards
// ============================================================

import React from 'react';
import { Store, AlertTriangle, Package, Clock, TrendingDown, TrendingUp, MapPin } from 'lucide-react';

export interface SummaryCardProps {
  label: string;
  value: string | number;
  change?: number;
  explanation?: string;
  icon: React.ElementType;
  color: 'accent' | 'warning' | 'critical' | 'success' | 'info';
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
}

export function SummaryCards({ cards }: { cards: SummaryCardProps[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md ${
            card.color === 'critical'
              ? 'border-critical'
              : card.color === 'warning'
              ? 'border-warning'
              : card.color === 'accent'
              ? 'border-accent'
              : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.label}
              </p>
              <p className="mt-1 text-2xl font-semibold">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              card.color === 'critical' ? 'bg-critical-soft' :
              card.color === 'warning' ? 'bg-warning-soft' :
              card.color === 'accent' ? 'bg-accent-soft' :
              card.color === 'success' ? 'bg-success-soft' : 'bg-info-soft'
            }`}>
              <card.icon className={`w-5 h-5 ${
                card.color === 'critical' ? 'text-critical' :
                card.color === 'warning' ? 'text-warning' :
                card.color === 'accent' ? 'text-accent' :
                card.color === 'success' ? 'text-success' : 'text-info'
              }`} />
            </div>
          </div>
          {card.change !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${
              card.change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {card.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {card.change >= 0 ? '+' : ''}{card.change.toFixed(1)}%
            </div>
          )}
          {card.explanation && <p className="mt-2 text-xs text-muted-foreground">{card.explanation}</p>}
        </div>
      ))}
    </div>
  );
}
