import React from 'react';
import {
  LayoutDashboard,
  Radio,
  CheckSquare,
  HelpCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'overview' | 'signals' | 'approvals' | 'qa' | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  approvalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  approvalsCount = 2,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'signals' as NavTab,
      label: 'Store signals',
      icon: Radio,
      badge: null,
    },
    {
      id: 'approvals' as NavTab,
      label: 'Approvals',
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
  ];

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
        <div className="px-6 pt-5 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Command Center
          </p>
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 font-semibold border-l-4 border-brand-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
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
      <div className="p-4 border-t border-surface-border bg-slate-50/50">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-border shadow-xs hover:border-slate-300 transition-all cursor-pointer">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Avatar Initials */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold ring-2 ring-emerald-100 shrink-0">
              KM
            </div>
            {/* User Details */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">Kavitha Menon</p>
              <p className="text-[11px] text-slate-500 truncate">Head Office — Operations</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        </div>
      </div>
    </aside>
  );
};
