// ============================================================
// FreshGuard AI — Enterprise Authentication & Registration Service
// ============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { emailService } from './email.service';
import { BadRequestError, UnauthorizedError, ForbiddenError, ConflictError, NotFoundError } from '../utils/errors';

export interface RegisterStoreManagerInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  storeName: string;
  storeType: string;
  storeTypeOther?: string;
  storeAddress: string;
  city: string;
  state: string;
  employeeId?: string;
  additionalInfo?: string;
}

export interface RegisterSupplierInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  supplierName: string;
  supplierType: string;
  supplierTypeOther?: string;
  productsSupplied: string[];
  businessAddress: string;
  city: string;
  state: string;
  gstin?: string;
  additionalInfo?: string;
}

export interface RegisterMainManagerInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  authNumber?: string;
  invitationToken?: string;
}

export class ServerAuthService {
  /**
   * Helper to sign JWT tokens
   */
  public generateToken(user: { id: string; email: string; role: string; fullName: string; assignedStoreId?: string | null; supplierId?: string | null }) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        assignedStoreId: user.assignedStoreId,
        supplierId: user.supplierId,
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  // In-memory fallback registry for development, demo, and test environments
  private static inMemoryRequests: any[] = [];
  private static inMemoryUsers: any[] = [];

  /**
   * 1. Register Store Manager (Creates PENDING access request)
   */
  public async registerStoreManager(input: Partial<RegisterStoreManagerInput>) {
    // Basic validations
    if (!input.fullName || !input.email || !input.password || !input.phoneNumber || !input.storeName) {
      throw new BadRequestError('Full Name, Email, Password, Phone Number, and Store Name are required.');
    }

    const confirmPassword = input.confirmPassword || input.password;
    if (input.password !== confirmPassword) {
      throw new BadRequestError('Password and Confirm Password do not match.');
    }

    if (input.password.length < 6) {
      throw new BadRequestError('Password must contain at least 6 characters.');
    }

    const emailClean = input.email.trim().toLowerCase();
    const storeAddress = input.storeAddress?.trim() || `${input.storeName.trim()} Commercial Facility`;
    const city = input.city?.trim() || 'Tacoma';
    const state = input.state?.trim() || 'WA';
    const resolvedStoreType = input.storeType === 'Other' && input.storeTypeOther
      ? `Other: ${input.storeTypeOther.trim()}`
      : (input.storeType || 'Standard');

    let existingUser: any = null;
    let existingRequest: any = null;

    try {
      existingUser = await prisma.user.findUnique({ where: { email: emailClean } });
    } catch {
      existingUser = ServerAuthService.inMemoryUsers.find((u) => u.email === emailClean);
    }

    if (existingUser) {
      throw new ConflictError('An authorized account with this corporate email already exists.');
    }

    try {
      existingRequest = await prisma.accessRequest.findFirst({
        where: { email: emailClean, status: 'PENDING' },
      });
    } catch {
      existingRequest = ServerAuthService.inMemoryRequests.find((r) => r.email === emailClean && r.status === 'PENDING');
    }

    if (existingRequest) {
      throw new ConflictError('A pending registration for this email is already awaiting Main Manager review.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);
    let requestId = `req_${Date.now()}`;

    try {
      // Create Access Request in Prisma
      const request = await prisma.accessRequest.create({
        data: {
          requestedRole: 'store_manager',
          fullName: input.fullName.trim(),
          email: emailClean,
          phoneNumber: input.phoneNumber.trim(),
          passwordHash,
          status: 'PENDING',
          storeName: input.storeName.trim(),
          storeType: resolvedStoreType,
          storeAddress,
          city,
          state,
          employeeId: input.employeeId?.trim() || null,
          additionalInfo: input.additionalInfo?.trim() || null,
        },
      });
      requestId = request.id;
    } catch {
      // Fallback to in-memory store
      const memRequest = {
        id: requestId,
        requestedRole: 'store_manager',
        fullName: input.fullName.trim(),
        email: emailClean,
        phoneNumber: input.phoneNumber.trim(),
        passwordHash,
        status: 'PENDING',
        storeName: input.storeName.trim(),
        storeType: resolvedStoreType,
        storeAddress,
        city,
        state,
        employeeId: input.employeeId?.trim() || null,
        additionalInfo: input.additionalInfo?.trim() || null,
        submissionDate: new Date().toISOString(),
      };
      ServerAuthService.inMemoryRequests.push(memRequest);
    }

    // Send confirmation email
    try {
      await emailService.sendRegistrationConfirmation({
        name: input.fullName,
        email: emailClean,
        role: 'store_manager',
        organizationName: input.storeName,
      });
    } catch {
      // Email non-blocking
    }

    return {
      success: true,
      requestId,
      message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
    };
  }

  /**
   * 2. Register Supplier (Creates PENDING access request)
   */
  public async registerSupplier(input: RegisterSupplierInput) {
    if (!input.fullName || !input.email || !input.password || !input.phoneNumber || !input.supplierName || !input.supplierType || !input.businessAddress || !input.city || !input.state) {
      throw new BadRequestError('All required supplier registration fields must be completed.');
    }

    if (input.password !== input.confirmPassword) {
      throw new BadRequestError('Password and Confirm Password do not match.');
    }

    if (input.password.length < 6) {
      throw new BadRequestError('Password must contain at least 6 characters.');
    }

    const emailClean = input.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existingUser) {
      throw new ConflictError('An authorized account with this business email already exists.');
    }

    const existingRequest = await prisma.accessRequest.findFirst({
      where: { email: emailClean, status: 'PENDING' },
    });
    if (existingRequest) {
      throw new ConflictError('A pending supplier registration for this email is already awaiting Main Manager review.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    const resolvedSupplierType = input.supplierType === 'Other' && input.supplierTypeOther
      ? `Other: ${input.supplierTypeOther.trim()}`
      : input.supplierType;

    const productsSuppliedStr = Array.isArray(input.productsSupplied)
      ? input.productsSupplied.join(', ')
      : input.productsSupplied || '';

    const request = await prisma.accessRequest.create({
      data: {
        requestedRole: 'supplier',
        fullName: input.fullName.trim(),
        email: emailClean,
        phoneNumber: input.phoneNumber.trim(),
        passwordHash,
        status: 'PENDING',
        supplierName: input.supplierName.trim(),
        supplierType: resolvedSupplierType,
        productsSupplied: productsSuppliedStr,
        storeAddress: input.businessAddress.trim(),
        city: input.city.trim(),
        state: input.state.trim(),
        gstin: input.gstin?.trim() || null,
        additionalInfo: input.additionalInfo?.trim() || null,
      },
    });

    await emailService.sendRegistrationConfirmation({
      name: input.fullName,
      email: emailClean,
      role: 'supplier',
      organizationName: input.supplierName,
    });

    return {
      success: true,
      requestId: request.id,
      message: 'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.',
    };
  }

  /**
   * 3. Register Main Manager (Bootstrap or Invitation-based)
   */
  public async registerMainManager(input: RegisterMainManagerInput) {
    if (!input.fullName || !input.email || !input.password || !input.phoneNumber) {
      throw new BadRequestError('Full name, email, phone number, and password are required.');
    }

    if (input.password !== input.confirmPassword) {
      throw new BadRequestError('Password and Confirm Password do not match.');
    }

    if (input.password.length < 6) {
      throw new BadRequestError('Password must contain at least 6 characters.');
    }

    const emailClean = input.email.trim().toLowerCase();

    // Check if existing user
    const existing = await prisma.user.findUnique({ where: { email: emailClean } });
    if (existing) {
      throw new ConflictError('An account with this email address already exists.');
    }

    // Check if ANY Main Manager exists
    const mainManagerCount = await prisma.user.count({
      where: { role: 'main_manager', status: 'APPROVED' },
    });

    let isBootstrap = false;

    if (mainManagerCount === 0) {
      // BOOTSTRAP MODE: First Main Manager requires the server setup secret
      if (!input.authNumber || input.authNumber.trim() !== env.INITIAL_MANAGER_SETUP_SECRET) {
        throw new UnauthorizedError('Invalid manager authentication credential. Bootstrap authorization failed.');
      }
      isBootstrap = true;
    } else {
      // POST-BOOTSTRAP: Public registration is locked. Must have invitation token.
      if (!input.invitationToken) {
        throw new ForbiddenError(
          'Initial administrator setup has already been completed. Additional Main Managers must be invited by an existing authorized Main Manager.'
        );
      }

      // Verify invitation
      const invitation = await prisma.managerInvitation.findUnique({
        where: { invitationToken: input.invitationToken },
      });

      if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
        throw new ForbiddenError('The invitation link is invalid, expired, or has already been used.');
      }

      if (invitation.email.toLowerCase() !== emailClean) {
        throw new ForbiddenError('This invitation was issued to a different email address.');
      }

      // Mark invitation accepted
      await prisma.managerInvitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);

    // Create Main Manager account in database
    const user = await prisma.user.create({
      data: {
        email: emailClean,
        fullName: input.fullName.trim(),
        phoneNumber: input.phoneNumber.trim(),
        passwordHash,
        role: 'main_manager',
        status: 'APPROVED',
        isEmailVerified: true,
      },
    });

    const token = this.generateToken(user);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        role: user.role,
        title: 'Head of Retail Operations',
        department: 'FreshBasket Executive HQ',
      },
      token,
      isBootstrap,
      message: isBootstrap
        ? 'Initial Main Manager registered and authorized successfully. System bootstrap complete.'
        : 'Main Manager account activated successfully.',
    };
  }

