// ============================================================
// FreshGuard AI — Supplier Experience: Delivery Schedules & Fleet
// ============================================================

import { useState } from 'react';
import { SUPPLIER_PURCHASE_ORDERS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  CalendarClock,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Thermometer,
  Navigation,
  CheckCheck
} from 'lucide-react';

export function SupplierDeliveriesPage() {
  const [orders, setOrders] = useState<SupplierPurchaseOrder[]>(SUPPLIER_PURCHASE_ORDERS);
  const [feedback, setFeedback] = useState<string | null>(null);

  const advanceDeliveryStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        if (o.status === 'confirmed' || o.status === 'pending_confirmation') {
          return { ...o, status: 'in_transit' as const };
        }
        if (o.status === 'delayed' || o.status === 'in_transit') {
          return {
            ...o,
            status: 'delivered' as const,
            actualDelivery: new Date().toISOString(),
          };
        }
        return o;
      })
    );

    const target = orders.find((o) => o.id === orderId);
    setFeedback(`Fleet status updated for PO ${target?.orderNumber}. Destination receiving dock notified.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
            <CalendarClock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>CASCADE FRESH DISTRIBUTORS · FLEET DISPATCH &amp; TELEMETRY</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Delivery Fleet Schedules
          </h1>

          <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            Real-time tracking of refrigerated delivery transport, carrier ETA timestamps, and cold-chain temperature telemetry across the Pacific Northwest retail network.
          </p>
        </div>

        {/* Fleet Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl">
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">ACTIVE FLEET</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">8 Vehicles</span>
          </div>
          <div className="p-3.5 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/15">
            <span className="text-[10px] font-mono text-[#F87171] block">ROUTE DELAYS</span>
            <span className="text-xl font-editorial text-[#F87171]">1 Active (I-5)</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">AVG COLD-CHAIN</span>
            <span className="text-xl font-editorial text-[#16A34A]">3.1°C</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">COMPLIANCE</span>
            <span className="text-xl font-editorial text-[#E0C588]">100% Sensor Log</span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Fleet Deliveries Grid */}
      <div className="space-y-4">
        {orders.map((po) => {
          const isDelivered = po.status === 'delivered';
          const isDelayed = po.status === 'delayed';

          return (
            <div
              key={po.id}
              className={`royal-card p-6 space-y-4 transition-all ${
                isDelayed ? 'border-[#9E2A2B]/40' : 'border-[#C5A059]/25'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-[#FDFBF7]">{po.orderNumber}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      isDelayed ? 'bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/50' :
                      isDelivered ? 'bg-[#16A34A]/20 text-[#4ADE80]' :
                      'bg-[#C5A059]/20 text-[#E0C588]'
                    }`}>
                      {po.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#8E9B90]">→ Destination: <strong className="text-[#FDFBF7]">{po.storeName}</strong></span>
                  </div>
                  <p className="text-xs text-[#8E9B90]">
                    Vehicle: <strong className="text-[#FDFBF7]">{po.deliveryVehicleId || 'Pending Assignment'}</strong> · Driver: {po.driverName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isDelivered ? (
                    <button
                      type="button"
                      onClick={() => advanceDeliveryStatus(po.id)}
                      className="btn-royal-gold text-xs px-4 py-2 flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>
                        {po.status === 'pending_confirmation' && 'Dispatch Truck'}
                        {po.status === 'confirmed' && 'Start In-Transit Route'}
                        {(po.status === 'in_transit' || po.status === 'delayed') && 'Mark Arrived & Delivered ✓'}
                      </span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold px-3 py-1.5 rounded border border-[#16A34A]/30 bg-[#16A34A]/10">
                      <CheckCheck className="w-4 h-4" />
                      <span>Delivered &amp; Signed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Transit Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">EXPECTED ETA</span>
                  <span className="font-mono text-[#FDFBF7] mt-0.5 block">{new Date(po.expectedDelivery).toLocaleString()}</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">COLD TELEMETRY</span>
                  <span className="font-mono text-[#16A34A] mt-0.5 block flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {po.temperatureLog || '3.2°C (Optimal)'}
                  </span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">LOAD MANIFEST</span>
                  <span className="font-mono text-[#E0C588] mt-0.5 block">{po.totalUnits} Units · ${po.totalValue.toFixed(2)}</span>
                </div>
              </div>

              {isDelayed && (
                <div className="p-3 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/10 text-xs text-[#8E9B90] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F87171] flex-shrink-0" />
                  <span>Freight transit delay logged on I-5 corridor. FreshBasket Store 017 notified.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
