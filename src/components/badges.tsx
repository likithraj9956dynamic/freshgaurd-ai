// ============================================================
// FreshGuard AI — Shared Components (v1): Badges
// ============================================================

import React from 'react';
import { Circle, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function SeverityBadge({
  severity,
  showDot = true,
}: {
  severity: 'info' | 'warning' | 'critical';
  showDot?: boolean;
}) {
  const config = {
    info: {
      label: 'Info',
      className: 'bg-blue-100 text-blue-800',
      icon: <Info className="w-3 h-3" />,
    },
    warning: {
      label: 'Warning',
      className: 'bg-yellow-100 text-yellow-800',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    critical: {
      label: 'Critical',
      className: 'bg-red-100 text-red-800',
      icon: <AlertTriangle className="w-3 h-3" />,
    },
  };

  const c = config[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}
    >
      {showDot && <Circle className="w-1.5 h-1.5" />}
      {c.label}
    </span>
  );
}

export function StatusBadge({
  status,
  showDot = true,
}: {
  status: string;
  showDot?: boolean;
}) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    'pending-approval': { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    approved: { label: 'Approved', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
    executed: { label: 'Executed', className: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-3 h-3" /> },
    cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800', icon: <Circle className="w-3 h-3" /> },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    acknowledged: { label: 'Acknowledged', className: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-3 h-3" /> },
    'in-progress': { label: 'In Progress', className: 'bg-purple-100 text-purple-800', icon: <Circle className="w-3 h-3" /> },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    open: { label: 'Open', className: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3" /> },
    investigating: { label: 'Investigating', className: 'bg-blue-100 text-blue-800', icon: <Circle className="w-3 h-3" /> },
    resolved: { label: 'Resolved', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    awaiting: { label: 'Awaiting', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800', icon: <Circle className="w-3 h-3" /> },
    active: { label: 'Active', className: 'bg-blue-100 text-blue-800', icon: <Circle className="w-3 h-3" /> },
    reviewed: { label: 'Reviewed', className: 'bg-purple-100 text-purple-800', icon: <Circle className="w-3 h-3" /> },
    closed: { label: 'Closed', className: 'bg-gray-100 text-gray-800', icon: <Circle className="w-3 h-3" /> },
    in_stock: { label: 'In Stock', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    low: { label: 'Low', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    'out-of-stock': { label: 'Out of Stock', className: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
    overage: { label: 'Overage', className: 'bg-purple-100 text-purple-800', icon: <Circle className="w-3 h-3" /> },
    delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    shipped: { label: 'Shipped', className: 'bg-blue-100 text-blue-800', icon: <Circle className="w-3 h-3" /> },
    confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800', icon: <CheckCircle className="w-3 h-3" /> },
    'not-compliant': { label: 'Non-Compliant', className: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
    partial: { label: 'Partial', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    compliant: { label: 'Compliant', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    pending_review: { label: 'Pending Review', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    critical: { label: 'Critical', className: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3" /> },
    warning: { label: 'Warning', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
    healthy: { label: 'Healthy', className: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
    'at-risk': { label: 'At Risk', className: 'bg-orange-100 text-orange-800', icon: <AlertTriangle className="w-3 h-3" /> },
    declined: { label: 'Declined', className: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
    pending_approval: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-3 h-3" /> },
  };

  const c = config[status] || { label: status, className: 'bg-gray-100 text-gray-800', icon: <Circle className="w-3 h-3" /> };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.className}`}
    >
      {showDot && <Circle className="w-1.5 h-1.5" />}
      {c.icon}
      {c.label}
    </span>
  );
}
