// ============================================================
// FreshGuard AI — Authentication & Role Authorization Context
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, UserRole, LoginCredentials, EmergencyAnnouncement } from '../types/auth';
import { authService, ENTERPRISE_USERS } from '../services/auth';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  quickLoginAs: (role: UserRole) => Promise<User>;
  logout: () => void;
  announcements: EmergencyAnnouncement[];
  unreadAnnouncementsCount: number;
  createAnnouncement: (announcement: {
    title: string;
    message: string;
    targetRoles: UserRole[];
    priority: 'routine' | 'urgent' | 'critical';
  }) => EmergencyAnnouncement;
  acknowledgeAnnouncement: (announcementId: string) => void;
  canAccessStore: (storeId: string) => boolean;
  canAccessSupplier: (supplierId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [announcements, setAnnouncements] = useState<EmergencyAnnouncement[]>([]);
  const navigate = useNavigate();

  // Load session on startup
  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session.user);
    }
    setAnnouncements(authService.getAnnouncements());
    setIsLoading(false);
  }, []);

  // Update announcement list when user changes
  const refreshAnnouncements = useCallback(() => {
    setAnnouncements(authService.getAnnouncements());
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    const session = await authService.login(credentials);
    setUser(session.user);
    refreshAnnouncements();
    return session.user;
  };

  const quickLoginAs = async (targetRole: UserRole): Promise<User> => {
    const preset = ENTERPRISE_USERS.find((u) => u.role === targetRole);
    if (!preset) throw new Error(`Unknown preset role: ${targetRole}`);
    return login({ email: preset.email, password: preset.passwordHash });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleCreateAnnouncement = (ann: {
    title: string;
    message: string;
    targetRoles: UserRole[];
    priority: 'routine' | 'urgent' | 'critical';
  }) => {
    if (!user) throw new Error('Unauthenticated user cannot publish announcements');
    const created = authService.createAnnouncement({
      ...ann,
      senderName: user.name,
      senderRole: user.title,
    });
    refreshAnnouncements();
    return created;
  };

  const handleAcknowledgeAnnouncement = (announcementId: string) => {
    if (!user) return;
    authService.acknowledgeAnnouncement(announcementId, user.id);
    refreshAnnouncements();
  };

  const unreadAnnouncementsCount = user
    ? announcements.filter(
        (a) => a.targetRoles.includes(user.role) && !a.acknowledgedBy.includes(user.id)
      ).length
    : 0;

  const value: AuthContextType = {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    quickLoginAs,
    logout,
    announcements,
    unreadAnnouncementsCount,
    createAnnouncement: handleCreateAnnouncement,
    acknowledgeAnnouncement: handleAcknowledgeAnnouncement,
    canAccessStore: (storeId: string) => authService.canAccessStore(user, storeId),
    canAccessSupplier: (supplierId: string) => authService.canAccessSupplier(user, supplierId),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
