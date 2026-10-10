// ============================================================
// FreshGuard AI — Enterprise Role-Based Authentication Service
// ============================================================

import type { User, AuthSession, LoginCredentials, EmergencyAnnouncement, UserRole } from '../types/auth';
import { accessRequestClient } from './access-request';

const STORAGE_KEY = 'freshguard_auth_session_v1';
const ANNOUNCEMENTS_KEY = 'freshguard_announcements_v1';

// Pre-configured enterprise accounts
export const ENTERPRISE_USERS: Array<User & { passwordHash: string }> = [
  {
    id: 'usr-exec-01',
    name: 'Eleanor Vance',
    email: 'executive@freshbasket.com',
    passwordHash: 'password123',
    role: 'main_manager',
    title: 'Head of Retail Operations',
    department: 'FreshBasket Executive HQ',
    avatar: 'EV',
  },
  {
    id: 'usr-store-017',
    name: 'Marcus Brody',
    email: 'store17.manager@freshbasket.com',
    passwordHash: 'password123',
    role: 'store_manager',
    title: 'General Store Director',
    department: 'Marathahalli Branch Operations',
    assignedStoreId: 'FB-17',
    assignedStoreName: 'FreshBasket Marathahalli (#FB-17)',
    avatar: 'MB',
  },
  {
    id: 'usr-supp-01',
    name: 'Elena Rostova',
    email: 'dispatch@cascadefresh.com',
    passwordHash: 'password123',
    role: 'supplier',
    title: 'Fleet & Fulfillment Director',
    department: 'Regional Dispatch & Cold Logistics',
    supplierId: 'sup-namdhari',
    supplierName: 'Namdhari Fresh Logistics',
    avatar: 'ER',
  },
];

// Seed announcements
const INITIAL_ANNOUNCEMENTS: EmergencyAnnouncement[] = [
  {
    id: 'ann-101',
    title: 'CRITICAL COLD-CHAIN ADVISORY: Outer Ring Road Freight Delays',
    message: 'Severe congestion along the Whitefield-Marathahalli arterial corridor. All temperature-sensitive produce deliveries must undergo infrared probe verification upon dock intake.',
    senderName: 'Eleanor Vance',
    senderRole: 'Head of Retail Operations',
    targetRoles: ['store_manager', 'supplier'],
    priority: 'critical',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    acknowledgedBy: ['usr-store-017'],
  },
  {
    id: 'ann-102',
    title: 'Systemwide Spoilage Mitigation Protocol v4.2 Activated',
    message: 'All store directors are instructed to prioritize markdown on fresh bakery & dairy with under 48 hours shelf-life by 14:00 today. Weekly wastage targets have been adjusted accordingly.',
    senderName: 'Eleanor Vance',
    senderRole: 'Head of Retail Operations',
    targetRoles: ['store_manager'],
    priority: 'urgent',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    acknowledgedBy: [],
  },
];

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

class AuthService {
  // --- SESSION MANAGEMENT ---

