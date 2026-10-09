// ============================================================
// FreshGuard AI — Store Manager: Daily Floor Directives Ledger
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORE_MANAGER_TASKS } from '../../mocks/tasks';
import type { StoreTask } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  ScanBarcode,
  CheckCheck,
  Check
} from 'lucide-react';

export function StoreTasksPage() {
  const [tasks, setTasks] = useState<StoreTask[]>(STORE_MANAGER_TASKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const advanceTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === 'pending') {
          setFeedback(`Directive "${t.title}" acknowledged.`);
          return { ...t, status: 'acknowledged' as const };
        }
        if (t.status === 'acknowledged') {
          setFeedback(`Directive "${t.title}" marked in-progress on floor.`);
          return { ...t, status: 'in-progress' as const };
        }
        if (t.status === 'in-progress') {
          setFeedback(`Directive "${t.title}" resolved and logged.`);
          return { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
        return t;
      })
    );
    setTimeout(() => setFeedback(null), 3000);
  };

  const markAllUrgentCompleted = () => {
    setTasks((prev) =>
      prev.map((t) =>
        t.priority === 'urgent' && t.status !== 'completed'
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
          : t
      )
    );
    setFeedback('All urgent directives marked resolved.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const pending = tasks.filter((t) => t.status !== 'completed');
  const completed = tasks.filter((t) => t.status === 'completed');

  const displayedTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Daily Directives Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store #017 (Tacoma Downtown) · Advance items through Acknowledged → In-Progress → Completed
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={markAllUrgentCompleted}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Resolve Urgent Tasks</span>
          </button>
          <Link
            to="/store/product-lookup"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <ScanBarcode className="w-3.5 h-3.5" />
            <span>Scan Barcode</span>
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Task Summary Badges */}
      <div className="grid grid-cols-3 gap-3 max-w-md">
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Total Assigned</span>
          <span className="text-xl font-bold text-slate-900">{tasks.length}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Active Pending</span>
          <span className="text-xl font-bold text-amber-700">{pending.length}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Completed</span>
          <span className="text-xl font-bold text-emerald-700">{completed.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'all'
              ? 'bg-[#164e3d] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-[#164e3d] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Pending Resolution ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-[#164e3d] text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Completed Archive ({completed.length})
        </button>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Task Description</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedTasks.map((t) => {
                const isDone = t.status === 'completed';
                const isUrgent = t.priority === 'urgent';
                const isHigh = t.priority === 'high';

                return (
                  <tr key={t.id} className={isDone ? 'opacity-60 bg-slate-50/50' : ''}>
                    <td>
                      <div className="font-medium text-slate-900">{t.title}</div>
                      <div className="text-xs text-slate-500">{t.instruction}</div>
                      {t.affectedProducts.length > 0 && (
                        <div className="text-[11px] text-slate-600 mt-1">
                          <strong>Affected SKUs:</strong> {t.affectedProducts.join(', ')}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          isUrgent
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="text-slate-600 font-mono text-xs whitespace-nowrap">
                      12:00 Today
                    </td>
                    <td>
                      <span className="capitalize text-xs text-slate-700">
                        {t.status.replace('-', ' ')}
                      </span>
                      {t.completedAt && (
                        <span className="block text-[10px] text-emerald-700 font-mono">
                          {new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </td>
                    <td className="text-right">
                      {!isDone ? (
                        <button
                          type="button"
                          onClick={() => advanceTask(t.id)}
                          className="btn-primary text-xs px-2.5 py-1 whitespace-nowrap"
                        >
                          {t.status === 'pending' && 'Acknowledge'}
                          {t.status === 'acknowledged' && 'Start Work'}
                          {t.status === 'in-progress' && 'Mark Done ✓'}
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-medium text-xs inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
