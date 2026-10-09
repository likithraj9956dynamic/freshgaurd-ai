// ============================================================
// FreshGuard AI — Store Manager: Executive Store Dashboard
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STORE_17_INVENTORY } from '../../mocks/inventory';
import { STORE_17_SALES, STORE_17_WASTAGE } from '../../mocks/sales-wastage';
import { STORE_MANAGER_TASKS } from '../../mocks/tasks';
import { STORE_17_PURCHASE_ORDER } from '../../mocks/purchase-orders';
import {
  Store,
  AlertTriangle,
  ClipboardList,
  Layers,
  Flame,
  Truck,
  ArrowRight,
  TrendingDown,
  Clock,
  ScanBarcode,
  Megaphone,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export function StoreDashboardPage() {
  const { user, announcements, acknowledgeAnnouncement } = useAuth();
  const [tasks] = useState(STORE_MANAGER_TASKS);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const oosItems = STORE_17_INVENTORY.filter((i) => i.status === 'out-of-stock');
  const lowStockItems = STORE_17_INVENTORY.filter((i) => i.status === 'low');

  // Announcements targeted to store manager
  const storeAnnouncements = announcements.filter((a) =>
    a.targetRoles.includes('store_manager')
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Store Header Banner */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
              <Store className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>AUTHORIZED STORE LEDGER · BRANCH #017 (TACOMA DOWNTOWN)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
              Store 017 Operations Briefing
            </h1>

            <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
              Assigned Store Director: <strong className="text-[#FDFBF7]">{user?.name}</strong>. Real-time floor surveillance, stockout mitigation, and delivery receiving for today&apos;s operational shift.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#C5A059] pt-1">
              <span>LOCATION: TACOMA, WA</span>
              <span>·</span>
              <span>FORMAT: URBAN HYPERMARKET</span>
              <span>·</span>
              <span>HOURS: 07:00 – 22:00 PST</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 flex-shrink-0">
            <Link
              to="/store/tasks"
              className="btn-royal-gold text-xs px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>View Today&apos;s Directives ({pendingTasks.length})</span>
            </Link>
            <Link
              to="/store/product-lookup"
              className="btn-royal-outline text-xs px-4 py-2.5 flex items-center justify-center gap-2"
            >
              <ScanBarcode className="w-4 h-4 text-[#C5A059]" />
              <span>Barcode Scanner</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Critical Store Exception Alert */}
      <div className="p-4 sm:p-5 rounded border border-[#9E2A2B]/40 bg-[#9E2A2B]/15 text-[#FDFBF7] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded bg-[#9E2A2B]/30 border border-[#9E2A2B]/60 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-[#F87171]" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#9E2A2B]/40 text-[#F87171] font-bold">
                CRITICAL STORE SURVEILLANCE
              </span>
              <span className="text-xs text-[#8E9B90]">Triggered by Head Office</span>
            </div>
            <p className="text-sm font-medium text-[#FDFBF7]">
              12 Fast-Moving SKUs Depleted · Inbound PO CF-10482 Delayed in Transit
            </p>
            <p className="text-xs text-[#8E9B90] leading-relaxed">
              Revenue tracking -17.95% vs benchmark due to shelf stockouts in organic produce and meat. Review delayed PO details with Cascade Fresh Distributors.
            </p>
          </div>
        </div>

        <Link
          to="/store/deliveries"
          className="btn-royal-outline text-xs px-3.5 py-2 flex items-center justify-center gap-1.5 flex-shrink-0 border-[#9E2A2B]/50 hover:border-[#9E2A2B]"
        >
          <span>Track Carrier ETA</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Key Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sales Target */}
        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">WEEKLY SALES</span>
            <span className="text-[#F87171] font-mono flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -17.9%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#FDFBF7]">${STORE_17_SALES.currentPeriod.toLocaleString()}</span>
            <span className="text-xs text-[#8E9B90]">/ ${STORE_17_SALES.previousPeriod.toLocaleString()} target</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Impacted by stockouts on produce &amp; meat.</p>
        </div>

        {/* Priority Tasks */}
        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">TODAY&apos;S DIRECTIVES</span>
            <span className="badge-royal-critical font-mono">1 URGENT</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#E0C588]">{pendingTasks.length} Active</span>
            <span className="text-xs text-[#8E9B90]">of {tasks.length} total</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Floor walk &amp; shelf count required by 12:00.</p>
        </div>

        {/* Stockout SKUs */}
        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">INVENTORY ALERTS</span>
            <span className="text-[#F87171] font-mono text-[11px]">CRITICAL</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#F87171]">{oosItems.length} Stockouts</span>
            <span className="text-xs text-[#8E9B90]">· {lowStockItems.length} Low</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Organic Spinach &amp; Ground Beef under 2 days supply.</p>
        </div>

        {/* Wastage */}
        <div className="royal-card p-5 space-y-2 border-white/10">
          <div className="flex items-center justify-between text-xs text-[#8E9B90]">
            <span className="font-mono text-[10px] text-[#C5A059] uppercase">WASTAGE THIS WEEK</span>
            <span className="text-[#E0C588] font-mono text-[11px]">+28% trend</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-editorial text-[#FDFBF7]">4 Incidents</span>
            <span className="text-xs text-[#8E9B90]">· 33.7 lbs total</span>
          </div>
          <p className="text-[11px] text-[#8E9B90]">Rotational FIFO issues logged in produce.</p>
        </div>
      </div>

      {/* Head Office Announcements Section */}
      {storeAnnouncements.length > 0 && (
        <section className="royal-card p-6 border-[#C5A059]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4 text-[#C5A059]" />
              <h2 className="text-lg font-editorial text-[#FDFBF7]">
                Executive Bulletins from Head Office
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#8E9B90] uppercase">
              {storeAnnouncements.length} ACTIVE DIRECTIVES
            </span>
          </div>

          <div className="space-y-3">
            {storeAnnouncements.map((ann) => {
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
                        Acknowledge Directive ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Two Column Grid: Today's Tasks & Inbound PO Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Directives Queue */}
        <div className="lg:col-span-7 royal-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                FLOOR TASKS
              </span>
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                Today&apos;s Priority Execution Queue
              </h2>
            </div>
            <Link to="/store/tasks" className="text-xs text-[#E0C588] hover:underline font-mono">
              View All Tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.slice(0, 3).map((t) => (
              <div key={t.id} className="p-4 rounded border border-white/5 bg-[#071C16] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      t.priority === 'urgent' ? 'bg-[#9E2A2B]/20 text-[#F87171] border border-[#9E2A2B]/40' : 'bg-[#C5A059]/20 text-[#E0C588]'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs font-semibold text-[#FDFBF7]">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#8E9B90]">Status: {t.status}</span>
                </div>
                <p className="text-xs text-[#8E9B90] leading-relaxed">{t.instruction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Inbound Delivery Status */}
        <div className="lg:col-span-5 royal-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                DOCK RECEIVING
              </span>
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                Incoming Carrier PO
              </h2>
            </div>
            <Link to="/store/deliveries" className="text-xs text-[#E0C588] hover:underline font-mono">
              Delivery Log →
            </Link>
          </div>

          <div className="p-4 rounded border border-[#9E2A2B]/30 bg-[#071C16] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#E0C588] font-bold">
                {STORE_17_PURCHASE_ORDER.orderNumber}
              </span>
              <span className="badge-royal-critical uppercase">STATUS: DELAYED</span>
            </div>

            <div className="space-y-1 text-xs text-[#8E9B90]">
              <p><strong className="text-[#FDFBF7]">Carrier:</strong> {STORE_17_PURCHASE_ORDER.supplier}</p>
              <p><strong className="text-[#FDFBF7]">Units Inbound:</strong> {STORE_17_PURCHASE_ORDER.totalItems} Items</p>
              <p><strong className="text-[#FDFBF7]">Order Value:</strong> ${STORE_17_PURCHASE_ORDER.totalValue.toFixed(2)}</p>
              <p><strong className="text-[#FDFBF7]">Expected ETA:</strong> 15:00 Today</p>
            </div>

            <div className="pt-2 border-t border-white/5 text-[11px] text-[#8E9B90]">
              <span className="text-[#E0C588]">Key Line Items:</span> Baby Spinach (60), Ground Beef (22), Chicken Breast (30).
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/store/inventory"
              className="w-full btn-royal-outline text-xs py-2.5 flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#C5A059]" />
              <span>Inspect Shelf Inventory Ledger</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
