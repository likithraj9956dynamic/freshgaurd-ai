// ============================================================
// FreshGuard AI — Layout: Royal Sidebar
// ============================================================

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  Store,
  Search,
  Scale,
  CheckCircle2,
  Smartphone,
  Sliders,
  Menu,
  X,
  ShieldAlert,
  Crown,
  ScanBarcode
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Command Centre', subtitle: 'Executive briefing', icon: Compass, exact: true },
  { path: '/network', label: 'Store Network', subtitle: 'Constellation & transfers', icon: Store },
  { path: '/stores/1012', label: 'Store 017 Dossier', subtitle: 'Featured investigation', icon: ShieldAlert },
  { path: '/investigations', label: 'Investigation Room', subtitle: 'Evidence & graph analysis', icon: Search },
  { path: '/decisions', label: 'Decision Chamber', subtitle: 'Strategy simulation & risk', icon: Scale },
  { path: '/actions', label: 'Action Centre', subtitle: 'Approval governance', icon: CheckCircle2 },
  { path: '/store-manager', label: 'Store Manager', subtitle: 'Daily task list', icon: Smartphone },
  { path: '/product-lookup', label: 'Product Registry', subtitle: 'Barcode & Open Food Facts', icon: ScanBarcode },
  { path: '/settings', label: 'Settings', subtitle: 'System & configuration', icon: Sliders },
];


export function Sidebar({ location }: { location: ReturnType<typeof useLocation> }) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded border border-[#C5A059]/30 bg-[#071C16] text-[#FDFBF7]"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-[#C5A059]" /> : <Menu className="w-5 h-5 text-[#C5A059]" />}
      </button>

      {/* Royal Editorial Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: '#041410',
          borderRight: '1px solid rgba(197, 160, 89, 0.18)',
          boxShadow: '10px 0 30px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header / Brand */}
        <div>
          <div className="px-6 pt-7 pb-6 border-b border-[#C5A059]/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center shadow-inner">
                <Crown className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <span className="font-cinzel text-sm font-bold tracking-wider text-[#FDFBF7] block">
                  FRESHGUARD
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block mt-0.5">
                  ROYAL OPERATIONS
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#8E9B90]">
              <span>NETWORK: FRESHBASKET</span>
              <span className="inline-flex items-center gap-1.5 text-[#E0C588]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                ACTIVE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3.5 px-3.5 py-3 rounded text-left transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0B3B2C]/80 to-[#071C16]/60 border border-[#C5A059]/30 text-[#FDFBF7]'
                      : 'text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/[0.03] border border-transparent'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#C5A059]' : 'text-[#8E9B90] group-hover:text-[#C5A059]'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`text-xs font-medium tracking-wide ${isActive ? 'text-[#FDFBF7]' : 'text-[#D0CDC5]'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#8E9B90] truncate leading-tight mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Editorial Seal */}
        <div className="p-4 mx-3 mb-4 rounded border border-[#C5A059]/20 bg-[#071C16]/80 text-[#8E9B90]">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#C5A059]">
            <span>STORES MONITORED</span>
            <span className="font-semibold text-white">12 SITES</span>
          </div>
          <p className="text-[11px] leading-relaxed mt-2 text-[#8E9B90]/90">
            Automated signals cross-referenced against logistics & wastage records.
          </p>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
