// ============================================================
// FreshGuard AI — Page: Settings & System Dossier
// ============================================================

import React, { useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import {
  Sliders,
  ShieldCheck,
  Crown,
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
    openKeyModal,
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
        message: `${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API verified! Connected and ready.`,
      });
      showToast({ type: 'success', title: 'Connection Verified', message: 'API credentials authenticated.' });
    } else {
      setTestResult({
        success: false,
        message: useAIStore.getState().statusMessage || 'Failed to authenticate API key.',
      });
      showToast({ type: 'critical', title: 'Verification Failed', message: 'Please check your API key.' });
    }
  };

  const handleSaveCredentials = () => {
    updateConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      isEnabled: true,
    });
    showToast({ type: 'success', title: 'Credentials Saved', message: 'AI configuration updated.' });
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
    <div className="space-y-10 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <section className="relative rounded border border-[#C5A059]/30 bg-gradient-to-br from-[#0B3B2C]/70 to-[#041410] p-8 sm:p-10 shadow-2xl">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#C5A059]/30 bg-[#0B3B2C]/50">
            <Sliders className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[11px] font-mono tracking-widest text-[#E0C588] uppercase">
              SYSTEM CONFIGURATION & TELEMETRY MANIFEST
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-normal text-[#FDFBF7]">
            Platform Governance & AI Parameters
          </h1>

          <p className="text-sm text-[#8E9B90] font-light leading-relaxed">
            Manage your AI intelligence engine credentials, telemetry calibration thresholds,
            and franchise governance models across the FreshBasket supermarket network.
          </p>
        </div>
      </section>

      {/* ============================================================
          AI ENGINE CREDENTIALS & API KEY CONFIGURATION CARD
          ============================================================ */}
      <div className="royal-card p-6 sm:p-8 space-y-6 border-[#C5A059]/30 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                AI Intelligence Engine & API Credentials
              </h2>
            </div>
            <p className="text-xs text-[#8E9B90]">
              Configure your Google Gemini or OpenAI API key to activate live reasoning, automated markdown schedules, and natural language copilot.
            </p>
          </div>

          <Badge variant={isLive ? 'success' : 'gold'}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            {isLive ? `${config.provider === 'gemini' ? 'Gemini' : 'OpenAI'} Live Connected` : 'No API Key Configured'}
          </Badge>
        </div>

        {/* Provider Switcher */}
        <div className="space-y-3">
          <label className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block">
            Select Active Intelligence Provider
          </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleProviderSelect('gemini')}
                className={`p-4 rounded border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-[#C5A059] bg-[#0B3B2C] text-[#FDFBF7] shadow-lg'
                    : 'border-white/10 bg-[#071C16] text-[#8E9B90] hover:border-[#C5A059]/40 hover:text-[#FDFBF7]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm">Google Gemini</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#C5A059]/20 text-[#E0C588] font-mono">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-[#8E9B90] leading-snug">
                  Gemini 1.5 Flash &amp; Pro with generous free tier quotas from Google AI Studio.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderSelect('openai')}
                className={`p-4 rounded border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-[#C5A059] bg-[#0B3B2C] text-[#FDFBF7] shadow-lg'
                    : 'border-white/10 bg-[#071C16] text-[#8E9B90] hover:border-[#C5A059]/40 hover:text-[#FDFBF7]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm">OpenAI</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                    GPT-4o
                  </span>
                </div>
                <p className="text-xs text-[#8E9B90] leading-snug">
                  GPT-4o Mini and GPT-4o for complex multi-factor causal analysis.
                </p>
              </button>
            </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="settings-api-key" className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block">
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
                  className="text-xs text-[#E0C588] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/70" />
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
                  className="w-full rounded text-xs font-mono pl-10 pr-24 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/40"
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 text-[#8E9B90] hover:text-[#FDFBF7] transition-colors"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="p-1 text-[#8E9B90] hover:text-[#F87171] transition-colors"
                      title="Clear key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Model Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="settings-model-select" className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block">
                  Model Variant
                </label>
                <div className="relative">
                  <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/70" />
                  <select
                    id="settings-model-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded text-xs pl-10 pr-4 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors appearance-none cursor-pointer"
                  >
                    {(AVAILABLE_MODELS[provider as 'gemini' | 'openai'] || []).map((m) => (
                      <option key={m.id} value={m.id} className="bg-[#071C16] text-[#FDFBF7]">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase tracking-wider block">
                  Key Privacy & Encryption
                </label>
                <div className="p-2.5 rounded border border-white/5 bg-[#071C16] text-xs text-[#8E9B90] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
                  <span>Stored locally in client session storage. Never sent to any central backend.</span>
                </div>
              </div>
            </div>

            {/* Test Connection Banner */}
            {testResult && (
              <div
                className={`p-3.5 rounded border flex items-start gap-3 ${
                  testResult.success
                    ? 'border-[#16A34A]/40 bg-[#16A34A]/10 text-[#4ADE80]'
                    : 'border-[#9E2A2B]/40 bg-[#9E2A2B]/10 text-[#F87171]'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-0.5">
                  <span className="font-mono text-[10px] uppercase font-bold block">
                    {testResult.success ? 'API ENDPOINT REACHABLE' : 'CONNECTION VERIFICATION FAILED'}
                  </span>
                  <p className="text-xs text-[#FDFBF7]/90 leading-relaxed">{testResult.message}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !apiKey.trim()}
                className="btn-royal-outline text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing Endpoint...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Test API Connection</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveCredentials}
                className="btn-royal-gold text-xs px-6 py-2.5 flex items-center gap-2"
              >
                <span>Save Credentials</span>
              </button>
            </div>
          </div>
      </div>

      {/* Model Spec Card */}
      <div className="royal-card p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#C5A059]" />
            <h2 className="text-xl font-editorial text-[#FDFBF7]">Royal Operations Intelligence Engine</h2>
          </div>
          <p className="text-xs text-[#8E9B90] leading-relaxed">
            Designed for franchise executives. Distinguishes hard evidence (POS sales, RFID inventory, delivery timestamps)
            from causal hypotheses (supplier delays, shrinkage, stockroom mismanagement).
          </p>
        </div>

        {info && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5 text-xs">
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">VERSION</span>
              <span className="font-mono text-[#E0C588] mt-0.5 block">{info.version}</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">STORES MONITORED</span>
              <span className="font-mono text-[#FDFBF7] mt-0.5 block">{info.storeCount} Sites</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">ACTION DIRECTIVES</span>
              <span className="font-mono text-[#FDFBF7] mt-0.5 block">{info.actionCount} Items</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#071C16]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">GOVERNANCE MODE</span>
              <span className="font-mono text-[#16A34A] mt-0.5 block">HUMAN SIGN-OFF</span>
            </div>
          </div>
        )}

        {/* Featured Store 17 Scenario Specs */}
        <div className="p-5 rounded border border-[#C5A059]/20 bg-[#071C16] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#C5A059] uppercase">FEATURED BENCHMARK · STORE 017</span>
            <span className="badge-royal-critical">CRITICAL SURVEILLANCE</span>
          </div>
          <p className="text-xs text-[#8E9B90] leading-relaxed">
            Store 017 (Tacoma Downtown) embodies the signature scenario: Revenue -18%, Footfall -5%, Transactions -15%,
            Wastage +28%, 12 fast-moving stockouts, and Purchase Order CF-10482 delayed.
          </p>
          <div className="text-[11px] text-[#8E9B90] pt-1 border-t border-white/5 font-mono">
            CALIBRATION PROTOCOL: Separates observed telemetry from diagnostic conjecture.
          </div>
        </div>
      </div>

    </div>
  );
}
