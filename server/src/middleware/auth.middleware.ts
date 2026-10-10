// ============================================================
// FreshGuard AI — Enterprise Backend Authentication Middleware
// ============================================================

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { prisma } from '../config/prisma';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
  assignedStoreId?: string | null;
  supplierId?: string | null;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Validates JWT access token on incoming requests
 */
export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. Missing Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtErr: any) {
      throw new UnauthorizedError('Session expired or invalid token. Please sign in again.');
    }

    if (!decoded || !decoded.userId) {
      throw new UnauthorizedError('Malformed token payload.');
    }

    // Check in database
    let user: AuthenticatedUser | null = null;
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (dbUser) {
        if (dbUser.status !== 'APPROVED') {
          throw new ForbiddenError('Your account is not approved for active platform access.');
        }
        user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          fullName: dbUser.fullName,
          assignedStoreId: dbUser.assignedStoreId,
          supplierId: dbUser.supplierId,
        };
      }
    } catch (dbErr) {
      // In case of DB connectivity, check if payload itself has valid signed claims
      if (decoded.role && decoded.email) {
        user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          fullName: decoded.fullName || 'Authorized User',
          assignedStoreId: decoded.assignedStoreId,
          supplierId: decoded.supplierId,
        };
      }
    }

    if (!user) {
      throw new UnauthorizedError('Authorized account record not found.');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Enforces role-based authorization on the backend
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Role "${req.user.role}" does not have permission to access this resource. Required: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
};

export const requireMainManager = requireRole(['main_manager']);
