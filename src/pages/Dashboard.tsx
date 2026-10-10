// ============================================================
// FreshGuard AI — Main Manager: Operations Overview
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemos } from '../hooks/useDemos';
import { LoadingState, EmptyState } from '../components/state';
import type { Store, DetectedIssue, Investigation, DecisionOption, Action } from '../types';
import { MlIntelligenceCard } from '../components/MlIntelligenceCard';
import {
  AlertTriangle,
  Store as StoreIcon,
  Search,
  Scale,
  CheckCircle2,
  Sliders,
  ArrowRight,
  TrendingDown,
  Layers,
  Flame,
  Truck,
  Check,
  X,
  Megaphone,
  ScanBarcode,
  Clock,
  ShieldAlert,
  UserCheck,
  Users
} from 'lucide-react';

export function DashboardPage() {
  const { data, isLoading } = useDemos();
  const navigate = useNavigate();

  // Local state for actions approval demo
  const [actionList, setActionList] = useState<Action[]>([]);
  const [approvalFeedback, setApprovalFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    if (data?.actions) {
      setActionList(data.actions);
    }
  }, [data]);

  if (isLoading) {
    return <LoadingState message="Loading network operations telemetry..." />;
  }

  if (!data) {
    return <EmptyState title="Unavailable" description="Network operational data could not be loaded." />;
  }

  const stores: Store[] = data.stores || [];
  const issues: DetectedIssue[] = data.issues || [];
  const decisions: DecisionOption[] = data.decisions || [];

  // Operational metrics
  const attentionStores = stores.filter((s) => s.status === 'critical' || s.status === 'at-risk');
  const criticalIssues = issues.filter((i) => i.severity === 'critical');
  const pendingActions = actionList.filter((a) => a.status === 'pending-approval');

  const handleApproveAction = (actionId: string, title: string) => {
    setActionList((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'approved' as const } : a))
    );
    setApprovalFeedback(`Action "${title}" approved. Dispatched to store execution ledger.`);
    setTimeout(() => setApprovalFeedback(null), 4000);
  };

  const handleRejectAction = (actionId: string, title: string) => {
    setActionList((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'rejected' as const } : a))
    );
    setApprovalFeedback(`Action "${title}" rejected by Main Operations Manager.`);
    setTimeout(() => setApprovalFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Period Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Operations Overview
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Network Operations · FreshBasket Retail Pacific Northwest · Reporting Period: Today, Oct 10, 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/manager/access-management"
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User Access & Approvals</span>
          </Link>
          <Link
            to="/manager/stores/FB-17"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Inspect FB-17 Marathahalli (Critical)</span>
          </Link>
        </div>
      </div>

      {/* 2. Operational Summary Banner */}
      <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/70 text-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-slate-900 block">
              Operational Priority Alert: 2 of 25 Stores Require Intervention
            </span>
            <p className="text-slate-600 leading-relaxed">
              FB-17 (Marathahalli) has 12 out-of-stock products, delayed supplier delivery, and a -17.95% sales decline. FB-03 (Banashankari) shows abnormal dairy shrinkage.
            </p>
          </div>
        </div>

        <Link
          to="/manager/investigations"
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 flex-shrink-0 whitespace-nowrap"
        >
          <span>View AI Root Cause Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {approvalFeedback && (
        <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{approvalFeedback}</span>
        </div>
      )}

      {/* 3. Essential Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Stores Requiring Attention</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              {attentionStores.length} Stores
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {attentionStores.length} <span className="text-xs font-normal text-slate-500">/ {stores.length} total</span>
          </div>
          <p className="text-[11px] text-slate-500">
            FB-17 (Critical) &amp; FB-03 (At-Risk)
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Products Below Par (OOS)</span>
            <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              18 SKUs
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            18 <span className="text-xs font-normal text-slate-500">SKUs network-wide</span>
          </div>
          <p className="text-[11px] text-slate-500">
            12 concentrated in produce &amp; poultry at FB-17 Marathahalli
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">High-Priority Alerts</span>
            <span className="text-red-700 font-semibold text-[11px] bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              {criticalIssues.length} Critical
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {criticalIssues.length} <span className="text-xs font-normal text-slate-500">Active</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Stockout surge, carrier delay &amp; wastage spike
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Fresh-Food Wastage Trend</span>
            <span className="text-slate-600 font-semibold text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
              Weekly
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-1">
            +4.2% <span className="text-xs font-normal text-slate-500">vs target</span>
          </div>
          <p className="text-[11px] text-slate-500">
            +28% localized increase at Marathahalli branch
          </p>
        </div>

      </div>

      {/* 3b. Machine Learning Perishable Intelligence Engine (Trained Models) */}
      <MlIntelligenceCard />

      {/* 4. Priority Issues Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Priority Operational Issues
            </h2>
            <p className="text-xs text-slate-500">
              Ranked exceptions requiring manager intervention across the 12-store network
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {issues.length} Recorded Issues
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Store</th>
                <th>Issue Summary</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Recommended Next Step</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => {
                const isCrit = issue.severity === 'critical';
                const isWarn = issue.severity === 'warning';
                const storeObj = stores.find((s) => s.id === issue.storeId);

                return (
                  <tr key={issue.id}>
                    <td className="font-medium text-slate-900">
                      <div>{storeObj?.name || `Store #${issue.storeId}`}</div>
                      <div className="text-[11px] text-slate-500">{storeObj?.location.city}, {storeObj?.location.state}</div>
                    </td>
                    <td>
                      <div className="font-medium text-slate-800">{issue.title}</div>
                      <div className="text-xs text-slate-500">{issue.description}</div>
                    </td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          isCrit
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 capitalize">
                        {issue.status}
                      </span>
                    </td>
                    <td className="text-slate-700">
                      {issue.recommendedNextStep || 'Review store inventory and contact supplier.'}
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/manager/stores/${issue.storeId}`}
                        className="text-xs text-[#164e3d] hover:underline font-medium"
                      >
                        Inspect Store →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pending Operational Approvals (Governance) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Operational Approvals Required ({pendingActions.length})
            </h2>
            <p className="text-xs text-slate-500">
              Actions proposed by AI intelligence engine awaiting human manager authorization
            </p>
          </div>
          <Link to="/manager/actions" className="text-xs text-[#164e3d] hover:underline font-medium">
            Full Governance Ledger →
          </Link>
        </div>

        <div className="p-4 divide-y divide-slate-100">
          {actionList.slice(0, 3).map((act) => {
            const isPending = act.status === 'pending-approval';
            return (
              <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{act.title}</span>
                    <span className="text-slate-500">· {act.storeName}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                      act.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      act.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{act.description}</p>
                  <p className="text-[11px] text-slate-500">
                    <strong>Evidence:</strong> {act.evidenceSummary} · <strong>Expected Savings:</strong> ${act.estimatedSavings}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApproveAction(act.id, act.title)}
                        className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectAction(act.id, act.title)}
                        className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 text-red-700 hover:text-red-800"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-slate-500 font-mono text-[11px]">
                      Decision Logged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. User Access Management Summary (Security & Governance) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#164e3d] text-white flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                User Access & Role Governance
              </h2>
              <p className="text-xs text-slate-500">
                Review pending applicant registrations and authorize store and supplier roles
              </p>
            </div>
          </div>
          <Link
            to="/manager/access-management"
            className="btn-primary text-xs flex items-center gap-1"
          >
            <span>Review Access Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 block text-[11px]">Pending Reviews</span>
              <span className="text-base font-bold text-amber-700">2 Requests</span>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 block text-[11px]">Authorized Directory</span>
              <span className="text-base font-bold text-slate-900">3 Users Active</span>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 block text-[11px]">Role Validation</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Backend Enforced
              </span>
            </div>
          </div>
          <p className="text-slate-500 max-w-sm text-[11px] leading-relaxed">
            Main Managers have sole authority to grant branch and supplier access across the FreshBasket network.
          </p>
        </div>
      </div>

      {/* 6. Quick Access Navigation Modules */}
      <div>
        <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">
          Operations Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/manager/network"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <StoreIcon className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">Store Network</span>
            <span className="text-[10px] text-slate-500 block">12 Branches</span>
          </Link>

          <Link
            to="/manager/investigations"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <Search className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">AI Investigations</span>
            <span className="text-[10px] text-slate-500 block">Causal Graph</span>
          </Link>

          <Link
            to="/manager/decisions"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <Scale className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">Decision Chamber</span>
            <span className="text-[10px] text-slate-500 block">Simulations</span>
          </Link>

          <Link
            to="/manager/actions"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <CheckCircle2 className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">Action Center</span>
            <span className="text-[10px] text-slate-500 block">Approvals</span>
          </Link>

          <Link
            to="/manager/product-lookup"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <ScanBarcode className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">Product Registry</span>
            <span className="text-[10px] text-slate-500 block">Barcodes</span>
          </Link>

          <Link
            to="/manager/settings"
            className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-[#164e3d] hover:bg-slate-50 transition-colors text-center group"
          >
            <Sliders className="w-5 h-5 mx-auto text-slate-600 group-hover:text-[#164e3d] mb-1.5" />
            <span className="text-xs font-medium text-slate-800 block">Settings</span>
            <span className="text-[10px] text-slate-500 block">Configuration</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
