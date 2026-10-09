// ============================================================
// FreshGuard AI — UI: AI Key & Model Configuration Modal
// ============================================================

import React, { useState } from 'react';
import {
  Sparkles,
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';
import { Badge } from './badge';
import { useAIStore } from '../../services/ai-store';
import { AVAILABLE_MODELS, type AIProvider } from '../../services/ai';
import { useToast } from '../ToastProvider';

export function AIKeyModal() {
  const {
    config,
    status,
    statusMessage,
    isKeyModalOpen,
    closeKeyModal,
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

  // Sync state when modal opens
  React.useEffect(() => {
    if (isKeyModalOpen) {
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
      setTestResult(null);
    }
  }, [isKeyModalOpen, config]);

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    setTestResult(null);
    if (newProvider === 'gemini') {
      setModel('gemini-1.5-flash');
    } else if (newProvider === 'openai') {
      setModel('gpt-4o-mini');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    // Temporarily update config in store so test AI connection uses these inputs
    updateConfig({ provider, apiKey: apiKey.trim(), model });

    const success = await testCurrentConnection();
    setIsTesting(false);

    if (success) {
      setTestResult({
        success: true,
        message: `${provider === 'gemini' ? 'Google Gemini' : 'OpenAI'} API key verified! Ready for live intelligence.`,
      });
      showToast({ type: 'success', title: 'API Key Verified', message: 'Connected to live intelligence endpoint.' });
    } else {
      setTestResult({
        success: false,
        message: useAIStore.getState().statusMessage || 'Verification failed. Please check the key.',
      });
      showToast({ type: 'critical', title: 'Connection Failed', message: 'Please check your API key.' });
    }
  };

  const handleSave = () => {
    updateConfig({
      provider,
      apiKey: apiKey.trim(),
      model,
      isEnabled: true,
    });
    showToast({ type: 'success', title: 'Configuration Saved', message: 'AI credentials updated.' });
    closeKeyModal();
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

  return (
    <Dialog open={isKeyModalOpen} onOpenChange={closeKeyModal}>
      <DialogContent maxWidth="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <Badge variant="gold">AI Engine Connector</Badge>
          </div>
          <DialogTitle>Configure AI API Credentials</DialogTitle>
          <DialogDescription>
            Connect FreshGuard AI to Google Gemini or OpenAI to activate live executive briefings,
            real-time causal reasoning, and Open Food Facts merchandising intelligence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-xs">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="font-mono text-[#C5A059] uppercase tracking-wider block">
              Intelligence Provider
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleProviderChange('gemini')}
                className={`p-3 rounded border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-[#C5A059] bg-[#0B3B2C] text-[#FDFBF7] shadow-md'
                    : 'border-white/10 bg-[#071C16] text-[#8E9B90] hover:border-[#C5A059]/40 hover:text-[#FDFBF7]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">Google Gemini</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C5A059]/20 text-[#E0C588] font-mono">
                    Free Tier
                  </span>
                </div>
                <p className="text-[11px] text-[#8E9B90] leading-snug">
                  High-speed multimodal models (1.5 Flash / Pro).
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange('openai')}
                className={`p-3 rounded border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-[#C5A059] bg-[#0B3B2C] text-[#FDFBF7] shadow-md'
                    : 'border-white/10 bg-[#071C16] text-[#8E9B90] hover:border-[#C5A059]/40 hover:text-[#FDFBF7]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm">OpenAI</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                    GPT-4o
                  </span>
                </div>
                <p className="text-[11px] text-[#8E9B90] leading-snug">
                  GPT-4o Mini and flagship reasoning models.
                </p>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="api-key-input" className="font-mono text-[#C5A059] uppercase tracking-wider block">
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
                  className="text-[11px] text-[#E0C588] hover:underline inline-flex items-center gap-1 font-mono"
                >
                  <span>Get an API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
                <input
                  id="api-key-input"
                  type={showKey ? 'text' : 'password'}
                  placeholder={
                    provider === 'gemini'
                      ? 'AIzaSy...'
                      : 'sk-proj-...'
                  }
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded text-xs font-mono pl-10 pr-24 py-2.5 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/40"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="p-1 text-[#8E9B90] hover:text-[#FDFBF7] transition-colors"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="p-1 text-[#8E9B90] hover:text-[#F87171] transition-colors"
                      title="Clear key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#8E9B90]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>
                  Keys are stored exclusively in your browser's private local storage and never transmitted to third parties.
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="model-select" className="font-mono text-[#C5A059] uppercase tracking-wider block">
                Model Parameter
              </label>
              <div className="relative">
                <Cpu className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]/60" />
                <select
                  id="model-select"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full rounded text-xs pl-10 pr-4 py-2.5 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {(AVAILABLE_MODELS[provider as 'gemini' | 'openai'] || []).map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#071C16] text-[#FDFBF7]">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Test Status Feedback Banner */}
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
                  {testResult.success ? 'AUTHENTICATION SUCCESSFUL' : 'AUTHENTICATION FAILED'}
                </span>
                <p className="text-xs text-[#FDFBF7]/90 leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting || !apiKey.trim()}
            className="btn-royal-outline text-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Pinging API...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Test Connection</span>
                </>
              )}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="btn-royal-gold text-xs px-6 py-2.5 flex items-center justify-center gap-2"
          >
            <span>Save Configuration</span>
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
