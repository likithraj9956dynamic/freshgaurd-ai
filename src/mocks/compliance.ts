// ============================================================
// FreshGuard AI — Dataset-Sourced Compliance Audit Records
// Source: dataset/compliance.csv (Real Inspection History for FB-17)
// ============================================================

import type { ComplianceRecord } from '../types';
import { STORE_17_ID } from './stores';

export const STORE_17_COMPLIANCE: ComplianceRecord[] = [
  {
    id: 'c-fb17-01',
    storeId: STORE_17_ID,
    section: 'Pest Control Certification',
    requirement: 'Mandatory bi-monthly certified facility pest eradication log',
    status: 'partial',
    riskLevel: 'high',
    lastInspected: '2026-10-04',
    nextInspection: '2026-11-04',
    inspector: 'Karnataka State Health & Safety Inspectorate',
    notes: 'Pest-control record overdue (Score: 87/100, 1 open issue flagged in dataset)',
  },
  {
    id: 'c-fb17-02',
    storeId: STORE_17_ID,
    section: 'Store Cleanliness & Sanitation',
    requirement: 'Store retail floor and back-room sanitization standards',
    status: 'compliant',
    riskLevel: 'low',
    lastInspected: '2026-10-31',
    nextInspection: '2026-11-30',
    inspector: 'Internal Retail Quality Audit',
    notes: 'Audit passed with 0 open issues (Score: 92/100)',
  },
  {
    id: 'c-fb17-03',
    storeId: STORE_17_ID,
    section: 'FIFO & Perishable Rotation',
    requirement: 'First-In First-Out inventory shelving protocol for Dairy and Produce',
    status: 'compliant',
    riskLevel: 'low',
    lastInspected: '2026-09-03',
    nextInspection: '2026-11-03',
    inspector: 'Retail Operations Lead',
    notes: 'Satisfactory rotation compliance on dairy coolers and bakery racks (Score: 90/100)',
  },
  {
    id: 'c-fb17-04',
    storeId: STORE_17_ID,
    section: 'Cold-Chain Log & Temperature Checks',
    requirement: 'Continuous digital logger verification for dairy and batter chillers',
    status: 'compliant',
    riskLevel: 'low',
    lastInspected: '2026-10-31',
    nextInspection: '2026-11-15',
    inspector: 'Internal Retail Quality Audit',
    notes: 'All display chillers maintained between 2°C - 4°C within compliant safety threshold',
  },
];

