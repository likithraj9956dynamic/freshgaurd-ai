// ============================================================
// FreshGuard AI — Service: Intelligent AI Engine & API Connector
// Supports Google Gemini API and OpenAI API
// ============================================================

import type { ValidatedOpenFoodFactsProduct } from '../types/openfoodfacts';

export type AIProvider = 'gemini' | 'openai';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  isEnabled: boolean;
}

export interface AIProductAnalysis {
  freshnessRiskScore: number; // 0-100 (higher = higher perishability/spoilage risk)
  freshnessRiskLevel: 'Low' | 'Moderate' | 'Elevated' | 'Critical';
  storageRecommendation: string;
  temperatureTarget: string;
  shelfLifeEstimate: string;
  markdownStrategy: Array<{
    daysRemaining: string;
    discountPct: string;
    action: string;
  }>;
  merchandisingDirectives: string[];
  qualityControlAudit: string[];
  executiveSummary: string;
  source: 'gemini' | 'openai';
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STORAGE_KEY_CONFIG = 'freshguard_ai_config_v1';

// Default initial configuration
export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-1.5-flash',
  isEnabled: true,
};

export const AVAILABLE_MODELS = {
  gemini: [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Ultra-fast & Recommended)' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Deep Reasoning & Analysis)' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Next-gen Latency)' },
  ],
  openai: [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Cost-effective & Fast)' },
    { id: 'gpt-4o', name: 'GPT-4o (Omni Reasoning)' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Legacy)' },
  ],
};

/**
 * Loads AI configuration from localStorage or environment variables.
 */
export function loadAIConfig(): AIConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_AI_CONFIG,
        ...parsed,
      };
    }
  } catch (err) {
    console.warn('[FreshGuard AI] Could not load saved AI config:', err);
  }

  // Check Vite environment variables as fallback
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_OPENAI_API_KEY || '';
  const envProvider = (import.meta as any).env?.VITE_OPENAI_API_KEY ? 'openai' : 'gemini';

  return {
    ...DEFAULT_AI_CONFIG,
    provider: envProvider,
    apiKey: envKey,
  };
}

/**
 * Saves AI configuration to localStorage.
 */
export function saveAIConfig(config: AIConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('freshguard:ai-config-changed', { detail: config }));
  } catch (err) {
    console.error('[FreshGuard AI] Failed to persist AI config:', err);
  }
}

/**
 * Validates and tests an API key against the specified provider.
 */
export async function testAIConnection(config: AIConfig): Promise<{ success: boolean; message: string }> {
  if (!config.apiKey.trim()) {
    return {
      success: false,
      message: 'API Key is required. Please enter your Google Gemini or OpenAI API key.',
    };
  }

  try {
    if (config.provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Respond with the exact word: "READY"' }] }],
          generationConfig: { maxOutputTokens: 10 },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        return { success: false, message: `Gemini verification failed: ${msg}` };
      }

      return { success: true, message: 'Google Gemini API key authenticated and connected successfully!' };
    }

    if (config.provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages: [{ role: 'user', content: 'Respond with the word READY' }],
          max_tokens: 5,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const msg = errorData?.error?.message || `HTTP ${res.status} ${res.statusText}`;
        return { success: false, message: `OpenAI verification failed: ${msg}` };
      }

      return { success: true, message: 'OpenAI API key authenticated and connected successfully!' };
    }

    return { success: false, message: 'Unsupported provider. Please select Google Gemini or OpenAI.' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network failure';
    return { success: false, message: `Connection test error: ${errorMsg}` };
  }
}

/**
 * Universal text generation — supports Google Gemini and OpenAI.
 * Throws if no API key is configured.
 */
