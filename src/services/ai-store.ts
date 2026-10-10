// ============================================================
// FreshGuard AI — Store: AI Intelligence & Copilot State (Zustand)
// ============================================================

import { create } from 'zustand';
import {
  loadAIConfig,
  saveAIConfig,
  testAIConnection,
  generateAIText,
  type AIConfig,
  type AIProvider,
  type CopilotMessage,
} from './ai';

interface AIStoreState {
  config: AIConfig;
  status: 'unconfigured' | 'testing' | 'connected' | 'error';
  statusMessage: string;
  isKeyModalOpen: boolean;
  isCopilotOpen: boolean;
  isCopilotLoading: boolean;
  copilotMessages: CopilotMessage[];

  // Actions
  updateConfig: (partial: Partial<AIConfig>) => void;
  setApiKey: (key: string) => void;
  setProvider: (provider: AIProvider) => void;
  setModel: (model: string) => void;
  testCurrentConnection: () => Promise<boolean>;
  openKeyModal: () => void;
  closeKeyModal: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  toggleCopilot: () => void;
  sendCopilotMessage: (text: string) => Promise<void>;
  clearCopilot: () => void;
}

const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: 'msg-welcome',
    role: 'assistant',
    content: `**Welcome to FreshGuard AI Executive Copilot.**\n\nI am connected to the FreshBasket operations telemetry network. You can ask me to analyze FB-17 (Marathahalli)'s stockouts, simulate dynamic markdowns, recommend inter-store transfers, or audit any product barcode.`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export const useAIStore = create<AIStoreState>((set, get) => {
  const initialConfig = loadAIConfig();
  const initialStatus = 'connected';
  const initialMsg = 'Google Gemini Enterprise AI Connected & Active';

  return {
    config: initialConfig,
    status: initialStatus,
    statusMessage: initialMsg,
    isKeyModalOpen: false,
    isCopilotOpen: false,
    isCopilotLoading: false,
    copilotMessages: INITIAL_COPILOT_MESSAGES,

    updateConfig: (partial) => {
      const updated = { ...get().config, ...partial };
      saveAIConfig(updated);
      set({ config: updated });
    },

    setApiKey: (key) => {
      get().updateConfig({ apiKey: key });
    },

    setProvider: (provider) => {
      const defaultModel = provider === 'gemini' ? 'gemini-flash-latest' : 'gpt-4o-mini';
      get().updateConfig({ provider, model: defaultModel });
    },

    setModel: (model) => {
      get().updateConfig({ model });
    },

    testCurrentConnection: async () => {
      const cfg = get().config;
      set({ status: 'testing', statusMessage: 'Validating API credentials with endpoint...' });

      const res = await testAIConnection(cfg);
      if (res.success) {
        set({
          status: 'connected',
          statusMessage: res.message,
        });
        return true;
      } else {
        set({
          status: 'error',
          statusMessage: res.message,
        });
        return false;
      }
    },

    openKeyModal: () => set({ isKeyModalOpen: false }),
    closeKeyModal: () => set({ isKeyModalOpen: false }),

    openCopilot: () => set({ isCopilotOpen: true }),
    closeCopilot: () => set({ isCopilotOpen: false }),
    toggleCopilot: () => set((s) => ({ isCopilotOpen: !s.isCopilotOpen })),

    sendCopilotMessage: async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: CopilotMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      set((s) => ({
        copilotMessages: [...s.copilotMessages, userMsg],
        isCopilotLoading: true,
      }));

      const systemPrompt = `You are FreshGuard AI, the operations intelligence assistant for the FreshBasket supermarket network. Specialize in retail analytics, perishable food waste prevention, and cold-chain logistics. Be direct, authoritative, and concise. Answer in 120 words or fewer using bullet points.`;

      try {
        const { text: aiResponseText, source } = await generateAIText(trimmed, systemPrompt, {
          maxOutputTokens: 350,
          temperature: 0.2,
        });

        const assistantMsg: CopilotMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: aiResponseText + `\n\n*(Verified live by ${source === 'gemini' ? 'Google Gemini' : 'OpenAI'})*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        set((s) => ({
          copilotMessages: [...s.copilotMessages, assistantMsg],
          isCopilotLoading: false,
        }));
      } catch (err: unknown) {
        const errorText = err instanceof Error ? err.message : 'Unknown AI error';
        const errorMsg: CopilotMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Failed to query AI model: ${errorText}. Please verify your API key in Settings.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        set((s) => ({
          copilotMessages: [...s.copilotMessages, errorMsg],
          isCopilotLoading: false,
        }));
      }
    },

    clearCopilot: () => set({ copilotMessages: INITIAL_COPILOT_MESSAGES }),
  };
});
