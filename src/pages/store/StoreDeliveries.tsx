// ============================================================
// FreshGuard AI — Store Manager: Dock Receiving & Deliveries
// ============================================================

import React, { useState } from 'react';
import { STORE_17_PURCHASE_ORDER } from '../../mocks/purchase-orders';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  PackageCheck
} from 'lucide-react';

export function StoreDeliveriesPage() {
  const [po, setPo] = useState(STORE_17_PURCHASE_ORDER);
  const [dockSigned, setDockSigned] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSignDock = () => {
    setDockSigned(true);
    setPo({ ...po, status: 'acknowledged' as any });
    setFeedback('Receiving dock receipt signed. Cold-chain intake verified and recorded.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Inbound Deliveries &amp; PO Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Store #017 (Tacoma Downtown) · Carrier appointment windows and dock intake verification
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Active Purchase Order Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold text-slate-900">
                Purchase Order #{po.orderNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                  dockSigned
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : po.status === 'delayed'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {dockSigned ? 'DOCK RECEIVED ✓' : `STATUS: ${po.status.toUpperCase()}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Carrier: <strong className="text-slate-800">{po.supplier}</strong> · Dedicated Regional Fleet
            </p>
          </div>

          <div>
            {!dockSigned ? (
              <button
                type="button"
                onClick={handleSignDock}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <PackageCheck className="w-4 h-4" />
                <span>Sign Dock Intake Receipt</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Intake Verified &amp; Signed</span>
              </span>
            )}
          </div>
        </div>

        {/* PO Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <span className="text-slate-500 block">Order Date</span>
            <span className="font-mono text-slate-800 font-semibold mt-0.5 block">{po.orderDate}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <span className="text-slate-500 block">Revised ETA</span>
            <span className="font-mono text-amber-700 font-semibold mt-0.5 block">15:00 Today</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <span className="text-slate-500 block">Total Units</span>
            <span className="font-mono text-slate-800 font-semibold mt-0.5 block">{po.totalItems} Items</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
            <span className="text-slate-500 block">Invoice Value</span>
            <span className="font-mono text-emerald-700 font-semibold mt-0.5 block">${po.totalValue.toFixed(2)}</span>
          </div>
        </div>

        {/* Delay Notice */}
        {po.status === 'delayed' && !dockSigned && (
          <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-red-900 block">
                Carrier Freight Delay Notice (I-5 Corridor)
              </span>
              <p className="text-red-700">
                Cascade Fresh Distributors vehicle FLEET-TRUCK-07 is delayed due to highway congestion. Cold-chain probe temperature verified compliant at 3.4°C.
              </p>
            </div>
          </div>
        )}

        {/* Line Items Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Order Line Items ({po.items.length})
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th className="text-center">Ordered</th>
                  <th className="text-center">Allocated</th>
                  <th className="text-center">Remaining</th>
                  <th className="text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody>
                {po.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-slate-900">{item.productName}</td>
                    <td className="text-center font-mono text-slate-700">{item.quantity} {item.unit}</td>
                    <td className="text-center font-mono text-emerald-700">{item.allocated} {item.unit}</td>
                    <td className="text-center font-mono text-amber-700">{item.remaining} {item.unit}</td>
                    <td className="text-right font-mono text-slate-800">${item.unitPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
