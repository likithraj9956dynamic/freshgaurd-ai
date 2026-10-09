// ============================================================
// FreshGuard AI — Mock Data: Store Manager Tasks
// ============================================================

import type { StoreTask, TaskEvidence } from '../types';

export const STORE_MANAGER_TASKS: StoreTask[] = [
  {
    id: 'task-001',
    storeId: '1012',
    title: 'Inspect fast-moving products',
    description: 'Verify inventory levels for 12 fast-moving products.',
    instruction: 'Walk the store and check that the 12 identified products are on shelves in required quantities. Note any issues in the inventory log.',
    priority: 'urgent',
    affectedProducts: ['Baby Spinach', 'Ground Beef', 'Chicken Breast', 'Artisan Bagels', 'Blueberries', 'Heavy Cream', 'Sourdough', 'Olive Oil', 'Eggs', 'Bananas', 'Milk', 'Salmon'],
    dueDate: '2026-10-09T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Affected Products', detail: '12 items', source: 'FreshGuard AI' },
    ],
    createdAt: '2026-10-08T08:00:00Z',
  },
  {
    id: 'task-002',
    storeId: '1012',
    title: 'Review fresh-food wastage',
    description: 'Review today\'s fresh-food wastage.',
    instruction: 'Check the waste log for today. Note any patterns in wastage (dates, departments, product names) to help identify root causes.',
    priority: 'high',
    affectedProducts: ['Baby Spinach', 'Baby Carrots', 'Ground Beef'],
    dueDate: '2026-10-09T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Wastage Records', detail: '4 records filed', source: 'Waste Tracking' },
      { label: 'Wastage Trend', detail: '+28% this week', source: 'Waste Tracking' },
    ],
    createdAt: '2026-10-08T08:00:00Z',
  },
  {
    id: 'task-003',
    storeId: '1012',
    title: 'Confirm PO status',
    description: 'Confirm the status of purchase order CF-10482.',
    instruction: 'Call the supplier with the order number and check delivery timing. Note the expected arrival time in the system.',
    priority: 'normal',
    affectedProducts: ['Ground Beef', 'Chicken Breast', 'Bagels', 'Baby Spinach'],
    dueDate: '2026-10-09T12:00:00Z',
    status: 'acknowledged',
    assignedTo: 'Procurement Lead',
    evidence: [
      { label: 'Order Number', detail: 'CF-10482', source: 'Procurement System' },
      { label: 'Expected Delivery', detail: 'Oct 6, 2026 2:00 PM', source: 'Procurement System' },
    ],
    createdAt: '2026-10-07T10:00:00Z',
  },
  {
    id: 'task-004',
    storeId: '1012',
    title: 'Complete compliance checklist',
    description: 'Complete the weekly compliance checklist.',
    instruction: 'Complete the temperature log review, shelf-life label check, and waste disposal log for the past week.',
    priority: 'high',
    affectedProducts: [],
    dueDate: '2026-10-10T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Compliance Issues', detail: '2 flags', source: 'Compliance System' },
    ],
    createdAt: '2026-10-06T14:00:00Z',
  },
];
