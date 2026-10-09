// ============================================================
// FreshGuard AI — Supplier Experience: Purchase Orders Ledger
// ============================================================

import React, { useState } from 'react';
import { SUPPLIER_PURCHASE_ORDERS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  PackageCheck,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp
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
    setFeedback(`Order ${target?.orderNumber} confirmed. Scheduled for warehouse dispatch.`);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Purchase Orders Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cascade Fresh Distributors · Confirm, manage and reconcile assigned retail purchase orders
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Total Orders</span>
          <span className="text-xl font-bold text-slate-900">{orders.length}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Pending Confirmation</span>
          <span className="text-xl font-bold text-amber-700">{pendingCount}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">In Transit</span>
          <span className="text-xl font-bold text-blue-700">{inTransitCount}</span>
        </div>
        <div className="bg-white p-3 rounded-md border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 block">Delivered</span>
          <span className="text-xl font-bold text-emerald-700">{deliveredCount}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search PO # or destination store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-md border border-slate-300 bg-white focus:border-[#164e3d] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'all' ? 'bg-[#164e3d] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending_confirmation')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'pending_confirmation' ? 'bg-[#164e3d] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('in_transit')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'in_transit' ? 'bg-[#164e3d] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            In Transit ({inTransitCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('delivered')}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              filter === 'delivered' ? 'bg-[#164e3d] text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Delivered ({deliveredCount})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((po) => {
          const isExpanded = expandedOrderId === po.id;
          const isPending = po.status === 'pending_confirmation';
          const isDelayed = po.status === 'delayed';

          return (
            <div
              key={po.id}
              className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Order Header Row */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-900">{po.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isDelayed
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : po.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {po.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">→ {po.storeName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span>Ordered: <strong className="text-slate-800">{new Date(po.orderDate).toLocaleDateString()}</strong></span>
                    <span>·</span>
                    <span>ETA: <strong className="text-slate-800">{new Date(po.expectedDelivery).toLocaleDateString()}</strong></span>
                    <span>·</span>
                    <span>Units: <strong className="text-slate-800">{po.totalUnits}</strong></span>
                    <span>·</span>
                    <span>Total: <strong className="text-emerald-700">${po.totalValue.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPending && (
                    <button
                      type="button"
                      onClick={() => confirmOrder(po.id)}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Confirm Order
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setExpandedOrderId(isExpanded ? null : po.id)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Manifest Details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/60 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded-md border border-slate-200">
                      <span className="text-slate-500 block">Assigned Vehicle</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{po.deliveryVehicleId || 'Pending Assignment'}</span>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-slate-200">
                      <span className="text-slate-500 block">Driver &amp; Dispatch</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{po.driverName || 'Unassigned'} ({po.driverPhone || 'N/A'})</span>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-slate-200">
                      <span className="text-slate-500 block">Cold Telemetry</span>
                      <span className="font-semibold text-emerald-700 mt-0.5 block">{po.temperatureLog || '3.2°C (Optimal)'}</span>
                    </div>
                  </div>

                  {po.notes && (
                    <p className="text-xs text-slate-600 italic">
                      Dispatch Notes: {po.notes}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                      Manifest Line Items
                    </span>
                    <div className="overflow-x-auto border border-slate-200 rounded-md bg-white">
                      <table className="enterprise-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-right">Unit Price</th>
                            <th className="text-right">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {po.items.map((item) => (
                            <tr key={item.id}>
                              <td className="font-medium text-slate-900">{item.productName}</td>
                              <td>{item.category}</td>
                              <td className="text-center font-mono">{item.quantity} {item.unit}</td>
                              <td className="text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                              <td className="text-right font-mono font-medium text-slate-800">
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
