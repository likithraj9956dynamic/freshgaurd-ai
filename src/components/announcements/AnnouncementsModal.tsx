// ============================================================
// FreshGuard AI — Enterprise Operational Announcements
// ============================================================

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import {
  X,
  Megaphone,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle
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
    setBroadcastFeedback('Announcement broadcast transmitted to network operations.');
    setTimeout(() => setBroadcastFeedback(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#164e3d] text-white flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Operational Bulletins &amp; Announcements
              </h2>
              <p className="text-xs text-slate-500">Network communications ledger</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'main_manager' && !isComposing && (
              <button
                type="button"
                onClick={() => setIsComposing(true)}
                className="btn-primary text-xs px-3 py-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Create Bulletin</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto app-scrollbar space-y-4 flex-1">
          {broadcastFeedback && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{broadcastFeedback}</span>
            </div>
          )}

          {/* Composer */}
          {isComposing && user?.role === 'main_manager' && (
            <form onSubmit={handleBroadcast} className="p-4 rounded-md border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  New Operational Bulletin
                </span>
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold-Chain Temperature Advisory: I-5 Highway Transit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white focus:border-[#164e3d] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Directive Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail instructions for store directors and supplier dispatchers..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white focus:border-[#164e3d] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-slate-300 bg-white"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Target Roles</label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={targetStores}
                        onChange={(e) => setTargetStores(e.target.checked)}
                        className="rounded accent-[#164e3d]"
                      />
                      <span>Store Managers</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={targetSuppliers}
                        onChange={(e) => setTargetSuppliers(e.target.checked)}
                        className="rounded accent-[#164e3d]"
                      />
                      <span>Suppliers</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="btn-primary text-xs px-3.5 py-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Bulletin</span>
                </button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="space-y-3">
            {visibleAnnouncements.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active announcements for your role.
              </div>
            ) : (
              visibleAnnouncements.map((ann) => {
                const isAcknowledged = user ? ann.acknowledgedBy.includes(user.id) : false;
                const isCrit = ann.priority === 'critical';
                const isUrg = ann.priority === 'urgent';

                return (
                  <div
                    key={ann.id}
                    className={`p-4 rounded-md border text-xs space-y-2 ${
                      isCrit
                        ? 'bg-red-50/70 border-red-200'
                        : isUrg
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                            isCrit
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : isUrg
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-300'
                          }`}
                        >
                          {ann.priority}
                        </span>
                        <span className="font-semibold text-slate-900">{ann.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">{ann.message}</p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Sender: <strong className="text-slate-800">{ann.senderName}</strong> ({ann.senderRole})</span>

                      {user && user.role !== 'main_manager' && (
                        <div>
                          {isAcknowledged ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Acknowledged</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => acknowledgeAnnouncement(ann.id)}
                              className="btn-primary text-xs px-2.5 py-1"
                            >
                              Acknowledge ✓
                            </button>
                          )}
                        </div>
                      )}

                      {user?.role === 'main_manager' && (
                        <span>{ann.acknowledgedBy.length} Acknowledgements</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
