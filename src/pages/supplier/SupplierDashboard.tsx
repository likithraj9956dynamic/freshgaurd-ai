// ============================================================
// FreshGuard AI — Supplier Experience: Logistics & Dispatch Hub
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SUPPLIER_PURCHASE_ORDERS, SUPPLIER_EMERGENCY_REQUESTS } from '../../mocks/supplier';
import type { SupplierPurchaseOrder } from '../../mocks/supplier';
import {
  Truck,
  PackageCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  Megaphone
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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Supplier Logistics &amp; Dispatch Hub
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-800 border border-blue-200">
              CASCADE FRESH DISTRIBUTORS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Fleet Representative: {user?.name} · Active Orders for FreshBasket Retail · Contract Status: Preferred Partner
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/supplier/orders"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Manage Orders ({orders.length})</span>
          </Link>
          <Link
            to="/supplier/requests"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            <span>Emergency Requests ({SUPPLIER_EMERGENCY_REQUESTS.length})</span>
          </Link>
        </div>
      </div>

      {/* 2. Delayed Shipment Notice */}
      {delayedOrders.length > 0 && (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50/70 text-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">
                Delivery Delay Alert: PO CF-10482 to Tacoma Downtown is Delayed in Transit
              </span>
              <p className="text-slate-600 leading-relaxed">
                Carrier vehicle FLEET-TRUCK-07 is delayed due to I-5 corridor traffic. Revised ETA: 15:00 Today. Cold-chain probe temperature verified at 3.4°C.
              </p>
            </div>
          </div>

          <Link
            to="/supplier/deliveries"
            className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
          >
            <span>Update Fleet Status</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 3. Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Assigned POs</span>
            <span className="font-mono text-slate-600 font-semibold">{orders.length} Total</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {inTransitOrders.length} <span className="text-xs font-normal text-slate-500">in transit</span>
          </div>
          <p className="text-[11px] text-slate-500">{pendingConfirm.length} awaiting confirmation</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">On-Time Delivery Rate</span>
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              88.5%
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-800">
            Optimal Tier
          </div>
          <p className="text-[11px] text-slate-500">Target threshold &gt;85%</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Cold-Chain Telemetry</span>
            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              100%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            3.1°C <span className="text-xs font-normal text-slate-500">mean sensor temp</span>
          </div>
          <p className="text-[11px] text-slate-500">Compliant refrigerated fleet</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Hot-Shot Requests</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              Urgent
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            1 <span className="text-xs font-normal text-slate-500">Request</span>
          </div>
          <p className="text-[11px] text-slate-500">Store 017 emergency replenishment</p>
        </div>
      </div>

      {/* 4. Head Office Bulletins for Suppliers */}
      {supplierAnnouncements.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#164e3d]" />
              <h2 className="text-sm font-semibold text-slate-900">
                Head Office Transit Bulletins
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {supplierAnnouncements.length} Active Advisories
            </span>
          </div>

          <div className="space-y-2.5">
            {supplierAnnouncements.map((ann) => {
              const isAcknowledged = user ? ann.acknowledgedBy.includes(user.id) : false;
              const isCrit = ann.priority === 'critical';

              return (
                <div
                  key={ann.id}
                  className={`p-3.5 rounded-md border text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isCrit ? 'bg-red-50/60 border-red-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isCrit ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ann.priority}
                      </span>
                      <span className="font-semibold text-slate-900">{ann.title}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{ann.message}</p>
                    <span className="text-[11px] text-slate-500 block">
                      From: {ann.senderName} ({ann.senderRole})
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    {isAcknowledged ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledged</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => acknowledgeAnnouncement(ann.id)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Acknowledge Advisory ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Assigned Purchase Orders Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Assigned Purchase Orders
            </h2>
            <p className="text-xs text-slate-500">
              Orders requiring fulfillment and confirmation for FreshBasket branches
            </p>
          </div>
          <Link to="/supplier/orders" className="text-xs text-[#164e3d] hover:underline font-medium">
            View All ({orders.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Destination Store</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Units</th>
                <th>Total Value</th>
                <th className="text-center">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((po) => {
                const isDelayed = po.status === 'delayed';
                const isPending = po.status === 'pending_confirmation';
                const isConfirmed = po.status === 'confirmed';

                return (
                  <tr key={po.id}>
                    <td className="font-mono font-semibold text-slate-900">{po.orderNumber}</td>
                    <td className="font-medium text-slate-800">{po.storeName}</td>
                    <td className="text-slate-600 font-mono text-xs">{new Date(po.orderDate).toLocaleDateString()}</td>
                    <td className="text-slate-600 font-mono text-xs">{new Date(po.expectedDelivery).toLocaleDateString()}</td>
                    <td className="font-mono text-slate-800">{po.totalUnits} Units</td>
                    <td className="font-mono font-medium text-slate-900">${po.totalValue.toFixed(2)}</td>
                    <td className="text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isDelayed
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : isConfirmed
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {po.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link
                        to="/supplier/orders"
                        className="text-xs text-[#164e3d] hover:underline font-medium"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
