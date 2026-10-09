// ============================================================
// FreshGuard AI — Application Entry & Routing
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ToastProvider';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/Dashboard';
import { StoreOverviewPage } from './pages/StoreOverview';
import { InvestigationRoomPage } from './pages/InvestigationRoom';
import { DecisionCentrePage } from './pages/DecisionCentre';
import { NetworkPage } from './pages/Network';
import { ActionCenterPage } from './pages/ActionCenter';
import { StoreManagerPage } from './pages/StoreManager';
import { ProductLookupPage } from './pages/ProductLookup';
import { SettingsPage } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/stores/:storeId" element={<StoreOverviewPage />} />
              <Route path="/investigations" element={<InvestigationRoomPage />} />
              <Route path="/investigations/:issueId" element={<InvestigationRoomPage />} />
              <Route path="/decisions" element={<DecisionCentrePage />} />
              <Route path="/decisions/:decisionId" element={<DecisionCentrePage />} />
              <Route path="/network" element={<NetworkPage />} />
              <Route path="/actions" element={<ActionCenterPage />} />
              <Route path="/store-manager" element={<StoreManagerPage />} />
              <Route path="/product-lookup" element={<ProductLookupPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </ToastProvider>
      </Router>
    </QueryClientProvider>
  );
}

