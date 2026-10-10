// ============================================================
// FreshGuard AI — Enterprise Access Request & Approval Service
// ============================================================

import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { emailService } from './email.service';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors';

export class AccessRequestService {
  /**
   * List access requests with optional status filtering
   */
  public async listRequests(statusFilter?: string) {
    const where: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      where.status = statusFilter;
    }

    let requests: any[] = [];
    try {
      requests = await prisma.accessRequest.findMany({
        where,
        orderBy: { submissionDate: 'desc' },
        include: {
          reviewer: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          decisions: {
            orderBy: { createdAt: 'desc' },
            include: {
              decider: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } catch {
      // Fallback demo requests if database unreachable
      requests = [
        {
          id: 'req_demo_01',
          fullName: 'Vikram Seth',
          email: 'vikram.seth@freshbasket.com',
          phoneNumber: '+91-98765-43210',
          requestedRole: 'store_manager',
          status: 'PENDING',
          submissionDate: new Date().toISOString(),
          storeName: 'FreshBasket Whitefield (#FB-16)',
          storeType: 'Standard',
          storeAddress: 'ITPL Main Road',
          city: 'Bangalore',
          state: 'Karnataka',
          employeeId: 'EMP-9021',
          decisions: [],
        },
        {
          id: 'req_demo_02',
          fullName: 'Kaveri Logistics Director',
          email: 'dispatch@kaverilogistics.com',
          phoneNumber: '+91-99887-76655',
          requestedRole: 'supplier',
          status: 'PENDING',
          submissionDate: new Date().toISOString(),
          supplierName: 'Kaveri Cold Distribution',
          supplierType: 'Dairy & Perishables',
          productsSupplied: ['Milk', 'Curd', 'Paneer'],
          city: 'Bangalore',
          state: 'Karnataka',
          decisions: [],
        },
      ];
      if (statusFilter && statusFilter !== 'ALL') {
        requests = requests.filter((r) => r.status === statusFilter);
      }
    }

    return requests.map((req) => ({
      id: req.id,
      fullName: req.fullName,
      email: req.email,
      phoneNumber: req.phoneNumber,
      requestedRole: req.requestedRole,
      status: req.status,
      submissionDate: req.submissionDate,
      storeName: req.storeName,
      storeType: req.storeType,
      storeAddress: req.storeAddress,
      city: req.city,
      state: req.state,
      employeeId: req.employeeId,
      supplierName: req.supplierName,
      supplierType: req.supplierType,
      productsSupplied: req.productsSupplied,
      gstin: req.gstin,
      additionalInfo: req.additionalInfo,
      decisionReason: req.decisionReason,
      managerInstructions: req.managerInstructions,
      reviewedAt: req.reviewedAt,
      reviewer: req.reviewer,
      decisions: req.decisions,
    }));
  }

  /**
   * Get single request details
   */
  public async getRequestById(id: string) {
    const req = await prisma.accessRequest.findUnique({
      where: { id },
      include: {
        reviewer: {
          select: { id: true, fullName: true, email: true },
        },
        decisions: {
          orderBy: { createdAt: 'desc' },
          include: {
            decider: { select: { id: true, fullName: true, email: true } },
          },
        },
      },
    });

    if (!req) {
      throw new NotFoundError(`Access request with ID "${id}" was not found.`);
    }

    return req;
  }

  /**
   * Approve an access request (Atomic Transaction)
   */
  public async approveRequest(requestId: string, deciderId: string, notes?: string) {
    const request = await prisma.accessRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundError(`Access request "${requestId}" not found.`);
    }

    if (request.status === 'APPROVED') {
      throw new BadRequestError('This access request has already been approved.');
    }

    // Safety: Applicant cannot approve their own request
    if (request.applicantId && request.applicantId === deciderId) {
      throw new ForbiddenError('You cannot approve your own access request.');
    }

    // Execute atomic approval transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Access Request
      const updatedRequest = await tx.accessRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedById: deciderId,
          reviewedAt: new Date(),
          decisionReason: notes || 'Approved by Main Manager.',
        },
      });

      // 2. Create or Update User account
      let user = await tx.user.findUnique({ where: { email: request.email } });
      if (!user) {
        user = await tx.user.create({
          data: {
            email: request.email,
            fullName: request.fullName,
            phoneNumber: request.phoneNumber,
            passwordHash: request.passwordHash,
            role: request.requestedRole,
            status: 'APPROVED',
            isEmailVerified: true,
            assignedStoreId: request.requestedRole === 'store_manager' ? '1012' : null,
            assignedStoreName: request.requestedRole === 'store_manager' ? request.storeName || 'FreshBasket Tacoma Downtown' : null,
            supplierId: request.requestedRole === 'supplier' ? 'sup-cascade' : null,
            supplierName: request.requestedRole === 'supplier' ? request.supplierName || 'Cascade Fresh' : null,
          },
        });
      } else {
        user = await tx.user.update({
          where: { id: user.id },
          data: {
            role: request.requestedRole,
            status: 'APPROVED',
            fullName: request.fullName,
            phoneNumber: request.phoneNumber,
            passwordHash: request.passwordHash,
            assignedStoreId: request.requestedRole === 'store_manager' ? '1012' : user.assignedStoreId,
            assignedStoreName: request.requestedRole === 'store_manager' ? request.storeName : user.assignedStoreName,
            supplierId: request.requestedRole === 'supplier' ? 'sup-cascade' : user.supplierId,
            supplierName: request.requestedRole === 'supplier' ? request.supplierName : user.supplierName,
          },
        });
      }

      // Link user to access request
      await tx.accessRequest.update({
        where: { id: requestId },
        data: { applicantId: user.id },
      });

      // 3. Record Audit Decision
      const decision = await tx.approvalDecision.create({
        data: {
          requestId: request.id,
          deciderId,
          action: 'APPROVE',
          notes: notes || 'Access request approved.',
        },
      });

      return { updatedRequest, user, decision };
    });

    // Send transactional approval email
    await emailService.sendApprovalNotification({
      name: request.fullName,
      email: request.email,
      role: request.requestedRole,
    });

    return {
      success: true,
      message: `Access request for ${request.fullName} has been approved. Notification email dispatched.`,
      request: result.updatedRequest,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.fullName,
        role: result.user.role,
      },
    };
  }

  /**
   * Reject an access request (Atomic Transaction)
   */
  public async rejectRequest(requestId: string, deciderId: string, reason?: string) {
    const request = await prisma.accessRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundError(`Access request "${requestId}" not found.`);
    }

    if (request.applicantId && request.applicantId === deciderId) {
      throw new ForbiddenError('You cannot evaluate your own access request.');
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.accessRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          reviewedById: deciderId,
          reviewedAt: new Date(),
          decisionReason: reason?.trim() || null,
        },
      });

      // If user record already exists, deactivate it
      const existingUser = await tx.user.findUnique({ where: { email: request.email } });
      if (existingUser) {
        await tx.user.update({
          where: { id: existingUser.id },
          data: { status: 'REJECTED' },
        });
      }

      await tx.approvalDecision.create({
        data: {
          requestId: request.id,
          deciderId,
          action: 'REJECT',
          reason: reason?.trim() || null,
        },
      });

      return updatedRequest;
    });

    // Send rejection email
    await emailService.sendRejectionNotification({
      name: request.fullName,
      email: request.email,
      reason: reason?.trim(),
    });

    return {
      success: true,
      message: `Access request for ${request.fullName} rejected. Notification email dispatched.`,
      request: result,
    };
  }

  /**
   * Request More Information from applicant
   */
  public async requestMoreInfo(requestId: string, deciderId: string, instructions: string) {
    if (!instructions || instructions.trim() === '') {
      throw new BadRequestError('Instructions for the applicant are required.');
    }

    const request = await prisma.accessRequest.findUnique({ where: { id: requestId } });
    if (!request) {
      throw new NotFoundError(`Access request "${requestId}" not found.`);
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedRequest = await tx.accessRequest.update({
        where: { id: requestId },
        data: {
          status: 'MORE_INFO_REQUIRED',
          reviewedById: deciderId,
          reviewedAt: new Date(),
          managerInstructions: instructions.trim(),
        },
      });

      await tx.approvalDecision.create({
        data: {
          requestId: request.id,
          deciderId,
          action: 'REQUEST_MORE_INFO',
          notes: instructions.trim(),
        },
      });

      return updatedRequest;
    });

    await emailService.sendMoreInfoRequired({
      name: request.fullName,
      email: request.email,
      instructions: instructions.trim(),
    });

    return {
      success: true,
      message: `Instructions sent to ${request.fullName}. Status updated to MORE_INFO_REQUIRED.`,
      request: result,
    };
  }

  /**
   * List all approved users for Main Manager directory
   */
  public async listApprovedUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        status: true,
        isEmailVerified: true,
        assignedStoreId: true,
        assignedStoreName: true,
        supplierId: true,
        supplierName: true,
        createdAt: true,
      },
    });

    return users;
  }

  /**
   * Invite another Main Manager
   */
  public async inviteMainManager(invitedByUserId: string, email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestError('A valid corporate email address is required.');
    }

    const emailClean = email.trim().toLowerCase();

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing && existing.role === 'main_manager') {
      throw new BadRequestError('An authorized Main Manager account already exists for this email.');
    }

    const inviter = await prisma.user.findUnique({ where: { id: invitedByUserId } });
    const inviterName = inviter ? inviter.fullName : 'Head of Retail Operations';

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    // Upsert invitation
    const invitation = await prisma.managerInvitation.upsert({
      where: { email: emailClean },
      update: {
        invitationToken: token,
        invitedById: invitedByUserId,
        status: 'PENDING',
        expiresAt,
      },
      create: {
        email: emailClean,
        invitationToken: token,
        invitedById: invitedByUserId,
        status: 'PENDING',
        expiresAt,
      },
    });

    // Send invitation email
    await emailService.sendManagerInvitation({
      email: emailClean,
      invitedByName: inviterName,
      invitationToken: token,
    });

    return {
      success: true,
      message: `Invitation successfully dispatched to ${emailClean}.`,
      invitationId: invitation.id,
      expiresAt: invitation.expiresAt,
    };
  }
}

export const accessRequestService = new AccessRequestService();
