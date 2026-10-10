// ============================================================
// FreshGuard AI — Store Manager: Task-Oriented Store Dashboard
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STORE_17_INVENTORY } from '../../mocks/inventory';
import { STORE_17_SALES, STORE_17_WASTAGE } from '../../mocks/sales-wastage';
import { STORE_MANAGER_TASKS } from '../../mocks/tasks';
import { STORE_17_PURCHASE_ORDER } from '../../mocks/purchase-orders';
import type { StoreTask } from '../../types';
import {
  ClipboardList,
  Layers,
  Flame,
  Truck,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ScanBarcode,
  Megaphone,
  Check
} from 'lucide-react';

export function StoreDashboardPage() {
  const { user, announcements, acknowledgeAnnouncement } = useAuth();
  const [tasks, setTasks] = useState<StoreTask[]>(STORE_MANAGER_TASKS);
  const [taskFeedback, setTaskFeedback] = useState<string | null>(null);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const oosItems = STORE_17_INVENTORY.filter((i) => i.status === 'out-of-stock');
  const lowStockItems = STORE_17_INVENTORY.filter((i) => i.status === 'low');
  const expiringItems = STORE_17_INVENTORY.filter((i) => i.daysOfSupply <= 3);

  // Filter announcements for store manager
  const storeAnnouncements = announcements.filter((a) =>
    a.targetRoles.includes('store_manager')
  );

  const advanceTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        if (t.status === 'pending') {
          setTaskFeedback(`Task "${t.title}" acknowledged.`);
          return { ...t, status: 'acknowledged' as const };
        }
        if (t.status === 'acknowledged') {
          setTaskFeedback(`Task "${t.title}" started in-progress on floor.`);
          return { ...t, status: 'in-progress' as const };
        }
        if (t.status === 'in-progress') {
          setTaskFeedback(`Task "${t.title}" marked completed.`);
          return { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        }
        return t;
      })
    );
    setTimeout(() => setTaskFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Store Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {user?.assignedStoreName?.replace(/FreshBasket\s*/i, '') || 'Store'} Operations
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
              {user?.assignedStoreId || 'FB-17'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Store Director: {user?.name} · Active Shift: Oct 10, 2026 · Hours: 07:00 – 22:00 IST
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/store/product-lookup"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <ScanBarcode className="w-3.5 h-3.5" />
            <span>Scan Barcode</span>
          </Link>
          <Link
            to="/store/tasks"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Task Ledger</span>
          </Link>
        </div>
      </div>

      {/* 2. Critical Alert Banner */}
      <div className="p-4 rounded-lg border border-red-200 bg-red-50/70 text-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900 block">
              Store Alert: Inbound PO #{STORE_17_PURCHASE_ORDER.orderNumber} Delayed ({STORE_17_PURCHASE_ORDER.supplier})
            </span>
            <p className="text-slate-600 leading-relaxed">
              Perishable bakery and fresh shelves require replenishment. {STORE_17_PURCHASE_ORDER.supplier} delivery is delayed without revised ETA (dataset PO-7106).
            </p>
          </div>
        </div>

        <Link
          to="/store/deliveries"
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
        >
          <span>Track Carrier Delivery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {taskFeedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{taskFeedback}</span>
        </div>
      )}

      {/* 3. Operational Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Directives Due Today</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              1 Urgent
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {pendingTasks.length} <span className="text-xs font-normal text-slate-500">/ {tasks.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500">Floor walk &amp; shelf count</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Out-of-Stock SKUs</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              Stockout
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {oosItems.length} <span className="text-xs font-normal text-slate-500">SKUs zero on-hand</span>
          </div>
          <p className="text-[11px] text-slate-500">Baby Spinach, Ground Beef, Chicken</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Products Near Expiry (&lt;3D)</span>
            <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Expiry Risk
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {expiringItems.length} <span className="text-xs font-normal text-slate-500">SKUs</span>
          </div>
          <p className="text-[11px] text-slate-500">Markdown recommended by 14:00</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Inbound PO Status</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              Delayed
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {STORE_17_PURCHASE_ORDER.orderNumber}
          </div>
          <p className="text-[11px] text-slate-500">136 Units · ETA 15:00 Today</p>
        </div>
      </div>

      {/* 4. Head Office Bulletins / Announcements */}
      {storeAnnouncements.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-[#164e3d]" />
              <h2 className="text-sm font-semibold text-slate-900">
                Head Office Operational Bulletins
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {storeAnnouncements.length} Active Directives
            </span>
          </div>

          <div className="space-y-2.5">
            {storeAnnouncements.map((ann) => {
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
                      Dispatched by: {ann.senderName} ({ann.senderRole})
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
                        Acknowledge Directive ✓
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Tasks Requiring Action Today Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Tasks Requiring Action Today
            </h2>
            <p className="text-xs text-slate-500">
              Floor directives for Store #017 staff with required completion status
            </p>
          </div>
          <Link to="/store/tasks" className="text-xs text-[#164e3d] hover:underline font-medium">
            View All ({tasks.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Task Description</th>
                <th>Priority</th>
                <th>Due Time</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const isDone = t.status === 'completed';
                const isUrgent = t.priority === 'urgent';
                const isHigh = t.priority === 'high';

                return (
                  <tr key={t.id} className={isDone ? 'opacity-60 bg-slate-50/50' : ''}>
                    <td>
                      <div className="font-medium text-slate-900">{t.title}</div>
                      <div className="text-xs text-slate-500">{t.instruction}</div>
                      {t.affectedProducts.length > 0 && (
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          <strong>Affected SKUs:</strong> {t.affectedProducts.slice(0, 4).join(', ')}
                          {t.affectedProducts.length > 4 ? ` (+${t.affectedProducts.length - 4} more)` : ''}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          isUrgent
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isHigh
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="text-slate-600 font-mono text-xs whitespace-nowrap">
                      12:00 Today
                    </td>
                    <td>
                      <span className="capitalize text-xs text-slate-700">
                        {t.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      {!isDone ? (
                        <button
                          type="button"
                          onClick={() => advanceTask(t.id)}
                          className="btn-primary text-xs px-2.5 py-1 whitespace-nowrap"
                        >
                          {t.status === 'pending' && 'Acknowledge'}
                          {t.status === 'acknowledged' && 'Start Work'}
                          {t.status === 'in-progress' && 'Mark Done ✓'}
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-medium text-xs inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Two Column Grid: Low-Stock Products & Inbound Delivery Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Low-Stock & Out-of-Stock Table */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Low-Stock &amp; Depleted SKUs
              </h3>
              <p className="text-xs text-slate-500">Products currently below required shelf thresholds</p>
            </div>
            <Link to="/store/inventory" className="text-xs text-[#164e3d] hover:underline font-medium">
              Inventory Ledger →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">On Hand</th>
                  <th className="text-center">Days Supply</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {STORE_17_INVENTORY.slice(0, 5).map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-medium text-slate-900">{item.product.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.product.sku}</div>
                    </td>
                    <td className="text-center font-mono text-slate-800">
                      {item.onHand} {item.unit}
                    </td>
                    <td className="text-center font-mono">
                      <span className={item.daysOfSupply <= 2 ? 'text-red-700 font-bold' : 'text-amber-700'}>
                        {item.daysOfSupply}D
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.status === 'out-of-stock'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incoming Deliveries Card */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Incoming Carrier PO</h3>
              <p className="text-xs text-slate-500">Inbound dock delivery schedule</p>
            </div>
            <Link to="/store/deliveries" className="text-xs text-[#164e3d] hover:underline font-medium">
              Details →
            </Link>
          </div>

          <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-slate-900">
                PO #{STORE_17_PURCHASE_ORDER.orderNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-red-100 text-red-800">
                DELAYED
              </span>
            </div>

            <div className="space-y-1 text-slate-600">
              <p><strong>Supplier:</strong> {STORE_17_PURCHASE_ORDER.supplier}</p>
              <p><strong>Inbound Units:</strong> {STORE_17_PURCHASE_ORDER.totalItems} Items</p>
              <p><strong>Revised ETA:</strong> 15:00 Today (I-5 corridor congestion)</p>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              Key Line Items: Baby Spinach (60), Ground Beef (22), Chicken Breast (30).
            </div>
          </div>

          <div className="pt-1">
            <Link
              to="/store/deliveries"
              className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Verify Dock Receiving Schedule</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
