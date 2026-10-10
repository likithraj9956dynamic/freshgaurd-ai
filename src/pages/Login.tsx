// ============================================================
// FreshGuard AI — Enterprise Login & Role-Based Registration
// ============================================================

import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  X,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  BadgeCheck,
  KeyRound,
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';

const STORE_TYPE_OPTIONS = [
  'Supermarket',
  'Hypermarket',
  'Convenience store',
  'Fresh produce store',
  'Grocery store',
  'Specialty food store',
  'Other',
];

const SUPPLIER_TYPE_OPTIONS = [
  'Fresh fruits and vegetables',
  'Dairy products',
  'Meat and seafood',
  'Bakery products',
  'Packaged foods',
  'Beverages',
  'Frozen products',
  'General grocery',
  'Logistics and distribution',
  'Other',
];

const PRODUCT_CATEGORY_OPTIONS = [
  'Fresh Produce (Fruits & Vegetables)',
  'Dairy, Eggs & Butter',
  'Chilled Meat & Poultry',
  'Seafood & Cold Chain',
  'Bakery & Fresh Dough',
  'Packaged Dry Goods',
  'Beverages & Juices',
  'Organic Specialty',
  'Frozen Foods',
];

export function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Mode: 'signin' | 'register_select' | 'register_store' | 'register_supplier' | 'register_manager' | 'submitted_pending'
  const initialMode = searchParams.get('action') === 'register-manager' ? 'register_manager' : 'signin';
  const [activeMode, setActiveMode] = useState<
    'signin' | 'register_select' | 'register_store' | 'register_supplier' | 'register_manager' | 'submitted_pending'
  >(initialMode);

  // Sign-in states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRolePreset, setSelectedRolePreset] = useState<UserRole | null>(null);

  // Common Registration fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAdditionalInfo, setRegAdditionalInfo] = useState('');

  // Store Manager specific
  const [regStoreName, setRegStoreName] = useState('');
  const [regStoreType, setRegStoreType] = useState('Supermarket');
  const [regStoreTypeOther, setRegStoreTypeOther] = useState('');
  const [regStoreAddress, setRegStoreAddress] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regState, setRegState] = useState('');
  const [regEmployeeId, setRegEmployeeId] = useState('');

  // Supplier specific
  const [regSupplierName, setRegSupplierName] = useState('');
  const [regSupplierType, setRegSupplierType] = useState('Fresh fruits and vegetables');
  const [regSupplierTypeOther, setRegSupplierTypeOther] = useState('');
  const [regProductsSupplied, setRegProductsSupplied] = useState<string[]>(['Fresh Produce (Fruits & Vegetables)']);
  const [regBusinessAddress, setRegBusinessAddress] = useState('');
  const [regGSTIN, setRegGSTIN] = useState('');

  // Main Manager specific
  const [regAuthNumber, setRegAuthNumber] = useState('');
  const [regInvitationToken, setRegInvitationToken] = useState(searchParams.get('token') || '');

  // Submission / feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingSubmissionDetails, setPendingSubmissionDetails] = useState<{
    role: string;
    name: string;
    email: string;
    orgName: string;
  } | null>(null);

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

  // Sign In submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your corporate email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your access password.');
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await login({ email, password });
      setSuccessMessage(`Credentials verified. Redirecting, ${authenticatedUser.name}...`);
      setTimeout(() => {
        redirectByRole(authenticatedUser.role);
      }, 400);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  // Store Manager submit
  const handleStoreRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regStoreName.trim() || !regStoreAddress.trim() || !regCity.trim() || !regState.trim()) {
      setErrorMessage('Please complete all mandatory store information fields marked with an asterisk (*).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerStoreManager({
        fullName: regFullName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        storeName: regStoreName,
        storeType: regStoreType,
        storeTypeOther: regStoreTypeOther,
        storeAddress: regStoreAddress,
        city: regCity,
        state: regState,
        employeeId: regEmployeeId,
        additionalInfo: regAdditionalInfo,
      });

      setPendingSubmissionDetails({
        role: 'Store Manager',
        name: regFullName,
        email: regEmail,
        orgName: regStoreName,
      });
      setActiveMode('submitted_pending');
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration request could not be processed.');
      setIsLoading(false);
    }
  };

  // Supplier submit
  const handleSupplierRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regSupplierName.trim() || !regBusinessAddress.trim() || !regCity.trim() || !regState.trim()) {
      setErrorMessage('Please complete all required supplier profile fields marked with an asterisk (*).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (regProductsSupplied.length === 0) {
      setErrorMessage('Please select at least one product category supplied by your company.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.registerSupplier({
        fullName: regFullName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        supplierName: regSupplierName,
        supplierType: regSupplierType,
        supplierTypeOther: regSupplierTypeOther,
        productsSupplied: regProductsSupplied,
        businessAddress: regBusinessAddress,
        city: regCity,
        state: regState,
        gstin: regGSTIN,
        additionalInfo: regAdditionalInfo,
      });

      setPendingSubmissionDetails({
        role: 'Supplier Partner',
        name: regFullName,
        email: regEmail,
        orgName: regSupplierName,
      });
      setActiveMode('submitted_pending');
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Supplier registration could not be processed.');
      setIsLoading(false);
    }
  };

  // Main Manager submit
  const handleManagerRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMessage('All administrator contact fields and password are required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (!regAuthNumber && !regInvitationToken) {
      setErrorMessage('Please provide either the Initial Manager Setup Secret or an active invitation token.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authService.registerMainManager({
        fullName: regFullName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword,
        authNumber: regAuthNumber,
        invitationToken: regInvitationToken,
      });

      setSuccessMessage('Main Manager credentials verified and activated! Redirecting to Executive Overview...');
      setTimeout(() => {
        navigate('/manager', { replace: true });
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Main Manager registration rejected by security policy.');
      setIsLoading(false);
    }
  };

  const toggleProductCategory = (category: string) => {
    setRegProductsSupplied((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
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

        {/* Global Error/Success Banner */}
        {errorMessage && (
          <div role="alert" className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
            <span className="flex-1 font-medium">{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div role="alert" className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
            <span className="flex-1 font-medium">{successMessage}</span>
          </div>
        )}

        {/* ========================================================
            VIEW 1: SIGN IN MODE (Standard Grid with Presets)
            ======================================================== */}
        {activeMode === 'signin' && (
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
                          Store FB-17
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">Marcus Brody · Marathahalli Branch</p>
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
                <span>Backend validates authorization on every protected route and endpoint.</span>
              </div>
            </div>

            {/* Right Column: Standard Form */}
            <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Sign In to Your Workspace</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your corporate credentials or use a verified demonstration role.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setActiveMode('register_select');
                    }}
                    className="text-xs font-semibold text-[#164e3d] hover:underline flex items-center gap-1"
                  >
                    <span>Request Access</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4" noValidate>
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

                {/* Register Options Callout */}
                <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Need new account access?</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveMode('register_select')}
                      className="font-medium text-[#164e3d] hover:underline"
                    >
                      Create Account
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setActiveMode('register_manager')}
                      className="font-medium text-slate-600 hover:text-slate-900"
                    >
                      Executive Setup
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>FreshBasket Single Sign-On</span>
                <span className="font-mono">v2.4 Enterprise</span>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            VIEW 2: ROLE SELECTION FOR ACCESS REQUEST
            ======================================================== */}
        {activeMode === 'register_select' && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Request Enterprise Access</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your operational function to complete the designated authorization dossier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('signin')}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
              >
                Back to Sign In
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Store Manager */}
              <div
                onClick={() => {
                  setErrorMessage(null);
                  setActiveMode('register_store');
                }}
                className="p-5 rounded-lg border-2 border-slate-200 hover:border-[#164e3d] hover:bg-emerald-50/30 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#164e3d] flex items-center justify-center group-hover:bg-[#164e3d] group-hover:text-white transition-colors">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Store Manager Registration</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For retail store general directors, floor managers, and shift supervisors. Includes branch assignment, shrinkage tracking, and local task logs.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-[#164e3d] gap-1">
                  <span>Complete Store Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Option B: Supplier Partner */}
              <div
                onClick={() => {
                  setErrorMessage(null);
                  setActiveMode('register_supplier');
                }}
                className="p-5 rounded-lg border-2 border-slate-200 hover:border-[#164e3d] hover:bg-emerald-50/30 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center group-hover:bg-[#164e3d] group-hover:text-white transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Supplier Partner Registration</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    For logistics partners, food producers, distribution fleets, and vendor dispatch teams. Includes PO reconciliation and dock telemetry.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-xs font-semibold text-[#164e3d] gap-1">
                  <span>Complete Supplier Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-slate-500" />
                <span>Are you a regional operations director or executive?</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('register_manager')}
                className="text-xs font-semibold text-[#164e3d] hover:underline"
              >
                Register as Main Manager (Protected) &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 3: STORE MANAGER REGISTRATION FORM
            ======================================================== */}
        {activeMode === 'register_store' && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Branch Operations Scope
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Store Manager Access Request</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit your credentials. Access is granted upon authorization by a Main Manager.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('register_select')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Back to Role Selection
              </button>
            </div>

            <form onSubmit={handleStoreRegisterSubmit} className="space-y-5" noValidate>
              
              {/* Section 1: Contact & Credentials */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  1. Manager Contact & Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marcus Brody"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Work Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. marcus@freshbasket.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (253) 555-0199"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Employee ID (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FB-01824"
                      value={regEmployeeId}
                      onChange={(e) => setRegEmployeeId(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Store Information */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  2. Branch & Facility Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Store Name / Branch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FreshBasket Marathahalli (#FB-17)"
                      value={regStoreName}
                      onChange={(e) => setRegStoreName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Store Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={regStoreType}
                      onChange={(e) => setRegStoreType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    >
                      {STORE_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {regStoreType === 'Other' && (
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Describe Store Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Specify custom facility format"
                      value={regStoreTypeOther}
                      onChange={(e) => setRegStoreTypeOther(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Store Physical Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1102 Pacific Avenue"
                    value={regStoreAddress}
                    onChange={(e) => setRegStoreAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Bangalore"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="WA"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Additional Information / Operational Context
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Store transition timeline, team size, cold storage specs"
                    value={regAdditionalInfo}
                    onChange={(e) => setRegAdditionalInfo(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Notice:</strong> Submission creates a pending request. Access is restricted until an authorized Main Manager reviews and approves your account.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveMode('register_select')}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                >
                  {isLoading ? 'Submitting Registration...' : 'Submit Store Manager Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            VIEW 4: SUPPLIER PARTNER REGISTRATION FORM
            ======================================================== */}
        {activeMode === 'register_supplier' && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                  Logistics & Fulfillment Scope
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Supplier Partner Registration</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Register your distribution organization for PO tracking and cold-chain compliance.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('register_select')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Back to Role Selection
              </button>
            </div>

            <form onSubmit={handleSupplierRegisterSubmit} className="space-y-5" noValidate>
              
              {/* Section 1: Contact Person & Credentials */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  1. Contact Person & Access Credentials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Contact Person's Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. dispatch@cascadefresh.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (253) 555-0144"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      GSTIN / Business Tax ID (if applicable)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GST-WA-88910"
                      value={regGSTIN}
                      onChange={(e) => setRegGSTIN(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Supplier / Company Profile */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  2. Supplier Organization & Product Scope
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Supplier / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cascade Fresh Distributors LLC"
                      value={regSupplierName}
                      onChange={(e) => setRegSupplierName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Supplier Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={regSupplierType}
                      onChange={(e) => setRegSupplierType(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    >
                      {SUPPLIER_TYPE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {regSupplierType === 'Other' && (
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Describe Supplier Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Specify supplier business category"
                      value={regSupplierTypeOther}
                      onChange={(e) => setRegSupplierTypeOther(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                )}

                {/* Multi-select product categories */}
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Products Supplied (Select all that apply) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRODUCT_CATEGORY_OPTIONS.map((cat) => {
                      const isSelected = regProductsSupplied.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleProductCategory(cat)}
                          className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#164e3d] text-white border-[#164e3d]'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Business / Dispatch Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4800 Logistics Way, Dock 4"
                    value={regBusinessAddress}
                    onChange={(e) => setRegBusinessAddress(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Seattle"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="WA"
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Fleet, Delivery, or Transit Specifications
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Refrigerated truck fleet capacity, route corridors, intake delivery windows"
                    value={regAdditionalInfo}
                    onChange={(e) => setRegAdditionalInfo(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2">
                <Truck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Approval Required:</strong> Once submitted, your supplier account undergoes corporate verification before portal activation.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveMode('register_select')}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                >
                  {isLoading ? 'Submitting Supplier Request...' : 'Submit Supplier Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            VIEW 5: MAIN MANAGER (EXECUTIVE) REGISTRATION & BOOTSTRAP
            ======================================================== */}
        {activeMode === 'register_manager' && (
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                  Executive Security Protocol
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Register as Main Manager</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-privilege executive registration. Initial setup requires administrator bootstrap verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMode('signin')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Back to Sign In
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <KeyRound className="w-4 h-4 text-[#164e3d]" />
                <span>Executive Bootstrap & Authorization Policy:</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                The initial Main Manager is authorized via the project setup secret. Once an initial Main Manager is activated, public registration is locked, and additional executives must be invited via secure token.
              </p>
            </div>

            <form onSubmit={handleManagerRegisterSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Corporate Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="executive@freshbasket.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (206) 555-0100"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Setup Credential (Initial Auth No. or Invitation Token) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Initial Auth # or Invitation Token"
                    value={regAuthNumber || regInvitationToken}
                    onChange={(e) => {
                      setRegAuthNumber(e.target.value);
                      setRegInvitationToken(e.target.value);
                    }}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 6 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveMode('signin')}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                >
                  {isLoading ? 'Verifying Authorization...' : 'Activate Main Manager Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            VIEW 6: PENDING SUBMISSION CONFIRMATION SCREEN
            ======================================================== */}
        {activeMode === 'submitted_pending' && (
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <BadgeCheck className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Application Pending Review
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-2">
                Registration Successfully Received
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
                Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.
              </p>
            </div>

            {pendingSubmissionDetails && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-left space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-semibold text-slate-900">{pendingSubmissionDetails.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-semibold text-slate-900">{pendingSubmissionDetails.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Requested Role:</span>
                  <span className="font-semibold text-slate-900">{pendingSubmissionDetails.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Facility / Organization:</span>
                  <span className="font-semibold text-slate-900">{pendingSubmissionDetails.orgName}</span>
                </div>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs text-slate-500">
              A confirmation email has been logged. You will receive an email notification when your access decision is complete.
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('signin');
                  setPendingSubmissionDetails(null);
                }}
                className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2"
              >
                <span>Return to Sign In Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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
