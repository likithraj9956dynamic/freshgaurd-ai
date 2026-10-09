// ============================================================
// FreshGuard AI — Investigation Room: Evidence Panel
// Enterprise Audited Telemetry Sources Panel
// ============================================================

import React from 'react';
import type { Investigation } from '../types';

export function EvidencePanel({ investigation }: { investigation: Investigation }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Cross-Referenced Telemetry Evidence</h3>
        <span className="text-[10px] font-mono font-medium text-slate-500">{investigation.evidenceSources.length} SOURCES AUDITED</span>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto app-scrollbar pr-1">
        {investigation.evidenceSources.map((ev) => (
          <div
            key={ev.id}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/60 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                ev.isFact ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                ev.isDerived ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {ev.isFact ? 'VERIFIED FACT' : ev.isDerived ? 'DERIVED SIGNAL' : 'HYPOTHESIS'}
              </span>
              <span className="text-[10px] font-mono text-slate-500">{ev.source}</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 mt-1">
              {ev.label}: <span className="font-mono text-emerald-800 font-bold">{ev.value}</span>
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {ev.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
