// ============================================================
// FreshGuard AI — Page: Store Dossier & Operational Investigation
// Enterprise Location Surveillance & Diagnostics
// ============================================================

import React, { useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { useAuth } from '../context/AuthContext';
import { LoadingState, EmptyState } from '../components/state';
import { SalesChart } from './StoreOverviewSalesChart';
import {
  TrendingDown,
  AlertTriangle,
  PackageX,
  Truck,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  FileText,
  User,
  Scale,
  Sparkles,
  Info,
  Building2,
  Calendar
} from 'lucide-react';

export function StoreOverviewPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDemos();
  const { user, canAccessStore } = useAuth();

  // Investigation progression stage state (1: What happened?, 2: Evidence, 3: Explanation, 4: Action)
  const [activeStage, setActiveStage] = useState<number>(1);

  if (isLoading) return <LoadingState message="Accessing secure store archives..." />;

  const currentStoreId = storeId || '1012';

  // Data isolation guard: Store Manager can only view their assigned store; Supplier cannot view store dossiers
  if (user && !canAccessStore(currentStoreId)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: `/stores/${currentStoreId}` }} replace />;
  }
  const store = data?.stores?.find((s) => s.id === currentStoreId);
  const issues = data?.issues?.filter((i) => i.storeId === currentStoreId) || [];
  const wastage = currentStoreId === '1012' ? data?.wastage || [] : [];
  const purchaseOrders = currentStoreId === '1012' && data?.purchaseOrder ? [data.purchaseOrder] : [];
  const sales = data?.sales;

  if (!store) {
    return <EmptyState title="Store Not Located" description="The requested franchise location does not exist in network records." />;
  }

  const isStore17 = currentStoreId === '1012';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Enterprise Store Profile Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded border ${
                store.status === 'critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {store.status === 'critical' ? 'Critical Exception Store' : 'Active Location'}
              </span>
              <span className="text-xs font-mono text-slate-500">
                Franchise ID #{store.id} · {store.location.region} ({store.location.city}, {store.location.state})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {store.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600">
              {store.address} · General Manager: <strong className="text-slate-800">{store.managerName}</strong> · Floor Size: {store.totalSquareFootage.toLocaleString()} sq ft ({store.assignedTeamSize} staff)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/investigations/issue-001')}
              className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <span>Investigation Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/decisions/dec-1')}
              className="btn-secondary text-xs px-3.5 py-2"
            >
              Simulate Intervention
            </button>
          </div>
        </div>

        {/* Operational Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">Actual Revenue</span>
            <span className="text-xl font-bold text-slate-900 mt-0.5 block">
              ${store.revenueActual.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">Target: ${store.revenueTarget.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide block">Sales Variance</span>
            <span className="text-xl font-bold text-rose-800 mt-0.5 block">-18%</span>
            <span className="text-[10px] text-rose-600">Past 4-week window</span>
          </div>
          <div className="p-3 rounded bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide block">Wastage Surge</span>
            <span className="text-xl font-bold text-rose-800 mt-0.5 block">+28%</span>
            <span className="text-[10px] text-rose-600">Escalating spoilage</span>
          </div>
          <div className="p-3 rounded bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide block">Stockout Count</span>
            <span className="text-xl font-bold text-amber-900 mt-0.5 block">12 SKU</span>
            <span className="text-[10px] text-amber-700">Fast-moving items</span>
          </div>
        </div>
      </section>

      {/* Progressive Investigation Flow */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Structured Operational Reasoning Flow
          </h2>
          <p className="text-xs text-slate-500">
            Progressive 4-stage root cause diagnosis separating observed evidence from assumptions
          </p>
        </div>

        {/* 4 Interactive Stage Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 border-b border-slate-200 pb-2">
          {[
            { num: 1, title: '1. What Happened?', subtitle: 'Observed Telemetry' },
            { num: 2, title: '2. Available Evidence', subtitle: 'Cross-System Records' },
            { num: 3, title: '3. What Explains It?', subtitle: 'Hypotheses vs Facts' },
            { num: 4, title: '4. Recommended Next Step', subtitle: 'Action Directives' }
          ].map((tab) => (
            <button
              key={tab.num}
              type="button"
              onClick={() => setActiveStage(tab.num)}
              className={`p-3 text-left rounded-lg transition-all border ${
                activeStage === tab.num
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <p className={`text-xs font-semibold ${activeStage === tab.num ? 'text-emerald-800' : 'text-slate-800'}`}>
                {tab.title}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{tab.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Stage Content Panel */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-6">
          
          {/* STAGE 1: What Happened? */}
          {activeStage === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Observed Operational Facts
                </span>
                <h3 className="text-lg font-semibold text-slate-900 pt-1">The 4-Week Anomaly Breakdown</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  Store 017 exhibits a severe disparity between footfall and revenue conversion. Customers continue
                  visiting the store (-5%), yet transactions are down -15% and revenue is down -18%. Shelves in fast-moving
                  produce and dairy are depleted.
                </p>
              </div>

              {/* Chart & Trend Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                {sales && <SalesChart data={sales} />}
                
                <div className="space-y-3">
                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Footfall vs Transaction Gap</span>
                      <span className="text-xs font-mono font-bold text-rose-700">-10% Spread</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      2,090 shoppers entered the store (down only 5% from 2,200), but only 685 completed purchases
                      (down 15% from 806). Customers left without purchasing intended fresh items.
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Concurrent Spoilage Surge</span>
                      <span className="text-xs font-mono font-bold text-rose-700">+28% Spoilage</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      While fast-movers were stocked out, slower-moving organic greens and beef sustained spoilage
                      prior to sale, indicating receiving schedule friction and shelf-rotation breakdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: What Evidence Do We Have? */}
          {activeStage === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Audited Telemetry Records
                </span>
                <h3 className="text-lg font-semibold text-slate-900 pt-1">Cross-System Evidence Repository</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Evidence harvested across POS registers, inventory counts, procurement bills, and store team logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800">PO: CF-10482</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">DELAYED</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Cascade Fresh Delivery Delayed</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Expected arrival Oct 06. Order contained 140 units of fresh dairy, salad greens, and beef. 
                    Delivery arrived 36 hours late with missing items.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800">INVENTORY AUDIT</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">12 STOCKOUTS</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Top Revenue SKUs Depleted</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Organic Baby Spinach, Gallon Whole Milk, Ground Beef 80/20, Artisan Sourdough zero shelf presence
                    during Friday-Sunday peak sales window.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600">WASTAGE RECORDS</span>
                    <span className="text-[10px] font-mono text-amber-700 font-semibold">4 LOGS FILED</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">$46 Weekly Fresh Loss</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Expired produce and bruised greens dumped prematurely; store staff cite erratic delivery cycles.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600">COMPLIANCE AUDIT</span>
                    <span className="text-[10px] font-mono text-blue-700 font-semibold">TEMPERATURE LOGS</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Afternoon Walkthrough Gaps</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Chiller logging omitted on Aug 12-13; refrigeration consistency flag investigated.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: What Might Explain It? */}
          {activeStage === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Causal Hypotheses &amp; Analysis
                </span>
                <h3 className="text-lg font-semibold text-slate-900 pt-1">Separating Fact from Assumption</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We resist jumping to premature single-cause conclusions. While late delivery CF-10482 occurred,
                  it may only account for a portion of the -18% sales decline.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Leading Hypothesis · Confidence 62%
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Availability Gaps from Supplier Delivery Caused Empty Baskets
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Shoppers seeking weekly fresh essentials left the store empty-handed or bought partial baskets
                    at competitors in Tacoma Downtown.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Alternative Hypothesis A
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Store Replenishment Gaps &amp; Stockroom Misplacement
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Staff shortages during peak hours may have left delivered crates unstacked in cold storage.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Alternative Hypothesis B
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Downtown Competitor Promotional Cannibalization
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aggressive rival produce discounting during the same 4-week window could suppress sales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: What Should We Do Next? */}
          {activeStage === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Action Directives
                </span>
                <h3 className="text-lg font-semibold text-slate-900 pt-1">Recommended Tactical Interventions</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Immediate restorative actions requiring head office human sign-off prior to execution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                      Intervention A · Immediate
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">Emergency Inter-Store Stock Transfer</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dispatch refrigerated transfer of 34 units of Baby Spinach and 28 lbs of Chicken from Cedar Hills/Gresham
                      surplus stores. Restores top shelves within 6 hours.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/decisions/dec-1')}
                    className="btn-primary w-full text-xs justify-center"
                  >
                    Simulate &amp; Authorise Transfer
                  </button>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Intervention B · Governance
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">Supplier Escalation with Cascade Fresh</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Issue formal Service Level Agreement (SLA) penalty notice for PO CF-10482 breach and require
                      priority re-route for tomorrow morning.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/actions')}
                    className="btn-secondary w-full text-xs justify-center"
                  >
                    Review In Action Centre
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Wastage & Purchase Order Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Wastage Logs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Wastage Incident Logs</h3>
            <span className="text-xs text-slate-500">{wastage.length} items logged</span>
          </div>

          <div className="space-y-2">
            {wastage.map((item) => (
              <div key={item.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-900">{item.productName}</p>
                  <p className="text-[11px] text-slate-500">{item.department} · {item.wastageReason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-mono font-bold text-rose-700">${item.cost.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-500">{item.wastageWeight} lbs loss</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Procurement Inbound Telemetry</h3>
            <span className="text-xs text-slate-500">Inbound Log</span>
          </div>

          <div className="space-y-2">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-800">{po.orderNumber} · {po.supplier}</span>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">DELAYED</span>
                </div>
                <p className="text-xs text-slate-600">
                  Expected: {new Date(po.expectedDelivery).toLocaleDateString()} · Status: Delayed in transit
                </p>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-xs">
                  <span className="text-slate-500">Notes: {po.notes}</span>
                  <span className="text-slate-900 font-mono font-semibold">${po.totalValue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
