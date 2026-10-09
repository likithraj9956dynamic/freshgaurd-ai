// ============================================================
// FreshGuard AI — Page: Settings & System Dossier
// Enterprise Platform Configuration & AI Model Integration
// ============================================================

import React, { useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import {
  Sliders,
  ShieldCheck,
  Sparkles,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Trash2,
  Eye,
  EyeOff,
  Database,
  Lock,
  Server
} from 'lucide-react';
import { useAIStore } from '../services/ai-store';
import { AVAILABLE_MODELS, type AIProvider } from '../services/ai';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ToastProvider';

export function SettingsPage() {
  const { data } = useDemos();
  const info = data?.demoInfo;

  const {
    config,
    updateConfig,
    testCurrentConnection,
  } = useAIStore();

  const { showToast } = useToast();

  const [provider, setProvider] = useState<AIProvider>(config.provider);
  const [apiKey, setApiKey] = useState<string>(config.apiKey);
  const [model, setModel] = useState<string>(config.model);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sync state when config changes
  React.useEffect(() => {
    setProvider(config.provider);
    setApiKey(config.apiKey);
    setModel(config.model);
  }, [config]);

  const handleProviderSelect = (p: AIProvider) => {
    setProvider(p);
    setTestResult(null);
    const newModel = p === 'gemini' ? 'gemini-1.5-flash' : p === 'openai' ? 'gpt-4o-mini' : 'simulation-v1';
    setModel(newModel);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    updateConfig({ provider, apiKey: apiKey.trim(), model });
    const success = await testCurrentConnection();
    setIsTesting(false);

    if (success) {
      setTestResult({
        success: true,
        message: `${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API verified. Credentials authenticated and live.`,
      });
      showToast({ type: 'success', title: 'Connection Verified', message: 'API credentials authenticated successfully.' });
    } else {
      setTestResult({
        success: false,
        message: useAIStore.getState().statusMessage || 'Failed to authenticate API key.',
      });
      showToast({ type: 'critical', title: 'Verification Failed', message: 'Please verify the API key and quota.' });
    }
  };

  const handleSaveCredentials = () => {
    updateConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      isEnabled: true,
    });
    showToast({ type: 'success', title: 'Credentials Saved', message: 'AI configuration updated and persisted.' });
  };

  const handleClearKey = () => {
    setApiKey('');
    updateConfig({
      apiKey: '',
      provider: 'gemini',
    });
    setTestResult(null);
    showToast({ type: 'info', title: 'API Key Cleared', message: 'Enter a new key to reconnect.' });
  };

  const isLive = Boolean(config.apiKey?.trim());

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Enterprise Header */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            <span>Enterprise System Governance &amp; API Configuration</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Platform Configuration &amp; Intelligence Engine
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
            Configure live LLM reasoning credentials, telemetry calibration thresholds, and franchise governance parameters across the FreshBasket supermarket operations network.
          </p>
        </div>
      </section>

      {/* AI Credentials Configuration Card */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h2 className="text-base font-semibold text-slate-900">
                AI Reasoning Engine &amp; API Credentials
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Configure Google Gemini or OpenAI API keys to activate live causal reasoning, automated markdown schedules, and copilot diagnostics.
            </p>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border ${
            isLive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-600' : 'bg-slate-400'}`} />
            {isLive ? `${config.provider === 'gemini' ? 'Gemini' : 'OpenAI'} Connected` : 'No API Key Configured'}
          </span>
        </div>

        {/* Provider Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
            Select Active Intelligence Provider
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleProviderSelect('gemini')}
              className={`p-4 rounded-lg border text-left transition-all ${
                provider === 'gemini'
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Google Gemini</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                Gemini 1.5 Flash &amp; Pro with fast structured output and generous free quotas.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleProviderSelect('openai')}
              className={`p-4 rounded-lg border text-left transition-all ${
                provider === 'openai'
                  ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-600'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">OpenAI</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                  GPT-4o
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-snug">
                GPT-4o Mini and GPT-4o for complex multi-factor causal analysis.
              </p>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="settings-api-key" className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
                {provider === 'gemini' ? 'Google AI Studio API Key' : 'OpenAI API Secret Key'}
              </label>
              <a
                href={
                  provider === 'gemini'
                    ? 'https://aistudio.google.com/app/apikey'
                    : 'https://platform.openai.com/api-keys'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 font-medium"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="settings-api-key"
                type={showKey ? 'text' : 'password'}
                placeholder={
                  provider === 'gemini'
                    ? 'Enter your Gemini API Key (e.g. AIzaSy...)'
                    : 'Enter your OpenAI API Key (e.g. sk-proj-...)'
                }
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-md text-xs font-mono pl-10 pr-24 py-2.5 bg-white text-slate-900 border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors placeholder:text-slate-400"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClearKey}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Clear key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Model Selector & Security Callout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="settings-model-select" className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
                Model Variant
              </label>
              <div className="relative">
                <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  id="settings-model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded-md text-xs pl-10 pr-4 py-2.5 bg-white text-slate-900 border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {(AVAILABLE_MODELS[provider as 'gemini' | 'openai'] || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block">
                Security &amp; Storage Isolation
              </label>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>Keys are stored in your browser session and never sent to third-party loggers.</span>
              </div>
            </div>
          </div>

          {/* Test Connection Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-md border flex items-start gap-3 ${
                testResult.success
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              )}
              <div className="flex-1 space-y-0.5">
                <span className="font-mono text-[10px] uppercase font-bold block">
                  {testResult.success ? 'API ENDPOINT REACHABLE' : 'CONNECTION VERIFICATION FAILED'}
                </span>
                <p className="text-xs leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="btn-secondary text-xs flex items-center gap-2 disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing Endpoint...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Test API Connection</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveCredentials}
              className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
            >
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Specifications & Platform Manifest Card */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Operations Intelligence Architecture Manifest
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Enterprise system specifications distinguishing audited telemetry facts (POS sales, RFID inventory, sensor logs)
            from diagnostic hypotheses.
          </p>
        </div>

        {info && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Build Release</span>
              <span className="font-mono font-medium text-slate-900 mt-0.5 block">{info.version}</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Network Stores</span>
              <span className="font-medium text-slate-900 mt-0.5 block">{info.storeCount} Sites</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Active Directives</span>
              <span className="font-medium text-slate-900 mt-0.5 block">{info.actionCount} Items</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Governance Mode</span>
              <span className="font-medium text-emerald-700 mt-0.5 block">HUMAN SIGN-OFF</span>
            </div>
          </div>
        )}

        {/* Featured Store 17 Benchmark */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Signature Benchmark: Tacoma Downtown (Store #017)
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              Surveillance Case
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Store 017 exhibits the multi-signal challenge: Revenue -18%, Footfall -5%, Transactions -15%,
            Wastage +28%, 12 fast-moving stockouts, and Purchase Order CF-10482 delayed 36 hours.
          </p>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
            CALIBRATION PROTOCOL: Separates observed telemetry from diagnostic conjecture.
          </div>
        </div>
      </div>

    </div>
  );
}
