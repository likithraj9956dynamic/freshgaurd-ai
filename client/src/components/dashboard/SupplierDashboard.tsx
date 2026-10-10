import React, { useState } from 'react';
import {
  Truck,
  PackageCheck,
  Clock,
  AlertTriangle,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
  Tag,
} from 'lucide-react';

export interface SupplierUpdateItem {
  id: string;
  poNumber: string;
  supplierName: string;
  updateType: 'Dispatch ETA' | 'Stock Shortage Alert' | 'Delivery Confirmation' | 'Price Adjustment';
  status: 'DISPATCHED' | 'DELAYED' | 'IN_TRANSIT' | 'ARRIVED';
  eta: string;
  details: string;
  submittedAt: string;
}

interface SupplierDashboardProps {
  onAddSupplierUpdate: (update: SupplierUpdateItem) => void;
  submittedUpdates: SupplierUpdateItem[];
}

export const SupplierDashboard: React.FC<SupplierDashboardProps> = ({
  onAddSupplierUpdate,
  submittedUpdates,
}) => {
  const [supplierName] = useState('Nordic Coast Fresh Produce Ltd');
  const [poNumber, setPoNumber] = useState('PO 4821');
  const [updateType, setUpdateType] = useState<'Dispatch ETA' | 'Stock Shortage Alert' | 'Delivery Confirmation' | 'Price Adjustment'>('Dispatch ETA');
  const [status, setStatus] = useState<'DISPATCHED' | 'DELAYED' | 'IN_TRANSIT' | 'ARRIVED'>('DISPATCHED');
  const [eta, setEta] = useState('Today, 11:30 AM IST');
  const [details, setDetails] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details) return;

    const newUpdate: SupplierUpdateItem = {
      id: `SUP_${Date.now()}`,
      poNumber,
      supplierName,
      updateType,
      status,
      eta,
      details,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
    };

    onAddSupplierUpdate(newUpdate);
    setSubmittedMessage(`Supplier update for ${poNumber} synced to Superadmin Dashboard!`);
    setDetails('');
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Supplier Operations Portal</h2>
              <p className="text-xs text-teal-200">{supplierName} — Logistics & Purchase Order Tracking</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs text-emerald-300 font-bold">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>GSTIN: 29AAAAA0000A1Z5</span>
        </div>
      </div>

      {/* KPI Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Purchase Orders</p>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">03 Active Orders</p>
          <p className="text-xs text-slate-500 mt-1">PO 4821 (Indiranagar), PO 4822 (Koramangala), PO 4825</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Dispatch Fulfillment</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">94.2% On-Time Rate</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">18 of 19 deliveries verified this month</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-surface-border shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Friction & Delay Alert</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">PO 4821 Delayed</p>
          <p className="text-xs text-amber-700 font-medium mt-1">+2 Days delay log on cold-chain transport</p>
        </div>
      </div>

      {/* Form + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left (7 Cols): Supplier Dispatch Update Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Post Dispatch / Delivery Status Update</h3>
              <p className="text-xs text-slate-500">Notifies store managers and Superadmin instantly</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Purchase Order *</label>
                <select
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="PO 4821">PO 4821 - Indiranagar Store (Produce & Dairy)</option>
                  <option value="PO 4822">PO 4822 - Koramangala Store (Leafy Greens)</option>
                  <option value="PO 4825">PO 4825 - Whitefield Store (Packaged Goods)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Status *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="DISPATCHED">Dispatched (On the way)</option>
                  <option value="IN_TRANSIT">In Transit (Cross-docking)</option>
                  <option value="DELAYED">Delayed (Weather / Transit friction)</option>
                  <option value="ARRIVED">Arrived at Store</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Update Category *</label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Dispatch ETA">Dispatch & ETA Update</option>
                  <option value="Stock Shortage Alert">Stock Availability Notice</option>
                  <option value="Delivery Confirmation">Delivery Confirmation Note</option>
                  <option value="Price Adjustment">Batch Cost & Price Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Arrival (ETA) *</label>
                <input
                  type="text"
                  required
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="e.g. Today, 11:30 AM IST"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Update Details & Manifest Notes *</label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Specify batch details, driver contact, or delay reason..."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Dispatch Update to Superadmin</span>
            </button>
          </form>
        </div>

        {/* Right (5 Cols): Live Supplier Updates Log */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-surface-border shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Supplier Activity Log ({submittedUpdates.length})</span>
            </div>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              Live Network Stream
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {submittedUpdates.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No supplier updates posted yet. Use the form to submit shipment status.
              </div>
            ) : (
              submittedUpdates.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                      {item.poNumber} • {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.submittedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.updateType} — ETA: {item.eta}</h4>
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
