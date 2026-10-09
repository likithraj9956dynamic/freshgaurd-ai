// ============================================================
// FreshGuard AI — Store Overview: Compliance Item
// ============================================================

import type { ComplianceRecord } from '../types';

export function ComplianceItem({ compliance }: { compliance: ComplianceRecord }) {
  return (
    <div className={`rounded-lg border p-3 ${compliance.status==='compliant'?'border-green-200 bg-green-50':compliance.status==='partial'?'border-yellow-200 bg-yellow-50':'border-red-200 bg-red-50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{compliance.section}</h4>
          <p className="text-xs text-muted-foreground">{compliance.requirement}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${compliance.status==='compliant'?'bg-green-100 text-green-800':compliance.status==='partial'?'bg-yellow-100 text-yellow-800':'bg-red-100 text-red-800'}`}>{compliance.status}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Risk: {compliance.riskLevel} · Last: {compliance.lastInspected}</p>
      <p className="text-xs text-muted-foreground">{compliance.notes}</p>
    </div>
  );
}
