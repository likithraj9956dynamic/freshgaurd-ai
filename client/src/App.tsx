import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/layout/Sidebar';
import { MorningBriefingBanner } from './components/dashboard/MorningBriefingBanner';
import { MetricCardsGrid } from './components/dashboard/MetricCardsGrid';
import { UrgencyStoreList } from './components/dashboard/UrgencyStoreList';
import { NetworkSalesWidget } from './components/dashboard/NetworkSalesWidget';
import { SignalsVerifyWidget } from './components/dashboard/SignalsVerifyWidget';
import { AccessManagementView } from './components/dashboard/AccessManagementView';
import { AuthModal } from './components/auth/AuthModal';
import { AuthService, UserProfile } from './services/auth.service';
import {
  Radio,
  CheckSquare,
  HelpCircle,
  FileText,
  ShieldCheck,
  Users,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [approvalsCount, setApprovalsCount] = useState(2);
  const [lastRefreshed, setLastRefreshed] = useState('08:42 IST');
  const [selectedStoreDetail, setSelectedStoreDetail] = useState<string | null>(null);

  // User Auth & Modal state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<'signin' | 'store' | 'supplier' | 'manager'>('signin');

  useEffect(() => {
    // Load current logged in user profile on start
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
    setActiveTab('overview');
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
        {/* 1. OVERVIEW / COMMAND CENTER */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-7xl mx-auto">
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

        {/* 2. STORE SIGNALS TAB */}
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

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500">Revenue Trajectory (R)</p>
                  <p className="text-xl font-extrabold text-red-600 mt-1">-18.0% contraction</p>
                  <p className="text-xs text-slate-400 mt-1">vs 14-day comparison baseline</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500">Shelf Stockout Rate (S)</p>
                  <p className="text-xl font-extrabold text-red-600 mt-1">40% Below Buffer</p>
                  <p className="text-xs text-slate-400 mt-1">4 high-velocity staples at 0 stock</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500">Supplier Friction (C)</p>
                  <p className="text-xl font-extrabold text-amber-600 mt-1">PO 4821 Overdue</p>
                  <p className="text-xs text-slate-400 mt-1">Nordic Coast Logistics delay (3 days)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. APPROVALS TAB */}
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

        {/* 4. EVIDENCE Q&A TAB */}
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

        {/* 5. AUDIT TRAIL TAB */}
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

        {/* 6. USER ACCESS MANAGEMENT TAB (MAIN MANAGERS) */}
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
