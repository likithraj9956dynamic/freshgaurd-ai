// ============================================================
// FreshGuard AI — Backend API Client
// Connects the frontend to the real Express/Prisma backend.
// Falls back gracefully to mock data when the backend is
// unavailable or DATABASE_URL is not configured.
// ============================================================

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '') + '/api/v1';

// ─── Generic fetch wrapper ──────────────────────────────────
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message || `API error ${res.status}`);
  }
  return res.json();
}

// ─── Health check (used to detect backend availability) ────
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const data = await apiFetch<{ status: string }>('/health');
    return data?.status === 'ok';
  } catch {
    return false;
  }
}

// ─── Stores ────────────────────────────────────────────────
export async function fetchStores() {
  return apiFetch<any[]>('/stores');
}

export async function fetchStoreSales(storeId: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<any[]>(`/stores/${storeId}/sales${qs}`);
}

export async function fetchStoreInventory(storeId: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<any[]>(`/stores/${storeId}/inventory${qs}`);
}

export async function fetchStoreWastage(storeId: string, params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<any[]>(`/stores/${storeId}/wastage${qs}`);
}

export async function fetchStorePurchaseOrders(storeId: string) {
  return apiFetch<any[]>(`/stores/${storeId}/purchase-orders`);
}

// ─── Analytics ─────────────────────────────────────────────
export async function fetchAnalyticsOverview(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<any>(`/analytics/overview${qs}`);
}

export async function fetchStoresAnalytics(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<any[]>(`/analytics/stores${qs}`);
}

// ─── Investigations ────────────────────────────────────────
export async function fetchInvestigations(storeId: string) {
  return apiFetch<any[]>(`/stores/${storeId}/investigations`);
}

export async function fetchInvestigationById(id: string) {
  return apiFetch<any>(`/investigations/${id}`);
}

// ─── Decisions ─────────────────────────────────────────────
export async function fetchDecisions(storeId: string) {
  return apiFetch<any[]>(`/stores/${storeId}/decisions`);
}

export async function createDecision(payload: unknown) {
  return apiFetch<any>('/decisions', { method: 'POST', body: JSON.stringify(payload) });
}

// ─── Actions ───────────────────────────────────────────────
export async function fetchActions(storeId: string) {
  return apiFetch<any[]>(`/stores/${storeId}/actions`);
}

export async function executeAction(actionId: string, payload: unknown) {
  return apiFetch<any>(`/actions/${actionId}/execute`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── AI Briefing ───────────────────────────────────────────
export async function fetchBriefing(storeId?: string) {
  const qs = storeId ? `?storeId=${storeId}` : '';
  return apiFetch<any>(`/briefing${qs}`);
}

export async function generateBriefing(payload: unknown) {
  return apiFetch<any>('/briefing/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── AI Assistant ──────────────────────────────────────────
export async function sendAssistantMessage(payload: { message: string; sessionId?: string; storeId?: string }) {
  return apiFetch<any>('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Data Import ───────────────────────────────────────────
export async function triggerDataImport(payload: unknown) {
  return apiFetch<any>('/import', { method: 'POST', body: JSON.stringify(payload) });
}
