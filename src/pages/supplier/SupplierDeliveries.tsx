// ============================================================
// FreshGuard AI — Supplier Experience: Delivery Schedules & Fleet
// Enterprise Fleet Logistics & Cold-Chain Telemetry Ledger
// ============================================================

import { useState } from 'react';
import { SUPPLIER_PURCHASE_ORDERS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  CalendarClock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Thermometer,
  Navigation,
  CheckCheck,
  Building2,
  Clock,
  ShieldCheck
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CalendarClock className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cascade Fresh Distributors · Fleet Logistics Ledger</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Delivery Fleet Schedules & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Real-time monitoring of refrigerated freight, driver manifests, carrier ETAs, and sensor telemetry across Pacific Northwest receiving docks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              Sensors Online: <strong className="text-emerald-700">8/8 Active</strong>
            </span>
          </div>
        </div>

        {/* Fleet Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Active Fleet</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">8 Vehicles</span>
          </div>
          <div className="p-3 rounded bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide block">Transit Delays</span>
            <span className="text-xl font-bold text-rose-800 mt-0.5 block">1 Active (I-5)</span>
          </div>
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Avg Temperature</span>
            <span className="text-xl font-bold text-emerald-700 mt-0.5 block">3.1°C (Optimal)</span>
          </div>
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Compliance Audit</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">100% Sensor Log</span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Fleet Deliveries List */}
      <div className="space-y-4">
        {orders.map((po) => {
          const isDelivered = po.status === 'delivered';
          const isDelayed = po.status === 'delayed';

          return (
            <div
              key={po.id}
              className={`bg-white rounded-lg p-5 border shadow-sm space-y-4 transition-all ${
                isDelayed ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-slate-900">{po.orderNumber}</span>
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                      isDelayed ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      isDelivered ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {po.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">
                      Destination Dock: <strong className="text-slate-800">{po.storeName}</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Carrier Vehicle: <strong className="text-slate-700">{po.deliveryVehicleId || 'Pending Assignment'}</strong> · Driver: {po.driverName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {!isDelivered ? (
                    <button
                      type="button"
                      onClick={() => advanceDeliveryStatus(po.id)}
                      className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>
                        {po.status === 'pending_confirmation' && 'Dispatch Truck'}
                        {po.status === 'confirmed' && 'Start In-Transit Route'}
                        {(po.status === 'in_transit' || po.status === 'delayed') && 'Mark Arrived & Delivered ✓'}
                      </span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium px-3 py-1.5 rounded border border-emerald-200 bg-emerald-50">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>Delivered &amp; Signed</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Transit Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Scheduled Dock ETA</span>
                  <span className="font-mono text-slate-800 font-medium mt-0.5 block">{new Date(po.expectedDelivery).toLocaleString()}</span>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Refrigeration Sensor</span>
                  <span className="font-mono text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5" />
                    {po.temperatureLog || '3.2°C (Compliant)'}
                  </span>
                </div>
                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Manifest Payload</span>
                  <span className="font-mono text-slate-800 font-medium mt-0.5 block">{po.totalUnits} Units · ${po.totalValue.toFixed(2)}</span>
                </div>
              </div>

              {isDelayed && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>Freight transit delay logged on I-5 corridor. FreshBasket Store 017 dock master notified.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
