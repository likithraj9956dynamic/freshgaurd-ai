// ============================================================
// FreshGuard AI — Supplier Experience: Emergency Supply Requests
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
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
            <AlertOctagon className="w-3.5 h-3.5 text-[#F87171]" />
            <span>CASCADE FRESH DISTRIBUTORS · EXPEDITED REPLENISHMENT DIRECTIVES</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Emergency Stock Requests
          </h1>

          <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            High-priority stockout replenishment orders transmitted directly by FreshBasket Head Office Operations Directors to prevent critical shelf vacancies.
          </p>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
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
              className="royal-card p-6 sm:p-8 border-[#9E2A2B]/40 shadow-xl space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-[#FDFBF7]">
                      {req.requestNumber}
                    </span>
                    <span className="badge-royal-critical">
                      URGENCY: {req.urgency.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#8E9B90]">
                      Target: <strong className="text-[#FDFBF7]">{req.storeName}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-[#8E9B90]">
                    Dispatched by: <strong className="text-[#FDFBF7]">{req.requestedBy}</strong> · {new Date(req.requestedAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isDispatched ? (
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="btn-royal-gold text-xs px-4 py-2.5 flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Accept &amp; Dispatch Hot-Shot Fleet</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold px-3 py-1.5 rounded border border-[#16A34A]/30 bg-[#16A34A]/10">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Hot-Shot Dispatched · In Transit</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Justification & Timeline */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#C5A059] uppercase block">
                  Executive Operational Directive
                </span>
                <p className="text-xs text-[#8E9B90] leading-relaxed bg-[#071C16] p-4 rounded border border-white/5">
                  {req.reason}
                </p>
              </div>

              {/* Requested Products */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-[#C5A059] uppercase block">
                  Expedited SKUs Required
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {req.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded border border-white/5 bg-[#071C16] flex items-center justify-between text-xs">
                      <span className="font-medium text-[#FDFBF7]">{item.productName}</span>
                      <span className="font-mono text-[#E0C588] font-bold">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8E9B90] font-mono">
                <span>DEADLINE REQUIREMENT: {req.requiredBy}</span>
                <span className="text-[#16A34A]">PRIORITY DOCK CLEARANCE GRANTED</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
