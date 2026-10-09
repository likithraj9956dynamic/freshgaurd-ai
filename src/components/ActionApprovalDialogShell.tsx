// ============================================================
// FreshGuard AI — Components: Action Approval Dialog (Royal)
// ============================================================

import React from 'react';
import { createPortal } from 'react-dom';
import type { Action } from '../types';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, X } from 'lucide-react';

export interface ActionApprovalDialogProps {
  isOpen: boolean;
  action: Action | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionApprovalDialog({
  isOpen,
  action,
  onApprove,
  onReject,
  onClose,
}: ActionApprovalDialogProps) {
  if (!isOpen || !action) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg rounded border border-[#C5A059]/40 bg-[#071C16] shadow-2xl p-6 sm:p-8 space-y-6 text-[#FDFBF7]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
              EXECUTIVE GOVERNANCE REVIEW
            </span>
            <h2 className="text-xl sm:text-2xl font-editorial text-[#FDFBF7] mt-1">
              {action.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8E9B90] hover:text-[#FDFBF7]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative & Stores */}
        <div className="space-y-4 text-xs">
          <p className="text-[#8E9B90] leading-relaxed">
            {action.description}
          </p>

          <div className="p-3.5 rounded border border-white/5 bg-[#0A241D]">
            <div className="flex justify-between text-[#8E9B90] text-[11px]">
              <span>TARGET STORE</span>
              <span className="text-[#FDFBF7] font-semibold">{action.storeName} ({action.storeId})</span>
            </div>
            <div className="flex justify-between text-[#8E9B90] text-[11px] mt-1.5">
              <span>ORDER VOLUME</span>
              <span className="text-[#E0C588] font-mono">{action.proposedQuantity} {action.unit}</span>
            </div>
          </div>

          {/* ROI Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded border border-white/5 bg-[#041410]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">ESTIMATED COST</span>
              <span className="text-base font-editorial text-[#F87171] mt-0.5 block">-${action.estimatedCost.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded border border-white/5 bg-[#041410]">
              <span className="text-[10px] font-mono text-[#8E9B90] block">PROJECTED BENEFIT</span>
              <span className="text-base font-editorial text-[#16A34A] mt-0.5 block">+${action.estimatedSavings.toLocaleString()}</span>
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-mono text-[#C5A059] uppercase block">SUPPORTING TELEMETRY EVIDENCE</span>
            {action.evidence.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/5">
                <span className="text-[#FDFBF7] font-medium">{ev.label}</span>
                <span className="text-[#8E9B90]">{ev.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => onReject(action.id)}
            className="px-4 py-2 rounded border border-[#9E2A2B]/40 text-xs text-[#F87171] hover:bg-[#9E2A2B]/20 transition-colors"
          >
            Reject Directive
          </button>
          <button
            onClick={() => onApprove(action.id)}
            className="btn-royal-gold py-2 px-5 text-xs"
          >
            Formally Approve & Authorise
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