export async function generateAIText(prompt: string, systemPrompt?: string): Promise<{ text: string; source: 'gemini' | 'openai' }> {
  const config = loadAIConfig();

  if (!config.apiKey?.trim()) {
    throw new Error('No API key configured. Please add your Google Gemini or OpenAI API key in Settings.');
  }

  if (config.provider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${encodeURIComponent(config.apiKey.trim())}`;
    const combinedPrompt = systemPrompt
      ? `[SYSTEM INSTRUCTION: ${systemPrompt}]\n\n[USER REQUEST]:\n${prompt}`
      : prompt;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = (errorData as any)?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`Gemini API error: ${msg}`);
    }

    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!output) throw new Error('Gemini returned an empty response.');
    return { text: output.trim(), source: 'gemini' };
  }

  if (config.provider === 'openai') {
    const messages: any[] = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: prompt });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = (errorData as any)?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`OpenAI API error: ${msg}`);
    }

    const data = await res.json();
    const output = data.choices?.[0]?.message?.content;
    if (!output) throw new Error('OpenAI returned an empty response.');
    return { text: output.trim(), source: 'openai' };
  }

  throw new Error('Unsupported AI provider. Please select Google Gemini or OpenAI.');
}

/**
 * Analyzes Open Food Facts product telemetry and formulates retail merchandising directives.
 */
export async function analyzeProductWithAI(
  product: ValidatedOpenFoodFactsProduct
): Promise<AIProductAnalysis> {
  const prompt = `
Analyze this retail food product from Open Food Facts telemetry for a premium grocery chain (FreshBasket / FreshGuard AI):
- Product Name: ${product.productName || 'Unknown'}
- Brand: ${product.brands || 'Unknown'}
- Categories: ${product.categories.join(', ') || 'General Grocery'}
- Ingredients: ${product.ingredientsText || 'Not specified'}
- Nutri-Score: ${product.nutriscoreGrade || 'N/A'}
- NOVA Group: ${product.novaGroup ?? 'N/A'}
- Allergens: ${product.allergens || 'None declared'}
- Serving Size / Quantity: ${product.quantity || product.servingSize || 'Standard'}

Produce a structured JSON response with this exact schema:
{
  "freshnessRiskScore": <number between 5 and 95>,
  "freshnessRiskLevel": <"Low" | "Moderate" | "Elevated" | "Critical">,
  "storageRecommendation": <brief storage temperature and humidity directive>,
  "temperatureTarget": <e.g. "2°C - 4°C" or "Ambient 18°C">,
  "shelfLifeEstimate": <estimated retail shelf life, e.g. "3 - 5 Days after display" or "12 Months ambient">,
  "markdownStrategy": [
    { "daysRemaining": "5 Days", "discountPct": "15%", "action": "First markdown tag" },
    { "daysRemaining": "2 Days", "discountPct": "35%", "action": "Flash sale endcap" },
    { "daysRemaining": "1 Day", "discountPct": "60%", "action": "Final clearance / deli repurpose" }
  ],
  "merchandisingDirectives": [<3 concise bullet points for store staff regarding placement, rotation, and display lighting>],
  "qualityControlAudit": [<3 key visual/olfactory criteria for daily staff inspection>],
  "executiveSummary": <concise 2-sentence executive summary of wastage sensitivity and turnover velocity>
}
Respond strictly with valid JSON. No markdown backticks if possible, or inside standard json fences.
`;

  const systemPrompt = 'You are FreshGuard AI, an elite retail operations and perishable inventory intelligence agent for upscale supermarket chains. Output valid JSON only.';

  const { text, source } = await generateAIText(prompt, systemPrompt);

  try {
    // Clean code blocks if present
    const cleanedJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      freshnessRiskScore: Math.min(100, Math.max(0, Number(parsed.freshnessRiskScore) || 45)),
      freshnessRiskLevel: parsed.freshnessRiskLevel || 'Moderate',
      storageRecommendation: parsed.storageRecommendation || 'Store in standard temperature-controlled zone.',
      temperatureTarget: parsed.temperatureTarget || '2°C - 4°C',
      shelfLifeEstimate: parsed.shelfLifeEstimate || '5 - 7 Days',
      markdownStrategy: Array.isArray(parsed.markdownStrategy) ? parsed.markdownStrategy : [],
      merchandisingDirectives: Array.isArray(parsed.merchandisingDirectives) ? parsed.merchandisingDirectives : [],
      qualityControlAudit: Array.isArray(parsed.qualityControlAudit) ? parsed.qualityControlAudit : [],
      executiveSummary: parsed.executiveSummary || 'Verified retail formulation analyzed for operational inventory management.',
      source,
    };
  } catch (err) {
    console.warn('[FreshGuard AI] Could not parse AI JSON response:', err);
    throw new Error('AI returned an unparseable response. Please try again.');
  }
}
