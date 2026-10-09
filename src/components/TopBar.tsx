// ============================================================
// FreshGuard AI — Role-Adaptive Royal TopBar
// ============================================================

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, RefreshCw, Sparkles, Key, LogOut } from 'lucide-react';
import { useAIStore } from '../services/ai-store';
import { useAuth } from '../context/AuthContext';
import { AnnouncementsModal } from './announcements/AnnouncementsModal';

const pageTitles: Record<string, { title: string; category: string }> = {
  // Main Manager
  '/': { title: 'Network Command Centre', category: 'Executive Operations Briefing' },
  '/manager': { title: 'Network Command Centre', category: 'Executive Operations Briefing' },
  '/manager/network': { title: 'Network Constellation', category: '12 Stores · Inventory Balancing' },
  '/manager/stores/1012': { title: 'Store 017 Investigation', category: 'Tacoma Downtown · Critical Priority' },
  '/manager/investigations': { title: 'Investigation Room', category: 'Causal Graph & Evidence Breakdown' },
  '/manager/decisions': { title: 'Decision Chamber', category: 'Operational Strategies & What-If' },
  '/manager/actions': { title: 'Action Centre', category: 'Human Approval & Execution Governance' },
  '/manager/product-lookup': { title: 'Product Registry', category: 'Open Food Facts Telemetry' },
  '/manager/settings': { title: 'System Settings', category: 'Model Parameters & Keys' },

  // Store Manager
  '/store': { title: 'Store 017 Command Centre', category: 'Tacoma Downtown Branch Operations' },
  '/store/tasks': { title: 'Daily Floor Directives', category: 'Floor Task Execution Ledger' },
  '/store/inventory': { title: 'Store Inventory & Expiry', category: 'Low Stock, OOS & Shelf-Life Surveillance' },
  '/store/alerts': { title: 'Wastage & Spoilage Log', category: 'Shrinkage Prevention & Alerts' },
  '/store/deliveries': { title: 'Dock Receiving & Deliveries', category: 'Supplier PO Inbound Schedules' },
  '/store/product-lookup': { title: 'Floor Barcode Scanner', category: 'Open Food Facts Registry' },

  // Supplier
  '/supplier': { title: 'Supplier Dispatch Hub', category: 'Cascade Fresh Distributors Logistics' },
  '/supplier/orders': { title: 'Purchase Orders Ledger', category: 'Active Order Lines & Confirmations' },
  '/supplier/deliveries': { title: 'Delivery Fleet Schedules', category: 'Cold-Chain Telemetry & Dock ETAs' },
  '/supplier/requests': { title: 'Emergency Stock Requests', category: 'Expedited Replenishment Orders' },
};

function getHeaderMeta(pathname: string) {
  if (pageTitles[pathname]) return pageTitles[pathname];
  for (const [key, meta] of Object.entries(pageTitles)) {
    if (key !== '/' && pathname.startsWith(key)) return meta;
  }
  return { title: 'FreshGuard AI', category: 'Operations Intelligence' };
}

export function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, unreadAnnouncementsCount } = useAuth();
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
  const aiStatusLabel = isLiveConnected
    ? `${config.provider === 'gemini' ? 'GEMINI' : 'OPENAI'} LIVE`
    : 'CONFIGURE AI';

  return (
    <>
      <header
        className="flex items-center justify-between px-6 sm:px-8 flex-shrink-0 z-20"
        style={{
          height: '70px',
          backgroundColor: '#041410',
          borderBottom: '1px solid rgba(197, 160, 89, 0.15)',
        }}
      >
        {/* Title & Editorial Breadcrumb */}
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
            {meta.category}
          </span>
          <h1 className="text-xl font-editorial font-normal tracking-wide text-[#FDFBF7] mt-0.5">
            {meta.title}
          </h1>
        </div>

        {/* Center Search & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:block" style={{ width: '250px' }}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A059]/70" />
            <input
              type="text"
              placeholder={role === 'supplier' ? 'Search PO # or SKU...' : 'Search barcode or SKU...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded text-xs pl-9 pr-3 py-2 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/20 focus:border-[#C5A059]/60 focus:outline-none transition-colors placeholder:text-[#8E9B90]/60 font-sans"
            />
          </form>

          {/* Emergency Announcements Trigger */}
          <button
            type="button"
            onClick={() => setIsAnnouncementsOpen(true)}
            className="relative p-2 rounded border border-[#C5A059]/20 hover:border-[#C5A059]/50 text-[#8E9B90] hover:text-[#E0C588] transition-colors"
            title="Emergency Announcements & Cold-Chain Bulletins"
            aria-label="View announcements"
          >
            <Bell className="w-4 h-4" />
            {unreadAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#9E2A2B] text-white text-[9px] font-mono font-bold flex items-center justify-center animate-pulse border border-[#041410]">
                {unreadAnnouncementsCount}
              </span>
            )}
          </button>

          {/* AI Controls for Main Manager */}
          {role === 'main_manager' && (
            <>
              <button
                type="button"
                onClick={openKeyModal}
                className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${
                  isLiveConnected
                    ? 'border-[#16A34A]/40 bg-[#16A34A]/10 text-[#4ADE80] hover:bg-[#16A34A]/20'
                    : 'border-[#C5A059]/30 bg-[#0A241D]/60 text-[#E0C588] hover:border-[#C5A059]/60 hover:bg-[#0A241D]'
                }`}
                title="Configure AI Engine & API Key"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveConnected ? 'bg-[#16A34A] animate-pulse' : 'bg-[#C5A059]'
                  }`}
                />
                <span className="font-mono text-[11px] tracking-wider uppercase">{aiStatusLabel}</span>
                <Key className="w-3 h-3 text-[#C5A059]/70 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={toggleCopilot}
                className="btn-royal-gold text-xs px-3.5 py-1.5 flex items-center gap-1.5 shadow-md group"
                title="Open FreshGuard Executive AI Copilot"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline font-sans font-semibold">Ask Copilot</span>
              </button>
            </>
          )}

          {/* Refresh Custom Trigger */}
          <button
            className="p-2 rounded border border-[#C5A059]/20 hover:border-[#C5A059]/50 text-[#8E9B90] hover:text-[#E0C588] transition-colors"
            onClick={() => window.dispatchEvent(new CustomEvent('demo:refresh'))}
            title="Refresh operational telemetry"
            aria-label="Refresh telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* User Profile Badge & Quick Logout */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
            <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center text-xs font-cinzel text-[#C5A059] font-bold">
              {user?.avatar || 'FB'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-medium text-[#FDFBF7]">{user?.name || 'Operator'}</p>
              <p className="text-[10px] text-[#8E9B90] truncate max-w-[150px]">{user?.title || 'Active'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded hover:bg-white/5 text-[#8E9B90] hover:text-[#F87171] transition-colors ml-1"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Emergency Announcements Modal */}
      <AnnouncementsModal
        isOpen={isAnnouncementsOpen}
        onClose={() => setIsAnnouncementsOpen(false)}
      />
    </>
  );
}
