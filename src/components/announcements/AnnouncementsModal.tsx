// ============================================================
// FreshGuard AI — Emergency Announcements & Broadcast Center
// ============================================================

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import {
  Bell,
  X,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Store,
  Truck,
  ShieldAlert
} from 'lucide-react';

interface AnnouncementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnnouncementsModal({ isOpen, onClose }: AnnouncementsModalProps) {
  const { user, announcements, createAnnouncement, acknowledgeAnnouncement } = useAuth();

  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'critical'>('urgent');
  const [targetStores, setTargetStores] = useState(true);
  const [targetSuppliers, setTargetSuppliers] = useState(true);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter announcements for current user's role (unless main_manager who sees all)
  const visibleAnnouncements = announcements.filter(
    (a) => user?.role === 'main_manager' || a.targetRoles.includes(user?.role as UserRole)
  );

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const targetRoles: UserRole[] = [];
    if (targetStores) targetRoles.push('store_manager');
    if (targetSuppliers) targetRoles.push('supplier');
    if (targetRoles.length === 0) targetRoles.push('store_manager', 'supplier');

    createAnnouncement({
      title: title.trim(),
      message: message.trim(),
      priority,
      targetRoles,
    });

    setTitle('');
    setMessage('');
    setIsComposing(false);
    setBroadcastFeedback('Announcement broadcast transmitted across network channels.');
    setTimeout(() => setBroadcastFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="max-w-3xl w-full royal-card border-[#C5A059]/40 shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#071C16]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-[#C5A059]/40 bg-[#0B3B2C] flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase block">
                COMMUNICATIONS &amp; COLD-CHAIN DISPATCH
              </span>
              <h2 className="text-xl font-editorial text-[#FDFBF7]">
                Executive Emergency Announcements
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'main_manager' && !isComposing && (
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="btn-royal-gold text-xs px-3.5 py-1.5 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Bulletin</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#8E9B90] hover:text-[#FDFBF7] hover:bg-white/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto app-scrollbar space-y-6 flex-1">
          {broadcastFeedback && (
            <div className="p-3.5 rounded border border-[#16A34A]/40 bg-[#16A34A]/15 text-[#4ADE80] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{broadcastFeedback}</span>
            </div>
          )}

          {/* Broadcast Composer (Main Manager only) */}
          {isComposing && user?.role === 'main_manager' && (
            <form onSubmit={handleBroadcast} className="royal-card p-5 border-[#C5A059]/40 bg-[#071C16] space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-mono text-[#E0C588] uppercase font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
                  Compose Operational Bulletin
                </span>
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="text-xs text-[#8E9B90] hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Bulletin Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Cold-Chain Advisory: Temp Spike on Route 5"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Directive Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail instructions for store directors and supplier logistics dispatchers..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded text-xs px-3 py-2 bg-[#041410] text-[#FDFBF7] border border-[#C5A059]/30"
                  >
                    <option value="routine">Routine Operational Advisory</option>
                    <option value="urgent">Urgent Directive</option>
                    <option value="critical">Critical Immediate Action</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-[#C5A059] uppercase block">Target Stakeholders</label>
                  <div className="flex items-center gap-4 pt-2 text-xs">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-[#8E9B90] hover:text-[#FDFBF7]">
                      <input
                        type="checkbox"
                        checked={targetStores}
                        onChange={(e) => setTargetStores(e.target.checked)}
                        className="rounded accent-[#C5A059]"
                      />
                      <span>Store Managers</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-[#8E9B90] hover:text-[#FDFBF7]">
                      <input
                        type="checkbox"
                        checked={targetSuppliers}
                        onChange={(e) => setTargetSuppliers(e.target.checked)}
                        className="rounded accent-[#C5A059]"
                      />
                      <span>Supplier Partners</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="btn-royal-gold text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Network</span>
                </button>
              </div>
            </form>
          )}

          {/* Announcements Feed */}
          <div className="space-y-3">
            {visibleAnnouncements.length === 0 ? (
              <div className="p-8 text-center text-[#8E9B90] text-xs">
                No active announcements or bulletins for your stakeholder credentials.
              </div>
            ) : (
              visibleAnnouncements.map((ann) => {
                const isAcknowledged = user ? ann.acknowledgedBy.includes(user.id) : false;
                return (
                  <div
                    key={ann.id}
                    className={`p-5 rounded border transition-all ${
                      ann.priority === 'critical'
                        ? 'border-[#9E2A2B]/50 bg-[#9E2A2B]/10'
                        : ann.priority === 'urgent'
                        ? 'border-[#C5A059]/40 bg-[#0B3B2C]/40'
                        : 'border-white/10 bg-[#071C16]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            ann.priority === 'critical'
                              ? 'bg-[#9E2A2B]/30 text-[#F87171] border border-[#9E2A2B]/50'
                              : ann.priority === 'urgent'
                              ? 'bg-[#C5A059]/20 text-[#E0C588] border border-[#C5A059]/40'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {ann.priority}
                        </span>
                        <span className="text-xs font-semibold text-[#FDFBF7]">{ann.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#8E9B90]">
                        <Clock className="w-3 h-3 text-[#C5A059]" />
                        <span>{new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#8E9B90] leading-relaxed mt-1">{ann.message}</p>

                    <div className="pt-3 mt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-3 text-[#8E9B90]">
                        <span>Transmitted by: <strong className="text-[#FDFBF7]">{ann.senderName}</strong></span>
                        <span className="hidden sm:inline">·</span>
                        <span className="text-[10px] font-mono text-[#C5A059] uppercase">
                          TARGET: {ann.targetRoles.join(', ')}
                        </span>
                      </div>

                      {/* Acknowledgement Action */}
                      {user && user.role !== 'main_manager' && (
                        <div>
                          {isAcknowledged ? (
                            <span className="inline-flex items-center gap-1.5 text-[#16A34A] text-xs font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Acknowledged</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => acknowledgeAnnouncement(ann.id)}
                              className="btn-royal-gold text-[11px] px-3 py-1.5"
                            >
                              Acknowledge Receipt ✓
                            </button>
                          )}
                        </div>
                      )}

                      {user?.role === 'main_manager' && (
                        <div className="text-[10px] font-mono text-[#8E9B90]">
                          <span>{ann.acknowledgedBy.length} Stakeholder Acknowledgements Logged</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#071C16] flex items-center justify-between text-[11px] text-[#8E9B90]">
          <span>FreshGuard Communications Ledger</span>
          <button
            onClick={onClose}
            className="btn-royal-outline text-xs px-3 py-1.5"
          >
            Close Feed
          </button>
        </div>

      </div>
    </div>
  );
}
