// ============================================================
// FreshGuard AI — Store Overview: Issue Card
// ============================================================

import type { DetectedIssue } from '../types';

export function IssueCard({ issue }: { issue: DetectedIssue }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-white p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{issue.title}</h3>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${issue.severity==='critical'?'bg-red-100 text-red-800':issue.severity==='warning'?'bg-yellow-100 text-yellow-800':'bg-blue-100 text-blue-800'}`}>{issue.severity}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{issue.mainProblem}</p>
      <div className="text-xs space-y-1">
        <p className="flex gap-2"><span className="font-medium text-muted-foreground">Urgency: </span><span>{issue.urgencyScore}/100</span></p>
        <p className="flex gap-2"><span className="font-medium text-muted-foreground">Stockouts: </span><span>{issue.stockoutCount}</span></p>
        <p className="flex gap-2"><span className="font-medium text-muted-foreground">Wastage increase: </span><span>{issue.wastageIncreasePercent}%</span></p>
        {issue.complianceIssues.length > 0 && <p className="flex gap-2"><span className="font-medium text-muted-foreground">Compliance: </span><span>{issue.complianceIssues.join(', ')}</span></p>}
      </div>
      <p className="text-xs text-accent mt-2">{issue.recommendedNextStep}</p>
    </div>
  );
}
