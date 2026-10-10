import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Store,
  Truck,
  Key,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
} from 'lucide-react';
import { AuthService } from '../../services/auth.service';

interface LoginViewProps {
  onLoginSuccess: (role: 'MAIN_MANAGER' | 'STORE_MANAGER' | 'SUPPLIER', user?: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'quick'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await AuthService.login({ email, password });
      if (res.notApproved) {
        setError(res.message || 'Account pending review by Main Manager.');
        setLoading(false);
        return;
      }
      const role = res.data?.user?.role || 'MAIN_MANAGER';
      onLoginSuccess(role as any, res.data?.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = (role: 'MAIN_MANAGER' | 'STORE_MANAGER' | 'SUPPLIER') => {
    const mockUsers = {
      MAIN_MANAGER: { fullName: 'Kavitha Menon', email: 'kavitha@freshguard.ai', role: 'MAIN_MANAGER' },
      STORE_MANAGER: { fullName: 'Rahul Verma', email: 'rahul@store17.com', role: 'STORE_MANAGER' },
      SUPPLIER: { fullName: 'Jane Smith', email: 'jane@nordiclogistics.com', role: 'SUPPLIER' },
    };
    onLoginSuccess(role, mockUsers[role]);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl border border-surface-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Banner Column (5 Cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-8 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="font-extrabold text-xl tracking-tight">FreshGuard AI</div>
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight">
              Grocery Operations Intelligence Hub
            </h2>
            <p className="text-xs text-emerald-200 mt-3 leading-relaxed">
              Unified role-based access for Superadmins, Store Managers, and Suppliers with automated signal telemetry.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-emerald-800/60">
            <div className="flex items-center space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-Time Store Requirement Sync</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Automated Supplier Dispatch Stream</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gated Operations Approval Queue</span>
            </div>
          </div>
        </div>

        {/* Right Content Column (7 Cols) */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('quick')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'quick'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                1-Click Role Login Demo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('signin')}
                className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'signin'
                    ? 'border-emerald-600 text-emerald-800'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Account Sign In
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* TAB 1: QUICK ROLE SWITCHER DEMO */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Select a role below to launch and test its dashboard view:
                </p>

                {/* Role Option 1: Superadmin */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('MAIN_MANAGER')}
                  className="w-full p-4 rounded-2xl border-2 border-emerald-600/30 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
                      <Key className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                        Superadmin / Main Manager
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Full network overview, store signals matrix & user approval queue
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Role Option 2: Store Manager */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('STORE_MANAGER')}
                  className="w-full p-4 rounded-2xl border-2 border-teal-600/30 hover:border-teal-600 bg-teal-50/40 hover:bg-teal-50 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                        Store Manager (Store 17 · Indiranagar)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Manage local sales, staff attendance & submit store needs to Superadmin
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Role Option 3: Supplier */}
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('SUPPLIER')}
                  className="w-full p-4 rounded-2xl border-2 border-slate-300 hover:border-slate-800 bg-slate-50 hover:bg-slate-100 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-slate-900">
                        Supplier (Nordic Coast Produce)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Track purchase orders & dispatch delivery updates to Superadmin
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            )}

            {/* TAB 2: FORMAL CREDENTIALS LOGIN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleFormalLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@freshguard.ai"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
