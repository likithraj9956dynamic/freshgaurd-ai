// ============================================================
// FreshGuard AI — Store Overview: Metric Card
// ============================================================

import type { Store } from '../types';

export function StoreMetricCard({ label, value, target, change, trend }: { label: string; value: string; target?: string; change?: number; trend?: 'up' | 'down' | 'stable' }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {target && <p className="text-xs text-muted-foreground">Target: {target}</p>}
      {trend && <p className={`text-xs font-medium mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-yellow-600'}`}>{trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Stable'}</p>}
      {change !== undefined && <p className={`text-xs font-medium mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{change >= 0 ? '+' : ''}{change}%</p>}
    </div>
  );
}
