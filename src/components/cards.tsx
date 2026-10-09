// ============================================================
// FreshGuard AI — Shared Components (v3): Cards & Charts
// ============================================================

import React from 'react';

// --- Chart Card ---
export function ChartCard({
  title,
  description,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border-subtle bg-white p-4 shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

// --- Store Health Card ---
export function StoreHealthCard({
  label,
  value,
  accentColor,
  description,
}: {
  label: string;
  value: string | number;
  accentColor: 'accent' | 'warning' | 'critical' | 'success' | 'info';
  description?: string;
}) {
  const config = {
    accent: { color: 'text-accent', bg: 'bg-accent-soft', border: 'border-accent' },
    warning: { color: 'text-warning', bg: 'bg-warning-soft', border: 'border-warning' },
    critical: { color: 'text-critical', bg: 'bg-critical-soft', border: 'border-critical' },
    success: { color: 'text-success', bg: 'bg-success-soft', border: 'border-success' },
    info: { color: 'text-info', bg: 'bg-info-soft', border: 'border-info' },
  };

  const c = config[accentColor];

  return (
    <div className={`rounded-lg border ${c.border} bg-white p-4 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className={`mt-1 text-xl font-semibold ${c.color}`}>{value}</p>
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
