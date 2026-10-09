// ============================================================
// FreshGuard AI — Layout: Royal TopBar
// ============================================================

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Bell, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

const pageTitles: Record<string, { title: string; category: string }> = {
  '/': { title: 'Royal Command Centre', category: 'Executive Operations Briefing' },
  '/network': { title: 'Network Constellation', category: '12 Stores · Inventory Balancing' },
  '/stores/1012': { title: 'Store 017 Investigation', category: 'Tacoma Downtown · Critical Priority' },
  '/investigations': { title: 'Investigation Room', category: 'Causal Graph & Evidence Breakdown' },
  '/decisions': { title: 'Decision Chamber', category: 'Operational Strategies & What-If' },
  '/actions': { title: 'Action Centre', category: 'Human Approval & Execution Governance' },
  '/store-manager': { title: 'Store Manager Workspace', category: 'Daily Operational Directives' },
  '/settings': { title: 'System Settings', category: 'Data Sources & Model Parameters' },
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const meta = getHeaderMeta(location.pathname);

  return (
    <header
      className="flex items-center justify-between px-8 flex-shrink-0 z-20"
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
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block" style={{ width: '280px' }}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A059]/70" />
          <input
            type="text"
            placeholder="Search stores, SKU, evidence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded text-xs pl-9 pr-3 py-2 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/20 focus:border-[#C5A059]/60 focus:outline-none transition-colors placeholder:text-[#8E9B90]/60 font-sans"
          />
        </div>

        {/* Intelligence Mode Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded border border-[#C5A059]/25 bg-[#0A241D]/60 text-xs text-[#E0C588]">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="font-mono text-[11px] tracking-wider">AI ADVISORY: ACTIVE</span>
        </div>

        {/* Refresh Custom Trigger */}
        <button
          className="p-2 rounded border border-[#C5A059]/20 hover:border-[#C5A059]/50 text-[#8E9B90] hover:text-[#E0C588] transition-colors"
          onClick={() => window.dispatchEvent(new CustomEvent('demo:refresh'))}
          title="Refresh operational telemetry"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Executive Profile Badge */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center text-xs font-cinzel text-[#C5A059] font-bold">
            FB
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-[#FDFBF7]">Head Office</p>
            <p className="text-[10px] text-[#8E9B90]">Operations Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}
