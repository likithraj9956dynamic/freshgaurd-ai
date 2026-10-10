import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'freshguard_jwt_secret_key_2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware: Verifies JWT token and checks if user status is APPROVED.
 */
export const authenticateUser = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    let decoded: any;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new UnauthorizedError('User account no longer exists');
    }

    // Strictly enforce access status on all protected endpoints
    if (user.status !== 'APPROVED') {
      if (user.status === 'PENDING') {
        throw new ForbiddenError(
          'Your registration request has been submitted. A Main Manager must review and approve your request before you can access system resources.'
        );
      } else if (user.status === 'REJECTED') {
        throw new ForbiddenError(
          'Your access request has been rejected by a Main Manager.'
        );
      } else if (user.status === 'MORE_INFO_REQUIRED') {
        throw new ForbiddenError(
          'Additional information is required for your access request. Check your email for manager instructions.'
        );
      } else {
        throw new ForbiddenError('Account is inactive or access is restricted.');
      }
    }

    req.user = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      status: user.status
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware: Restricts access to specific allowed roles.
 */
export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
        )
      );
    }

    next();
  };
};

/**
 * Middleware: Restricts access strictly to Main Managers.
 */
export const requireMainManager = requireRoles('MAIN_MANAGER');
