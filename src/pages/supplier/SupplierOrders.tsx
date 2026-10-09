// ============================================================
// FreshGuard AI — Supplier Experience: Purchase Orders Ledger
// ============================================================

import { useState } from 'react';
import { SUPPLIER_PURCHASE_ORDERS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  PackageCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Building2,
  Calendar
} from 'lucide-react';

export function SupplierOrdersPage() {
  const [orders, setOrders] = useState<SupplierPurchaseOrder[]>(SUPPLIER_PURCHASE_ORDERS);
  const [filter, setFilter] = useState<'all' | 'pending_confirmation' | 'confirmed' | 'in_transit' | 'delivered'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('po-10482');
  const [feedback, setFeedback] = useState<string | null>(null);

  const confirmOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'confirmed' as const } : o))
    );
    const target = orders.find((o) => o.id === orderId);
    setFeedback(`Order ${target?.orderNumber} confirmed. Delivery scheduled in warehouse dispatch.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.storeName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'in_transit') return o.status === 'in_transit' || o.status === 'delayed';
    return o.status === filter;
  });

  const pendingCount = orders.filter((o) => o.status === 'pending_confirmation').length;
  const inTransitCount = orders.filter((o) => o.status === 'in_transit' || o.status === 'delayed').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/80 via-[#071C16] to-[#041410] p-6 sm:p-8 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/60 text-xs font-mono text-[#E0C588]">
            <PackageCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>CASCADE FRESH DISTRIBUTORS · PURCHASE ORDERS RECONCILIATION</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Purchase Orders Ledger
          </h1>

          <p className="text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            Review, confirm, and fulfill purchase orders assigned to Cascade Fresh Distributors. Confirm incoming orders to lock fulfillment windows and notify store receiving docks.
          </p>
        </div>

        {/* Status Counter Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-2xl">
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">TOTAL ORDERS</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{orders.length}</span>
          </div>
          <div className="p-3.5 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <span className="text-[10px] font-mono text-[#E0C588] block">AWAITING CONFIRMATION</span>
            <span className="text-xl font-editorial text-[#E0C588]">{pendingCount}</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#8E9B90] block">IN TRANSIT / ACTIVE</span>
            <span className="text-xl font-editorial text-[#FDFBF7]">{inTransitCount}</span>
          </div>
          <div className="p-3.5 rounded border border-white/5 bg-[#071C16]">
            <span className="text-[10px] font-mono text-[#16A34A] block">DELIVERED</span>
            <span className="text-xl font-editorial text-[#16A34A]">{deliveredCount}</span>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="p-4 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#C5A059]/70 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search PO # or destination store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded text-xs pl-9 pr-3 py-2 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'all' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending_confirmation')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'pending_confirmation' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('in_transit')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'in_transit' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            In Transit ({inTransitCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`text-xs px-3 py-1.5 rounded font-mono ${
              filter === 'delivered' ? 'bg-[#C5A059] text-[#041410] font-semibold' : 'text-[#8E9B90] hover:bg-white/5'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((po) => {
          const isExpanded = expandedOrderId === po.id;
          const isPending = po.status === 'pending_confirmation';
          const isDelayed = po.status === 'delayed';

          return (
            <div
              key={po.id}
              className={`royal-card transition-all overflow-hidden ${
                isDelayed ? 'border-[#9E2A2B]/40' : 'border-[#C5A059]/25'
              }`}
            >
              {/* Order Header Row */}
              <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-[#FDFBF7]">{po.orderNumber}</span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      isDelayed ? 'bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/50' :
                      isPending ? 'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/40' :
                      po.status === 'confirmed' ? 'bg-[#16A34A]/20 text-[#4ADE80] border border-[#16A34A]/30' :
                      'bg-white/10 text-white/80'
                    }`}>
                      {po.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-[#8E9B90]">→ {po.storeName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#8E9B90]">
                    <span>Ordered: <strong className="text-[#FDFBF7]">{new Date(po.orderDate).toLocaleDateString()}</strong></span>
                    <span>·</span>
                    <span>Expected ETA: <strong className="text-[#E0C588]">{new Date(po.expectedDelivery).toLocaleDateString()}</strong></span>
                    <span>·</span>
                    <span>Units: <strong className="text-[#FDFBF7]">{po.totalUnits}</strong></span>
                    <span>·</span>
                    <span>Total: <strong className="text-[#16A34A]">${po.totalValue.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => confirmOrder(po.id)}
                      className="btn-royal-gold text-xs px-4 py-2"
                    >
                      Confirm Order
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? null : po.id)}
                    className="p-2 rounded text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5 transition-colors"
                    aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Manifest Details */}
              {isExpanded && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-white/5 bg-[#041410]/60 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                    <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                      <span className="text-[10px] font-mono text-[#8E9B90] block">ASSIGNED VEHICLE</span>
                      <span className="font-mono text-[#FDFBF7] mt-0.5 block">{po.deliveryVehicleId || 'Pending Assignment'}</span>
                    </div>
                    <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                      <span className="text-[10px] font-mono text-[#8E9B90] block">DRIVER &amp; DISPATCH</span>
                      <span className="font-mono text-[#FDFBF7] mt-0.5 block">{po.driverName || 'Unassigned'} ({po.driverPhone || 'N/A'})</span>
                    </div>
                    <div className="p-3 rounded border border-white/5 bg-[#071C16]">
                      <span className="text-[10px] font-mono text-[#8E9B90] block">COLD-CHAIN SENSOR</span>
                      <span className="font-mono text-[#16A34A] mt-0.5 block">{po.temperatureLog || 'Sensor Calibrated'}</span>
                    </div>
                  </div>

                  {po.notes && (
                    <p className="text-xs text-[#8E9B90] italic">
                      Notes: {po.notes}
                    </p>
                  )}

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block">
                      Line Items Manifest
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#071C16] text-[#8E9B90] font-mono text-[10px] uppercase border-b border-white/10">
                          <tr>
                            <th className="p-2.5">Product Name</th>
                            <th className="p-2.5">Department</th>
                            <th className="p-2.5 text-center">Quantity</th>
                            <th className="p-2.5 text-right">Unit Price</th>
                            <th className="p-2.5 text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[#8E9B90]">
                          {po.items.map((item) => (
                            <tr key={item.id}>
                              <td className="p-2.5 font-medium text-[#FDFBF7]">{item.productName}</td>
                              <td className="p-2.5">{item.category}</td>
                              <td className="p-2.5 text-center font-mono">{item.quantity} {item.unit}</td>
                              <td className="p-2.5 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                              <td className="p-2.5 text-right font-mono text-[#FDFBF7]">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
