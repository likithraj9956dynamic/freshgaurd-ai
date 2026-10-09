// ============================================================
// FreshGuard AI — Enterprise Privilege Boundary Page
// ============================================================

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export function UnauthorizedPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const attemptedPath = (location.state as { attemptedPath?: string })?.attemptedPath || 'Protected Resource';

  const getAuthorizedHome = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'main_manager':
        return '/manager';
      case 'store_manager':
        return '/store';
      case 'supplier':
        return '/supplier';
      default:
        return '/login';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'main_manager':
        return 'Main Manager (Head Office)';
      case 'store_manager':
        return `Store Manager (${user.assignedStoreName || 'Assigned Branch'})`;
      case 'supplier':
        return `Supplier Representative (${user.supplierName || 'Authorized Vendor'})`;
      default:
        return 'Unauthenticated User';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6 text-slate-900">
      <div className="max-w-lg w-full bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-5">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              Access Restricted
            </h1>
            <p className="text-xs text-slate-500">Privilege boundary enforced</p>
          </div>
        </div>

        <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Attempted Path:</span>
            <span className="font-mono text-red-700 font-medium">{attemptedPath}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Active User:</span>
            <span className="font-medium text-slate-800">{user?.name || 'Anonymous'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Authorized Scope:</span>
            <span className="font-medium text-emerald-800">{getRoleLabel()}</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In accordance with retail data isolation policies, store managers are restricted to their assigned branch data, and suppliers may only access their assigned purchase orders.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => navigate(getAuthorizedHome())}
            className="w-full sm:w-auto btn-primary text-xs px-4 py-2 flex items-center justify-center gap-1.5 flex-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={logout}
            className="w-full sm:w-auto btn-secondary text-xs px-3.5 py-2 flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Switch Account</span>
          </button>
        </div>

      </div>
    </div>
  );
}
