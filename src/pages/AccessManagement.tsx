// ============================================================
// FreshGuard AI — Main Manager: User Access & Role Governance
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  accessRequestClient,
  type AccessRequestItem,
  type ApprovedUserItem,
} from '../services/access-request';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  MessageSquare,
  Building2,
  Store,
  Truck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Send,
  AlertCircle,
  RefreshCw,
  UserPlus
} from 'lucide-react';

export function AccessManagementPage() {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<ApprovedUserItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedRequest, setSelectedRequest] = useState<AccessRequestItem | null>(null);
  const [confirmApproveReq, setConfirmApproveReq] = useState<AccessRequestItem | null>(null);
  const [confirmRejectReq, setConfirmRejectReq] = useState<AccessRequestItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [moreInfoReq, setMoreInfoReq] = useState<AccessRequestItem | null>(null);
  const [moreInfoInstructions, setMoreInfoInstructions] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Action status message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqList, userList] = await Promise.all([
        accessRequestClient.listRequests('ALL'),
        accessRequestClient.listApprovedUsers(),
      ]);
      setRequests(reqList);
      setApprovedUsers(userList);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.message || 'Failed to load access records.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  // Approval handler
  const handleApprove = async () => {
    if (!confirmApproveReq) return;
    setIsSubmitting(true);
    try {
      const res = await accessRequestClient.approveRequest(confirmApproveReq.id);
      showNotification(res.message);
      setConfirmApproveReq(null);
      if (selectedRequest?.id === confirmApproveReq.id) {
        setSelectedRequest(null);
      }
      await loadData();
    } catch (err: any) {
      showNotification(err?.message || 'Approval failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rejection handler
  const handleReject = async () => {
    if (!confirmRejectReq) return;
    setIsSubmitting(true);
    try {
      const res = await accessRequestClient.rejectRequest(confirmRejectReq.id, rejectReason);
      showNotification(res.message);
      setConfirmRejectReq(null);
      setRejectReason('');
      if (selectedRequest?.id === confirmRejectReq.id) {
        setSelectedRequest(null);
      }
      await loadData();
    } catch (err: any) {
      showNotification(err?.message || 'Rejection failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request More Info handler
  const handleRequestMoreInfo = async () => {
    if (!moreInfoReq || !moreInfoInstructions.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await accessRequestClient.requestMoreInfo(moreInfoReq.id, moreInfoInstructions);
      showNotification(res.message);
      setMoreInfoReq(null);
      setMoreInfoInstructions('');
      if (selectedRequest?.id === moreInfoReq.id) {
        setSelectedRequest(null);
      }
      await loadData();
    } catch (err: any) {
      showNotification(err?.message || 'Failed to submit instructions.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Invite Main Manager handler
  const handleInviteManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await accessRequestClient.inviteMainManager(inviteEmail);
      showNotification(res.message);
      setIsInviteModalOpen(false);
      setInviteEmail('');
    } catch (err: any) {
      showNotification(err?.message || 'Invitation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter requests according to active tab & query
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = approvedUsers.length;
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length;

  const filteredRequests = requests.filter((req) => {
    if (activeTab !== 'ALL' && req.status !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.fullName.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      (req.storeName && req.storeName.toLowerCase().includes(q)) ||
      (req.supplierName && req.supplierName.toLowerCase().includes(q)) ||
      req.requestedRole.toLowerCase().includes(q)
    );
  });

  const filteredApprovedUsers = approvedUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.assignedStoreName && u.assignedStoreName.toLowerCase().includes(q)) ||
      (u.supplierName && u.supplierName.toLowerCase().includes(q))
    );
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'main_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="w-3 h-3" />
            Main Manager
          </span>
        );
      case 'store_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Store className="w-3 h-3" />
            Store Manager
          </span>
        );
      case 'supplier':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Truck className="w-3 h-3" />
            Supplier
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'MORE_INFO_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3 h-3" />
            Info Required
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              User Access Management
            </h1>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              SECURITY GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate pending registration requests, authorize role assignments, and manage executive invitations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadData()}
            className="btn-secondary text-xs flex items-center gap-1.5"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Main Manager</span>
          </button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 shadow-sm border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="flex-1 font-medium">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs & Search Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-[#164e3d] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Pending Requests</span>
            {pendingCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'PENDING' ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-[#164e3d] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Approved Users</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'APPROVED' ? 'bg-emerald-200 text-emerald-950' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'REJECTED'
                ? 'bg-[#164e3d] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Rejected Requests</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'REJECTED' ? 'bg-red-200 text-red-950' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {rejectedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-[#164e3d] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>All Requests</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'ALL' ? 'bg-slate-200 text-slate-900' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {requests.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applicant or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:border-[#164e3d]"
          />
        </div>
      </div>

      {/* 3. Main Data View */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-lg border border-slate-200">
          Loading access records from database...
        </div>
      ) : activeTab === 'APPROVED' ? (
        /* APPROVED USERS DIRECTORY VIEW */
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Authorized User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Organization / Branch</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApprovedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No approved users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredApprovedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">{getRoleBadge(u.role)}</td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {u.assignedStoreName || u.supplierName || 'Corporate Operations'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{u.phoneNumber || '—'}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          ACTIVE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* REQUESTS LIST VIEW (PENDING, REJECTED, ALL) */
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-slate-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-700">No requests in this queue</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'PENDING'
                  ? 'All submitted applicant requests have been reviewed.'
                  : 'No access requests matching current criteria.'}
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                {/* Left: Applicant details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.fullName}</span>
                    {getRoleBadge(req.requestedRole)}
                    {getStatusBadge(req.status)}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(req.submissionDate).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 text-xs text-slate-600 pt-0.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{req.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{req.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      {req.requestedRole === 'supplier' ? (
                        <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      ) : (
                        <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      )}
                      <span className="font-medium text-slate-800 truncate">
                        {req.storeName || req.supplierName || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights & notes */}
                  {(req.decisionReason || req.managerInstructions || req.additionalInfo) && (
                    <div className="text-[11px] bg-slate-50 rounded p-2 text-slate-600 mt-1 border border-slate-100 flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {req.managerInstructions ? (
                          <strong>Instructions sent: {req.managerInstructions}</strong>
                        ) : req.decisionReason ? (
                          <strong>Rejection reason: {req.decisionReason}</strong>
                        ) : (
                          req.additionalInfo
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setMoreInfoReq(req);
                          setMoreInfoInstructions('');
                        }}
                        className="px-2.5 py-1.5 rounded-md border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Request additional information from applicant"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ask Info</span>
                      </button>

                      <button
                        onClick={() => {
                          setConfirmRejectReq(req);
                          setRejectReason('');
                        }}
                        className="px-2.5 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => setConfirmApproveReq(req)}
                        className="px-3 py-1.5 rounded-md bg-[#164e3d] text-white hover:bg-[#113e30] text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================
          MODAL 1: VIEW DETAILS DOSSIER
          ======================================================== */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-lg border border-slate-300 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{selectedRequest.fullName}</h3>
                {getRoleBadge(selectedRequest.requestedRole)}
                {getStatusBadge(selectedRequest.status)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted {new Date(selectedRequest.submissionDate).toLocaleString()} · ID: {selectedRequest.id}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-500 block">Contact Information</span>
                <div className="font-semibold text-slate-900">{selectedRequest.email}</div>
                <div className="text-slate-700">{selectedRequest.phoneNumber}</div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded border border-slate-100">
                <span className="text-slate-500 block">Target Organization</span>
                <div className="font-semibold text-slate-900">
                  {selectedRequest.storeName || selectedRequest.supplierName || 'Operations HQ'}
                </div>
                <div className="text-slate-700">
                  {selectedRequest.storeType || selectedRequest.supplierType || 'Standard'}
                </div>
              </div>
            </div>

            {/* Address & Specifics */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block border-b border-slate-100 pb-1">
                Facility & Operational Scope
              </span>
              <div className="grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 block">Physical Location:</span>
                  <span>{selectedRequest.storeAddress || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">City / State:</span>
                  <span>{selectedRequest.city ? `${selectedRequest.city}, ${selectedRequest.state}` : '—'}</span>
                </div>
                {selectedRequest.employeeId && (
                  <div>
                    <span className="text-slate-400 block">Employee ID:</span>
                    <span className="font-mono">{selectedRequest.employeeId}</span>
                  </div>
                )}
                {selectedRequest.gstin && (
                  <div>
                    <span className="text-slate-400 block">GSTIN / Tax ID:</span>
                    <span className="font-mono">{selectedRequest.gstin}</span>
                  </div>
                )}
              </div>

              {selectedRequest.productsSupplied && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Products Supplied:</span>
                  <div className="p-2.5 rounded bg-blue-50 border border-blue-200 text-blue-900 font-medium">
                    {selectedRequest.productsSupplied}
                  </div>
                </div>
              )}

              {selectedRequest.additionalInfo && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Applicant Additional Information:</span>
                  <p className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                    {selectedRequest.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedRequest(null)}
                className="btn-secondary text-xs px-4 py-2"
              >
                Close
              </button>

              {selectedRequest.status === 'PENDING' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setConfirmRejectReq(selectedRequest);
                      setRejectReason('');
                    }}
                    className="px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                  >
                    Reject Request
                  </button>
                  <button
                    onClick={() => setConfirmApproveReq(selectedRequest)}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Approve Access
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: CONFIRM APPROVAL
          ======================================================== */}
      {confirmApproveReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-slate-300 shadow-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#164e3d] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Authorize Account Access</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Are you sure you want to approve access for <strong>{confirmApproveReq.fullName}</strong> as a{' '}
                  <strong>{confirmApproveReq.requestedRole.replace('_', ' ')}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
              Upon confirmation, an official approval notification will be dispatched with their sign-in link, and their credentials will be immediately activated.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmApproveReq(null)}
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="btn-primary text-xs px-4 py-1.5"
              >
                {isSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 3: CONFIRM REJECTION
          ======================================================== */}
      {confirmRejectReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-slate-300 shadow-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reject Access Request</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Decline authorization for <strong>{confirmRejectReq.fullName}</strong>.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Reason for Rejection (Optional — included in notification email)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Unverified employee ID or incomplete commercial liability documentation."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-md border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmRejectReq(null)}
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-md bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 4: REQUEST MORE INFORMATION
          ======================================================== */}
      {moreInfoReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-slate-300 shadow-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Request Additional Information</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Send instructions to <strong>{moreInfoReq.fullName}</strong> before finalizing an access decision.
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Specific Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Please provide your Regional Food Safety Manager certification or verify your store delivery schedule."
                value={moreInfoInstructions}
                onChange={(e) => setMoreInfoInstructions(e.target.value)}
                className="w-full text-xs p-2.5 rounded-md border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMoreInfoReq(null)}
                className="btn-secondary text-xs px-3 py-1.5"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestMoreInfo}
                disabled={isSubmitting || !moreInfoInstructions.trim()}
                className="btn-primary text-xs px-4 py-1.5"
              >
                {isSubmitting ? 'Sending...' : 'Send Instructions'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 5: INVITE MAIN MANAGER
          ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg border border-slate-300 shadow-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Invite Main Manager</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Issue a secure, 72-hour executive registration link to authorize a new Main Manager.
                </p>
              </div>
            </div>

            <form onSubmit={handleInviteManager} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">
                  Executive Corporate Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="director.vance@freshbasket.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 bg-white"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded border border-purple-200 text-purple-900 text-xs">
                A cryptographically signed invitation token will be generated and dispatched to the recipient's inbox.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="btn-secondary text-xs px-3 py-1.5"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !inviteEmail.trim()}
                  className="btn-primary text-xs px-4 py-1.5"
                >
                  {isSubmitting ? 'Dispatching...' : 'Dispatch Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
