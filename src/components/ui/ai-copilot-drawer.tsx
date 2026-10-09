// ============================================================
// FreshGuard AI — UI: Executive Operations AI Copilot Drawer
// Enterprise Retail Intelligence Powered by Google Gemini
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  Zap,
} from 'lucide-react';
import { useAIStore } from '../../services/ai-store';

const SUGGESTED_QUERIES = [
  'Why is Store 017 revenue down 18%?',
  'Recommend markdown schedule for perishable dairy',
  'Analyze transfer feasibility: Bellevue to Tacoma',
  'What caused PO CF-10482 delay?',
];

export function AICopilotDrawer() {
  const {
    isCopilotOpen,
    closeCopilot,
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs pointer-events-auto transition-opacity animate-in fade-in duration-200"
        onClick={closeCopilot}
      />

      {/* Slide-over Drawer */}
      <aside
        className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-auto"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-screen max-w-md sm:max-w-lg bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <span>Operations Intelligence Copilot</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Gemini Active
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real-time FreshBasket store telemetry &amp; causal diagnostics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearCopilot}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={closeCopilot}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close copilot drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Query Suggestions */}
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              <Zap className="w-3 h-3 text-emerald-700" />
              <span>Prompt Directives:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendCopilotMessage(q)}
                  disabled={isCopilotLoading}
                  className="text-[11px] px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-800 transition-colors text-left shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 app-scrollbar bg-slate-50/30">
            {copilotMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isAssistant ? 'justify-start' : 'justify-end'
                  }`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-emerald-700" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed relative group ${
                      isAssistant
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {/* Render message content */}
                    <div className="whitespace-pre-wrap font-sans text-xs space-y-1.5">
                      {msg.content}
                    </div>

                    <div className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t text-[10px] ${
                      isAssistant ? 'border-slate-100 text-slate-400' : 'border-emerald-600/60 text-emerald-100'
                    }`}>
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-slate-800 flex items-center gap-1"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
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
                    <div className="w-6 h-6 rounded bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}

            {isCopilotLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Bot className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="rounded-lg p-3 bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                  <span>Synthesizing Gemini operational intelligence...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about Store 017, stockouts, transfers, waste..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isCopilotLoading}
                className="w-full rounded-md text-xs pl-3 pr-10 py-2.5 bg-slate-50 text-slate-900 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:outline-none transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isCopilotLoading}
                className="absolute right-1.5 p-1.5 rounded-md bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
