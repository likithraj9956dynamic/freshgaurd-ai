import React from 'react';
import {
  LayoutDashboard,
  Radio,
  CheckSquare,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
  Users,
  LogOut,
  LogIn,
  Store,
  Truck,
  Key,
} from 'lucide-react';

export type NavTab = 'overview' | 'store-mgr' | 'supplier' | 'signals' | 'approvals' | 'qa' | 'audit' | 'access' | 'login-view';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  approvalsCount?: number;
  currentUser?: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  storeUpdatesCount?: number;
  supplierUpdatesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  approvalsCount = 2,
  currentUser,
  onOpenAuth,
  onLogout,
  storeUpdatesCount = 0,
  supplierUpdatesCount = 0,
}) => {
  const isMainManager = currentUser?.role === 'MAIN_MANAGER' || !currentUser;
  const isStoreManager = currentUser?.role === 'STORE_MANAGER';
  const isSupplier = currentUser?.role === 'SUPPLIER';

  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Superadmin Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'store-mgr' as NavTab,
      label: 'Store Manager Hub',
      icon: Store,
      badge: storeUpdatesCount > 0 ? storeUpdatesCount.toString() : null,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'supplier' as NavTab,
      label: 'Supplier Portal',
      icon: Truck,
      badge: supplierUpdatesCount > 0 ? supplierUpdatesCount.toString() : null,
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    },
    {
      id: 'signals' as NavTab,
      label: 'Store signals',
      icon: Radio,
      badge: null,
    },
    {
      id: 'approvals' as NavTab,
      label: 'Approvals Queue',
      icon: CheckSquare,
      badge: approvalsCount > 0 ? approvalsCount.toString() : null,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      id: 'qa' as NavTab,
      label: 'Evidence Q&A',
      icon: HelpCircle,
      badge: null,
    },
    {
      id: 'audit' as NavTab,
      label: 'Audit trail',
      icon: FileText,
      badge: null,
    },
    {
      id: 'access' as NavTab,
      label: 'User access',
      icon: Users,
      badge: null,
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    {
      id: 'login-view' as NavTab,
      label: 'Login & Role Switch',
      icon: LogIn,
      badge: null,
    },
  ];

  const getInitials = (name: string) => {
    if (!name) return 'KM';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 bg-white border-r border-surface-border flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      {/* Top: Logo & Main Navigation */}
      <div>
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center space-x-3 border-b border-surface-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-sm ring-2 ring-brand-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base leading-tight tracking-tight flex items-center space-x-1">
              <span>FreshGuard</span>
              <span className="text-brand-600 font-extrabold">AI</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Grocery Operations Hub</p>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-4 pb-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Operations Dashboards
          </p>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-bold border-l-4 border-brand-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
                      item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Card */}
      <div className="p-3.5 border-t border-surface-border bg-slate-50/50">
        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-surface-border shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-emerald-100 shrink-0">
                {getInitials(currentUser.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate">
                  {currentUser.role?.replace('_', ' ') || 'Operations'}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onTabChange('login-view')}
            className="w-full p-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login / Role Switcher</span>
          </button>
        )}
      </div>
    </aside>
  );
};
