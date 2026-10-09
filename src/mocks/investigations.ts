// ============================================================
// FreshGuard AI — Mock Data: Investigations
// ============================================================

import type { Investigation, InvestigationEvidence, InvestigationAction, InvestigationHypothesis } from '../types';

export const INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv-001',
    issueId: 'issue-001',
    storeId: '1012',
    title: 'Store 17 Revenue Decline Investigation',
    issueTitle: 'Store 17 revenue decline',
    severity: 'critical',
    affectedStore: 'FreshBasket Tacoma Store 17',
    evidenceSummary: 'Sales decline of 18%, transactions down 15%, 12 fast-moving products short on shelves, a delayed supplier delivery, and a 28% increase in fresh-food wastage.',
    hypothesis: {
      main: 'Product availability issues linked to a delayed supplier delivery are contributing to the sales decline.',
      alternatives: [
        'Seasonal demand shift to different product categories',
        'Competitive pricing pressure in the downtown Tacoma market',
        'Customer experience issues unrelated to product availability',
        'Internal staffing or coverage reductions during peak periods',
      ],
      confidence: 62,
      limitations: [
        'No direct transaction-level data linking the late delivery to specific lost sales',
        'Information on concurrent marketing or pricing changes is unavailable at this stage',
        'The wastage increase may be a separate issue or a symptom of stock management problems',
      ],
    },
    evidenceSources: [
      { id: 'e1', label: 'Sales Trend', type: 'metric', value: '-18%', detail: 'Revenue declined from $156,500 to $128,400 over four weeks', source: 'FreshBasket Analytics', isFact: true, isDerived: false, isHypothesis: false },
      { id: 'e2', label: 'Footfall Trend', type: 'metric', value: '-5%', detail: 'Shopper count declined from 2,200 to 2,090', source: 'FreshBasket Analytics', isFact: true, isDerived: false, isHypothesis: false },
      { id: 'e3', label: 'Transaction Volume', type: 'metric', value: '-15%', detail: 'Transactions dropped from 806 to 685', source: 'FreshBasket Analytics', isFact: true, isDerived: false, isHypothesis: false },
      { id: 'e4', label: 'Product Availability', type: 'metric', value: '12 stockouts', detail: '12 fast-moving products below required stock levels', source: 'Inventory System', isFact: true, isDerived: true, isHypothesis: false },
      { id: 'e5', label: 'Supplier Delivery', type: 'record', value: 'Delayed', detail: 'Purchase order CF-10482 expected Oct 6 but delivered late', source: 'Procurement System', isFact: true, isDerived: false, isHypothesis: false },
      { id: 'e6', label: 'Customer Feedback', type: 'note', value: 'Positive mentions of empty produce', detail: 'Store manager reports intermittent customer complaints', source: 'Store Team', isFact: false, isDerived: true, isHypothesis: true },
      { id: 'e7', label: 'Wastage Increase', type: 'metric', value: '+28%', detail: 'Fresh-food wastage rising alongside availability issues', source: 'Waste Tracking', isFact: true, isDerived: true, isHypothesis: false },
      { id: 'e8', label: 'Possible Missing Link', type: 'unknown', value: 'Unknown', detail: 'No direct data connecting the delayed delivery to specific lost transactions', source: 'FreshBasket Analytics', isFact: false, isDerived: false, isHypothesis: true },
    ],
    suggestedActions: [
      { id: 'a1', title: 'Verify product availability data', description: 'Confirm whether the delayed delivery is the cause of the 12 stockouts observed.', type: 'investigate', target: 'Inventory System', priority: 'urgent', status: 'in-progress' },
      { id: 'a2', title: 'Review replenishment frequency', description: 'Evaluate whether ordering frequency for fresh categories should increase.', type: 'recommend', target: 'Procurement', priority: 'high', status: 'pending' },
      { id: 'a3', title: 'Compare with similar stores', description: 'Check whether other urban stores have similar sales patterns.', type: 'investigate', target: 'Analytics', priority: 'normal', status: 'pending' },
      { id: 'a4', title: 'Schedule store visit', description: 'Confirm findings on the ground with a physical store visit.', type: 'escalate', target: 'Head Office', priority: 'high', status: 'pending' },
    ],
    confidence: 62,
    confidenceLevel: 'medium',
    createdBy: 'FreshGuard AI Dashboard',
    createdAt: '2026-10-07T08:00:00Z',
    updatedAt: '2026-10-08T10:00:00Z',
    status: 'active',
  },
];
