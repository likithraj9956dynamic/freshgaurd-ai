// ============================================================
// FreshGuard AI — Supplier Experience: Logistics & Dispatch Hub
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SUPPLIER_PURCHASE_ORDERS, SUPPLIER_EMERGENCY_REQUESTS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  Truck,
  PackageCheck,
  CalendarClock,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Thermometer,
  Megaphone,
  ShieldCheck,
  Building2
} from 'lucide-react';

export function SupplierDashboardPage() {
  const { user, announcements, acknowledgeAnnouncement } = useAuth();
  const [orders] = useState<SupplierPurchaseOrder[]>(SUPPLIER_PURCHASE_ORDERS);

  const pendingConfirm = orders.filter((o) => o.status === 'pending_confirmation');
  const delayedOrders = orders.filter((o) => o.status === 'delayed');
  const inTransitOrders = orders.filter((o) => o.status === 'in_transit' || o.status === 'delayed');

  // Filter announcements for supplier
  const supplierAnnouncements = announcements.filter((a) =>
    a.targetRoles.includes('supplier')
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header Banner */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
              <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>SUPPLIER PORTAL · CASCADE FRESH DISTRIBUTORS (#SUP-CASCADE)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
              Supplier Logistics &amp; Dispatch Hub
            </h1>

            <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
              Authorized Representative: <strong className="text-[#FDFBF7]">{user?.name}</strong> ({user?.title}). Monitor assigned FreshBasket purchase orders, cold-chain carrier telemetry, and expedited replenishment requests.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#C5A059] pt-1">
              <span>AUTHORIZED VENDOR: CASCADE FRESH</span>
              <span>·</span>
              <span>FLEET UNITS: 8 VEHICLES</span>
              <span>·</span>
              <span>CONTRACT STATUS: PREFERRED PARTNER</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
            <Link
              to="/supplier/orders"
              className="btn-royal-gold text-xs px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Manage Purchase Orders ({orders.length})</span>
            </Link>
            <Link
              to="/supplier/requests"
              className="btn-royal-outline text-xs px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <AlertOctagon className="w-4 h-4 text-[#F87171]" />
              <span>Emergency Requests ({SUPPLIER_EMERGENCY_REQUESTS.length})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Delayed Shipment Notice */}
      {delayedOrders.length > 0 && (
        <div className="p-4 sm:p-5 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/15 text-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded bg-[#9E2A2B]/30 border border-[#9E2A2B]/60 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-[#F87171]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#9E2A2B]/40 text-[#F87171] font-bold">
                  DELIVERY DELAY ALERT
                </span>
                <span className="text-xs text-[#8E9B90]">Store 017 Receiving Waiting</span>
              </div>
              <p className="text-sm font-medium text-[#FDFBF7]">
                PO CF-10482 to Tacoma Downtown is Delayed in Transit (I-5 Congestion)
              </p>
              <p className="text-xs text-[#8E9B90] leading-relaxed">
                Carrier vehicle FLEET-TRUCK-07 revised ETA 15:00 PST. Cold-chain probe verified at 3.4°C.
              </p>
            </div>
          </div>

          <Link
            to="/supplier/deliveries"
            className="btn-royal-outline text-xs px-3.5 py-2 flex items-center justify-center gap-1.5 flex-shrink-0 border-[#9E2A2B]/50 hover:border-[#9E2A2B]"
          >
            <span>Update Fleet Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Supplier Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">ACTIVE PURCHASE ORDERS</span>
            <span className="font-mono text-[#E0C588] text-[11px]">{orders.length} TOTAL</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#FDFBF7]">{inTransitOrders.length} In Transit</span>
            <span className="text-xs text-[#8E9B90]">· {pendingConfirm.length} Pending</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Supplying across 4 FreshBasket regional stores.</p>
        </div>

        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">ON-TIME DELIVERY RATE</span>
            <span className="text-[#16A34A] font-mono text-[11px] font-bold">88.5%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#16A34A]">Optimal Tier</span>
            <span className="text-xs text-[#8E9B90]">target &gt;85%</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">1 delay in past 7 calendar days.</p>
        </div>

        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">COLD-CHAIN COMPLIANCE</span>
            <span className="text-[#E0C588] font-mono text-[11px] font-bold">99.2%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#FDFBF7]">3.1°C Mean</span>
            <span className="text-xs text-[#8E9B90]">sensor logged</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Refrigerated probe telemetry active on all trucks.</p>
        </div>

        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">EMERGENCY REQUESTS</span>
            <span className="text-[#F87171] font-mono text-[11px]">HOT-SHOT</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#F87171]">1 Request</span>
            <span className="text-xs text-[#8E9B90]">Store 017</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Organic Spinach &amp; Poultry replenishment requested.</p>
        </div>
      </div>

      {/* Head Office Bulletins for Suppliers */}
      {supplierAnnouncements.length > 0 && (
        <section className="royal-card p-6 border-[#C5A059]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-lg font-editorial text-[#FDFBF7]">
                Head Office Communications &amp; Transit Bulletins
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8E9B90] uppercase">
              {supplierAnnouncements.length} ADVISORIES
            </span>
          </div>

          <div className="space-y-3">
            {supplierAnnouncements.map((ann) => {
              const isAcknowledged = user ? ann.acknowledgedBy.includes(user.id) : false;
              return (
                <div
                  key={ann.id}
                  className="p-4 rounded border border-white/10 bg-[#071C16] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        ann.priority === 'critical' ? 'bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/40' : 'bg-[#C5A059]/20 text-[#E0C588]'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="text-xs font-semibold text-[#FDFBF7]">{ann.title}</span>
                    </div>
                    <p className="text-xs text-[#8E9B90] leading-relaxed">{ann.message}</p>
                    <span className="text-[10px] font-mono text-[#8E9B90] block mt-1">
                      From: {ann.senderName} ({ann.senderRole})
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    {isAcknowledged ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#16A34A] font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledged</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => acknowledgeAnnouncement(ann.id)}
                        className="btn-royal-gold text-xs px-3.5 py-2"
                      >
                        Acknowledge Advisory ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Two Column Section: Assigned POs Preview & Emergency Hot-Shot Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Purchase Orders */}
        <div className="lg:col-span-7 royal-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                PURCHASE ORDERS
              </span>
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                Assigned Orders Awaiting Fulfilment
              </h2>
            </div>
            <Link to="/supplier/orders" className="text-xs text-[#E0C588] hover:underline font-mono">
              View All Orders →
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 3).map((po) => (
              <div key={po.id} className="p-4 rounded border border-white/5 bg-[#071C16] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FDFBF7]">{po.orderNumber}</span>
                    <span className="text-xs text-[#8E9B90]">→ {po.storeName}</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    po.status === 'delayed' ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/40' :
                    po.status === 'confirmed' ? 'bg-[#16A34A]/20 text-[#4ADE80]' :
                    po.status === 'pending_confirmation' ? 'bg-[#C5A059]/20 text-[#E0C588]' :
                    'bg-white/10 text-white/80'
                  }`}>
                    {po.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#8E9B90]">
                  <span>Units: <strong className="text-[#FDFBF7]">{po.totalUnits}</strong> · Value: <strong className="text-[#16A34A]">${po.totalValue.toFixed(2)}</strong></span>
                  <span className="font-mono text-[11px] text-[#C5A059]">ETA: {new Date(po.expectedDelivery).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Emergency Supply Request */}
        <div className="lg:col-span-5 royal-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#F87171] uppercase block">
                EXPEDITED HOT-SHOT
              </span>
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                Emergency Stock Request
              </h2>
            </div>
            <Link to="/supplier/requests" className="text-xs text-[#E0C588] hover:underline font-mono">
              Details →
            </Link>
          </div>

          {SUPPLIER_EMERGENCY_REQUESTS.map((req) => (
            <div key={req.id} className="p-4 rounded border border-[#9E2A2B]/30 bg-[#071C16] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#E0C588] font-bold">
                  {req.requestNumber}
                </span>
                <span className="badge-royal-critical uppercase">URGENCY: CRITICAL</span>
              </div>

              <p className="text-xs text-[#8E9B90] leading-relaxed">
                {req.reason}
              </p>

              <div className="text-xs space-y-1 text-[#8E9B90] border-t border-white/5 pt-2">
                <p><strong className="text-[#FDFBF7]">Destination:</strong> {req.storeName}</p>
                <p><strong className="text-[#FDFBF7]">Required Window:</strong> {req.requiredBy}</p>
                <p><strong className="text-[#E0C588]">Requested SKUs:</strong> {req.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}</p>
              </div>

              <div className="pt-2">
                <Link
                  to="/supplier/requests"
                  className="w-full btn-royal-gold text-xs py-2 flex items-center justify-center gap-1.5"
                >
                  <span>Review &amp; Accept Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
