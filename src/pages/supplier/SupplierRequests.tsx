// ============================================================
// FreshGuard AI — Supplier Experience: Emergency Stock Requests
// Enterprise Expedited Replenishment Directives
// ============================================================

import { useState } from 'react';
import { SUPPLIER_EMERGENCY_REQUESTS } from '../../mocks/supplier';
import type { SupplierEmergencyRequest } from '../../mocks/supplier';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldAlert,
  Send,
  Building2
} from 'lucide-react';

export function SupplierRequestsPage() {
  const [requests, setRequests] = useState<SupplierEmergencyRequest[]>(SUPPLIER_EMERGENCY_REQUESTS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'dispatched' as const } : r
      )
    );
    const target = requests.find((r) => r.id === requestId);
    setFeedback(`Emergency hot-shot replenishment accepted for ${target?.storeName}. Vehicle dispatched.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
              <AlertOctagon className="w-3.5 h-3.5 text-amber-700" />
              <span>Supplier Logistics · Expedited Replenishment Directives</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Emergency Stock Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              High-priority stockout replenishment orders transmitted directly by FreshBasket Head Office Operations Directors to prevent critical shelf vacancies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Pending Authorization: <strong className="text-amber-700">1 Urgent</strong>
            </span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Requests Ledger */}
      <div className="space-y-4">
        {requests.map((req) => {
          const isDispatched = req.status === 'dispatched';

          return (
            <div
              key={req.id}
              className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-slate-900">
                      {req.requestNumber}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      URGENCY: {req.urgency.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      Target Store: <strong className="text-slate-800">{req.storeName}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Dispatched by: <strong className="text-slate-700">{req.requestedBy}</strong> · {new Date(req.requestedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isDispatched ? (
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Accept &amp; Dispatch Hot-Shot Fleet</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium px-3 py-1.5 rounded border border-emerald-200 bg-emerald-50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Hot-Shot Dispatched · In Transit</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Justification & Directive */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Executive Operational Directive
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
                  {req.reason}
                </p>
              </div>

              {/* Requested Products */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Expedited SKUs Required
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {req.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-900">{item.productName}</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <span className="font-mono">REQUIREMENT DEADLINE: {req.requiredBy}</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Priority Dock Clearance Granted
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
