// ============================================================
// FreshGuard AI — Enterprise Role-Based Application Entry & Routing
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ToastProvider';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppShell } from './components/AppShell';

// Authentication & Guard Pages
import { LoginPage } from './pages/Login';
import { UnauthorizedPage } from './pages/Unauthorized';

// Main Manager Pages (Enterprise HQ Network Scope)
import { DashboardPage } from './pages/Dashboard';
import { StoreOverviewPage } from './pages/StoreOverview';
import { InvestigationRoomPage } from './pages/InvestigationRoom';
import { DecisionCentrePage } from './pages/DecisionCentre';
import { NetworkPage } from './pages/Network';
import { ActionCenterPage } from './pages/ActionCenter';
import { ProductLookupPage } from './pages/ProductLookup';
import { SettingsPage } from './pages/Settings';

// Store Manager Pages (Branch #017 Assigned Scope)
import { StoreDashboardPage } from './pages/store/StoreDashboard';
import { StoreTasksPage } from './pages/store/StoreTasks';
import { StoreInventoryPage } from './pages/store/StoreInventory';
import { StoreAlertsPage } from './pages/store/StoreAlerts';
import { StoreDeliveriesPage } from './pages/store/StoreDeliveries';

// Supplier Partner Pages (Cascade Fresh Logistics Scope)
import { SupplierDashboardPage } from './pages/supplier/SupplierDashboard';
import { SupplierOrdersPage } from './pages/supplier/SupplierOrders';
import { SupplierDeliveriesPage } from './pages/supplier/SupplierDeliveries';
import { SupplierRequestsPage } from './pages/supplier/SupplierRequests';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

// Smart Root Route Dispatcher based on authenticated role
function RootIndexRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  switch (user.role) {
    case 'main_manager':
      return <Navigate to="/manager" replace />;
    case 'store_manager':
      return <Navigate to="/store" replace />;
    case 'supplier':
      return <Navigate to="/supplier" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// Smart Product Lookup Route Dispatcher
function ProductLookupRedirect() {
  const { user } = useAuth();
  if (user?.role === 'store_manager') {
    return <Navigate to="/store/product-lookup" replace />;
  }
  return <Navigate to="/manager/product-lookup" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Authentication Pages (outside AppShell) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Application Workspace (inside AppShell) */}
              <Route element={<AppShell />}>
                
                {/* Dynamic Smart Entry Point */}
                <Route path="/" element={<RootIndexRedirect />} />

                {/* ========================================================
                    ROLE A: MAIN MANAGER EXPERIENCE (Head Office Network Scope)
                    ======================================================== */}
                <Route
                  path="/manager"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/stores/:storeId"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <StoreOverviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/investigations"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <InvestigationRoomPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/investigations/:issueId"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <InvestigationRoomPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/decisions"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <DecisionCentrePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/decisions/:decisionId"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <DecisionCentrePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/network"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <NetworkPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/actions"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <ActionCenterPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/product-lookup"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <ProductLookupPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manager/settings"
                  element={
                    <ProtectedRoute allowedRoles={['main_manager']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* ========================================================
                    ROLE B: STORE MANAGER EXPERIENCE (Assigned Branch Scope)
                    ======================================================== */}
                <Route
                  path="/store"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <StoreDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store/tasks"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <StoreTasksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store/inventory"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <StoreInventoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store/alerts"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <StoreAlertsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store/deliveries"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <StoreDeliveriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/store/product-lookup"
                  element={
                    <ProtectedRoute allowedRoles={['store_manager']}>
                      <ProductLookupPage />
                    </ProtectedRoute>
                  }
                />

                {/* ========================================================
                    ROLE C: SUPPLIER EXPERIENCE (Cascade Fresh Logistics Scope)
                    ======================================================== */}
                <Route
                  path="/supplier"
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/orders"
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/deliveries"
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierDeliveriesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supplier/requests"
                  element={
                    <ProtectedRoute allowedRoles={['supplier']}>
                      <SupplierRequestsPage />
                    </ProtectedRoute>
                  }
                />

                {/* ========================================================
                    LEGACY COMPATIBILITY & CONVENIENCE ALIASES
                    ======================================================== */}
                <Route path="/stores/:storeId" element={<Navigate to="/manager/stores/1012" replace />} />
                <Route path="/investigations" element={<Navigate to="/manager/investigations" replace />} />
                <Route path="/investigations/:issueId" element={<Navigate to="/manager/investigations" replace />} />
                <Route path="/decisions" element={<Navigate to="/manager/decisions" replace />} />
                <Route path="/decisions/:decisionId" element={<Navigate to="/manager/decisions" replace />} />
                <Route path="/network" element={<Navigate to="/manager/network" replace />} />
                <Route path="/actions" element={<Navigate to="/manager/actions" replace />} />
                <Route path="/store-manager" element={<Navigate to="/store/tasks" replace />} />
                <Route path="/product-lookup" element={<ProductLookupRedirect />} />
                <Route path="/settings" element={<Navigate to="/manager/settings" replace />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
