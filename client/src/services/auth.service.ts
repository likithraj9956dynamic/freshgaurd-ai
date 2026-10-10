/**
 * FreshGuard AI Client - Auth & Access Management Service
 */

const API_BASE = '/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'MAIN_MANAGER' | 'STORE_MANAGER' | 'SUPPLIER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_REQUIRED';
  storeDetail?: any;
  supplierDetail?: any;
}

export interface AccessRequestItem {
  id: string;
  userId: string;
  requestedRole: string;
  status: string;
  requestData: any;
  rejectionReason?: string;
  moreInfoNote?: string;
  createdAt: string;
  decidedAt?: string;
  applicant: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    status: string;
    createdAt: string;
    storeDetail?: any;
    supplierDetail?: any;
  };
  decider?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export class AuthService {
  private static getHeaders(token?: string) {
    const authToken = token || localStorage.getItem('freshguard_token');
    return {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
    };
  }

  public static async login(credentials: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) {
      if (data.error === 'ACCESS_NOT_APPROVED') {
        return { success: false, notApproved: true, status: data.data.status, message: data.message, data: data.data };
      }
      throw new Error(data.message || 'Login failed');
    }
    if (data.data?.token) {
      localStorage.setItem('freshguard_token', data.data.token);
      localStorage.setItem('freshguard_user', JSON.stringify(data.data.user));
    }
    return data;
  }

  public static async registerStoreManager(payload: any) {
    const res = await fetch(`${API_BASE}/auth/register/store-manager`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Store Manager registration failed');
    }
    return data;
  }

  public static async registerSupplier(payload: any) {
    const res = await fetch(`${API_BASE}/auth/register/supplier`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Supplier registration failed');
    }
    return data;
  }

  public static async registerMainManager(payload: any) {
    const res = await fetch(`${API_BASE}/auth/register/main-manager`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Main Manager registration failed');
    }
    if (data.data?.token) {
      localStorage.setItem('freshguard_token', data.data.token);
      localStorage.setItem('freshguard_user', JSON.stringify(data.data.user));
    }
    return data;
  }

  public static async getMe() {
    const token = localStorage.getItem('freshguard_token');
    if (!token) return null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(token)
    });
    const data = await res.json();
    if (!res.ok) {
      localStorage.removeItem('freshguard_token');
      localStorage.removeItem('freshguard_user');
      return null;
    }
    return data.data?.user;
  }

  public static logout() {
    localStorage.removeItem('freshguard_token');
    localStorage.removeItem('freshguard_user');
  }

  public static async listAccessRequests(status = 'PENDING', search = '') {
    const query = new URLSearchParams({ status, ...(search ? { search } : {}) }).toString();
    const res = await fetch(`${API_BASE}/access-requests?${query}`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch access requests');
    }
    return data.data;
  }

  public static async approveAccessRequest(id: string) {
    const res = await fetch(`${API_BASE}/access-requests/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to approve access request');
    }
    return data;
  }

  public static async rejectAccessRequest(id: string, reason?: string) {
    const res = await fetch(`${API_BASE}/access-requests/${id}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to reject access request');
    }
    return data;
  }

  public static async requestMoreInfo(id: string, note: string) {
    const res = await fetch(`${API_BASE}/access-requests/${id}/request-info`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ note })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send request for more information');
    }
    return data;
  }

  public static async inviteMainManager(email: string) {
    const res = await fetch(`${API_BASE}/access-requests/invite-manager`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to send Main Manager invitation');
    }
    return data;
  }

  public static async listUsers() {
    const res = await fetch(`${API_BASE}/users`, {
      headers: this.getHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch users');
    }
    return data.data;
  }
}
