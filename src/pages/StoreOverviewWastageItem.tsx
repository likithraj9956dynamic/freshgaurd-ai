// ============================================================
// FreshGuard AI — Store Overview: Wastage Item
// ============================================================

import type { WastageRecord } from '../types';

export function WastageItem({ wastage }: { wastage: WastageRecord }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-white p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${wastage.status==='confirmed'?'bg-green-100 text-green-800':wastage.status==='investigating'?'bg-blue-100 text-blue-800':wastage.status==='pending-review'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-800'}`}>{wastage.status}</span>
        <span className="text-xs text-muted-foreground">{wastage.date}</span>
      </div>
      <p className="text-sm font-medium">{wastage.productName}</p>
      <p className="text-xs text-muted-foreground">{wastage.department} — {wastage.wastageWeight}kg wasted ({wastage.wastageReason})</p>
      <p className="text-xs text-muted-foreground">Cost: ${wastage.cost.toFixed(2)} · {wastage.notes}</p>
    </div>
  );
}
