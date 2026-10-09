// ============================================================
// FreshGuard AI — Enterprise Role-Based Authentication Service
// ============================================================

import type { User, AuthSession, LoginCredentials, EmergencyAnnouncement, UserRole } from '../types/auth';

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
    department: 'Tacoma Branch Operations',
    assignedStoreId: '1012',
    assignedStoreName: 'FreshBasket Tacoma Downtown (#017)',
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
    supplierId: 'sup-cascade',
    supplierName: 'Cascade Fresh Distributors',
    avatar: 'ER',
  },
];

// Seed announcements
const INITIAL_ANNOUNCEMENTS: EmergencyAnnouncement[] = [
  {
    id: 'ann-101',
    title: 'CRITICAL COLD-CHAIN ADVISORY: I-5 Highway Transit Delays',
    message: 'Severe traffic & seasonal temperature anomalies along the Tacoma-Seattle freight corridor. All temperature-sensitive organic produce deliveries (Baby Spinach, Berries) must undergo infrared probe verification upon dock intake.',
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
    // Artificial slight latency to render accessible enterprise loading state
    await new Promise((resolve) => setTimeout(resolve, 600));

    const emailClean = credentials.email.trim().toLowerCase();
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
    return session;
  }

  public logout(): void {
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
