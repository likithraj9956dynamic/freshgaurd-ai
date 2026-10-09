// ============================================================
// FreshGuard AI — Role-Adaptive Royal Sidebar
// ============================================================

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ScanBarcode,
  PackageCheck,
  Truck,
  ClipboardList,
  AlertOctagon,
  LogOut,
  CalendarClock,
  Layers,
  Flame
} from 'lucide-react';

export function Sidebar({ location }: { location: ReturnType<typeof useLocation> }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Build navigation items based on active authenticated role
  const getNavItems = () => {
    if (role === 'store_manager') {
      return [
        { path: '/store', label: 'Store Command', subtitle: 'Branch #017 overview', icon: Store, exact: true },
        { path: '/store/tasks', label: 'Daily Directives', subtitle: 'Priority floor tasks', icon: ClipboardList },
        { path: '/store/inventory', label: 'Inventory & Expiry', subtitle: 'Stockouts & shelf-life', icon: Layers },
        { path: '/store/alerts', label: 'Wastage & Spoilage', subtitle: 'Shrinkage & advisories', icon: Flame },
        { path: '/store/deliveries', label: 'Incoming Deliveries', subtitle: 'Supplier dock ETA', icon: Truck },
        { path: '/store/product-lookup', label: 'Barcode Registry', subtitle: 'Open Food Facts check', icon: ScanBarcode },
      ];
    }

    if (role === 'supplier') {
      return [
        { path: '/supplier', label: 'Dispatch Hub', subtitle: 'Cascade Fresh operations', icon: Truck, exact: true },
        { path: '/supplier/orders', label: 'Purchase Orders', subtitle: 'Order confirmation & lines', icon: PackageCheck },
        { path: '/supplier/deliveries', label: 'Delivery Schedules', subtitle: 'Fleet status & cold-chain', icon: CalendarClock },
        { path: '/supplier/requests', label: 'Emergency Stock', subtitle: 'Expedited supply requests', icon: AlertOctagon },
      ];
    }

    // Default: Main Manager (Network-wide executive scope)
    return [
      { path: '/manager', label: 'Command Centre', subtitle: 'Executive briefing (12 Stores)', icon: Compass, exact: true },
      { path: '/manager/network', label: 'Store Network', subtitle: 'Constellation & transfers', icon: Store },
      { path: '/manager/stores/1012', label: 'Store 017 Dossier', subtitle: 'Featured investigation', icon: ShieldAlert },
      { path: '/manager/investigations', label: 'Investigation Room', subtitle: 'Causal graph & evidence', icon: Search },
      { path: '/manager/decisions', label: 'Decision Chamber', subtitle: 'Strategy simulation & risk', icon: Scale },
      { path: '/manager/actions', label: 'Action Centre', subtitle: 'Approval governance ledger', icon: CheckCircle2 },
      { path: '/manager/product-lookup', label: 'Product Registry', subtitle: 'Barcode telemetry', icon: ScanBarcode },
      { path: '/manager/settings', label: 'Settings', subtitle: 'System & AI credentials', icon: Sliders },
    ];
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case 'main_manager':
        return { label: 'MAIN MANAGER', sub: 'NETWORK HQ · 12 SITES', color: 'text-[#C5A059]' };
      case 'store_manager':
        return { label: 'STORE MANAGER', sub: 'BRANCH #017 · TACOMA', color: 'text-[#4ADE80]' };
      case 'supplier':
        return { label: 'SUPPLIER PARTNER', sub: 'CASCADE FRESH LOGISTICS', color: 'text-[#60A5FA]' };
      default:
        return { label: 'GUEST STAKEHOLDER', sub: 'AUTHENTICATION REQ', color: 'text-[#8E9B90]' };
    }
  };

  const badgeInfo = getRoleBadge();

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
        <div className="overflow-y-auto app-scrollbar">
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
                  OPERATIONS PLATFORM
                </span>
              </div>
            </div>

            {/* Role Scoped Status Chip */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className={`font-mono text-[10px] font-bold tracking-wider ${badgeInfo.color}`}>
                {badgeInfo.label}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#E0C588] text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-[#8E9B90] font-mono mt-0.5 truncate">{badgeInfo.sub}</p>
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

        {/* Footer: User Profile & Logout */}
        <div className="p-4 mx-3 mb-4 rounded border border-[#C5A059]/20 bg-[#071C16]/80 text-[#8E9B90] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center text-[11px] font-cinzel text-[#C5A059] font-bold flex-shrink-0">
                {user?.avatar || 'FG'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#FDFBF7] truncate">{user?.name || 'Authorized User'}</p>
                <p className="text-[10px] text-[#8E9B90] truncate">{user?.title || 'Stakeholder'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded border border-white/10 hover:border-[#9E2A2B]/60 hover:bg-[#9E2A2B]/20 text-[#8E9B90] hover:text-[#F87171] transition-colors"
              title="Sign out of FreshGuard"
              aria-label="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#8E9B90]/80">
            <span>DATA ISOLATION</span>
            <span className="text-[#16A34A]">ENFORCED</span>
          </div>
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
