// ============================================================
// FreshGuard AI — Investigation Room: Evidence Panel
// ============================================================

import React from 'react';
import type { Investigation } from '../types';

export function EvidencePanel({ investigation }: { investigation: Investigation }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-editorial text-[#FDFBF7]">Cross-Referenced Evidence</h3>
        <span className="text-[10px] font-mono text-[#C5A059]">{investigation.evidenceSources.length} SOURCES</span>
      </div>

      <div className="space-y-2.5 max-h-[380px] overflow-y-auto app-scrollbar pr-1">
        {investigation.evidenceSources.map((ev) => (
          <div
            key={ev.id}
            className="p-3.5 rounded border border-white/5 bg-[#071C16] hover:border-[#C5A059]/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className={ev.isFact ? 'badge-royal-fact' : 'badge-royal-hypothesis'}>
                {ev.isFact ? 'VERIFIED FACT' : ev.isDerived ? 'DERIVED SIGNAL' : 'HYPOTHESIS'}
              </span>
              <span className="text-[10px] font-mono text-[#8E9B90]">{ev.source}</span>
            </div>
            <p className="text-xs font-semibold text-[#FDFBF7] mt-1.5">
              {ev.label}: <span className="text-[#E0C588] font-mono">{ev.value}</span>
            </p>
            <p className="text-[11px] text-[#8E9B90] mt-0.5 leading-relaxed">
              {ev.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
