import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Store, Truck, Key, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { AuthService } from '../../services/auth.service';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialTab?: 'signin' | 'store' | 'supplier' | 'manager';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signin',
}) => {
  const [tab, setTab] = useState<'signin' | 'store' | 'supplier' | 'manager'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<any | null>(null);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Store Manager State
  const [smName, setSmName] = useState('');
  const [smEmail, setSmEmail] = useState('');
  const [smPhone, setSmPhone] = useState('');
  const [smPassword, setSmPassword] = useState('');
  const [smConfirmPassword, setSmConfirmPassword] = useState('');
  const [smStoreName, setSmStoreName] = useState('');
  const [smStoreType, setSmStoreType] = useState('Supermarket');
  const [smStoreTypeOther, setSmStoreTypeOther] = useState('');
  const [smAddress, setSmAddress] = useState('');
  const [smCity, setSmCity] = useState('');
  const [smState, setSmState] = useState('');
  const [smEmpId, setSmEmpId] = useState('');
  const [smAddInfo, setSmAddInfo] = useState('');

  // Supplier State
  const [supContact, setSupContact] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supPassword, setSupPassword] = useState('');
  const [supConfirmPassword, setSupConfirmPassword] = useState('');
  const [supCompany, setSupCompany] = useState('');
  const [supType, setSupType] = useState('Fresh fruits and vegetables');
  const [supTypeOther, setSupTypeOther] = useState('');
  const [supProducts, setSupProducts] = useState('');
  const [supAddress, setSupAddress] = useState('');
  const [supCity, setSupCity] = useState('');
  const [supState, setSupState] = useState('');
  const [supGstin, setSupGstin] = useState('');
  const [supAddInfo, setSupAddInfo] = useState('');

  // Main Manager State
  const [mmName, setMmName] = useState('');
  const [mmEmail, setMmEmail] = useState('');
  const [mmPhone, setMmPhone] = useState('');
  const [mmPassword, setMmPassword] = useState('');
  const [mmConfirmPassword, setMmConfirmPassword] = useState('');
  const [mmAuthNumber, setMmAuthNumber] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setError(null);
    setSuccessMsg(null);
    setPendingStatus(null);
  };

  const handleTabChange = (newTab: 'signin' | 'store' | 'supplier' | 'manager') => {
    setTab(newTab);
    resetForm();
  };

  // 1. Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingStatus(null);
    setLoading(true);

    try {
      const res = await AuthService.login({ email: loginEmail, password: loginPassword });
      if (res.notApproved) {
        setPendingStatus(res);
        setLoading(false);
        return;
      }
      onSuccess(res.data?.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Store Manager Registration Submit
  const handleStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (smPassword !== smConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: smName,
        email: smEmail,
        phoneNumber: smPhone,
        password: smPassword,
        storeName: smStoreName,
        storeType: smStoreType === 'Other' ? smStoreTypeOther : smStoreType,
        storeTypeOther: smStoreType === 'Other' ? smStoreTypeOther : undefined,
        storeAddress: smAddress,
        city: smCity,
        state: smState,
        employeeId: smEmpId,
        additionalInfo: smAddInfo,
      };

      const res = await AuthService.registerStoreManager(payload);
      setSuccessMsg(res.message || 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 3. Supplier Registration Submit
  const handleSupplierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (supPassword !== supConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        contactName: supContact,
        email: supEmail,
        phoneNumber: supPhone,
        password: supPassword,
        companyName: supCompany,
        supplierType: supType === 'Other' ? supTypeOther : supType,
        supplierTypeOther: supType === 'Other' ? supTypeOther : undefined,
        productsSupplied: supProducts,
        businessAddress: supAddress,
        city: supCity,
        state: supState,
        gstin: supGstin,
        additionalInfo: supAddInfo,
      };

      const res = await AuthService.registerSupplier(payload);
      setSuccessMsg(res.message || 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Main Manager Registration Submit
  const handleManagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mmPassword !== mmConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: mmName,
        email: mmEmail,
        phoneNumber: mmPhone,
        password: mmPassword,
        authNumber: mmAuthNumber,
      };

      const res = await AuthService.registerMainManager(payload);
      onSuccess(res.data?.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Main Manager registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-surface-border overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">FreshGuard AI Access Control</h2>
              <p className="text-xs text-emerald-200">Role-Based Operations Authentication Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
          <button
            type="button"
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'signin'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('store')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'store'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Request Store Access</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('supplier')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'supplier'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Request Supplier Access</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('manager')}
            className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              tab === 'manager'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Main Manager Setup</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>Registration Request Submitted</span>
              </div>
              <p>{successMsg}</p>
              <button
                onClick={() => handleTabChange('signin')}
                className="mt-2 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition-all"
              >
                Return to Sign In
              </button>
            </div>
          )}

          {pendingStatus && (
            <div className="mb-4 p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>
                  {pendingStatus.status === 'PENDING'
                    ? 'Registration Pending Review'
                    : pendingStatus.status === 'REJECTED'
                    ? 'Access Request Not Approved'
                    : 'Additional Information Required'}
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{pendingStatus.message}</p>

              {pendingStatus.data?.rejectionReason && (
                <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs">
                  <span className="font-bold text-red-700">Reason:</span> {pendingStatus.data.rejectionReason}
                </div>
              )}

              {pendingStatus.data?.moreInfoNote && (
                <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs">
                  <span className="font-bold text-amber-800">Manager Instruction:</span> {pendingStatus.data.moreInfoNote}
                </div>
              )}
            </div>
          )}

          {!successMsg && !pendingStatus && (
            <>
              {/* TAB 1: SIGN IN */}
              {tab === 'signin' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Work / Business Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="operator@freshguard.ai"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to FreshGuard AI'}
                  </button>
                </form>
              )}

              {/* TAB 2: STORE MANAGER REGISTRATION */}
              {tab === 'store' && (
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={smName}
                        onChange={(e) => setSmName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={smEmail}
                        onChange={(e) => setSmEmail(e.target.value)}
                        placeholder="manager@store17.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={smPhone}
                        onChange={(e) => setSmPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID (Optional)</label>
                      <input
                        type="text"
                        value={smEmpId}
                        onChange={(e) => setSmEmpId(e.target.value)}
                        placeholder="EMP-84920"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={smPassword}
                        onChange={(e) => setSmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={smConfirmPassword}
                        onChange={(e) => setSmConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <h3 className="text-xs font-bold text-emerald-900 mb-3">Store Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Store Name *</label>
                        <input
                          type="text"
                          required
                          value={smStoreName}
                          onChange={(e) => setSmStoreName(e.target.value)}
                          placeholder="Indiranagar FreshBasket"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Store Type *</label>
                        <select
                          value={smStoreType}
                          onChange={(e) => setSmStoreType(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        >
                          <option value="Supermarket">Supermarket</option>
                          <option value="Hypermarket">Hypermarket</option>
                          <option value="Convenience store">Convenience store</option>
                          <option value="Fresh produce store">Fresh produce store</option>
                          <option value="Grocery store">Grocery store</option>
                          <option value="Specialty food store">Specialty food store</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {smStoreType === 'Other' && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Describe Store Type *</label>
                        <input
                          type="text"
                          required
                          value={smStoreTypeOther}
                          onChange={(e) => setSmStoreTypeOther(e.target.value)}
                          placeholder="Custom store model description"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={smAddress}
                          onChange={(e) => setSmAddress(e.target.value)}
                          placeholder="100ft Road"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                        <input
                          type="text"
                          value={smCity}
                          onChange={(e) => setSmCity(e.target.value)}
                          placeholder="Bengaluru"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                        <input
                          type="text"
                          value={smState}
                          onChange={(e) => setSmState(e.target.value)}
                          placeholder="Karnataka"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting Registration...' : 'Submit Store Manager Access Request'}
                  </button>
                </form>
              )}

              {/* TAB 3: SUPPLIER REGISTRATION */}
              {tab === 'supplier' && (
                <form onSubmit={handleSupplierSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person Full Name *</label>
                      <input
                        type="text"
                        required
                        value={supContact}
                        onChange={(e) => setSupContact(e.target.value)}
                        placeholder="Jane Smith"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Business Email *</label>
                      <input
                        type="email"
                        required
                        value={supEmail}
                        onChange={(e) => setSupEmail(e.target.value)}
                        placeholder="contact@nordiclogistics.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={supPhone}
                        onChange={(e) => setSupPhone(e.target.value)}
                        placeholder="+91 91234 56789"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN (Optional)</label>
                      <input
                        type="text"
                        value={supGstin}
                        onChange={(e) => setSupGstin(e.target.value)}
                        placeholder="29AAAAA0000A1Z5"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={supPassword}
                        onChange={(e) => setSupPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={supConfirmPassword}
                        onChange={(e) => setSupConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <h3 className="text-xs font-bold text-emerald-900 mb-3">Supplier Organization Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company / Supplier Name *</label>
                        <input
                          type="text"
                          required
                          value={supCompany}
                          onChange={(e) => setSupCompany(e.target.value)}
                          placeholder="Nordic Coast Fresh Produce Ltd"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Supplier Type *</label>
                        <select
                          value={supType}
                          onChange={(e) => setSupType(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                        >
                          <option value="Fresh fruits and vegetables">Fresh fruits & vegetables</option>
                          <option value="Dairy products">Dairy products</option>
                          <option value="Meat and seafood">Meat and seafood</option>
                          <option value="Bakery products">Bakery products</option>
                          <option value="Packaged foods">Packaged foods</option>
                          <option value="Beverages">Beverages</option>
                          <option value="Frozen products">Frozen products</option>
                          <option value="General grocery">General grocery</option>
                          <option value="Logistics and distribution">Logistics & distribution</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    {supType === 'Other' && (
                      <div className="mt-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Describe Supplier Type *</label>
                        <input
                          type="text"
                          required
                          value={supTypeOther}
                          onChange={(e) => setSupTypeOther(e.target.value)}
                          placeholder="Custom supplier category description"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                        />
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Products Supplied *</label>
                      <input
                        type="text"
                        required
                        value={supProducts}
                        onChange={(e) => setSupProducts(e.target.value)}
                        placeholder="Organic Leafy Greens, Tomatoes, Dairy SKU 482"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Submitting Supplier Access...' : 'Submit Supplier Access Request'}
                  </button>
                </form>
              )}

              {/* TAB 4: MAIN MANAGER REGISTRATION */}
              {tab === 'manager' && (
                <form onSubmit={handleManagerSubmit} className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                    <p className="font-bold">Main Manager Bootstrap / Invitation</p>
                    <p className="text-[11px] mt-0.5 text-emerald-700">
                      Initial setup requires the manager setup authentication number. Subsequent registrations require an invitation link from an existing Main Manager.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={mmName}
                        onChange={(e) => setMmName(e.target.value)}
                        placeholder="Kavitha Menon"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={mmEmail}
                        onChange={(e) => setMmEmail(e.target.value)}
                        placeholder="kavitha@freshguard.ai"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={mmPhone}
                        onChange={(e) => setMmPhone(e.target.value)}
                        placeholder="+91 99000 11223"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Manager Auth Number *</label>
                      <input
                        type="password"
                        required
                        value={mmAuthNumber}
                        onChange={(e) => setMmAuthNumber(e.target.value)}
                        placeholder="Enter initial auth number (987654321)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={mmPassword}
                        onChange={(e) => setMmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={mmConfirmPassword}
                        onChange={(e) => setMmConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50"
                  >
                    {loading ? 'Creating Account...' : 'Register as Main Manager'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
