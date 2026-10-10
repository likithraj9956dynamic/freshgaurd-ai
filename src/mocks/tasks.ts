// ============================================================
// FreshGuard AI — Mock Data: Store Manager Tasks
// ============================================================

import type { StoreTask, TaskEvidence } from '../types';
import { STORE_17_ID } from './stores';

export const STORE_MANAGER_TASKS: StoreTask[] = [
  {
    id: 'task-001',
    storeId: STORE_17_ID,
    title: 'Inspect fast-moving fresh products',
    description: 'Verify inventory shelf stock for 12 fast-moving products.',
    instruction: 'Walk the store floor and check that critical fast movers are stocked. Flag items with near-zero stock in the register.',
    priority: 'urgent',
    affectedProducts: ['Milk Bread', 'Brown Bread', 'Curd 400g', 'Paneer 200g', 'Tomato 1kg', 'Onion 1kg', 'Banana (dozen)', 'Spinach', 'Dosa Batter 1kg', 'Chapati (10)', 'Toned Milk 500ml', 'Idli Batter 1kg'],
    dueDate: '2026-11-13T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Affected Products', detail: '12 items from products.csv', source: 'FreshGuard AI' },
    ],
    createdAt: '2026-11-12T08:00:00Z',
  },
  {
    id: 'task-002',
    storeId: STORE_17_ID,
    title: 'Review fresh-food wastage log',
    description: 'Review today\'s perishable wastage entries.',
    instruction: 'Check the waste log for today against wastage.csv patterns. Note department breakdown (Bakery & Dairy) to identify handling causes.',
    priority: 'high',
    affectedProducts: ['Tomato 1kg', 'Spinach', 'Curd 400g', 'Brown Bread'],
    dueDate: '2026-11-13T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Wastage Records', detail: '4 records filed', source: 'dataset/wastage.csv' },
      { label: 'Wastage Trend', detail: '+28% this week', source: 'Waste Tracking' },
    ],
    createdAt: '2026-11-12T08:00:00Z',
  },
  {
    id: 'task-003',
    storeId: STORE_17_ID,
    title: 'Confirm PO status with Namdhari Fresh',
    description: 'Confirm the status of delayed purchase order PO-7106.',
    instruction: 'Contact Namdhari Fresh dispatch regarding delayed order PO-7106. Record ETA for Chapati and Onion delivery.',
    priority: 'normal',
    affectedProducts: ['Chapati (10)', 'Onion 1kg', 'Dosa Batter 1kg', 'Banana Cake'],
    dueDate: '2026-11-13T12:00:00Z',
    status: 'acknowledged',
    assignedTo: 'Procurement Lead',
    evidence: [
      { label: 'Order Number', detail: 'PO-7106', source: 'dataset/purchase_orders.csv' },
      { label: 'Status', detail: 'Delayed – no revised date', source: 'dataset/purchase_orders.csv' },
    ],
    createdAt: '2026-11-11T10:00:00Z',
  },
  {
    id: 'task-004',
    storeId: STORE_17_ID,
    title: 'Complete pest control & sanitization log',
    description: 'Resolve overdue pest-control documentation flag.',
    instruction: 'Review vendor pest control certificate and verify clean inspection logs for back-room storage.',
    priority: 'high',
    affectedProducts: [],
    dueDate: '2026-11-14T12:00:00Z',
    status: 'pending',
    assignedTo: 'Store Manager',
    evidence: [
      { label: 'Compliance Issues', detail: 'Pest-control record overdue (Score: 87)', source: 'dataset/compliance.csv' },
    ],
    createdAt: '2026-11-10T14:00:00Z',
  },
];

