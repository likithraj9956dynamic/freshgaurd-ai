// ============================================================
// FreshGuard AI — Authentication & Role Types
// ============================================================

export type UserRole = 'main_manager' | 'store_manager' | 'supplier';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  assignedStoreId?: string;       // Present for store_manager (e.g. '1012')
  assignedStoreName?: string;     // e.g. 'Store 017 — Tacoma Downtown'
  supplierId?: string;            // Present for supplier (e.g. 'sup-cascade')
  supplierName?: string;          // e.g. 'Cascade Fresh Distributors'
  avatar?: string;
  lastLoginAt?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number; // Unix timestamp ms
  isDemo: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface EmergencyAnnouncement {
  id: string;
  title: string;
  message: string;
  senderName: string;
  senderRole: string;
  targetRoles: UserRole[];
  priority: 'routine' | 'urgent' | 'critical';
  createdAt: string;
  acknowledgedBy: string[]; // User IDs who acknowledged
}
