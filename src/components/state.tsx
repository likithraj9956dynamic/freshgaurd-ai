// ============================================================
// FreshGuard AI — Shared Components (v2): State
// ============================================================

import React from 'react';
import { Loader2, AlertCircle, Info } from 'lucide-react';

export function LoadingState({
  message = 'Loading...',
  full = false,
}: {
  message?: string;
  full?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        full ? 'min-h-[40vh]' : 'py-12'
      }`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Info,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
        <Icon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  reset,
}: {
  message?: string;
  reset?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-critical-soft flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-critical" />
      </div>
      <h3 className="text-sm font-semibold text-critical">Something went wrong</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
      {reset && (
        <button
          onClick={reset}
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
