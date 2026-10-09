// ============================================================
// FreshGuard AI — Services: Mock Implementations
// ============================================================

import type {
  StoreService,
  AnalyticsService,
  InvestigationService,
  DecisionService,
  ActionService,
  TaskService,
  NetworkService,
} from './interfaces';
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
  STORES,
  STORE_17_ID,
  PRODUCTS,
  STORE_17_INVENTORY,
  STORE_17_SALES,
  STORE_17_WASTAGE,
  STORE_17_PURCHASE_ORDER,
  STORE_17_COMPLIANCE,
  ISSUES,
  INVESTIGATIONS,
  DECISION_OPTIONS,
  ACTIONS,
  STORE_MANAGER_TASKS,
  NETWORK_STORES,
  TRANSFER_OPPORTUNITIES,
  DEMO_DATA_INFO,
} from '../mocks';

// --- Store Service (Mock) ---
export class MockStoreService implements StoreService {
  async getStores(): Promise<Store[]> {
    return STORES;
  }

  async getStore(id: string): Promise<Store | undefined> {
    return STORES.find((s) => s.id === id);
  }

  async searchStores(query: string): Promise<Store[]> {
    const q = query.toLowerCase();
    return STORES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.storeNumber.includes(q) ||
        s.location.city.toLowerCase().includes(q) ||
        s.location.state.toLowerCase().includes(q),
    );
  }

  async getDemoStores(): Promise<Store[]> {
    return STORES;
  }
}

// --- Analytics Service (Mock) ---
export class MockAnalyticsService implements AnalyticsService {
  async getSalesMetric(storeId: string): Promise<SalesMetric | undefined> {
    return STORE_17_SALES;
  }

  async getDemoSalesMetric(storeId: string): Promise<SalesMetric | undefined> {
    return STORE_17_SALES;
  }

  async getWastageRecords(storeId: string): Promise<WastageRecord[]> {
    return STORE_17_WASTAGE;
  }

  async getDemoWastageRecords(storeId: string): Promise<WastageRecord[]> {
    return STORE_17_WASTAGE;
  }
}

// --- Investigation Service (Mock) ---
export class MockInvestigationService implements InvestigationService {
  async getInvestigation(id: string): Promise<Investigation | undefined> {
    return INVESTIGATIONS.find((i) => i.id === id);
  }

  async getDemoInvestigation(id: string): Promise<Investigation | undefined> {
    return INVESTIGATIONS.find((i) => i.id === id);
  }

  async getIssues(storeId: string): Promise<DetectedIssue[]> {
    return ISSUES.filter((i) => i.storeId === storeId || storeId === STORE_17_ID);
  }

  async getDemoIssues(storeId: string): Promise<DetectedIssue[]> {
    return ISSUES.filter((i) => i.storeId === storeId || storeId === STORE_17_ID);
  }
}

// --- Decision Service (Mock) ---
export class MockDecisionService implements DecisionService {
  async getDecisionOptions(storeId: string): Promise<DecisionOption[]> {
    return DECISION_OPTIONS;
  }

  async getDemoDecisionOptions(storeId: string): Promise<DecisionOption[]> {
    return DECISION_OPTIONS;
  }
}

// --- Action Service (Mock) ---
export class MockActionService implements ActionService {
  private actions = [...ACTIONS];

  async getActions(): Promise<Action[]> {
    return this.actions;
  }

  async getDemoActions(): Promise<Action[]> {
    return this.actions;
  }

  async updateActionStatus(id: string, status: Action['status']): Promise<Action | undefined> {
    const index = this.actions.findIndex((a) => a.id === id);
    if (index === -1) return undefined;
    this.actions[index] = { ...this.actions[index], status };
    return this.actions[index];
  }

  async demoUpdateActionStatus(id: string, status: Action['status']): Promise<Action | undefined> {
    return this.updateActionStatus(id, status);
  }
}

// --- Task Service (Mock) ---
export class MockTaskService implements TaskService {
  private tasks = [...STORE_MANAGER_TASKS];

  async getTasks(storeId: string): Promise<StoreTask[]> {
    return STORE_MANAGER_TASKS.filter((t) => t.storeId === storeId);
  }

  async getDemoTasks(storeId: string): Promise<StoreTask[]> {
    return STORE_MANAGER_TASKS.filter((t) => t.storeId === storeId);
  }

  async updateTaskStatus(id: string, status: StoreTask['status']): Promise<StoreTask | undefined> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.tasks[index] = { ...this.tasks[index], status };
    if (status === 'completed') {
      this.tasks[index].completedBy = 'Store Manager';
      this.tasks[index].completedAt = new Date().toISOString();
    }
    return this.tasks[index];
  }

  async demoUpdateTaskStatus(id: string, status: StoreTask['status']): Promise<StoreTask | undefined> {
    return this.updateTaskStatus(id, status);
  }
}

// --- Network Service (Mock) ---
export class MockNetworkService implements NetworkService {
  async getNetworkStores(): Promise<NetworkStore[]> {
    return NETWORK_STORES;
  }

  async getDemoNetworkStores(): Promise<NetworkStore[]> {
    return NETWORK_STORES;
  }

  async getTransferOpportunities(): Promise<TransferOpportunity[]> {
    return TRANSFER_OPPORTUNITIES;
  }

  async getDemoTransferOpportunities(): Promise<TransferOpportunity[]> {
    return TRANSFER_OPPORTUNITIES;
  }
}
