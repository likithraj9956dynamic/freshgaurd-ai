// ============================================================
// FreshGuard AI — Store Overview: Task Card
// ============================================================

import type { StoreTask } from '../types';

export function TaskCard({ task }: { task: StoreTask }) {
  return (
    <div className={`rounded-lg border p-4 ${task.status==='completed'?'border-green-200 bg-green-50':'border-border-subtle bg-white'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${task.priority==='urgent'?'bg-red-100 text-red-800':task.priority==='high'?'bg-orange-100 text-orange-800':'bg-blue-100 text-blue-800'}`}>{task.priority}</span>
          <h4 className="text-sm font-semibold">{task.title}</h4>
        </div>
        {task.status==='completed'&&<svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{task.instruction}</p>
      <p className="text-xs text-muted-foreground">{task.affectedProducts.length>0?`Affected: ${task.affectedProducts.slice(0,3).join(', ')}${task.affectedProducts.length>3?'...':''}`:''} {task.dueDate&&<span className="mt-1 block">Due: {new Date(task.dueDate).toLocaleDateString()}</span>}</p>
    </div>
  );
}
