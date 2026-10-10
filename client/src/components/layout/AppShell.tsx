import React, { useState } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  approvalsCount?: number;
  lastRefreshed?: string;
  onRefresh?: () => void;
  currentUser?: any;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab: externalTab,
  onTabChange: externalOnTabChange,
  approvalsCount = 2,
  lastRefreshed = '08:42 IST',
  onRefresh,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [internalTab, setInternalTab] = useState<NavTab>('overview');

  const currentTab = externalTab !== undefined ? externalTab : internalTab;
  const handleTabChange = externalOnTabChange || setInternalTab;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-base font-sans">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={currentTab}
        onTabChange={handleTabChange}
        approvalsCount={approvalsCount}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Sticky TopBar */}
        <TopBar lastRefreshed={lastRefreshed} onRefresh={onRefresh} />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};
