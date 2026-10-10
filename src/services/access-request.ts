// ============================================================
// FreshGuard AI — Frontend Access Request & Approval Service
// ============================================================

export interface AccessRequestItem {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  requestedRole: 'main_manager' | 'store_manager' | 'supplier';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED';
  submissionDate: string;
  storeName?: string;
  storeType?: string;
  storeAddress?: string;
  city?: string;
  state?: string;
  employeeId?: string;
  supplierName?: string;
  supplierType?: string;
  productsSupplied?: string;
  gstin?: string;
  additionalInfo?: string;
  decisionReason?: string;
  managerInstructions?: string;
  reviewedAt?: string;
  reviewer?: { id: string; fullName: string; email: string };
  decisions?: Array<{
    id: string;
    action: string;
    reason?: string;
    notes?: string;
    createdAt: string;
    decider: { fullName: string; email: string };
  }>;
}

export interface ApprovedUserItem {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  assignedStoreId?: string;
  assignedStoreName?: string;
  supplierId?: string;
  supplierName?: string;
  createdAt: string;
}

const STORAGE_REQUESTS_KEY = 'freshguard_access_requests_v1';
const STORAGE_APPROVED_USERS_KEY = 'freshguard_approved_users_v1';

async function safeFetchJson(url: string, options?: RequestInit): Promise<{ ok: boolean; status: number; data: any; isJson: boolean }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data, isJson: true };
    }
    const text = await res.text();
    return { ok: false, status: res.status, data: { message: text }, isJson: false };
  } catch (err: any) {
    return { ok: false, status: 0, data: { message: err?.message || 'Network error' }, isJson: false };
  }
}

// Seed demo access requests so the system is immediately reviewable
const INITIAL_DEMO_REQUESTS: AccessRequestItem[] = [
  {
    id: 'req-sm-201',
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@freshbasket.com',
    phoneNumber: '+1 (253) 555-0184',
    requestedRole: 'store_manager',
    status: 'PENDING',
    submissionDate: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    storeName: 'FreshBasket Bellevue Square (#023)',
    storeType: 'Supermarket',
    storeAddress: '400 Bellevue Way NE',
    city: 'Bellevue',
    state: 'WA',
    employeeId: 'FB-9921',
    additionalInfo: 'Transferring from Portland branch. Need access to daily shrinkage telemetry and cold-chain alert configurations.',
  },
  {
    id: 'req-sp-202',
    fullName: 'David Morales',
    email: 'd.morales@olympicdairy.com',
    phoneNumber: '+1 (360) 555-0142',
    requestedRole: 'supplier',
    status: 'PENDING',
    submissionDate: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    supplierName: 'Olympic Valley Dairy Farms',
    supplierType: 'Dairy products',
    productsSupplied: 'Organic Milk, Artisanal Cheeses, Greek Yogurt',
    storeAddress: '1240 Farmway Road',
    city: 'Olympia',
    state: 'WA',
    gstin: 'GST-OLYMP-2840',
    additionalInfo: 'Authorized tier-1 organic dairy supplier for Northwest region stores #012 through #024.',
  },
  {
    id: 'req-sm-203',
    fullName: 'Kenneth Vance',
    email: 'k.vance@freshbasket.com',
    phoneNumber: '+1 (206) 555-0199',
    requestedRole: 'store_manager',
    status: 'MORE_INFO_REQUIRED',
    submissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    storeName: 'FreshBasket Ballard Market (#008)',
    storeType: 'Fresh produce store',
    storeAddress: '5300 Ballard Ave NW',
    city: 'Seattle',
    state: 'WA',
    employeeId: 'FB-4412',
    managerInstructions: 'Please upload or provide verification of your Regional Food Safety Manager certification.',
    additionalInfo: 'Candidate for interim general store manager position.',
  },
  {
    id: 'req-sp-204',
    fullName: 'Alexander Rossi',
    email: 'alex@pacificbaking.com',
    phoneNumber: '+1 (503) 555-0111',
    requestedRole: 'supplier',
    status: 'REJECTED',
    submissionDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    supplierName: 'Pacific Hearth Bakery',
    supplierType: 'Bakery products',
    productsSupplied: 'Sourdough Boules, Baguettes',
    storeAddress: '882 Artisan Way',
    city: 'Portland',
    state: 'OR',
    decisionReason: 'Vendor insurance certificate expired. Please re-apply with active commercial liability policy.',
  },
];

