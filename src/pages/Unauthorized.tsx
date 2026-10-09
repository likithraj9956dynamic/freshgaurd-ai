// ============================================================
// FreshGuard AI — Unauthorized Access Page (Data Isolation Guard)
// ============================================================

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

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
        return 'Main Operations Manager (Head Office)';
      case 'store_manager':
        return `Store Manager (${user.assignedStoreName || 'Assigned Branch'})`;
      case 'supplier':
        return `Supplier Representative (${user.supplierName || 'Authorized Vendor'})`;
      default:
        return 'Unauthenticated User';
    }
  };

  return (
    <div className="min-h-screen bg-[#041410] flex items-center justify-center p-6 text-[#FDFBF7]">
      <div className="max-w-xl w-full royal-card p-8 sm:p-10 border-[#9E2A2B]/40 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9E2A2B] via-[#C5A059] to-[#9E2A2B]" />

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded border border-[#9E2A2B]/60 bg-[#9E2A2B]/20 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-[#F87171]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#F87171] uppercase block">
                SECURITY EXCEPTION · ACCESS RESTRICTED
              </span>
              <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-[#FDFBF7]">
                Privilege Boundary Enforced
              </h1>
            </div>
          </div>

          <div className="p-4 rounded border border-white/5 bg-[#071C16] text-xs text-[#8E9B90] space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span>Attempted Path:</span>
              <span className="font-mono text-[#F87171] bg-black/40 px-2 py-0.5 rounded">{attemptedPath}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span>Active User:</span>
              <span className="font-medium text-[#FDFBF7]">{user?.name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Authorized Credential:</span>
              <span className="font-mono text-[#E0C588]">{getRoleLabel()}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-[#8E9B90] leading-relaxed">
            <p>
              In accordance with enterprise retail compliance and strict data isolation policies, confidential operational dossiers, financial margins, and cross-franchise telemetry are restricted to authorized credentials.
            </p>
            <p className="text-[11px] text-[#8E9B90]/80">
              Store Managers are isolated to their designated store unit, and Suppliers may only access assigned purchase orders and delivery logs.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate(getAuthorizedHome())}
              className="w-full sm:w-auto btn-royal-gold text-xs px-5 py-3 flex items-center justify-center gap-2 flex-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to My Authorized Workspace</span>
            </button>

            <button
              onClick={logout}
              className="w-full sm:w-auto btn-royal-outline text-xs px-4 py-3 flex items-center justify-center gap-2 border-white/20 text-[#8E9B90] hover:text-[#FDFBF7]"
            >
              <LogOut className="w-4 h-4 text-[#F87171]" />
              <span>Switch Account</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#8E9B90]/60">
            <span>FRESHGUARD RBAC PROTOCOL</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#C5A059]" />
              ZERO TRUST DATA ISOLATION
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
