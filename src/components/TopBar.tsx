// ============================================================
// FreshGuard AI — Enterprise Top Navigation Bar
// ============================================================

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, RefreshCw, Sparkles, Key, UserCheck } from 'lucide-react';
import { useAIStore } from '../services/ai-store';
import { useAuth } from '../context/AuthContext';
import { AnnouncementsModal } from './announcements/AnnouncementsModal';

const pageMeta: Record<string, { title: string; category: string }> = {
  // Main Manager
  '/': { title: 'Operations Overview', category: 'Executive Briefing' },
  '/manager': { title: 'Operations Overview', category: 'Network Briefing' },
  '/manager/network': { title: 'Store Network', category: '12 Regional Branches' },
  '/manager/stores/1012': { title: 'Store 017 Investigation', category: 'Tacoma Downtown Branch' },
  '/manager/investigations': { title: 'AI Investigations', category: 'Causal Root Analysis' },
  '/manager/decisions': { title: 'Decision Chamber', category: 'Strategy Simulation' },
  '/manager/actions': { title: 'Action Governance', category: 'Approvals Ledger' },
  '/manager/product-lookup': { title: 'Product Registry', category: 'Open Food Facts Telemetry' },
  '/manager/settings': { title: 'System Settings', category: 'Configurations & Model Keys' },

  // Store Manager
  '/store': { title: 'Store Overview', category: 'Branch #017 (Tacoma)' },
  '/store/tasks': { title: 'Daily Tasks Ledger', category: 'Floor Directives' },
  '/store/inventory': { title: 'Inventory & Expiry', category: 'Shelf-Life Surveillance' },
  '/store/alerts': { title: 'Wastage & Spoilage', category: 'Shrinkage Logs' },
  '/store/deliveries': { title: 'Inbound Deliveries', category: 'Carrier Dock Receiving' },
  '/store/product-lookup': { title: 'Product Registry', category: 'Barcode Audit' },

  // Supplier
  '/supplier': { title: 'Logistics Overview', category: 'Cascade Fresh Distributors' },
  '/supplier/orders': { title: 'Purchase Orders', category: 'Order Reconciliation' },
  '/supplier/deliveries': { title: 'Delivery Schedules', category: 'Fleet Schedules & Telemetry' },
  '/supplier/requests': { title: 'Emergency Requests', category: 'Expedited Stock Directives' },
};

function getHeaderMeta(pathname: string) {
  if (pageMeta[pathname]) return pageMeta[pathname];
  for (const [key, meta] of Object.entries(pageMeta)) {
    if (key !== '/' && pathname.startsWith(key)) return meta;
  }
  return { title: 'Retail Operations Platform', category: 'FreshGuard AI' };
}

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, unreadAnnouncementsCount } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);

  const meta = getHeaderMeta(location.pathname);
  const { config, openKeyModal, toggleCopilot } = useAIStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (role === 'supplier') {
      navigate(`/supplier/orders?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      const target = role === 'store_manager' ? '/store/product-lookup' : '/manager/product-lookup';
      navigate(`${target}?barcode=${encodeURIComponent(searchQuery.trim())}`);
    }
    setSearchQuery('');
  };

  const isLiveConnected = Boolean(config.apiKey?.trim());

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-20">
        
        {/* Page Title & Breadcrumb */}
        <div>
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {meta.category}
          </span>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight">
            {meta.title}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-56 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={role === 'supplier' ? 'Search PO # or item...' : 'Search barcode or SKU...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 rounded-md bg-slate-50 text-slate-900 border border-slate-300 focus:bg-white focus:border-[#164e3d] focus:outline-none transition-colors"
            />
          </form>

          {/* Announcements Alert Bell */}
          <button
            type="button"
            onClick={() => setIsAnnouncementsOpen(true)}
            className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Emergency Announcements & Operational Bulletins"
            aria-label="View announcements"
          >
            <Bell className="w-4 h-4" />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* Operations AI Copilot Button */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCopilot}
              className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5"
              title="AI Operations Assistant"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Operations AI</span>
            </button>
          </div>

          {/* Data Refresh */}
          <button
            className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            onClick={() => window.dispatchEvent(new CustomEvent('demo:refresh'))}
            title="Refresh Operational Telemetry"
            aria-label="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#164e3d] text-white font-medium text-xs flex items-center justify-center">
              {user?.avatar || 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-medium text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{user?.title}</p>
            </div>
          </div>

        </div>
      </header>

      {/* Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />
    </>
  );
}
