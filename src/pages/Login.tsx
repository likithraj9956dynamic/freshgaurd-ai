// ============================================================
// FreshGuard AI — Enterprise Role-Based Authentication Page
// ============================================================

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, ENTERPRISE_USERS } from '../services/auth';
import type { UserRole } from '../types/auth';
import {
  Crown,
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
  Info,
  HelpCircle,
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

  // Forgot password modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

  // If already authenticated, redirect automatically
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
      setErrorMessage('Please provide your enterprise directory email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid format email (e.g. name@freshbasket.com).');
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
      setSuccessMessage(`Credentials verified. Welcome back, ${authenticatedUser.name}.`);
      setTimeout(() => {
        redirectByRole(authenticatedUser.role);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check your credentials.');
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
    <div className="min-h-screen bg-[#041410] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative selection:bg-[#C5A059]/30 selection:text-[#FDFBF7]">
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(197, 160, 89, 0.15) 0%, transparent 60%), linear-gradient(rgba(197, 160, 89, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(197, 160, 89, 0.04) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />

      <div className="w-full max-w-4xl relative z-10 space-y-8 my-auto">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C5A059]/30 bg-[#0B3B2C]/50 backdrop-blur-md shadow-lg">
            <Crown className="w-4 h-4 text-[#C5A059]" />
            <span className="font-cinzel text-xs font-semibold tracking-widest text-[#FDFBF7]">
              FRESHGUARD AI
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C5A059]" />
            <span className="font-mono text-[10px] tracking-wider text-[#C5A059] uppercase">
              ENTERPRISE PLATFORM
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#FDFBF7] tracking-tight">
            Role-Based Operational Gateway
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9B90] max-w-xl mx-auto font-light leading-relaxed">
            FreshBasket Supermarket Operations, Store Directives &amp; Supplier Cold-Chain Logistics Intelligence.
          </p>
        </div>

        {/* Main Grid: Demonstration Presets + Login Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Quick Role Presets (Phase 3 Requirement) */}
          <div className="lg:col-span-5 royal-card p-6 flex flex-col justify-between border-[#C5A059]/20 shadow-xl space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                  DEMONSTRATION ACCESS
                </span>
                <h2 className="text-xl font-editorial text-[#FDFBF7] mt-0.5">
                  Verified Enterprise Roles
                </h2>
                <p className="text-xs text-[#8E9B90] mt-1 leading-relaxed">
                  Select a certified stakeholder profile below to review their dedicated application experience.
                </p>
              </div>

              {/* Role Presets List */}
              <div className="space-y-2.5">
                {/* 1. Main Manager */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('main_manager')}
                  className={`w-full text-left p-3.5 rounded border transition-all flex items-start gap-3.5 ${
                    selectedRolePreset === 'main_manager'
                      ? 'border-[#C5A059] bg-[#0B3B2C]/80 shadow-md ring-1 ring-[#C5A059]/40'
                      : 'border-white/10 bg-[#071C16]/60 hover:border-[#C5A059]/40 hover:bg-[#071C16]'
                  }`}
                >
                  <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#FDFBF7] tracking-wide">Main Manager</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#E0C588]">
                        Network HQ
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B90] truncate mt-0.5">Eleanor Vance · 12 Stores</p>
                    <p className="text-[10px] text-[#8E9B90]/70 mt-1 line-clamp-1">
                      Network KPIs, AI investigations, action governance &amp; emergency announcements.
                    </p>
                  </div>
                </button>

                {/* 2. Store Manager */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('store_manager')}
                  className={`w-full text-left p-3.5 rounded border transition-all flex items-start gap-3.5 ${
                    selectedRolePreset === 'store_manager'
                      ? 'border-[#C5A059] bg-[#0B3B2C]/80 shadow-md ring-1 ring-[#C5A059]/40'
                      : 'border-white/10 bg-[#071C16]/60 hover:border-[#C5A059]/40 hover:bg-[#071C16]'
                  }`}
                >
                  <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Store className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#FDFBF7] tracking-wide">Store Manager</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#16A34A]/20 text-[#4ADE80]">
                        Store #017
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B90] truncate mt-0.5">Marcus Brody · Tacoma Branch</p>
                    <p className="text-[10px] text-[#8E9B90]/70 mt-1 line-clamp-1">
                      Daily floor tasks, low-stock &amp; expiry, wastage logging, incoming POs.
                    </p>
                  </div>
                </button>

                {/* 3. Supplier */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset('supplier')}
                  className={`w-full text-left p-3.5 rounded border transition-all flex items-start gap-3.5 ${
                    selectedRolePreset === 'supplier'
                      ? 'border-[#C5A059] bg-[#0B3B2C]/80 shadow-md ring-1 ring-[#C5A059]/40'
                      : 'border-white/10 bg-[#071C16]/60 hover:border-[#C5A059]/40 hover:bg-[#071C16]'
                  }`}
                >
                  <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#FDFBF7] tracking-wide">Supplier Partner</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#3B82F6]/20 text-[#60A5FA]">
                        Logistics
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8E9B90] truncate mt-0.5">Elena Rostova · Cascade Fresh</p>
                    <p className="text-[10px] text-[#8E9B90]/70 mt-1 line-clamp-1">
                      Assigned purchase orders, delivery statuses, emergency supply orders.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-3.5 rounded border border-[#C5A059]/20 bg-[#041410]/90 text-[11px] text-[#8E9B90] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#E0C588] font-mono text-[10px] uppercase font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Zero-Trust Authorization</span>
              </div>
              <p className="leading-relaxed text-[#8E9B90]/90">
                Preset selection automatically supplies valid credentials. User roles and data permissions are authenticated strictly through verified server tokens.
              </p>
            </div>
          </div>

          {/* Right Column: Standard Authentication Form */}
          <div className="lg:col-span-7 royal-card p-6 sm:p-8 flex flex-col justify-between border-[#C5A059]/30 shadow-2xl relative">
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                  SECURE SIGN IN
                </span>
                <h2 className="text-2xl font-editorial text-[#FDFBF7] mt-0.5">
                  FreshGuard Directory Credentials
                </h2>
                <p className="text-xs text-[#8E9B90] mt-1">
                  Authenticate with your FreshBasket single sign-on or vendor credentials.
                </p>
              </div>

              {/* Feedback Alerts */}
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded border border-[#9E2A2B]/50 bg-[#9E2A2B]/15 text-[#F87171] text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#F87171]" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#4ADE80]" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-email"
                    className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block"
                  >
                    Directory Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C5A059]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="e.g. executive@freshbasket.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded text-xs pl-10 pr-4 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/40 font-sans"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="login-password"
                      className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetFeedback(null);
                        setResetEmail(email);
                        setIsResetModalOpen(true);
                      }}
                      className="text-[11px] text-[#E0C588] hover:underline font-mono"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#C5A059]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded text-xs pl-10 pr-11 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/40 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E9B90] hover:text-[#FDFBF7] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-royal-gold text-xs py-3.5 shadow-lg group flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#041410] border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Security Token...</span>
                      </>
                    ) : (
                      <>
                        <span>Authenticate &amp; Launch Workspace</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer Metadata */}
            <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-[#8E9B90]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Session Encrypted · TLS 1.3
              </span>
              <span className="font-mono text-[#C5A059]">FreshBasket Network v2.4</span>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full royal-card p-6 border-[#C5A059]/40 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E9B90] hover:text-[#FDFBF7]"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                CREDENTIAL RECOVERY
              </span>
              <h3 className="text-xl font-editorial text-[#FDFBF7]">Reset Directory Password</h3>
              <p className="text-xs text-[#8E9B90]">
                Enter your registered enterprise email. A secure time-limited token will be issued.
              </p>
            </div>

            {resetFeedback && (
              <div
                className={`p-3 rounded border text-xs flex items-start gap-2 ${
                  resetFeedback.success
                    ? 'border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80]'
                    : 'border-[#9E2A2B]/40 bg-[#9E2A2B]/15 text-[#F87171]'
                }`}
              >
                {resetFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <span>{resetFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3 pt-1">
              <input
                type="email"
                required
                placeholder="registered@freshbasket.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full rounded text-xs pl-3 pr-3 py-2.5 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="btn-royal-outline text-xs px-3 py-2"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="btn-royal-gold text-xs px-4 py-2"
                >
                  {isResetSubmitting ? 'Sending...' : 'Transmit Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
