// ============================================================
// FreshGuard AI — Components: Investigation Graph Legend
// ============================================================

export function InvestigationGraphLegend() {
  return (
    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border-subtle">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
        <span className="text-xs">Observed fact</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
        <span className="text-xs">Derived calculation</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-purple-100 border border-purple-200" />
        <span className="text-xs">Supported hypothesis</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
        <span className="text-xs">Unknown relationship</span>
      </div>
    </div>
  );
}
