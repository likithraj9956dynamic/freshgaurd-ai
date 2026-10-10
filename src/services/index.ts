// ============================================================
// FreshGuard AI — Services: Registry & Demo State
// ============================================================

import type {
  Store,
  SalesMetric,
  WastageRecord,
  DetectedIssue,
  Investigation,
  DecisionOption,
  Action,
  StoreTask,
  NetworkStore,
  TransferOpportunity,
} from '../types';
import {
  MockStoreService,
  MockAnalyticsService,
  MockInvestigationService,
  MockDecisionService,
  MockActionService,
  MockTaskService,
  MockNetworkService,
} from './mock-services';

// Export service instances for use throughout the app.
export const storeService = new MockStoreService();
export const analyticsService = new MockAnalyticsService();
export const investigationService = new MockInvestigationService();
export const decisionService = new MockDecisionService();
export const actionService = new MockActionService();
export const taskService = new MockTaskService();
export const networkService = new MockNetworkService();

// --- Demo State (for cross-component state management) ---
import { create } from 'zustand';

interface DemoState {
  isLoading: boolean;
  isDemo: boolean;
  refresh: () => void;
  setLoading: (loading: boolean) => void;
  resetDemoData: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  isLoading: false,
  isDemo: true,
  refresh: () => {
    // In demo mode, this just logs - data is deterministic.
    console.log('[Demo] Refresh called - data is deterministic');
  },
  setLoading: (loading) => set({ isLoading: loading }),
  resetDemoData: () => {
    console.log('[Demo] Demo data reset (frontend-only)');
  },
}));

// --- Demo Data Info ---
export { DEMO_DATA_INFO } from '../mocks';

// --- Open Food Facts API Service ---
export * from './openfoodfacts';

// --- AI Intelligence & API Connector ---
export * from './ai';
export * from './ai-store';

// --- Machine Learning Intelligence ---
export * from './ml';

