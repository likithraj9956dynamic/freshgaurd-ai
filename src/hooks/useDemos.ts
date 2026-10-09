// ============================================================
// FreshGuard AI — Hooks: useDemos
// ============================================================

import React from 'react';
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

interface DemoData {
  stores: typeof STORES;
  issues: typeof ISSUES;
  investigations: typeof INVESTIGATIONS;
  decisions: typeof DECISION_OPTIONS;
  actions: typeof ACTIONS;
  tasks: typeof STORE_MANAGER_TASKS;
  network: typeof NETWORK_STORES;
  transfers: typeof TRANSFER_OPPORTUNITIES;
  sales: typeof STORE_17_SALES;
  wastage: typeof STORE_17_WASTAGE;
  purchaseOrder: typeof STORE_17_PURCHASE_ORDER;
  compliance: typeof STORE_17_COMPLIANCE;
  products: typeof PRODUCTS;
  inventory: typeof STORE_17_INVENTORY;
  demoInfo: typeof DEMO_DATA_INFO;
}

// Provider for demo data state
export function useDemos() {
  const [data, setData] = React.useState<DemoData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDemo, setIsDemo] = React.useState(true);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [successMessages, setSuccessMessages] = React.useState<string[]>([]);

  React.useEffect(() => {
    // In demo mode, load data directly (deterministic)
    setIsLoading(true);

    // Simulate async data loading
    const timer = setTimeout(() => {
      setData({
        stores: STORES,
        issues: ISSUES,
        investigations: INVESTIGATIONS,
        decisions: DECISION_OPTIONS,
        actions: ACTIONS,
        tasks: STORE_MANAGER_TASKS,
        network: NETWORK_STORES,
        transfers: TRANSFER_OPPORTUNITIES,
        sales: STORE_17_SALES,
        wastage: STORE_17_WASTAGE,
        purchaseOrder: STORE_17_PURCHASE_ORDER,
        compliance: STORE_17_COMPLIANCE,
        products: PRODUCTS,
        inventory: STORE_17_INVENTORY,
        demoInfo: DEMO_DATA_INFO,
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // Listen for demo refresh events
    const handleRefresh = () => {
      // In demo mode, data is deterministic - just log
      console.log('[Demo] Refreshed demo data');
    };

    const handleReset = () => {
      console.log('[Demo] Demo data reset');
    };

    window.addEventListener('demo:refresh', handleRefresh);
    window.addEventListener('demo:reset', handleReset);

    return () => {
      window.removeEventListener('demo:refresh', handleRefresh);
      window.removeEventListener('demo:reset', handleReset);
    };
  }, []);

  const refresh = () => {
    // Demo: data is deterministic, but trigger a re-render
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData((prev: DemoData | null) => prev ? { ...prev, demoInfo: { ...prev.demoInfo, generatedAt: new Date().toISOString() } } : null);
      setIsLoading(false);
    }, 300);
    return timer;
  };

  const resetDemoData = () => {
    setErrors([]);
    setSuccessMessages(['Demo data reset. All data is sample data for frontend development.']);
    // Reset data to initial state
    setData({
      stores: STORES,
      issues: ISSUES,
      investigations: INVESTIGATIONS,
      decisions: DECISION_OPTIONS,
      actions: ACTIONS,
      tasks: STORE_MANAGER_TASKS,
      network: NETWORK_STORES,
      transfers: TRANSFER_OPPORTUNITIES,
      sales: STORE_17_SALES,
      wastage: STORE_17_WASTAGE,
      purchaseOrder: STORE_17_PURCHASE_ORDER,
      compliance: STORE_17_COMPLIANCE,
      products: PRODUCTS,
      inventory: STORE_17_INVENTORY,
      demoInfo: DEMO_DATA_INFO,
    });
    setTimeout(() => {
      setSuccessMessages((prev) => prev.slice(1));
    }, 3000);
  };

  return {
    data,
    isLoading,
    isDemo,
    setIsDemo,
    errors,
    successMessages,
    refresh,
    resetDemoData,
  };
}
