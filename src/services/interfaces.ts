// ============================================================
// FreshGuard AI — Services: Interfaces
// ============================================================

import type {
  Store,
  SalesMetric,
  WastageRecord,
  PurchaseOrder,
  DetectedIssue,
  Investigation,
  DecisionOption,
  Action,
  StoreTask,
  NetworkStore,
  TransferOpportunity,
} from '../types';

// --- Store Service ---
export interface StoreService {
  getStores(): Promise<Store[]>;
  getStore(id: string): Promise<Store | undefined>;
  searchStores(query: string): Promise<Store[]>;
  getDemoStores(): Promise<Store[]>;
}

// --- Analytics Service ---
export interface AnalyticsService {
  getSalesMetric(storeId: string): Promise<SalesMetric | undefined>;
  getDemoSalesMetric(storeId: string): Promise<SalesMetric | undefined>;
  getWastageRecords(storeId: string): Promise<WastageRecord[]>;
  getDemoWastageRecords(storeId: string): Promise<WastageRecord[]>;
}

// --- Investigation Service ---
export interface InvestigationService {
  getInvestigation(id: string): Promise<Investigation | undefined>;
  getDemoInvestigation(id: string): Promise<Investigation | undefined>;
  getIssues(storeId: string): Promise<DetectedIssue[]>;
  getDemoIssues(storeId: string): Promise<DetectedIssue[]>;
}

// --- Decision Service ---
export interface DecisionService {
  getDecisionOptions(storeId: string): Promise<DecisionOption[]>;
  getDemoDecisionOptions(storeId: string): Promise<DecisionOption[]>;
}

// --- Action Service ---
export interface ActionService {
  getActions(): Promise<Action[]>;
  getDemoActions(): Promise<Action[]>;
  updateActionStatus(id: string, status: Action['status']): Promise<Action | undefined>;
  demoUpdateActionStatus(id: string, status: Action['status']): Promise<Action | undefined>;
}

// --- Task Service ---
export interface TaskService {
  getTasks(storeId: string): Promise<StoreTask[]>;
  getDemoTasks(storeId: string): Promise<StoreTask[]>;
  updateTaskStatus(id: string, status: StoreTask['status']): Promise<StoreTask | undefined>;
  demoUpdateTaskStatus(id: string, status: StoreTask['status']): Promise<StoreTask | undefined>;
}

// --- Network Service ---
export interface NetworkService {
  getNetworkStores(): Promise<NetworkStore[]>;
  getDemoNetworkStores(): Promise<NetworkStore[]>;
  getTransferOpportunities(): Promise<TransferOpportunity[]>;
  getDemoTransferOpportunities(): Promise<TransferOpportunity[]>;
}
