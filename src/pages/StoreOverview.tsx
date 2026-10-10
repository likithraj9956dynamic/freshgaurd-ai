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

  const currentStoreId = storeId || data?.stores?.[0]?.id || 'FB-01';

  // Data isolation guard: Store Manager can only view their assigned store; Supplier cannot view store dossiers
  if (user && !canAccessStore(currentStoreId)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: `/stores/${currentStoreId}` }} replace />;
  }
  const store = data?.stores?.find((s) => s.id === currentStoreId);
  const issues = data?.issues?.filter((i) => i.storeId === currentStoreId) || [];
  const wastage = data?.wastage?.filter?.((w: any) => w.storeId === currentStoreId || !w.storeId) || data?.wastage || [];
  const purchaseOrders = data?.purchaseOrder ? [data.purchaseOrder].filter((po: any) => po.storeId === currentStoreId || !po.storeId) : [];
  const sales = data?.sales;

  if (!store) {
    return <EmptyState title="Store Not Located" description="The requested franchise location does not exist in network records." />;
  }

  const revenueVariance = store.revenueTarget > 0
    ? Math.round(((store.revenueActual - store.revenueTarget) / store.revenueTarget) * 100)
    : 0;
  const isCriticalOrAtRisk = store.status === 'critical' || store.status === 'at-risk' || revenueVariance < -10;
  const wastageSurge = isCriticalOrAtRisk ? '+28%' : store.status === 'warning' ? '+14%' : '+2.4%';
  const stockoutCount = isCriticalOrAtRisk ? '12 SKU' : store.status === 'warning' ? '5 SKU' : '1 SKU';
  const baselineFootfall = Math.round(store.totalSquareFootage * 0.08);
  const currentFootfall = isCriticalOrAtRisk ? Math.round(baselineFootfall * 0.95) : baselineFootfall;
  const completedPurchases = isCriticalOrAtRisk ? Math.round(baselineFootfall * 0.33) : Math.round(baselineFootfall * 0.42);

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
          <div className={`p-3 rounded border ${revenueVariance < 0 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wide block ${revenueVariance < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>Sales Variance</span>
            <span className={`text-xl font-bold mt-0.5 block ${revenueVariance < 0 ? 'text-rose-800' : 'text-emerald-800'}`}>
              {revenueVariance > 0 ? `+${revenueVariance}%` : `${revenueVariance}%`}
            </span>
            <span className={`text-[10px] ${revenueVariance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>Past 4-week window</span>
          </div>
          <div className={`p-3 rounded border ${isCriticalOrAtRisk ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wide block ${isCriticalOrAtRisk ? 'text-rose-700' : 'text-slate-600'}`}>Wastage Rate</span>
            <span className={`text-xl font-bold mt-0.5 block ${isCriticalOrAtRisk ? 'text-rose-800' : 'text-slate-800'}`}>{wastageSurge}</span>
            <span className={`text-[10px] ${isCriticalOrAtRisk ? 'text-rose-600' : 'text-slate-500'}`}>{isCriticalOrAtRisk ? 'Escalating spoilage' : 'Baseline tolerance'}</span>
          </div>
          <div className={`p-3 rounded border ${isCriticalOrAtRisk ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-[11px] font-semibold uppercase tracking-wide block ${isCriticalOrAtRisk ? 'text-amber-800' : 'text-slate-600'}`}>Stockout Count</span>
            <span className={`text-xl font-bold mt-0.5 block ${isCriticalOrAtRisk ? 'text-amber-900' : 'text-slate-800'}`}>{stockoutCount}</span>
            <span className={`text-[10px] ${isCriticalOrAtRisk ? 'text-amber-700' : 'text-slate-500'}`}>{isCriticalOrAtRisk ? 'Fast-moving items' : 'Standard buffer'}</span>
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
                <h3 className="text-lg font-semibold text-slate-900 pt-1">
                  {store.name} Operational Anomaly Breakdown
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {isCriticalOrAtRisk
                    ? `${store.name} exhibits an operational disparity in the ${store.location.area} branch. While store footfall remains active (~${currentFootfall.toLocaleString()} shoppers), transaction conversion is depressed and revenue is tracking at ${revenueVariance}% (${store.revenueActual.toLocaleString()} actual vs ${store.revenueTarget.toLocaleString()} target). Core fresh categories require inventory replenishment.`
                    : `${store.name} (${store.id}) is operating within steady baseline operational parameters in the ${store.location.area} cluster. Revenue variance is tracking at ${revenueVariance}% ($${store.revenueActual.toLocaleString()} vs budget of $${store.revenueTarget.toLocaleString()}) with normal shelf inventory velocity.`
                  }
                </p>
              </div>

              {/* Chart & Trend Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
                {sales && <SalesChart data={sales} />}
                
                <div className="space-y-3">
                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Footfall vs Transaction Spread</span>
                      <span className={`text-xs font-mono font-bold ${isCriticalOrAtRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {isCriticalOrAtRisk ? '-10% Spread' : 'Nominal (Balanced)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {isCriticalOrAtRisk
                        ? `${currentFootfall.toLocaleString()} shoppers entered the ${store.name} store, but only ${completedPurchases.toLocaleString()} completed full purchases due to stockout depletion in perishable lines.`
                        : `${currentFootfall.toLocaleString()} shoppers entered ${store.name}, with ${completedPurchases.toLocaleString()} completed checkouts matching anticipated basket sizes for this location.`
                      }
                    </p>
                  </div>

                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Wastage &amp; Fresh Loss Rate</span>
                      <span className={`text-xs font-mono font-bold ${isCriticalOrAtRisk ? 'text-rose-700' : 'text-emerald-700'}`}>
                        {wastageSurge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {isCriticalOrAtRisk
                        ? `While high-velocity items were depleted, slower-moving fresh greens sustained spoilage prior to sale, indicating receiving schedule friction and shelf-rotation breakdowns in the ${store.location.area} branch.`
                        : `Wastage is tracking within healthy tolerance across dairy, bakery, and produce sections for ${store.name}.`
                      }
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
                  {isCriticalOrAtRisk
                    ? `Diagnostic protocol for ${store.name}. While localized logistics disruptions occurred, root cause assessment examines both fulfilment velocity and in-store merchandising.`
                    : `Baseline diagnostic protocol for ${store.name}. Telemetry indicates stable operations with minimal disruption across fresh categories.`
                  }
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Leading Hypothesis · Confidence {isCriticalOrAtRisk ? '64%' : '91%'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    {isCriticalOrAtRisk
                      ? `Availability Gaps from Inbound Route Impacted ${store.name}`
                      : `Normal Replenishment Velocity Maintained at ${store.name}`
                    }
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {isCriticalOrAtRisk
                      ? `Shoppers seeking weekly essentials at ${store.name} in ${store.location.area} encountered stockouts in fast-moving items, impacting overall basket size.`
                      : `Inventory turnover and replenishment cycles in ${store.location.area} are meeting demand forecasts.`
                    }
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Alternative Hypothesis A
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Store Replenishment Gaps &amp; Stockroom Staging
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Peak-hour store staffing allocation in {store.location.area} may impact shelf restocking velocity during high footfall periods.
                  </p>
                </div>

                <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Alternative Hypothesis B
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Regional Micro-Market Promotional Shifts
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Rival retail promotions in the {store.location.area} market corridor may influence peripheral produce category shopping patterns.
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
                  Immediate restorative actions requiring head office human sign-off prior to execution for {store.name}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                      Intervention A · Immediate
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">Inter-Store Stock Balancing</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Dispatch balanced transfer of surplus produce from adjacent network branches to {store.name}. Restores core display shelves within 6 hours.
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
                    <h4 className="text-sm font-semibold text-slate-900">Supplier Fulfilment Verification</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Issue route performance notification for deliveries servicing {store.name} ({store.location.area}) and confirm next intake schedule.
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
            {purchaseOrders.map((po: any) => (
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
