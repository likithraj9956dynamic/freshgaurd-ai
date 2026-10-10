import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { z } from 'zod';
import { ApiResponse } from '../utils/apiResponse';
import { BadRequestError, ForbiddenError, NotFoundError } from '../utils/errors';
import { EmailService } from '../services/email.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

const rejectSchema = z.object({
  reason: z.string().optional(),
});

const moreInfoSchema = z.object({
  note: z.string().min(3, 'Message note to applicant is required'),
});

const inviteManagerSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export class AccessRequestController {
  /**
   * 1. List Access Requests (Main Manager Only)
   */
  public static async listRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { status = 'PENDING', search } = req.query;

      const whereClause: any = {};

      if (status !== 'ALL') {
        whereClause.status = status as string;
      }

      if (search) {
        const searchStr = String(search).toLowerCase();
        whereClause.OR = [
          { applicant: { fullName: { contains: searchStr, mode: 'insensitive' } } },
          { applicant: { email: { contains: searchStr, mode: 'insensitive' } } },
          { requestedRole: { contains: searchStr, mode: 'insensitive' } }
        ];
      }

      const requests = await prisma.accessRequest.findMany({
        where: whereClause,
        include: {
          applicant: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              role: true,
              status: true,
              createdAt: true,
              storeDetail: true,
              supplierDetail: true,
            }
          },
          decider: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return ApiResponse.success({
        res,
        message: 'Access requests fetched successfully',
        data: { requests, count: requests.length }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 2. Get Request Details
   */
  public static async getRequestDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const accessRequest = await prisma.accessRequest.findUnique({
        where: { id },
        include: {
          applicant: {
            include: {
              storeDetail: true,
              supplierDetail: true,
            }
          },
          decider: {
            select: {
              id: true,
              fullName: true,
              email: true
            }
          }
        }
      });

      if (!accessRequest) {
        throw new NotFoundError('Access request not found');
      }

      return ApiResponse.success({
        res,
        message: 'Access request details retrieved',
        data: { accessRequest }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 3. Approve Request
   */
  public static async approveRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const decider = req.user!;

      const request = await prisma.accessRequest.findUnique({
        where: { id },
        include: { applicant: true }
      });

      if (!request) {
        throw new NotFoundError('Access request not found');
      }

      if (request.userId === decider.id) {
        throw new ForbiddenError('Main Managers cannot approve their own access requests');
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updatedReq = await tx.accessRequest.update({
          where: { id },
          data: {
            status: 'APPROVED',
            decidedBy: decider.id,
            decidedAt: new Date(),
          }
        });

        await tx.user.update({
          where: { id: request.userId },
          data: {
            status: 'APPROVED',
            emailVerified: true
          }
        });

        await tx.auditLog.create({
          data: {
            actor: decider.email,
            eventType: 'ACCESS_REQUEST_APPROVED',
            details: {
              requestId: id,
              applicantId: request.userId,
              applicantEmail: request.applicant.email,
              role: request.requestedRole
            }
          }
        });

        return updatedReq;
      });

      EmailService.sendAccessApprovedEmail(
        request.applicant.email,
        request.applicant.fullName,
        request.requestedRole
      );

      return ApiResponse.success({
        res,
        message: 'Access request approved successfully',
        data: { request: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 4. Reject Request
   */
  public static async rejectRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const decider = req.user!;
      const { reason } = rejectSchema.parse(req.body);

      const request = await prisma.accessRequest.findUnique({
        where: { id },
        include: { applicant: true }
      });

      if (!request) {
        throw new NotFoundError('Access request not found');
      }

      if (request.userId === decider.id) {
        throw new ForbiddenError('Main Managers cannot perform decision operations on their own account');
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updatedReq = await tx.accessRequest.update({
          where: { id },
          data: {
            status: 'REJECTED',
            rejectionReason: reason || 'Criteria not met',
            decidedBy: decider.id,
            decidedAt: new Date(),
          }
        });

        await tx.user.update({
          where: { id: request.userId },
          data: { status: 'REJECTED' }
        });

        await tx.auditLog.create({
          data: {
            actor: decider.email,
            eventType: 'ACCESS_REQUEST_REJECTED',
            details: {
              requestId: id,
              applicantId: request.userId,
              reason: reason || 'Criteria not met'
            }
          }
        });

        return updatedReq;
      });

      EmailService.sendAccessRejectedEmail(
        request.applicant.email,
        request.applicant.fullName,
        reason
      );

      return ApiResponse.success({
        res,
        message: 'Access request rejected',
        data: { request: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 5. Request Additional Information
   */
  public static async requestMoreInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const decider = req.user!;
      const { note } = moreInfoSchema.parse(req.body);

      const request = await prisma.accessRequest.findUnique({
        where: { id },
        include: { applicant: true }
      });

      if (!request) {
        throw new NotFoundError('Access request not found');
      }

      const updated = await prisma.$transaction(async (tx) => {
        const updatedReq = await tx.accessRequest.update({
          where: { id },
          data: {
            status: 'MORE_INFO_REQUIRED',
            moreInfoNote: note,
            decidedBy: decider.id,
            decidedAt: new Date(),
          }
        });

        await tx.user.update({
          where: { id: request.userId },
          data: { status: 'MORE_INFO_REQUIRED' }
        });

        await tx.auditLog.create({
          data: {
            actor: decider.email,
            eventType: 'ACCESS_REQUEST_MORE_INFO_REQUESTED',
            details: { requestId: id, applicantId: request.userId, note }
          }
        });

        return updatedReq;
      });

      EmailService.sendMoreInfoRequestedEmail(
        request.applicant.email,
        request.applicant.fullName,
        note
      );

      return ApiResponse.success({
        res,
        message: 'Requested additional information from applicant',
        data: { request: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 6. Invite Main Manager
   */
  public static async inviteMainManager(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { email } = inviteManagerSchema.parse(req.body);
      const inviter = req.user!;

      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser && existingUser.status === 'APPROVED') {
        throw new BadRequestError('User with this email address is already registered and active');
      }

      const token = crypto.randomBytes(24).toString('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const invitation = await prisma.managerInvitation.create({
        data: {
          email: email.toLowerCase(),
          token,
          invitedBy: inviter.id,
          expiresAt
        }
      });

      EmailService.sendMainManagerInvitation(email, token);

      return ApiResponse.success({
        res,
        statusCode: 201,
        message: `Main Manager invitation sent to ${email}`,
        data: { invitationId: invitation.id, email: invitation.email, expiresAt }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 7. List All Users
   */
  public static async listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          role: true,
          status: true,
          createdAt: true,
          storeDetail: true,
          supplierDetail: true,
        },
        orderBy: { createdAt: 'desc' }
      });

      return ApiResponse.success({
        res,
        message: 'Users retrieved successfully',
        data: { users, count: users.length }
      });
    } catch (error) {
      next(error);
    }
  }
}
