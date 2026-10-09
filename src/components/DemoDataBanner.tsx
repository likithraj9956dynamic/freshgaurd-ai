// ============================================================
// FreshGuard AI — Shared Component: DemoDataBanner
// ============================================================

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useDemoStore } from '../services';

export function DemoDataBanner({
  onRefresh,
  onReset,
}: {
  onRefresh?: () => void;
  onReset?: () => void;
}) {
  const { isDemo, isLoading, refresh, setLoading } = useDemoStore();

  if (!isDemo) return null;

  return (
    <div className="demo-banner">
      <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
      <span className="demo-banner-text">
        <RefreshCw className="w-3 h-3 inline-block mr-1 animate-spin" />
        Demo data mode. All figures are sample data.
      </span>
      {onRefresh && (
        <button
          className="text-white/80 hover:text-white text-sm underline underline-offset-2"
          onClick={() => {
            setLoading(true);
            onRefresh();
            setTimeout(() => setLoading(false), 500);
          }}
        >
          Refresh
        </button>
      )}
      {onReset && (
        <button
          className="text-white/60 hover:text-white text-sm underline underline-offset-2"
          onClick={onReset}
        >
          Reset
        </button>
      )}
    </div>
  );
}
