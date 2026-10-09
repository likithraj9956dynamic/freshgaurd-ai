// ============================================================
// FreshGuard AI — Mock Data: Compliance
// ============================================================

import type { ComplianceRecord } from '../types';

export const STORE_17_COMPLIANCE: ComplianceRecord[] = [
  { id: 'c1', storeId: '1012', section: 'Temperature Logs', requirement: 'Daily cold-chain temperature documentation for all cold rooms', status: 'non-compliant', riskLevel: 'high', lastInspected: '2026-10-05', nextInspection: '2026-10-12', inspector: 'Head Office', notes: 'Two days of afternoon logs missing from Aug 12-13' },
  { id: 'c2', storeId: '1012', section: 'Shelf-Life Labels', requirement: 'All prepared foods and deli items must have labeling', status: 'partial', riskLevel: 'medium', lastInspected: '2026-10-05', nextInspection: '2026-10-12', inspector: 'Head Office', notes: '7 items missing sell-by dates on 10/5' },
  { id: 'c3', storeId: '1012', section: 'Food Safety Certification', requirement: 'All staff handling food have valid food safety cert', status: 'compliant', riskLevel: 'low', lastInspected: '2026-10-05', nextInspection: '2026-10-12', inspector: 'Head Office', notes: '100% certified' },
  { id: 'c4', storeId: '1012', section: 'Waste Disposal Log', requirement: 'Daily waste disposal records with weight and reason', status: 'partial', riskLevel: 'medium', lastInspected: '2026-10-05', nextInspection: '2026-10-12', inspector: 'Head Office', notes: '10/6 log incomplete' },
];
