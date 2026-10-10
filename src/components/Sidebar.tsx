// ============================================================
// FreshGuard AI — Enterprise Sidebar Navigation
// ============================================================

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Store,
  Search,
  Scale,
  CheckCircle2,
  Sliders,
  Menu,
  X,
  ScanBarcode,
  PackageCheck,
  Truck,
  ClipboardList,
  AlertOctagon,
  LogOut,
  CalendarClock,
  Layers,
  Flame,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export function Sidebar({ location }: { location: ReturnType<typeof useLocation> }) {
  const { user, role, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Clean, predictable enterprise navigation items
  const getNavItems = () => {
    if (role === 'store_manager') {
      return [
        { path: '/store', label: 'Store Overview', subtitle: 'Branch #017 summary', icon: LayoutDashboard, exact: true },
        { path: '/store/tasks', label: 'Daily Tasks', subtitle: 'Priority floor directives', icon: ClipboardList },
        { path: '/store/inventory', label: 'Inventory & Expiry', subtitle: 'Stockouts & shelf life', icon: Layers },
        { path: '/store/alerts', label: 'Wastage & Spoilage', subtitle: 'Shrinkage logs', icon: Flame },
        { path: '/store/deliveries', label: 'Incoming Deliveries', subtitle: 'Carrier dock intake', icon: Truck },
        { path: '/store/product-lookup', label: 'Product Registry', subtitle: 'Barcode audit', icon: ScanBarcode },
      ];
    }

    if (role === 'supplier') {
      return [
        { path: '/supplier', label: 'Logistics Overview', subtitle: 'Fulfillment summary', icon: LayoutDashboard, exact: true },
        { path: '/supplier/orders', label: 'Purchase Orders', subtitle: 'Order confirmations', icon: PackageCheck },
        { path: '/supplier/deliveries', label: 'Delivery Schedules', subtitle: 'Fleet tracking & ETAs', icon: CalendarClock },
        { path: '/supplier/requests', label: 'Emergency Requests', subtitle: 'Expedited stock', icon: AlertOctagon },
      ];
    }

    // Default: Main Manager
    return [
      { path: '/manager', label: 'Operations Overview', subtitle: 'Network executive summary', icon: LayoutDashboard, exact: true },
      { path: '/manager/access-management', label: 'User Access Governance', subtitle: 'Approve & manage roles', icon: UserCheck },
      { path: '/manager/network', label: 'Store Network', subtitle: '25 regional branches', icon: Store },
      { path: '/manager/stores/FB-17', label: 'Store Dossier', subtitle: 'Branch analytics & records', icon: ShieldCheck },
      { path: '/manager/investigations', label: 'AI Investigations', subtitle: 'Causal root analysis', icon: Search },
      { path: '/manager/decisions', label: 'Decision Chamber', subtitle: 'Strategy simulation', icon: Scale },
      { path: '/manager/actions', label: 'Action Governance', subtitle: 'Approvals ledger', icon: CheckCircle2 },
      { path: '/manager/product-lookup', label: 'Product Registry', subtitle: 'Barcode lookup', icon: ScanBarcode },
      { path: '/manager/settings', label: 'System Settings', subtitle: 'Configurations & keys', icon: Sliders },
    ];
  };

  const navItems = getNavItems();

  const getRoleBadge = () => {
    switch (role) {
      case 'main_manager':
        return { label: 'Main Manager', sub: 'Network Operations HQ' };
      case 'store_manager':
        return { label: 'Store Manager', sub: user?.assignedStoreName || 'Branch Operations' };
      case 'supplier':
        return { label: 'Supplier Partner', sub: user?.supplierName || 'Logistics Partner' };
      default:
        return { label: 'User', sub: 'Operations' };
    }
  };

  const badgeInfo = getRoleBadge();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-[#0f2e24] text-white border border-emerald-800 shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle navigation"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Enterprise Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col justify-between bg-[#0f2e24] text-slate-200 border-r border-[#164e3d] ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & Role Header */}
        <div>
          <div className="p-5 border-b border-[#1b5e4b]/40">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#164e3d] border border-emerald-600/40 flex items-center justify-center text-white font-bold text-xs">
                FG
              </div>
              <div className="min-w-0">
                <span className="text-sm font-semibold tracking-tight text-white block">
                  FreshGuard AI
                </span>
                <span className="text-[11px] text-emerald-300/80 font-mono block">
                  Retail Operations
                </span>
              </div>
            </div>

            {/* Scope / Role Tag */}
            <div className="mt-3.5 pt-3 border-t border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="min-w-0">
                <p className="font-semibold text-white text-xs truncate">{badgeInfo.label}</p>
                <p className="text-[11px] text-emerald-300/70 truncate">{badgeInfo.sub}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/80 text-emerald-300 border border-emerald-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ACTIVE
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto app-scrollbar max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1b5e4b] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 ${
                      isActive ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-3.5 border-t border-[#1b5e4b]/40 bg-[#0c261e]">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Operator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Authenticated'}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-300 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 transition-colors"
              title="Sign Out"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
