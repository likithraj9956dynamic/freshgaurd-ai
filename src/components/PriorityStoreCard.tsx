// ============================================================
// FreshGuard AI — Components: Priority Store Card
// ============================================================

import React from 'react';
import { Store, MapPin, TrendingDown, AlertTriangle, Package, Building2 } from 'lucide-react';
import { SeverityBadge } from './badges';

export function PriorityStoreCard({
  store,
  issue,
  onClick,
}: {
  store: {
    id: string;
    name: string;
    storeNumber: string;
    location: { city: string; state: string; area: string };
    status: string;
    trending: string;
    revenueActual: number;
    revenueTarget: number;
  };
  issue: {
    urgencyScore: number;
    salesChangePercent: number;
    stockoutCount: number;
    wastageIncreasePercent: number;
    complianceIssues: string[];
    mainProblem: string;
    recommendedNextStep: string;
  } | null;
  onClick: () => void;
}) {
  const severity: 'info' | 'warning' | 'critical' = issue
    ? issue.urgencyScore >= 80
      ? 'critical'
      : issue.urgencyScore >= 60
        ? 'warning'
        : 'info'
    : 'warning';

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-border-subtle bg-white p-4 shadow-sm hover:shadow-md transition-all hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">{store.name}</h3>
            <span className="text-xs font-mono text-muted-foreground">{store.storeNumber}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{store.location.city}, {store.location.state}</span>
            <span className="hidden sm:inline">— {store.location.area}</span>
          </div>
        </div>
        <SeverityBadge severity={severity} />
      </div>

      {/* Key metrics */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <TrendingDown className={`w-3 h-3 ${store.trending === 'down' ? 'text-red-600' : 'text-green-600'}`} />
          <span>{store.revenueActual >= store.revenueTarget ? 'On Target' : 'Below Target'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          <span>{issue?.stockoutCount || 0} stockouts</span>
        </div>
      </div>

      {/* Urgency indicators */}
      <div className="mt-2 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-warning" />
          {issue && issue.stockoutCount > 0 ? `${issue.stockoutCount} stockouts` : 'Low stockouts'}
        </span>
        <span className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-muted-foreground" />
          {store.status}
        </span>
      </div>

      {/* Recommended next step */}
      {issue?.recommendedNextStep && (
        <div className="mt-2 pt-2 border-t border-border-subtle">
          <p className="text-xs font-medium text-accent">{issue.recommendedNextStep}</p>
        </div>
      )}
    </button>
  );
}