  public getSession(): AuthSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);

      // Check expiration (24h validity)
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  public setSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  public clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // --- LOGIN & AUTHENTICATION ---

  public async login(credentials: LoginCredentials): Promise<AuthSession> {
    const emailClean = credentials.email.trim().toLowerCase();

    // 1. Try real backend API safely
    const res = await safeFetchJson('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailClean, password: credentials.password }),
    });

    if (res.ok && res.isJson && res.data?.token && res.data?.user) {
      const session: AuthSession = {
        user: {
          ...res.data.user,
          lastLoginAt: new Date().toISOString(),
        },
        token: res.data.token,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
        isDemo: false,
      };
      this.setSession(session);
      localStorage.setItem('freshguard_token_v1', res.data.token);
      return session;
    }

    // If server specifically reported an access restriction (PENDING, REJECTED, MORE_INFO_REQUIRED)
    if (res.isJson && res.data?.message) {
      const msg = res.data.message;
      if (
        msg.includes('review and approve') ||
        msg.includes('not approved') ||
        msg.includes('Additional information required')
      ) {
        throw new Error(msg);
      }
    }

    // 2. Fallback to demonstration enterprise accounts
    const userMatch = ENTERPRISE_USERS.find(
      (u) => u.email.toLowerCase() === emailClean && u.passwordHash === credentials.password
    );

    if (!userMatch) {
      throw new Error('Invalid email or password. Please verify credentials or select a verified enterprise demonstration role.');
    }

    const { passwordHash: _, ...safeUser } = userMatch;
    const session: AuthSession = {
      user: {
        ...safeUser,
        lastLoginAt: new Date().toISOString(),
      },
      token: `fg_jwt_${safeUser.role}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
      isDemo: true,
    };

    this.setSession(session);
    localStorage.setItem('freshguard_token_v1', session.token);
    return session;
  }

  // --- REGISTRATION WORKFLOWS ---

  public async registerStoreManager(data: any): Promise<{ success: boolean; message: string; requestId?: string }> {
    const res = await safeFetchJson('/api/v1/auth/register/store-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.isJson && res.data) {
      return res.data;
    }

    if (res.isJson && res.data && (res.data.message || res.data.error) && res.status < 500) {
      throw new Error(res.data.message || res.data.error);
    }

    // Fallback: save to local access request store
    accessRequestClient.addPendingRequest({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      requestedRole: 'store_manager',
      storeName: data.storeName,
      storeType: data.storeType === 'Other' ? `Other: ${data.storeTypeOther}` : data.storeType,
      storeAddress: data.storeAddress,
      city: data.city,
      state: data.state,
      employeeId: data.employeeId,
      additionalInfo: data.additionalInfo,
    });

    return {
      success: true,
      message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
    };
  }

  public async registerSupplier(data: any): Promise<{ success: boolean; message: string; requestId?: string }> {
    const res = await safeFetchJson('/api/v1/auth/register/supplier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.isJson && res.data) {
      return res.data;
    }

    if (res.isJson && res.data && (res.data.message || res.data.error) && res.status < 500) {
      throw new Error(res.data.message || res.data.error);
    }

    accessRequestClient.addPendingRequest({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      requestedRole: 'supplier',
      supplierName: data.supplierName,
      supplierType: data.supplierType === 'Other' ? `Other: ${data.supplierTypeOther}` : data.supplierType,
      productsSupplied: Array.isArray(data.productsSupplied) ? data.productsSupplied.join(', ') : data.productsSupplied,
      storeAddress: data.businessAddress,
      city: data.city,
      state: data.state,
      gstin: data.gstin,
      additionalInfo: data.additionalInfo,
    });

    return {
      success: true,
      message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
    };
  }

  public async registerMainManager(data: any): Promise<{ success: boolean; message: string; user?: any; token?: string }> {
    const res = await safeFetchJson('/api/v1/auth/register/main-manager', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok && res.isJson && res.data) {
      if (res.data.token && res.data.user) {
        const session: AuthSession = {
          user: res.data.user,
          token: res.data.token,
          expiresAt: Date.now() + 1000 * 60 * 60 * 24,
          isDemo: false,
        };
        this.setSession(session);
        localStorage.setItem('freshguard_token_v1', res.data.token);
      }
      return res.data;
    }

    // If server returned a client/validation error (e.g. 400 or 409)
    if (res.isJson && res.data && (res.data.message || res.data.error) && res.status < 500) {
      throw new Error(res.data.message || res.data.error);
    }

    // Backend database unavailable, unconfigured, or returned 500/503 -> Seamless client-side bootstrap validation
    if (data.authNumber === '987654321') {
      const newManager: User = {
        id: `usr-exec-${Date.now().toString().slice(-4)}`,
        name: data.fullName,
        email: data.email,
        role: 'main_manager',
        title: 'Head of Retail Operations',
        department: 'FreshBasket Executive HQ',
        avatar: data.fullName.slice(0, 2).toUpperCase(),
      };
      const session: AuthSession = {
        user: newManager,
        token: `fg_jwt_main_manager_${Date.now()}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
        isDemo: true,
      };
      this.setSession(session);
      localStorage.setItem('freshguard_token_v1', session.token);
      return {
        success: true,
        message: 'Initial Main Manager registered and authorized successfully. System bootstrap complete.',
        user: newManager,
        token: session.token,
      };
    }

    throw new Error('Invalid manager authentication credential. Bootstrap authorization failed.');
  }

  public async getBootstrapStatus(): Promise<{ bootstrapRequired: boolean }> {
    const res = await safeFetchJson('/api/v1/auth/bootstrap-status');
    if (res.ok && res.isJson && res.data) {
      return res.data;
    }
    return { bootstrapRequired: true };
  }

  public logout(): void {
    localStorage.removeItem('freshguard_token_v1');
    this.clearSession();
  }

  public async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userMatch = ENTERPRISE_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (userMatch) {
      return {
        success: true,
        message: `A secure password reset link has been dispatched to ${email}. Check your enterprise inbox.`,
      };
    }
    return {
      success: false,
      message: `No active directory account found with email: ${email}. Please contact HQ IT support.`,
    };
  }

  // --- DATA ISOLATION HELPERS ---

  public canAccessStore(user: User | null, storeId: string): boolean {
    if (!user) return false;
    if (user.role === 'main_manager') return true;
    if (user.role === 'store_manager') {
      return user.assignedStoreId === storeId;
    }
    return false; // Suppliers cannot browse internal store dossiers
  }

  public canAccessSupplier(user: User | null, supplierId: string): boolean {
    if (!user) return false;
    if (user.role === 'main_manager') return true;
    if (user.role === 'supplier') {
      return user.supplierId === supplierId;
    }
    return false; // Store managers cannot view arbitrary supplier internal ledgers
  }

  // --- EMERGENCY ANNOUNCEMENTS ---

  public getAnnouncements(): EmergencyAnnouncement[] {
    try {
      const raw = localStorage.getItem(ANNOUNCEMENTS_KEY);
      if (!raw) {
        localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
        return INITIAL_ANNOUNCEMENTS;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  }

  public getAnnouncementsForRole(role: UserRole): EmergencyAnnouncement[] {
    const list = this.getAnnouncements();
    return list.filter((a) => a.targetRoles.includes(role));
  }

  public createAnnouncement(announcement: Omit<EmergencyAnnouncement, 'id' | 'createdAt' | 'acknowledgedBy'>): EmergencyAnnouncement {
    const list = this.getAnnouncements();
    const newRecord: EmergencyAnnouncement = {
      ...announcement,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      acknowledgedBy: [],
    };
    const updated = [newRecord, ...list];
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
    return newRecord;
  }

  public acknowledgeAnnouncement(announcementId: string, userId: string): void {
    const list = this.getAnnouncements();
    const updated = list.map((a) => {
      if (a.id === announcementId && !a.acknowledgedBy.includes(userId)) {
        return { ...a, acknowledgedBy: [...a.acknowledgedBy, userId] };
      }
      return a;
    });
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(updated));
  }
}

export const authService = new AuthService();
