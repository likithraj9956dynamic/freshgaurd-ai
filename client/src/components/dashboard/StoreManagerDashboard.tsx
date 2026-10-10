import React, { useState } from 'react';
import {
  Store,
  Users,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Package,
  Wrench,
  Clock,
  Send,
  Calendar,
} from 'lucide-react';

export interface StoreUpdateItem {
  id: string;
  storeId: string;
  storeName: string;
  type: 'Stock Reorder' | 'Equipment Maintenance' | 'Staffing Request' | 'Price Adjustment';
  title: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  details: string;
  submittedBy: string;
  createdAt: string;
}

interface StoreManagerDashboardProps {
  onAddStoreUpdate: (update: StoreUpdateItem) => void;
  submittedUpdates: StoreUpdateItem[];
}

export const StoreManagerDashboard: React.FC<StoreManagerDashboardProps> = ({
  onAddStoreUpdate,
  submittedUpdates,
}) => {
  const [selectedStore, setSelectedStore] = useState('Store 17 · Indiranagar (Bengaluru East)');
  const [updateType, setUpdateType] = useState<'Stock Reorder' | 'Equipment Maintenance' | 'Staffing Request' | 'Price Adjustment'>('Stock Reorder');
  const [title, setTitle] = useState('');
  const [urgency, setUrgency] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [details, setDetails] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Store metrics state
  const [staffCount, setStaffCount] = useState(14);
  const [staffOnLeave, setStaffOnLeave] = useState(2);
  const [dailySalesRevenue, setDailySalesRevenue] = useState('₹1,42,850');
  const [stockoutItemsCount, setStockoutItemsCount] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !details) return;

    const newUpdate: StoreUpdateItem = {
      id: `SU_${Date.now()}`,
      storeId: 'STORE_17',
      storeName: selectedStore,
      type: updateType,
      title,
      urgency,
      details,
      submittedBy: 'Kavitha Menon (Store Manager)',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    onAddStoreUpdate(newUpdate);
    setSubmittedMessage(`Update "${title}" sent to Superadmin Command Center!`);
    setTitle('');
    setDetails('');
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Store Manager Operations Dashboard</h2>
              <p className="text-xs text-emerald-200">Local Store Inventory, Staffing & Live Update Submissions</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-emerald-200">Active Store:</label>
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold focus:outline-none"
          >
            <option value="Store 17 · Indiranagar (Bengaluru East)" className="text-slate-900">Store 17 · Indiranagar</option>
            <option value="Store 04 · Koramangala (Bengaluru South)" className="text-slate-900">Store 04 · Koramangala</option>
            <option value="Store 23 · Whitefield (Bengaluru East)" className="text-slate-900">Store 23 · Whitefield</option>
            <option value="Store 11 · Jayanagar (Bengaluru South)" className="text-slate-900">Store 11 · Jayanagar</option>
          </select>
        </div>
      </div>

      {/* Metric Summary Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Sales */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Store Sales</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{dailySalesRevenue}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +6.4% vs 7-day average</p>
        </div>

        {/* Card 2: Staff Attendance */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Staff & Shift</p>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{staffCount - staffOnLeave} / {staffCount} On Duty</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">{staffOnLeave} staff members on leave today</p>
        </div>

        {/* Card 3: Stockout Alerts */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock SKUs</p>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-red-600 mt-2">{stockoutItemsCount} SKUs Critical</p>
          <p className="text-xs text-red-500 font-medium mt-1">Organic Leafy Greens & Full Cream Milk</p>
        </div>

        {/* Card 4: Equipment & Store Health */}
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Equipment Health</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">Chiller #2 Warning</p>
          <p className="text-xs text-slate-500 mt-1">Temp +3.2°C above target baseline</p>
        </div>
      </div>

      {/* Main 2-Column Section: Submit Form + Live Updates Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (7 Cols): Store Need / Update Submission Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Submit Store Requirement / Need</h3>
              <p className="text-xs text-slate-500">Automatically syncs with the Superadmin Command Center</p>
            </div>
          </div>

          {submittedMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Category *</label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Stock Reorder">Stock Reorder Needed</option>
                  <option value="Equipment Maintenance">Equipment / Chiller Maintenance</option>
                  <option value="Staffing Request">Staffing & Attendance Need</option>
                  <option value="Price Adjustment">Markdown / Price Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="HIGH">High (Immediate Action Required)</option>
                  <option value="MEDIUM">Medium (Within 24 Hours)</option>
                  <option value="LOW">Low (Standard Request)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent PO 4821 delivery needed or Chiller #2 technician required"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Explanation & Quantities *</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide quantities, stock numbers, or specific maintenance issues..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit & Sync to Superadmin Dashboard</span>
            </button>
          </form>
        </div>

        {/* Right (5 Cols): Live Submitted Store Updates Log */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Recent Store Requests ({submittedUpdates.length})</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Live Sync Active
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {submittedUpdates.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No store requests submitted yet. Use the form to send updates directly to Superadmin.
              </div>
            ) : (
              submittedUpdates.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                      item.urgency === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {item.type} • {item.urgency}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">{item.details}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