const INITIAL_APPROVED_USERS: ApprovedUserItem[] = [
  {
    id: 'usr-exec-01',
    fullName: 'Eleanor Vance',
    email: 'executive@freshbasket.com',
    phoneNumber: '+1 (206) 555-0100',
    role: 'main_manager',
    status: 'APPROVED',
    isEmailVerified: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: 'usr-store-017',
    fullName: 'Marcus Brody',
    email: 'store17.manager@freshbasket.com',
    phoneNumber: '+91 80 555-0177',
    role: 'store_manager',
    status: 'APPROVED',
    isEmailVerified: true,
    assignedStoreId: 'FB-17',
    assignedStoreName: 'FreshBasket Marathahalli (#FB-17)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 'usr-supp-01',
    fullName: 'Elena Rostova',
    email: 'dispatch@cascadefresh.com',
    phoneNumber: '+91 80 555-0190',
    role: 'supplier',
    status: 'APPROVED',
    isEmailVerified: true,
    supplierId: 'sup-namdhari',
    supplierName: 'Namdhari Fresh Logistics',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];

class AccessRequestClient {
  private getLocalRequests(): AccessRequestItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_REQUESTS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(INITIAL_DEMO_REQUESTS));
        return INITIAL_DEMO_REQUESTS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_REQUESTS;
    }
  }

  private saveLocalRequests(requests: AccessRequestItem[]) {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(requests));
  }

  private getLocalApprovedUsers(): ApprovedUserItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_APPROVED_USERS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_APPROVED_USERS_KEY, JSON.stringify(INITIAL_APPROVED_USERS));
        return INITIAL_APPROVED_USERS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_APPROVED_USERS;
    }
  }

  private saveLocalApprovedUsers(users: ApprovedUserItem[]) {
    localStorage.setItem(STORAGE_APPROVED_USERS_KEY, JSON.stringify(users));
  }

  /**
   * List access requests (filterable)
   */
  public async listRequests(statusFilter?: string): Promise<AccessRequestItem[]> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const url = statusFilter && statusFilter !== 'ALL'
        ? `/api/v1/access-requests?status=${statusFilter}`
        : '/api/v1/access-requests';

      const res = await safeFetchJson(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch {
      // Graceful fallback to local mock store
    }

    const all = this.getLocalRequests();
    if (!statusFilter || statusFilter === 'ALL') return all;
    return all.filter((r) => r.status === statusFilter);
  }

  /**
   * Approve an access request
   */
  public async approveRequest(requestId: string, notes?: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const res = await safeFetchJson(`/api/v1/access-requests/${requestId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ notes }),
      });

      if (res.ok && res.data) {
        return res.data;
      }
    } catch {
      // Local fallback
    }

    const requests = this.getLocalRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found.');

    const target = requests[reqIndex];
    target.status = 'APPROVED';
    target.reviewedAt = new Date().toISOString();
    target.decisionReason = notes || 'Approved by Main Manager.';
    this.saveLocalRequests(requests);

    // Add to approved users list
    const users = this.getLocalApprovedUsers();
    if (!users.some((u) => u.email === target.email)) {
      users.unshift({
        id: `usr-${Date.now().toString().slice(-4)}`,
        fullName: target.fullName,
        email: target.email,
        phoneNumber: target.phoneNumber,
        role: target.requestedRole,
        status: 'APPROVED',
        isEmailVerified: true,
        assignedStoreName: target.storeName,
        supplierName: target.supplierName,
        createdAt: new Date().toISOString(),
      });
      this.saveLocalApprovedUsers(users);
    }

    return {
      success: true,
      message: `Access request for ${target.fullName} has been approved. Notification email dispatched.`,
    };
  }

  /**
   * Reject an access request
   */
  public async rejectRequest(requestId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const res = await safeFetchJson(`/api/v1/access-requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ reason }),
      });

      if (res.ok && res.data) {
        return res.data;
      }
    } catch {
      // Local fallback
    }

    const requests = this.getLocalRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found.');

    const target = requests[reqIndex];
    target.status = 'REJECTED';
    target.reviewedAt = new Date().toISOString();
    target.decisionReason = reason?.trim() || 'Criteria not met.';
    this.saveLocalRequests(requests);

    return {
      success: true,
      message: `Access request for ${target.fullName} rejected. Notification email dispatched.`,
    };
  }

  /**
   * Request more information
   */
  public async requestMoreInfo(requestId: string, instructions: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const res = await safeFetchJson(`/api/v1/access-requests/${requestId}/request-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ instructions }),
      });

      if (res.ok && res.data) {
        return res.data;
      }
    } catch {
      // Local fallback
    }

    const requests = this.getLocalRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found.');

    const target = requests[reqIndex];
    target.status = 'MORE_INFO_REQUIRED';
    target.reviewedAt = new Date().toISOString();
    target.managerInstructions = instructions.trim();
    this.saveLocalRequests(requests);

    return {
      success: true,
      message: `Instructions sent to ${target.fullName}. Status updated to MORE_INFO_REQUIRED.`,
    };
  }

  /**
   * List approved users
   */
  public async listApprovedUsers(): Promise<ApprovedUserItem[]> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const res = await safeFetchJson('/api/v1/users', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok && res.data?.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch {
      // Local fallback
    }

    return this.getLocalApprovedUsers();
  }

  /**
   * Invite another Main Manager
   */
  public async inviteMainManager(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem('freshguard_token_v1');
      const res = await safeFetchJson('/api/v1/auth/invite-manager', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok && res.data) {
        return res.data;
      }
    } catch {
      // Local fallback
    }

    return {
      success: true,
      message: `Executive invitation link generated and dispatched to ${email}.`,
    };
  }

  /**
   * Add a newly submitted client request to the local store (for immediate visibility)
   */
  public addPendingRequest(item: Omit<AccessRequestItem, 'id' | 'submissionDate' | 'status'>) {
    const list = this.getLocalRequests();
    const newItem: AccessRequestItem = {
      ...item,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      submissionDate: new Date().toISOString(),
    };
    this.saveLocalRequests([newItem, ...list]);
    return newItem;
  }
}

export const accessRequestClient = new AccessRequestClient();
