import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  UserPlus,
  Search,
  Eye,
  Check,
  X,
  MessageSquare,
  Building2,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { AuthService, AccessRequestItem } from '../../services/auth.service';

export const AccessManagementView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<AccessRequestItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [moreInfoModalOpen, setMoreInfoModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Form inputs for modals
  const [rejectReason, setRejectReason] = useState('');
  const [moreInfoNote, setMoreInfoNote] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.listAccessRequests(activeSubTab, searchQuery);
      setRequests(data.requests || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch access requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [activeSubTab]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRequests();
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await AuthService.approveAccessRequest(selectedRequest.id);
      setActionMessage({ type: 'success', text: `Access request for ${selectedRequest.applicant.fullName} approved!` });
      setApproveModalOpen(false);
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Approval failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await AuthService.rejectAccessRequest(selectedRequest.id, rejectReason);
      setActionMessage({ type: 'success', text: `Access request for ${selectedRequest.applicant.fullName} rejected.` });
      setRejectModalOpen(false);
      setRejectReason('');
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Rejection failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!selectedRequest || !moreInfoNote) return;
    setActionLoading(true);
    try {
      await AuthService.requestMoreInfo(selectedRequest.id, moreInfoNote);
      setActionMessage({ type: 'success', text: `Message sent to ${selectedRequest.applicant.fullName}!` });
      setMoreInfoModalOpen(false);
      setMoreInfoNote('');
      fetchRequests();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Request failed' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setActionLoading(true);
    try {
      await AuthService.inviteMainManager(inviteEmail);
      setActionMessage({ type: 'success', text: `Invitation sent to ${inviteEmail}!` });
      setInviteModalOpen(false);
      setInviteEmail('');
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Invitation failed' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-surface-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">User Access Management</h2>
              <p className="text-xs text-slate-500">
                Review registration requests, enforce role permissions, and grant access to FreshGuard AI.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setInviteModalOpen(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Main Manager</span>
          </button>
          <button
            onClick={fetchRequests}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs & Search */}
      <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex space-x-2">
            {[
              { id: 'PENDING', label: 'Pending Requests', icon: Clock, badgeBg: 'bg-amber-100 text-amber-800' },
              { id: 'APPROVED', label: 'Approved Users', icon: CheckCircle2, badgeBg: 'bg-emerald-100 text-emerald-800' },
              { id: 'REJECTED', label: 'Rejected Requests', icon: XCircle, badgeBg: 'bg-red-100 text-red-800' },
              { id: 'ALL', label: 'All Users', icon: Users, badgeBg: 'bg-slate-100 text-slate-800' },
            ].map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = activeSubTab === tabItem.id;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveSubTab(tabItem.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tabItem.label}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applicants..."
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Search
            </button>
          </form>
        </div>

        {/* Requests Listing Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs">Loading access requests...</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600 text-xs font-semibold">{error}</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-medium">No access requests found under this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Applicant & Contact</th>
                  <th className="py-3 px-4">Requested Role</th>
                  <th className="py-3 px-4">Organization / Store</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((item) => {
                  const applicant = item.applicant;
                  const reqData = item.requestData || {};
                  const storeName = applicant?.storeDetail?.storeName || reqData.storeName;
                  const companyName = applicant?.supplierDetail?.companyName || reqData.companyName;
                  const orgInfo = storeName || companyName || 'N/A';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{applicant?.fullName || 'N/A'}</div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{applicant?.email}</span>
                          {applicant?.phoneNumber && (
                            <>
                              <span>•</span>
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{applicant?.phoneNumber}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-800 border-emerald-200">
                          {item.requestedRole.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{orgInfo}</div>
                        <div className="text-[11px] text-slate-400">
                          {applicant?.storeDetail?.storeType || applicant?.supplierDetail?.supplierType || ''}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase border ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : item.status === 'MORE_INFO_REQUIRED'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setSelectedRequest(item);
                            setDetailModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(item);
                                setApproveModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(item);
                                setRejectModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-bold text-[11px] border border-red-200"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(item);
                                setMoreInfoModalOpen(true);
                              }}
                              className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg border border-amber-200"
                              title="Request Information"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW DETAILS */}
      {detailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Access Request Payload Details</h3>
              <button onClick={() => setDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <p><strong>Applicant Name:</strong> {selectedRequest.applicant.fullName}</p>
                <p><strong>Work Email:</strong> {selectedRequest.applicant.email}</p>
                <p><strong>Phone:</strong> {selectedRequest.applicant.phoneNumber || 'N/A'}</p>
                <p><strong>Requested Role:</strong> {selectedRequest.requestedRole}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
              </div>

              {selectedRequest.requestData && (
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="font-bold text-slate-900 mb-1">Registration Fields:</p>
                  <pre className="text-[11px] font-mono bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto">
                    {JSON.stringify(selectedRequest.requestData, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="text-right">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRM APPROVAL */}
      {approveModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-800 font-bold">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span>Confirm Approval</span>
            </div>
            <p className="text-xs text-slate-600">
              Are you sure you want to approve access for <strong>{selectedRequest.applicant.fullName}</strong> as a <strong>{selectedRequest.requestedRole}</strong>?
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRM REJECTION */}
      {rejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-800 font-bold">
              <XCircle className="w-6 h-6 text-red-600" />
              <span>Reject Access Request</span>
            </div>
            <p className="text-xs text-slate-600">
              Specify reason for rejecting <strong>{selectedRequest.applicant.fullName}</strong>:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Unverified store location or missing documentation"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs h-24 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Reject Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REQUEST MORE INFO */}
      {moreInfoModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-800 font-bold">
              <MessageSquare className="w-6 h-6 text-amber-600" />
              <span>Request Additional Information</span>
            </div>
            <p className="text-xs text-slate-600">
              Provide specific instructions for <strong>{selectedRequest.applicant.fullName}</strong>:
            </p>
            <textarea
              value={moreInfoNote}
              onChange={(e) => setMoreInfoNote(e.target.value)}
              placeholder="e.g. Please upload your store license or tax identification proof"
              className="w-full p-3 rounded-xl border border-slate-300 text-xs h-24 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setMoreInfoModalOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestMoreInfo}
                disabled={actionLoading || !moreInfoNote}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Sending...' : 'Send Instruction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: INVITE MAIN MANAGER */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <form onSubmit={handleInviteManager} className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-emerald-900 font-bold">
              <UserPlus className="w-6 h-6 text-emerald-700" />
              <span>Invite Main Manager</span>
            </div>
            <p className="text-xs text-slate-600">
              Generate a secure Main Manager registration token and send an invitation email:
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email</label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="manager@freshguard.ai"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading || !inviteEmail}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {actionLoading ? 'Sending Invitation...' : 'Send Invitation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
