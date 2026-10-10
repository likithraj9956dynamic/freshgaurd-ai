import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/layout/Sidebar';
import { MorningBriefingBanner } from './components/dashboard/MorningBriefingBanner';
import { MetricCardsGrid } from './components/dashboard/MetricCardsGrid';
import { UrgencyStoreList } from './components/dashboard/UrgencyStoreList';
import { NetworkSalesWidget } from './components/dashboard/NetworkSalesWidget';
import { SignalsVerifyWidget } from './components/dashboard/SignalsVerifyWidget';
import { AccessManagementView } from './components/dashboard/AccessManagementView';
import { StoreManagerDashboard, StoreUpdateItem } from './components/dashboard/StoreManagerDashboard';
import { SupplierDashboard, SupplierUpdateItem } from './components/dashboard/SupplierDashboard';
import { LoginView } from './components/dashboard/LoginView';
import { AuthModal } from './components/auth/AuthModal';
import { AuthService, UserProfile } from './services/auth.service';
import {
  Radio,
  CheckSquare,
  HelpCircle,
  FileText,
  ShieldCheck,
  Users,
  Store,
  Truck,
  AlertCircle,
  Bell,
  CheckCircle2,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [approvalsCount, setApprovalsCount] = useState(2);
  const [lastRefreshed, setLastRefreshed] = useState('08:42 IST');
  const [selectedStoreDetail, setSelectedStoreDetail] = useState<string | null>(null);

  // User Auth & Role State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<'signin' | 'store' | 'supplier' | 'manager'>('signin');

  // Real-Time Operations State (Synced between Store Managers, Suppliers & Superadmin)
  const [storeUpdates, setStoreUpdates] = useState<StoreUpdateItem[]>([
    {
      id: 'SU_INIT_1',
      storeId: 'STORE_17',
      storeName: 'Store 17 · Indiranagar',
      type: 'Stock Reorder',
      title: 'PO 4821 Overdue - Organic Leafy Greens stock low',
      urgency: 'HIGH',
      details: 'Stockout risk expected before 11:30 AM delivery window.',
      submittedBy: 'Rahul Verma (Store Manager)',
      createdAt: '08:15 IST',
    }
  ]);

  const [supplierUpdates, setSupplierUpdates] = useState<SupplierUpdateItem[]>([
    {
      id: 'SUP_INIT_1',
      poNumber: 'PO 4821',
      supplierName: 'Nordic Coast Fresh Produce Ltd',
      updateType: 'Dispatch ETA',
      status: 'IN_TRANSIT',
      eta: 'Today, 11:30 AM IST',
      details: 'Refrigerated transit truck en route to Indiranagar Hub.',
      submittedAt: '08:30 IST',
    }
  ]);

  useEffect(() => {
    AuthService.getMe().then((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
  }, []);

  const handleManualRefresh = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setLastRefreshed(timeStr);
  };

  const handleAddStoreUpdate = (newUpdate: StoreUpdateItem) => {
    setStoreUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleAddSupplierUpdate = (newUpdate: SupplierUpdateItem) => {
    setSupplierUpdates((prev) => [newUpdate, ...prev]);
  };

  const handleCardNavigation = (cardId: string) => {
    if (cardId === 'stores-attention' || cardId === 'at-risk-sales') {
      setActiveTab('signals');
    } else if (cardId === 'open-reviews') {
      setActiveTab('approvals');
    } else if (cardId === 'task-completion') {
      setActiveTab('signals');
    }
  };

  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreDetail(storeId);
    setActiveTab('signals');
  };

  const handleOpenAuth = (tab: 'signin' | 'store' | 'supplier' | 'manager' = 'signin') => {
    setInitialAuthTab(tab);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setActiveTab('login-view');
  };

  const handleLoginSuccess = (role: 'MAIN_MANAGER' | 'STORE_MANAGER' | 'SUPPLIER', user?: any) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser({
        id: `demo_${Date.now()}`,
        fullName: role === 'MAIN_MANAGER' ? 'Kavitha Menon' : role === 'STORE_MANAGER' ? 'Rahul Verma' : 'Jane Smith',
        email: `${role.toLowerCase()}@freshguard.ai`,
        role: role,
        status: 'APPROVED',
      });
    }

    if (role === 'STORE_MANAGER') {
      setActiveTab('store-mgr');
    } else if (role === 'SUPPLIER') {
      setActiveTab('supplier');
    } else {
      setActiveTab('overview');
    }
  };

  return (
    <>
      <AppShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        approvalsCount={approvalsCount}
        lastRefreshed={lastRefreshed}
        onRefresh={handleManualRefresh}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('signin')}
        onLogout={handleLogout}
      >
        {/* 1. SUPERADMIN OVERVIEW / COMMAND CENTER */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            
            {/* Live Feed Banner for Store & Supplier Submissions */}
            {(storeUpdates.length > 1 || supplierUpdates.length > 1) && (
              <div className="p-4 rounded-2xl bg-emerald-950 text-white border border-emerald-500/40 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-300">Live Network Field Updates Synced</h4>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Latest Store Request: <strong>{storeUpdates[0]?.title}</strong> • Supplier Status: <strong>{supplierUpdates[0]?.poNumber} ({supplierUpdates[0]?.status})</strong>
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('signals')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    View Signals Matrix
                  </button>
                </div>
              </div>
            )}

            {/* Morning Briefing Hero Banner */}
            <MorningBriefingBanner
              onExploreStore17={() => handleStoreSelect('STORE_17')}
              onReviewApprovals={() => setActiveTab('approvals')}
            />

            {/* Metric Cards Grid (4 Columns) */}
            <MetricCardsGrid onCardClick={handleCardNavigation} />

            {/* Lower Section: 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Urgency-Ranked Stores List (7 Cols) */}
              <div className="lg:col-span-7">
                <UrgencyStoreList
                  onSelectStore={handleStoreSelect}
                  onViewAllStores={() => setActiveTab('signals')}
                />
              </div>

              {/* Right: Network Sales Trend + Signals to Verify (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <NetworkSalesWidget />
                <SignalsVerifyWidget onSignalClick={(sig) => handleStoreSelect('STORE_23')} />
              </div>
            </div>
          </div>
        )}

        {/* 2. STORE MANAGER DASHBOARD */}
        {activeTab === 'store-mgr' && (
          <StoreManagerDashboard
            onAddStoreUpdate={handleAddStoreUpdate}
            submittedUpdates={storeUpdates}
          />
        )}

        {/* 3. SUPPLIER DASHBOARD */}
        {activeTab === 'supplier' && (
          <SupplierDashboard
            onAddSupplierUpdate={handleAddSupplierUpdate}
            submittedUpdates={supplierUpdates}
          />
        )}

        {/* 4. DEDICATED LOGIN / ROLE SWITCHER PAGE */}
        {activeTab === 'login-view' && (
          <LoginView onLoginSuccess={handleLoginSuccess} />
        )}

        {/* 5. STORE SIGNALS TAB */}
        {activeTab === 'signals' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Store Signals & Multi-Factor Urgency Matrix
                    </h2>
                    <p className="text-xs text-slate-500">
                      Calculated using U = 0.35R + 0.25W + 0.25S + 0.15C with critical stockout overrides.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold">
                  STORE 17 (URGENCY 92.5 - CRITICAL)
                </span>
              </div>

              {/* Dynamic Submissions Feed */}
              <div className="mt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Field Inputs Received</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Store Updates Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span>Recent Store Manager Requests</span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {storeUpdates.length} Submitted
                      </span>
                    </div>
                    {storeUpdates.slice(0, 3).map((up) => (
                      <div key={up.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-800">{up.storeName} • {up.type}</div>
                        <p className="text-[11px] text-slate-600">{up.details}</p>
                      </div>
                    ))}
                  </div>

                  {/* Supplier Updates Card */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <Truck className="w-4 h-4 text-teal-700" />
                        <span>Supplier Dispatch Stream</span>
                      </span>
                      <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full">
                        {supplierUpdates.length} Live Updates
                      </span>
                    </div>
                    {supplierUpdates.slice(0, 3).map((sup) => (
                      <div key={sup.id} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="font-bold text-slate-800">{sup.poNumber} ({sup.supplierName})</div>
                        <p className="text-[11px] text-slate-600">Status: {sup.status} • ETA: {sup.eta}</p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. APPROVALS TAB */}
        {activeTab === 'approvals' && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Human Review Queue ({approvalsCount} Actions Pending)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Actions are strictly gated by human sign-off before operational execution.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        HIGH URGENCY
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        Store 17: Apply 25% Near-Expiry Markdown on Perishable Produce & Dairy
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Estimated avoid loss: $123.20 discard spoilage · Net ROI: +$526.04 recovered revenue.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        alert('Action approved! State transitioned to executing.');
                        setApprovalsCount((c) => Math.max(0, c - 1));
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                    >
                      Approve & Execute
                    </button>
                    <button
                      onClick={() => {
                        alert('Action rejected.');
                        setApprovalsCount((c) => Math.max(0, c - 1));
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. EVIDENCE Q&A TAB */}
        {activeTab === 'qa' && (
          <div className="max-w-7xl mx-auto p-6 rounded-2xl bg-white border border-surface-border shadow-card">
            <div className="flex items-center space-x-3 text-slate-900 font-bold text-lg pb-4 border-b border-slate-100">
              <HelpCircle className="w-5 h-5 text-brand-600" />
              <span>Evidence Q&A Assistant</span>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Ask natural language questions about store inventory, sales, wastage logs, and supplier delivery delays. Every response is grounded in verified telemetry with zero SQL injection risk.
            </p>
          </div>
        )}

        {/* 8. AUDIT TRAIL TAB */}
        {activeTab === 'audit' && (
          <div className="max-w-7xl mx-auto p-6 rounded-2xl bg-white border border-surface-border shadow-card">
            <div className="flex items-center space-x-3 text-slate-900 font-bold text-lg pb-4 border-b border-slate-100">
              <FileText className="w-5 h-5 text-slate-600" />
              <span>Immutable Operations Audit Trail</span>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Complete chronological record of all proposed actions, human approvals, simulation runs, and store task dispatches.
            </p>
          </div>
        )}

        {/* 9. USER ACCESS MANAGEMENT TAB (MAIN MANAGERS) */}
        {activeTab === 'access' && (
          <AccessManagementView />
        )}
      </AppShell>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={initialAuthTab}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
}

export default App;
