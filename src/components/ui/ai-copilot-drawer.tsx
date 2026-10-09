// ============================================================
// FreshGuard AI — UI: Executive AI Copilot Drawer (shadcn-inspired)
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Sliders,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { useAIStore } from '../../services/ai-store';
import { Badge } from './badge';

const SUGGESTED_QUERIES = [
  'Why is Store 017 revenue down 18%?',
  'Recommend markdown strategy for dairy inventory',
  'Analyze transfer feasibility: Bellevue to Tacoma',
  'What caused PO CF-10482 delay?',
];

export function AICopilotDrawer() {
  const {
    config,
    isCopilotOpen,
    closeCopilot,
    openKeyModal,
    copilotMessages,
    isCopilotLoading,
    sendCopilotMessage,
    clearCopilot,
  } = useAIStore();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isCopilotOpen) {
      scrollToBottom();
    }
  }, [copilotMessages, isCopilotOpen]);

  if (!isCopilotOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isCopilotLoading) return;
    const text = input;
    setInput('');
    sendCopilotMessage(text);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providerLabel =
    config.provider === 'gemini'
      ? config.apiKey
        ? 'Gemini Live'
        : 'Gemini (Unconfigured)'
      : config.provider === 'openai'
      ? config.apiKey
        ? 'OpenAI Live'
        : 'OpenAI (Unconfigured)'
      : 'Simulation AI';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity animate-in fade-in duration-200"
        onClick={closeCopilot}
      />

      {/* Slide-over Drawer */}
      <aside
        className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-screen max-w-md sm:max-w-lg bg-gradient-to-b from-[#0A241D] to-[#041410] border-l border-[#C5A059]/30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#C5A059]/20 flex items-center justify-between bg-[#041410]/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div>
                <h3 className="font-editorial text-lg text-[#FDFBF7] flex items-center gap-2">
                  <span>Executive Copilot</span>
                  <Badge variant={config.apiKey ? 'success' : 'gold'}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {providerLabel}
                  </Badge>
                </h3>
                <p className="text-[10px] font-mono text-[#8E9B90] mt-0.5">
                  FRESHGUARD INTELLIGENCE ENGINE · {config.model}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openKeyModal}
                className="p-1.5 rounded text-[#8E9B90] hover:text-[#E0C588] hover:bg-white/5 transition-colors"
                title="Configure AI API Key"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={clearCopilot}
                className="p-1.5 rounded text-[#8E9B90] hover:text-[#F87171] hover:bg-white/5 transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeCopilot}
                className="p-1.5 rounded text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5 transition-colors"
                aria-label="Close copilot drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Query Suggestions */}
          <div className="px-5 py-3 border-b border-white/5 bg-[#071C16]/50">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C5A059] uppercase mb-2">
              <Zap className="w-3 h-3" />
              <span>Prompt Starters:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendCopilotMessage(q)}
                  disabled={isCopilotLoading}
                  className="text-[11px] px-2.5 py-1 rounded border border-white/10 bg-[#071C16] text-[#8E9B90] hover:text-[#FDFBF7] hover:border-[#C5A059]/40 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 app-scrollbar">
            {copilotMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded border border-[#C5A059]/30 bg-[#0B3B2C] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-[#C5A059]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded p-3.5 text-xs leading-relaxed relative group ${
                      isAssistant
                        ? 'bg-[#071C16] border border-[#C5A059]/20 text-[#FDFBF7]'
                        : 'bg-[#0B3B2C] border border-[#C5A059]/40 text-[#FDFBF7]'
                    }`}
                  >
                    {/* Render message content */}
                    <div className="whitespace-pre-wrap font-sans text-xs space-y-1.5">
                      {msg.content}
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2 pt-1 border-t border-white/5 text-[10px] font-mono text-[#8E9B90]">
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#E0C588] flex items-center gap-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#16A34A]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded border border-white/20 bg-[#0A241D] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-[#E0C588]" />
                    </div>
                  )}
                </div>
              );
            })}

            {isCopilotLoading && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded border border-[#C5A059]/30 bg-[#0B3B2C] flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <div className="rounded p-3.5 bg-[#071C16] border border-[#C5A059]/20 text-xs text-[#E0C588] flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                  <span>Synthesizing operational intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-[#C5A059]/20 bg-[#041410]">
            {!config.apiKey && (
              <div className="mb-2 p-2 rounded border border-[#C5A059]/20 bg-[#0B3B2C]/40 text-[11px] text-[#E0C588] flex items-center justify-between">
                <span>Running in simulation. Add your API key for live AI.</span>
                <button
                  type="button"
                  onClick={openKeyModal}
                  className="underline hover:text-white font-mono text-[10px]"
                >
                  Configure
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about Store 017, stockouts, transfers..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isCopilotLoading}
                className="w-full rounded text-xs pl-4 pr-11 py-3 bg-[#071C16] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none transition-colors placeholder:text-[#8E9B90]/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isCopilotLoading}
                className="absolute right-2 p-2 rounded bg-[#C5A059] text-[#041410] hover:bg-[#D4B26F] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </aside>
    </div>
  );
}
