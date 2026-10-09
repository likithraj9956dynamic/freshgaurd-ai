// ============================================================
// FreshGuard AI — Protected Route Guard
// ============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import { Crown } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#041410] flex flex-col items-center justify-center text-[#FDFBF7] space-y-4">
        <div className="w-12 h-12 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center animate-pulse">
          <Crown className="w-6 h-6 text-[#C5A059]" />
        </div>
        <div className="text-center">
          <p className="font-editorial text-xl tracking-wide text-[#FDFBF7]">Verifying Security Credentials...</p>
          <span className="text-[11px] font-mono tracking-widest text-[#C5A059] uppercase block mt-1">
            FRESHGUARD ROLE AUTHORIZATION
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" state={{ attemptedPath: location.pathname }} replace />;
  }

  return <>{children}</>;
}
