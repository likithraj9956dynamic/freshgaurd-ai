// ============================================================
// FreshGuard AI — Layout: AppShell
// ============================================================

import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

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
      className={`flex bg-[#041410] text-[#FDFBF7] ${className}`}
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Sidebar location={location} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main
          className="app-scrollbar flex-1 overflow-y-auto"
          style={{ backgroundColor: '#041410' }}
        >
          <div className="w-full max-w-[1440px] mx-auto p-6 md:p-8 lg:p-10">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
