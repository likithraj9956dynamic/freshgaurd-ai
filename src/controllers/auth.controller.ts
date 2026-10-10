import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { ApiResponse } from '../utils/apiResponse';
import { BadRequestError, ForbiddenError, UnauthorizedError, ConflictError } from '../utils/errors';
import { EmailService } from '../services/email.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'freshguard_jwt_secret_key_2026';
const INITIAL_MANAGER_SETUP_SECRET = process.env.INITIAL_MANAGER_SETUP_SECRET || '987654321';

// Validation Schemas
const registerStoreManagerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid work email address'),
  phoneNumber: z.string().min(6, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  storeName: z.string().min(2, 'Store name is required'),
  storeType: z.string().min(2, 'Store type is required'),
  storeTypeOther: z.string().optional(),
  storeAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  employeeId: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const registerSupplierSchema = z.object({
  contactName: z.string().min(2, 'Contact person name is required'),
  email: z.string().email('Invalid business email address'),
  phoneNumber: z.string().min(6, 'Valid phone number is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company/Supplier name is required'),
  supplierType: z.string().min(2, 'Supplier type is required'),
  supplierTypeOther: z.string().optional(),
  productsSupplied: z.string().min(2, 'Products supplied is required'),
  businessAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gstin: z.string().optional(),
  additionalInfo: z.string().optional(),
});

const registerMainManagerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid work email address'),
  phoneNumber: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  authNumber: z.string().optional(),
  invitationToken: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export class AuthController {
  /**
   * 1. Register Store Manager
   */
  public static async registerStoreManager(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerStoreManagerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (existingUser) {
        throw new ConflictError('An account with this email address already exists');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: data.email.toLowerCase(),
            passwordHash,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            role: 'STORE_MANAGER',
            status: 'PENDING',
            employeeId: data.employeeId,
          }
        });

        const storeDetail = await tx.storeDetail.create({
          data: {
            userId: user.id,
            storeName: data.storeName,
            storeType: data.storeType,
            storeTypeOther: data.storeTypeOther,
            storeAddress: data.storeAddress,
            city: data.city,
            state: data.state,
            employeeId: data.employeeId,
            additionalInfo: data.additionalInfo,
          }
        });

        const accessRequest = await tx.accessRequest.create({
          data: {
            userId: user.id,
            requestedRole: 'STORE_MANAGER',
            status: 'PENDING',
            requestData: {
              storeName: data.storeName,
              storeType: data.storeType,
              storeTypeOther: data.storeTypeOther,
              storeAddress: data.storeAddress,
              city: data.city,
              state: data.state,
              employeeId: data.employeeId,
              additionalInfo: data.additionalInfo,
            }
          }
        });

        await tx.auditLog.create({
          data: {
            actor: user.email,
            eventType: 'USER_REGISTERED_STORE_MANAGER',
            details: { userId: user.id, requestId: accessRequest.id }
          }
        });

        return { user, storeDetail, accessRequest };
      });

      EmailService.sendRegistrationConfirmation(result.user.email, result.user.fullName, 'STORE_MANAGER');

      const managers = await prisma.user.findMany({
        where: { role: 'MAIN_MANAGER', status: 'APPROVED' },
        select: { email: true }
      });
      if (managers.length > 0) {
        EmailService.sendNewAccessRequestNotification(
          managers.map(m => m.email),
          result.user.fullName,
          result.user.email,
          'STORE_MANAGER'
        );
      }

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
        data: {
          userId: result.user.id,
          status: result.user.status,
          requestId: result.accessRequest.id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. Register Supplier
   */
  public static async registerSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSupplierSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (existingUser) {
        throw new ConflictError('An account with this email address already exists');
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: data.email.toLowerCase(),
            passwordHash,
            fullName: data.contactName,
            phoneNumber: data.phoneNumber,
            role: 'SUPPLIER',
            status: 'PENDING',
          }
        });

        const supplierDetail = await tx.supplierDetail.create({
          data: {
            userId: user.id,
            companyName: data.companyName,
            supplierType: data.supplierType,
            supplierTypeOther: data.supplierTypeOther,
            productsSupplied: data.productsSupplied,
            businessAddress: data.businessAddress,
            city: data.city,
            state: data.state,
            gstin: data.gstin,
            additionalInfo: data.additionalInfo,
          }
        });

        const accessRequest = await tx.accessRequest.create({
          data: {
            userId: user.id,
            requestedRole: 'SUPPLIER',
            status: 'PENDING',
            requestData: {
              companyName: data.companyName,
              supplierType: data.supplierType,
              supplierTypeOther: data.supplierTypeOther,
              productsSupplied: data.productsSupplied,
              businessAddress: data.businessAddress,
              city: data.city,
              state: data.state,
              gstin: data.gstin,
              additionalInfo: data.additionalInfo,
            }
          }
        });

        await tx.auditLog.create({
          data: {
            actor: user.email,
            eventType: 'USER_REGISTERED_SUPPLIER',
            details: { userId: user.id, requestId: accessRequest.id }
          }
        });

        return { user, supplierDetail, accessRequest };
      });

      EmailService.sendRegistrationConfirmation(result.user.email, result.user.fullName, 'SUPPLIER');

      const managers = await prisma.user.findMany({
        where: { role: 'MAIN_MANAGER', status: 'APPROVED' },
        select: { email: true }
      });
      if (managers.length > 0) {
        EmailService.sendNewAccessRequestNotification(
          managers.map(m => m.email),
          result.user.fullName,
          result.user.email,
          'SUPPLIER'
        );
      }

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
        data: {
          userId: result.user.id,
          status: result.user.status,
          requestId: result.accessRequest.id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. Register Main Manager
   */
  public static async registerMainManager(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerMainManagerSchema.parse(req.body);

      const existingUser = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (existingUser) {
        throw new ConflictError('An account with this email address already exists');
      }

      const mainManagerCount = await prisma.user.count({
        where: { role: 'MAIN_MANAGER', status: 'APPROVED' }
      });

      let isInitialBootstrap = false;

      if (mainManagerCount === 0) {
        if (!data.authNumber || data.authNumber.trim() !== INITIAL_MANAGER_SETUP_SECRET) {
          throw new UnauthorizedError('Invalid manager authentication credential for initial setup');
        }
        isInitialBootstrap = true;
      } else {
        if (!data.invitationToken) {
          throw new ForbiddenError(
            'Initial Main Manager setup is disabled. Additional Main Managers can only register via an invitation from an existing Main Manager.'
          );
        }

        const invitation = await prisma.managerInvitation.findFirst({
          where: {
            token: data.invitationToken,
            email: data.email.toLowerCase(),
            used: false,
            expiresAt: { gt: new Date() }
          }
        });

        if (!invitation) {
          throw new UnauthorizedError('Invalid or expired manager invitation token');
        }
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: data.email.toLowerCase(),
            passwordHash,
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            role: 'MAIN_MANAGER',
            status: 'APPROVED',
            emailVerified: true,
          }
        });

        if (data.invitationToken) {
          await tx.managerInvitation.updateMany({
            where: { token: data.invitationToken },
            data: { used: true }
          });
        }

        await tx.auditLog.create({
          data: {
            actor: user.email,
            eventType: isInitialBootstrap ? 'INITIAL_MAIN_MANAGER_BOOTSTRAPPED' : 'MAIN_MANAGER_REGISTERED_VIA_INVITE',
            details: { userId: user.id }
          }
        });

        return user;
      });

      const token = jwt.sign(
        { userId: result.id, email: result.email, role: result.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: 'Main Manager account successfully registered and verified',
        data: {
          token,
          user: {
            id: result.id,
            email: result.email,
            fullName: result.fullName,
            role: result.role,
            status: result.status,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. Login
   */
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase() },
        include: {
          storeDetail: true,
          supplierDetail: true,
          accessRequests: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!user) {
        throw new UnauthorizedError('Invalid email address or password');
      }

      const passwordValid = await bcrypt.compare(data.password, user.passwordHash);
      if (!passwordValid) {
        throw new UnauthorizedError('Invalid email address or password');
      }

      if (user.status !== 'APPROVED') {
        const latestRequest = user.accessRequests[0];
        
        return res.status(403).json({
          success: false,
          error: 'ACCESS_NOT_APPROVED',
          message:
            user.status === 'PENDING'
              ? 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.'
              : user.status === 'REJECTED'
              ? 'Your access request was not approved by a Main Manager.'
              : 'Additional information is required for your access request.',
          data: {
            userId: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            status: user.status,
            rejectionReason: latestRequest?.rejectionReason,
            moreInfoNote: latestRequest?.moreInfoNote,
          }
        });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return ApiResponse.success({
        res,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            status: user.status,
            storeDetail: user.storeDetail,
            supplierDetail: user.supplierDetail,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. Get Current User Profile
   */
  public static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          storeDetail: true,
          supplierDetail: true,
          storeAssignments: {
            include: { store: true }
          }
        }
      });

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      return ApiResponse.success({
        res,
        message: 'User profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            role: user.role,
            status: user.status,
            storeDetail: user.storeDetail,
            supplierDetail: user.supplierDetail,
            storeAssignments: user.storeAssignments,
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
