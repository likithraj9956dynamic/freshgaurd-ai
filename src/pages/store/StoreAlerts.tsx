// ============================================================
// FreshGuard AI — Store Manager: Wastage & Spoilage Log
// ============================================================

import React, { useState } from 'react';
import { STORE_17_WASTAGE } from '../../mocks/sales-wastage';
import type { WastageRecord } from '../../types';
import {
  Flame,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';

export function StoreAlertsPage() {
  const [wastageList, setWastageList] = useState<WastageRecord[]>(STORE_17_WASTAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New incident state
  const [productName, setProductName] = useState('');
  const [department, setDepartment] = useState('Produce');
  const [weight, setWeight] = useState('');
  const [reason, setReason] = useState('Spoilage - expired before sale');
  const [cost, setCost] = useState('');

  const totalCost = wastageList.reduce((acc, curr) => acc + curr.cost, 0);
  const totalWeight = wastageList.reduce((acc, curr) => acc + curr.wastageWeight, 0);

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !weight) return;

    const newRecord: WastageRecord = {
      id: `w-${Date.now()}`,
      storeId: '1012',
      date: new Date().toISOString().split('T')[0],
      department,
      productName: productName.trim(),
      category: department,
      wastageWeight: parseFloat(weight) || 1.0,
      wastageReason: reason,
      cost: parseFloat(cost) || 5.0,
      status: 'confirmed',
      notes: 'Logged directly by floor store director.',
      recommendedAction: 'Apply immediate markdown and audit refrigeration temperature.',
    };

    setWastageList([newRecord, ...wastageList]);
    setIsModalOpen(false);
    setProductName('');
    setWeight('');
    setCost('');
    setFeedback(`Wastage record for "${productName}" committed to compliance database.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Wastage &amp; Spoilage Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store #017 (Tacoma Downtown) · Perishable shrinkage audit and discard tracking
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Spoilage Incident</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Logged Incidents</span>
          <span className="text-xl font-bold text-slate-900">{wastageList.length} Records</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Total Net Shrinkage</span>
          <span className="text-xl font-bold text-red-700">${totalCost.toFixed(2)}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Discard Weight</span>
          <span className="text-xl font-bold text-slate-800">{totalWeight.toFixed(1)} lbs</span>
        </div>
      </div>

      {/* Spoilage Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            Recorded Discard History
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            TOLERANCE THRESHOLD: &lt; 2.5%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Product</th>
                <th>Reason</th>
                <th>Weight</th>
                <th className="text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {wastageList.map((item) => (
                <tr key={item.id}>
                  <td className="text-slate-600 font-mono text-xs">{item.date}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      {item.department}
                    </span>
                  </td>
                  <td className="font-medium text-slate-900">{item.productName}</td>
                  <td className="text-slate-600 text-xs">
                    <div>{item.wastageReason}</div>
                    {item.recommendedAction && (
                      <div className="text-[11px] text-amber-700 mt-0.5">Directive: {item.recommendedAction}</div>
                    )}
                  </td>
                  <td className="font-mono text-slate-700 text-xs">{item.wastageWeight} lbs</td>
                  <td className="text-right font-mono text-red-700 font-semibold text-xs">
                    -${item.cost.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-5 rounded-lg border border-slate-300 shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Record Spoilage Incident</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Log discarded merchandise to reconcile store inventory.
              </p>
            </div>

            <form onSubmit={handleAddIncident} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Baby Spinach 5oz"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 6.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Discard Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"
                >
                  <option value="Spoilage - expired before sale">Spoilage - expired before sale</option>
                  <option value="Spoilage - overstock">Spoilage - overstock</option>
                  <option value="Damaged packaging in transit">Damaged packaging in transit</option>
                  <option value="Cold chain temperature anomaly">Cold chain temperature anomaly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Estimated Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 14.50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs px-3.5 py-1.5"
                >
                  Commit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
