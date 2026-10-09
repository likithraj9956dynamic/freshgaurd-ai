// ============================================================
// FreshGuard AI — Components: Evidence Item
// ============================================================

import type { ActionEvidence } from '../types';

export function EvidenceItem({ ev }: { ev: ActionEvidence }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground flex-shrink-0">›</span>
      <div>
        <p className="font-medium">{ev.label}</p>
        <p className="text-xs text-muted-foreground">{ev.detail}</p>
      </div>
    </div>
  );
}

export function ActionEvidenceList({ evidence }: { evidence: ActionEvidence[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Evidence</h3>
      <ul className="space-y-2">
        {evidence.map((ev, i) => (
          <EvidenceItem key={i} ev={ev} />
        ))}
      </ul>
    </div>
  );
}
