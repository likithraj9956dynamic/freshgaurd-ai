// ============================================================
// FreshGuard AI — Shared Components: PageHeader
// ============================================================

import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  actions,
  showBack = false,
  backPath,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
  backPath?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        {showBack && backPath && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-subtle hover:bg-muted transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
