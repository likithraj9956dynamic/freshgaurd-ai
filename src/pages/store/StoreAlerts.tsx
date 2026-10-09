// ============================================================
// FreshGuard AI — Store Manager: Wastage & Spoilage Alerts Log
// ============================================================

import { useState } from 'react';
import { STORE_17_WASTAGE } from '../../mocks/sales-wastage';
import type { WastageRecord } from '../../types';
import {
  Flame,
  AlertTriangle,
  Plus,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  X
} from 'lucide-react';

export function StoreAlertsPage() {
  const [wastageList, setWastageList] = useState<WastageRecord[]>(STORE_17_WASTAGE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New incident form state
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
    setFeedback(`Wastage record for "${productName}" successfully logged into network compliance database.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
              <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>STORE 017 · PERISHABLE SHRINKAGE &amp; WASTAGE AUDIT</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
              Wastage &amp; Spoilage Surveillance
            </h1>

            <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
              Auditing of discard logs, rotational FIFO breaches, and damaged merchandise. Spoilage at Store 017 is tracking +28% this week, concentrated in produce and fresh meats.
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="btn-royal-gold text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Spoilage Incident</span>
            </button>
          </div>
        </div>

        {/* Wastage Summary KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-lg">
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">LOGGED INCIDENTS</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{wastageList.length} Records</span>
          </div>
          <div className="p-3.5 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/15">
            <span className="text-[10px] font-mono text-[#F87171] block">TOTAL NET SHRINKAGE</span>
            <span className="text-xl font-editorial text-[#F87171]">${totalCost.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">DISCARD WEIGHT</span>
            <span className="text-xl font-editorial text-[#E0C588]">{totalWeight.toFixed(1)} lbs</span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Spoilage Records Ledger */}
      <div className="royal-card p-6 space-y-4 border-[#C5A059]/20 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <span className="text-xs font-mono text-[#C5A059] uppercase tracking-wider">
            Verified Floor Discard History
          </span>
          <span className="text-xs text-[#8E9B90] font-mono">
            BENCHMARK TOLERANCE: &lt; 2.5% OF MERCHANDISE
          </span>
        </div>

        <div className="space-y-3">
          {wastageList.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded border border-white/10 bg-[#071C16] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-[#E0C588] uppercase">
                    {item.department}
                  </span>
                  <span className="text-sm font-semibold text-[#FDFBF7]">{item.productName}</span>
                  <span className="text-xs font-mono text-[#8E9B90]">({item.date})</span>
                </div>

                <p className="text-xs text-[#8E9B90]">
                  <strong className="text-[#FDFBF7]">Reason:</strong> {item.wastageReason}
                </p>

                {item.recommendedAction && (
                  <p className="text-xs text-[#C5A059] font-mono">
                    ✦ Operational Directive: {item.recommendedAction}
                  </p>
                )}
              </div>

              <div className="flex-shrink-0 text-left md:text-right space-y-1">
                <div className="text-base font-editorial text-[#F87171] font-semibold">
                  -${item.cost.toFixed(2)}
                </div>
                <div className="text-xs font-mono text-[#8E9B90]">
                  Weight: {item.wastageWeight} lbs
                </div>
                <span className="inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16A34A]/20 text-[#4ADE80]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full royal-card p-6 border-[#C5A059]/40 space-y-4 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E9B90] hover:text-[#FDFBF7]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                COMPLIANCE LOG
              </span>
              <h3 className="text-xl font-editorial text-[#FDFBF7]">Record Spoilage Incident</h3>
              <p className="text-xs text-[#8E9B90]">
                File discarded perishable merchandise to update store inventory reconciliation.
              </p>
            </div>

            <form onSubmit={handleAddIncident} className="space-y-3.5 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Baby Spinach 5oz"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 8.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Discard Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                >
                  <option value="Spoilage - expired before sale">Spoilage - expired before sale</option>
                  <option value="Spoilage - overstock">Spoilage - overstock</option>
                  <option value="Damaged packaging in handling">Damaged packaging in handling</option>
                  <option value="Cold chain temperature fluctuation">Cold chain temperature fluctuation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Estimated Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 14.50"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-royal-outline text-xs px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-royal-gold text-xs px-4 py-2"
                >
                  Commit Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
