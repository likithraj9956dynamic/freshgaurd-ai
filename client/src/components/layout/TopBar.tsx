import React, { useState } from 'react';
import {
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface TopBarProps {
  lastRefreshed?: string;
  onRefresh?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lastRefreshed = '08:42 IST',
  onRefresh,
}) => {
  const [isDark, setIsDark] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <header className="h-16 bg-white border-b border-surface-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
      {/* Left: Breadcrumbs navigation */}
      <div className="flex items-center space-x-2 text-sm font-medium">
        <span className="text-slate-500 hover:text-slate-700 cursor-pointer transition-colors">
          FreshBasket
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-semibold flex items-center space-x-1.5">
          <span>Head Office</span>
        </span>
      </div>

      {/* Right Actions & Badges */}
      <div className="flex items-center space-x-4">
        {/* Synthetic Data Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>SYNTHETIC DATA</span>
        </div>

        {/* Timestamp */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/60 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Refreshed {lastRefreshed}</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefreshClick}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Refresh telemetry"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
