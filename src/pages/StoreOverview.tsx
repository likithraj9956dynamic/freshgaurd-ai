// ============================================================
// FreshGuard AI — Page: Store 017 Dossier & Cinematic Investigation
// ============================================================

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import { EDITORIAL_IMAGES } from '../assets/images';
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
  Info
} from 'lucide-react';

export function StoreOverviewPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { data, isLoading } = useDemos();

  // Investigation progression stage state (1: What happened?, 2: Evidence, 3: Explanation, 4: Action)
  const [activeStage, setActiveStage] = useState<number>(1);

  if (isLoading) return <LoadingState message="Accessing secure store archives..." />;

  const currentStoreId = storeId || '1012';
  const store = data?.stores?.find((s) => s.id === currentStoreId);
  const issues = data?.issues?.filter((i) => i.storeId === currentStoreId) || [];
  const wastage = currentStoreId === '1012' ? data?.wastage || [] : [];
  const purchaseOrders = currentStoreId === '1012' && data?.purchaseOrder ? [data.purchaseOrder] : [];
  const compliance = currentStoreId === '1012' ? data?.compliance || [] : [];
  const sales = data?.sales;

  if (!store) {
    return <EmptyState title="Store Not Located" description="The requested franchise location does not exist in network records." />;
  }

  const isStore17 = currentStoreId === '1012';

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      
      {/* ============================================================
          CINEMATIC STORE HEADER WITH RETAIL PHOTOGRAPHY ANCHOR
          ============================================================ */}
      <section className="relative rounded border border-[#C5A059]/30 bg-[#071C16] overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Store Editorial Image */}
          <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-full">
            <img
              src={isStore17 ? EDITORIAL_IMAGES.store17Hero : EDITORIAL_IMAGES.marketGreens}
              alt={store.name}
              className="w-full h-full object-cover object-center absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent via-[#071C16]/60 to-[#071C16]" />
            <div className="absolute top-5 left-5">
              <span className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded ${
                store.status === 'critical' ? 'badge-royal-critical' : 'badge-royal-fact'
              }`}>
                {store.status === 'critical' ? 'CRITICAL INCIDENT · DOSSIER #017' : 'FRANCHISE LOCATION'}
              </span>
            </div>
            <div className="absolute bottom-5 left-5 text-xs text-[#E0C588] font-mono">
              OPENED {store.openDate} · {store.totalSquareFootage.toLocaleString()} SQ FT
            </div>
          </div>

          {/* Right: Operational Profile & Headline Metrics */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E9B90]">
                <span>FRANCHISE ID: #{store.id}</span>
                <span className="text-[#C5A059]">{store.location.region} · {store.location.city}, {store.location.state}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
                {store.name}
              </h1>
              <p className="text-sm text-[#8E9B90] font-light leading-relaxed">
                {store.address} · General Manager: <strong className="text-[#FDFBF7] font-medium">{store.managerName}</strong> ({store.assignedTeamSize} staff)
              </p>

              {/* Core Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
                <div className="p-3 rounded border border-white/5 bg-[#0A241D]/60">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">ACTUAL REVENUE</span>
                  <span className="text-xl font-editorial text-[#F87171] mt-0.5 block">
                    ${store.revenueActual.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#8E9B90]">Target: ${store.revenueTarget.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-[#0A241D]/60">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">SALES VARIANCE</span>
                  <span className="text-xl font-editorial text-[#F87171] mt-0.5 block">-18%</span>
                  <span className="text-[10px] text-[#8E9B90]">Past 4-week window</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-[#0A241D]/60">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">WASTAGE SURGE</span>
                  <span className="text-xl font-editorial text-[#F87171] mt-0.5 block">+28%</span>
                  <span className="text-[10px] text-[#8E9B90]">Escalating spoilage</span>
                </div>
                <div className="p-3 rounded border border-white/5 bg-[#0A241D]/60">
                  <span className="text-[10px] font-mono text-[#8E9B90] block">STOCKOUT COUNT</span>
                  <span className="text-xl font-editorial text-[#E0C588] mt-0.5 block">12 SKU</span>
                  <span className="text-[10px] text-[#8E9B90]">Fast-moving items</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => navigate('/investigations/issue-001')}
                className="btn-royal-gold"
              >
                Open Investigation Graph <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/decisions/dec-1')}
                className="btn-royal-outline"
              >
                Simulate Intervention
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          PROGRESSIVE INVESTIGATION FLOW (4 STAGES)
          ============================================================ */}
      <section className="space-y-6">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block">
            STRUCTURED REASONING PROTOCOL
          </span>
          <h2 className="text-2xl sm:text-3xl font-editorial text-[#FDFBF7]">
            Progressive Investigation Flow
          </h2>
        </div>

        {/* 4 Interactive Stage Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 border-b border-[#C5A059]/20 pb-2">
          {[
            { num: 1, title: '1. What Happened?', subtitle: 'Observed Facts' },
            { num: 2, title: '2. Available Evidence', subtitle: 'Cross-system records' },
            { num: 3, title: '3. What Explains It?', subtitle: 'Hypotheses vs Facts' },
            { num: 4, title: '4. What Next?', subtitle: 'Recommended Action' }
          ].map((tab) => (
            <button
              key={tab.num}
              onClick={() => setActiveStage(tab.num)}
              className={`p-3.5 text-left rounded transition-all border ${
                activeStage === tab.num
                  ? 'bg-[#0B3B2C] border-[#C5A059]/60 text-[#FDFBF7] shadow-lg'
                  : 'bg-[#071C16]/50 border-white/5 text-[#8E9B90] hover:bg-[#071C16] hover:text-[#FDFBF7]'
              }`}
            >
              <p className={`text-xs font-semibold ${activeStage === tab.num ? 'text-[#E0C588]' : 'text-[#8E9B90]'}`}>
                {tab.title}
              </p>
              <p className="text-[11px] text-[#8E9B90] mt-0.5">{tab.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Stage Content Panel */}
        <div className="royal-card p-6 sm:p-8 space-y-6">
          
          {/* STAGE 1: What Happened? */}
          {activeStage === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="badge-royal-fact">OBSERVED OPERATIONAL FACTS</span>
                <h3 className="text-2xl font-editorial text-[#FDFBF7]">The 4-Week Anomaly Breakdown</h3>
                <p className="text-sm text-[#8E9B90] leading-relaxed max-w-3xl">
                  Store 017 exhibits a severe disparity between footfall and revenue conversion. Customers continue
                  visiting the store (-5%), yet transactions are down -15% and revenue is down -18%. Shelves in fast-moving
                  produce and dairy are depleted.
                </p>
              </div>

              {/* Chart & Trend Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                {sales && <SalesChart data={sales} />}
                
                <div className="space-y-3">
                  <div className="p-4 rounded border border-white/5 bg-[#071C16]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#E0C588]">FOOTFALL vs TRANSACTION GAP</span>
                      <span className="text-xs font-mono text-[#F87171]">-10% SPREAD</span>
                    </div>
                    <p className="text-xs text-[#8E9B90] mt-2 leading-relaxed">
                      2,090 shoppers entered the store (down only 5% from 2,200), but only 685 completed purchases
                      (down 15% from 806). Customers left without purchasing intended items.
                    </p>
                  </div>

                  <div className="p-4 rounded border border-white/5 bg-[#071C16]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#E0C588]">CONCURRENT SPOILAGE SURGE</span>
                      <span className="text-xs font-mono text-[#F87171]">+28% WASTAGE</span>
                    </div>
                    <p className="text-xs text-[#8E9B90] mt-2 leading-relaxed">
                      While fast-movers were stocked out, slower-moving organic greens and beef sustained spoilage
                      prior to sale, suggesting receiving scheduling or shelf-rotation breakdowns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: What Evidence Do We Have? */}
          {activeStage === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="badge-royal-fact">AUDITED TELEMETRY SOURCES</span>
                <h3 className="text-2xl font-editorial text-[#FDFBF7]">Cross-System Evidence Repository</h3>
                <p className="text-sm text-[#8E9B90] leading-relaxed">
                  Evidence harvested across POS registers, inventory counts, procurement bills, and store team logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delayed PO */}
                <div className="p-4 rounded border border-[#C5A059]/20 bg-[#071C16]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#C5A059]">PURCHASE ORDER: CF-10482</span>
                    <span className="badge-royal-critical">DELAYED</span>
                  </div>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-2">Cascade Fresh Delivery Delayed</h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Expected arrival Oct 06. Order contained 140 units of fresh dairy, salad greens, and beef. 
                    Delivery arrived 36 hours late with missing items.
                  </p>
                </div>

                {/* 12 Fast-Movers Out of Stock */}
                <div className="p-4 rounded border border-[#C5A059]/20 bg-[#071C16]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#C5A059]">INVENTORY AUDIT</span>
                    <span className="badge-royal-critical">12 CRITICAL STOCKOUTS</span>
                  </div>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-2">Top Revenue SKU Depleted</h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Organic Baby Spinach, Gallon Whole Milk, Ground Beef 80/20, Artisan Sourdough zero shelf presence
                    during Friday-Sunday peak sales window.
                  </p>
                </div>

                {/* Spoilage Log */}
                <div className="p-4 rounded border border-white/5 bg-[#071C16]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#8E9B90]">WASTAGE RECORDS</span>
                    <span className="text-xs font-mono text-[#E0C588]">4 LOGS FILED</span>
                  </div>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-2">$46 Weekly Fresh Loss</h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Expired produce and bruised greens dumped prematurely; store staff cite erratic delivery cycles.
                  </p>
                </div>

                {/* Compliance Flag */}
                <div className="p-4 rounded border border-white/5 bg-[#071C16]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#8E9B90]">COMPLIANCE AUDIT</span>
                    <span className="badge-royal-hypothesis">TEMPERATURE LOGS</span>
                  </div>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-2">Afternoon Walkthrough Gaps</h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Chiller logging omitted on Aug 12-13; potential refrigeration consistency issue flagged.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: What Might Explain It? */}
          {activeStage === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="badge-royal-hypothesis">CAUSAL HYPOTHESIS & SCIENTIFIC RESTRAINT</span>
                <h3 className="text-2xl font-editorial text-[#FDFBF7]">Separating Fact from Assumption</h3>
                <p className="text-sm text-[#8E9B90] leading-relaxed">
                  We resist jumping to simplistic single-cause conclusions. While late delivery CF-10482 occurred,
                  it may only account for a portion of the -18% sales decline.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/40">
                  <div className="flex items-center gap-2">
                    <span className="badge-royal-fact">LEADING HYPOTHESIS · CONFIDENCE 62%</span>
                  </div>
                  <h4 className="text-lg font-editorial text-[#FDFBF7] mt-2">
                    Availability Gaps from Supplier Delivery Caused Empty Baskets
                  </h4>
                  <p className="text-xs text-[#8E9B90] mt-1 leading-relaxed">
                    Shoppers seeking weekly fresh essentials left the store empty-handed or bought partial baskets
                    at competitors in Tacoma Downtown.
                  </p>
                </div>

                <div className="p-4 rounded border border-white/10 bg-[#071C16]">
                  <span className="badge-royal-hypothesis">ALTERNATIVE HYPOTHESIS A</span>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-1">
                    Store Replenishment Gaps & Stockroom Misplacement
                  </h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Staff shortages during peak hours may have left delivered crates unstacked in cold storage.
                  </p>
                </div>

                <div className="p-4 rounded border border-white/10 bg-[#071C16]">
                  <span className="badge-royal-hypothesis">ALTERNATIVE HYPOTHESIS B</span>
                  <h4 className="text-base font-editorial text-[#FDFBF7] mt-1">
                    Downtown Competitor Promotional Cannibalization
                  </h4>
                  <p className="text-xs text-[#8E9B90] mt-1">
                    Aggressive rival produce discounting during the same 4-week window could suppress sales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: What Should We Do Next? */}
          {activeStage === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="badge-royal-fact">ACTION DIRECTIVES</span>
                <h3 className="text-2xl font-editorial text-[#FDFBF7]">Recommended Tactical Interventions</h3>
                <p className="text-sm text-[#8E9B90] leading-relaxed">
                  Immediate restorative actions requiring head office human sign-off prior to execution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded border border-[#C5A059]/30 bg-[#071C16] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#C5A059] uppercase">INTERVENTION A · IMMEDIATE</span>
                    <h4 className="text-lg font-editorial text-[#FDFBF7]">Emergency Inter-Store Stock Transfer</h4>
                    <p className="text-xs text-[#8E9B90] leading-relaxed">
                      Dispatch refrigerated transfer of 34 units of Baby Spinach and 28 lbs of Chicken from Cedar Hills/Gresham
                      surplus stores. Restores top shelves within 6 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/decisions/dec-1')}
                    className="btn-royal-gold w-full text-xs justify-center"
                  >
                    Simulate & Authorise Transfer
                  </button>
                </div>

                <div className="p-5 rounded border border-white/10 bg-[#071C16] flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#8E9B90] uppercase">INTERVENTION B · GOVERNANCE</span>
                    <h4 className="text-lg font-editorial text-[#FDFBF7]">Supplier Escalation with Cascade Fresh</h4>
                    <p className="text-xs text-[#8E9B90] leading-relaxed">
                      Issue formal Service Level Agreement (SLA) penalty notice for PO CF-10482 breach and require
                      priority re-route for tomorrow morning.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/actions')}
                    className="btn-royal-outline w-full text-xs justify-center"
                  >
                    Review In Action Centre
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ============================================================
          AUDITED WASTAGE & PURCHASE ORDER RECORDS
          ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Wastage Dossier */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-editorial text-[#FDFBF7]">Wastage Incident Logs</h3>
            <span className="text-xs font-mono text-[#8E9B90]">{wastage.length} items logged</span>
          </div>

          <div className="space-y-2.5">
            {wastage.map((item) => (
              <div key={item.id} className="royal-card p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#FDFBF7]">{item.productName}</p>
                  <p className="text-xs text-[#8E9B90]">{item.department} · {item.wastageReason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-editorial text-[#F87171]">${item.cost.toFixed(2)}</p>
                  <p className="text-[10px] text-[#8E9B90]">{item.wastageWeight} lbs loss</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-editorial text-[#FDFBF7]">Procurement Inbound Telemetry</h3>
            <span className="text-xs font-mono text-[#8E9B90]">Inbound Log</span>
          </div>

          <div className="space-y-2.5">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="royal-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C5A059]">{po.orderNumber} · {po.supplier}</span>
                  <span className="badge-royal-critical">DELAYED</span>
                </div>
                <p className="text-xs text-[#8E9B90]">
                  Expected: {new Date(po.expectedDelivery).toLocaleDateString()} · Status: Delayed in transit
                </p>
                <div className="pt-2 border-t border-white/5 flex justify-between text-xs">
                  <span className="text-[#8E9B90]">Notes: {po.notes}</span>
                  <span className="text-[#E0C588] font-mono">${po.totalValue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
