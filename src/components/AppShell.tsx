// ============================================================
// FreshGuard AI — Enterprise Application Shell
// ============================================================

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AIKeyModal } from './ui/ai-key-modal';
import { AICopilotDrawer } from './ui/ai-copilot-drawer';

export function AppShell({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const location = useLocation();

  return (
    <div
      className={`flex bg-slate-50 text-slate-900 ${className}`}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Sidebar location={location} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar />
        <main
          className="app-scrollbar flex-1 overflow-y-auto bg-slate-50"
        >
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>

      {/* Enterprise AI Configuration & Intelligence Modals */}
      <AIKeyModal />
      <AICopilotDrawer />
    </div>
  );
}
