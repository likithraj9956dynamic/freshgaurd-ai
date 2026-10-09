// ============================================================
// FreshGuard AI — Enterprise Login & Authentication
// ============================================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, ENTERPRISE_USERS } from '../services/auth';
import type { UserRole } from '../types/auth';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Store,
  Truck,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRolePreset, setSelectedRolePreset] = useState<UserRole | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      redirectByRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectByRole = (role: UserRole) => {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname;
    if (from && from !== '/login' && from !== '/unauthorized') {
      navigate(from, { replace: true });
      return;
    }
    switch (role) {
      case 'main_manager':
        navigate('/manager', { replace: true });
        break;
      case 'store_manager':
        navigate('/store', { replace: true });
        break;
      case 'supplier':
        navigate('/supplier', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  };

  const handleSelectPreset = (role: UserRole) => {
    setSelectedRolePreset(role);
    setErrorMessage(null);
    const targetUser = ENTERPRISE_USERS.find((u) => u.role === role);
    if (targetUser) {
      setEmail(targetUser.email);
      setPassword(targetUser.passwordHash);
    }
  };

  const validateForm = (): boolean => {
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Please provide your corporate directory email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid format email (e.g. executive@freshbasket.com).');
      return false;
    }
    if (!password) {
      setErrorMessage('Please enter your access password.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const authenticatedUser = await login({ email, password });
      setSuccessMessage(`Credentials verified. Redirecting, ${authenticatedUser.name}...`);
      setTimeout(() => {
        redirectByRole(authenticatedUser.role);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetFeedback({ success: false, message: 'Please enter your registered email address.' });
      return;
    }
    setIsResetSubmitting(true);
    const res = await authService.resetPassword(resetEmail);
    setResetFeedback(res);
    setIsResetSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Simple Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#164e3d] text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            FreshGuard AI · Retail Operations Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Enterprise Single Sign-On
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Authorized portal for store managers, logistics suppliers, and operations directors.
          </p>
        </div>

        {/* Main Grid: Demonstration Presets + Login Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: Quick Role Presets */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Demonstration Access
                </span>
                <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                  Select Stakeholder Role
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose a verified role to automatically test their application experience:
                </p>
              </div>

              {/* Role Presets */}
              <div className="space-y-2">
                {/* 1. Main Manager */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('main_manager')}
                  className={`w-full text-left p-3 rounded-md border text-xs transition-colors flex items-start gap-3 ${
                    selectedRolePreset === 'main_manager'
                      ? 'border-[#164e3d] bg-emerald-50/60 ring-1 ring-[#164e3d]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-[#164e3d] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Main Manager</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        12 Stores
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Eleanor Vance · Operations HQ</p>
                  </div>
                </button>

                {/* 2. Store Manager */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('store_manager')}
                  className={`w-full text-left p-3 rounded-md border text-xs transition-colors flex items-start gap-3 ${
                    selectedRolePreset === 'store_manager'
                      ? 'border-[#164e3d] bg-emerald-50/60 ring-1 ring-[#164e3d]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-[#164e3d] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Store Manager</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Store #017
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Marcus Brody · Tacoma Downtown</p>
                  </div>
                </button>

                {/* 3. Supplier */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('supplier')}
                  className={`w-full text-left p-3 rounded-md border text-xs transition-colors flex items-start gap-3 ${
                    selectedRolePreset === 'supplier'
                      ? 'border-[#164e3d] bg-emerald-50/60 ring-1 ring-[#164e3d]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-[#164e3d] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Supplier Partner</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        Logistics
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">Elena Rostova · Cascade Fresh</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Role authorization is enforced on all protected endpoints and routing boundaries.</span>
            </div>
          </div>

          {/* Right Column: Standard Form */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-slate-900">Sign In to Your Workspace</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your credentials below or use one of the verified demo presets.
                </p>
              </div>

              {/* Feedback Alerts */}
              {errorMessage && (
                <div role="alert" className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div role="alert" className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="login-email" className="text-xs font-medium text-slate-700 block mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="e.g. executive@freshbasket.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:border-[#164e3d] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="text-xs font-medium text-slate-700 block">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetFeedback(null);
                        setResetEmail(email);
                        setIsResetModalOpen(true);
                      }}
                      className="text-xs text-[#164e3d] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-10 py-2 rounded-md border border-slate-300 bg-white text-slate-900 focus:border-[#164e3d] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Verifying credentials...</span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>FreshBasket Single Sign-On</span>
              <span className="font-mono">v2.4 Enterprise</span>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-5 rounded-lg border border-slate-300 shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your directory email to receive a password reset link.
              </p>
            </div>

            {resetFeedback && (
              <div
                className={`p-3 rounded-md text-xs flex items-start gap-2 ${
                  resetFeedback.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {resetFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                )}
                <span>{resetFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="email"
                required
                placeholder="registered@freshbasket.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  {isResetSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