  /**
   * Check if bootstrap mode is active (no main managers exist)
   */
  public async getBootstrapStatus() {
    try {
      const count = await prisma.user.count({
        where: { role: 'main_manager', status: 'APPROVED' },
      });
      return { bootstrapRequired: count === 0 };
    } catch {
      return { bootstrapRequired: false };
    }
  }

  /**
   * 4. User Login
   */
  public async login(email: string, passwordPlain: string) {
    if (!email || !passwordPlain) {
      throw new BadRequestError('Email and password are required.');
    }

    const emailClean = email.trim().toLowerCase();

    // Check database user first
    const user = await prisma.user.findUnique({ where: { email: emailClean } });

    if (user) {
      // Check status
      if (user.status === 'PENDING') {
        throw new ForbiddenError(
          'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.'
        );
      }

      if (user.status === 'REJECTED') {
        throw new ForbiddenError(
          'Your access request was not approved. Please contact HQ IT support.'
        );
      }

      const isValidPassword = await bcrypt.compare(passwordPlain, user.passwordHash);
      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid credentials. Please verify your email and password.');
      }

      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          title: user.role === 'main_manager' ? 'Head of Retail Operations' : user.role === 'store_manager' ? 'General Store Director' : 'Fleet & Fulfillment Director',
          department: user.role === 'main_manager' ? 'FreshBasket Executive HQ' : user.role === 'store_manager' ? 'Tacoma Branch Operations' : 'Regional Dispatch & Cold Logistics',
          assignedStoreId: user.assignedStoreId,
          assignedStoreName: user.assignedStoreName,
          supplierId: user.supplierId,
          supplierName: user.supplierName,
        },
        token,
      };
    }

    // Check if there is an active pending access request for this email
    const pendingRequest = await prisma.accessRequest.findFirst({
      where: { email: emailClean },
      orderBy: { createdAt: 'desc' },
    });

    if (pendingRequest) {
      if (pendingRequest.status === 'PENDING') {
        throw new ForbiddenError(
          'Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.'
        );
      }
      if (pendingRequest.status === 'REJECTED') {
        const reasonMsg = pendingRequest.decisionReason
          ? ` Reason: ${pendingRequest.decisionReason}`
          : '';
        throw new ForbiddenError(`Your access request was not approved.${reasonMsg}`);
      }
      if (pendingRequest.status === 'MORE_INFO_REQUIRED') {
        throw new ForbiddenError(
          `Additional information required: ${pendingRequest.managerInstructions || 'Please check your email for instructions.'}`
        );
      }
    }

    throw new UnauthorizedError('Invalid credentials. Account not found.');
  }
}

export const serverAuthService = new ServerAuthService();
