// ============================================================
// FreshGuard AI — Components: Evidence Panel
// ============================================================

import React from 'react';
import { Clock, Database, TrendingUp, FileText, Tag, AlertTriangle } from 'lucide-react';
import { SeverityBadge } from './badges';

export function EvidencePanel({
  evidence,
  showToggle = true,
}: {
  evidence: Array<{
    type: 'metric' | 'record' | 'comparison' | 'note';
    label: string;
    value: string;
    detail: string;
    source: string;
    comparison?: { current: string; previous: string; change: string };
  }>;
  showToggle?: boolean;
}) {
  const [expanded, setExpanded] = React.useState<number | null>(null);

  if (evidence.length === 0) {
    return (
      <div className="rounded-lg border border-border-subtle bg-white p-4">
        <h3 className="text-sm font-semibold mb-2">Evidence Sources</h3>
        <p className="text-sm text-muted-foreground">No evidence recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-white overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(expanded === 0 ? null : 0)}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">Evidence Sources</span>
          <SeverityBadge severity="info" showDot={false} />
        </div>
        <span className="text-xs text-muted-foreground">
          {expanded === 0 ? '▲' : '▼'} {evidence.length} sources
        </span>
      </button>

      {expanded === 0 && (
        <div className="divide-y border-t border-border-subtle">
          {evidence.map((item, idx) => {
            const isComparison = item.type === 'comparison';
            const Icon = getIconForType(item.type);

            return (
              <div
                key={idx}
                className={`p-4 transition-colors ${
                  isComparison ? 'bg-accent-soft/30' : 'hover:bg-muted/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold truncate">{item.label}</h4>
                      <SeverityBadge severity="info" showDot={false} />
                    </div>
                    <p className="text-sm font-mono font-medium">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                    <p className="text-xs text-muted-foreground mt-1">Source: {item.source}</p>
                    {isComparison && item.comparison && (
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">
                          Current: {item.comparison.current}
                        </span>
                        <span className="text-muted-foreground">
                          Previous: {item.comparison.previous}
                        </span>
                        <span
                          className={`font-semibold ${
                            item.comparison.change.startsWith('-')
                              ? 'text-red-600'
                              : 'text-green-600'
                          }`}
                        >
                          {item.comparison.change}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getIconForType(type: string) {
  switch (type) {
    case 'metric':
      return TrendingUp;
    case 'record':
      return Database;
    case 'comparison':
      return Clock;
    case 'note':
      return FileText;
    default:
      return AlertTriangle;
  }
}
