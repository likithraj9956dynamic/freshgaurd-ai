// ============================================================
// FreshGuard AI — Enterprise Transactional Email Service
// ============================================================

import { prisma } from '../config/prisma';
import { env } from '../config/env';

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateType: 'REGISTRATION_CONFIRMATION' | 'ACCESS_APPROVED' | 'ACCESS_REJECTED' | 'MORE_INFO_REQUIRED' | 'MANAGER_INVITATION' | 'NEW_REQUEST_NOTIFICATION';
  html: string;
  metadata?: Record<string, any>;
}

// Enterprise brand email styling
const getEmailWrapper = (content: string, previewText: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FreshGuard AI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
    .container { max-width: 580px; margin: 30px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background-color: #164e3d; padding: 24px 32px; text-align: left; }
    .logo-badge { display: inline-block; background-color: #0d382b; color: #a7f3d0; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .header-title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 12px 0 0 0; }
    .body { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .card { background-color: #f1f5f9; border-left: 4px solid #164e3d; padding: 16px; margin: 20px 0; border-radius: 0 6px 6px 0; font-size: 13px; }
    .button { display: inline-block; background-color: #164e3d; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 13px; margin: 20px 0; text-align: center; }
    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </div>
  <div class="container">
    <div class="header">
      <span class="logo-badge">FreshGuard AI</span>
      <h1 class="header-title">Retail Operations Intelligence</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;"><strong>FreshGuard AI Enterprise Operations Platform</strong></p>
      <p style="margin: 0;">Authorized access only. If you received this email by error, please contact HQ Security.</p>
    </div>
  </div>
</body>
</html>
`;

export class EmailService {
  /**
   * Log and optionally send transactional email
   */
  public async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; status: string; logId: string }> {
    let status = 'SIMULATED';
    let errorMessage: string | null = null;

    try {
      if (env.EMAIL_PROVIDER_API_KEY && env.EMAIL_PROVIDER_API_KEY.trim() !== '') {
        // Real provider dispatch (e.g., Resend or SendGrid via standard fetch)
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${env.EMAIL_PROVIDER_API_KEY}`,
            },
            body: JSON.stringify({
              from: env.EMAIL_FROM,
              to: [options.to],
              subject: options.subject,
              html: options.html,
            }),
          });
          if (res.ok) {
            status = 'SENT';
          } else {
            status = 'FAILED';
            errorMessage = `HTTP ${res.status}: ${await res.text()}`;
          }
        } catch (apiErr: any) {
          status = 'FAILED';
          errorMessage = apiErr?.message || 'Email dispatch failed';
        }
      } else {
        // Honest logging when provider is not configured
        status = 'SIMULATED';
        console.log(`[EmailService] Simulated delivery to ${options.to}: "${options.subject}"`);
      }
    } catch (e: any) {
      status = 'FAILED';
      errorMessage = e?.message || 'Unknown email failure';
    }

    // Persist to database log safely
    let logId = 'local-log';
    try {
      const logRecord = await prisma.emailLog.create({
        data: {
          recipientEmail: options.to,
          subject: options.subject,
          templateType: options.templateType,
          status,
          errorMessage,
          metadata: options.metadata || {},
        },
      });
      logId = logRecord.id;
    } catch (dbErr) {
      console.warn('[EmailService] Could not persist email log to DB:', dbErr);
    }

    return { success: status === 'SENT' || status === 'SIMULATED', status, logId };
  }

  /**
   * 1. Registration Confirmation (Pending)
   */
  public async sendRegistrationConfirmation(applicant: { name: string; email: string; role: string; organizationName?: string }) {
    const roleLabel = applicant.role === 'store_manager' ? 'Store Manager' : applicant.role === 'supplier' ? 'Supplier Partner' : 'Main Manager';
    const content = `
      <p>Hello <strong>${applicant.name}</strong>,</p>
      <p>Your access registration for <strong>FreshGuard AI</strong> has been successfully received.</p>
      <div class="card">
        <strong>Application Details:</strong><br/>
        Role Requested: <strong>${roleLabel}</strong><br/>
        Organization / Store: <strong>${applicant.organizationName || 'Corporate Operations'}</strong><br/>
        Status: <span style="color:#b45309;font-weight:600;">PENDING REVIEW</span>
      </div>
      <p>An authorized Main Manager must review and approve your credentials before your account can be activated.</p>
      <p>You will receive an email notification as soon as your access decision has been finalized.</p>
    `;
    return this.sendEmail({
      to: applicant.email,
      subject: 'FreshGuard AI — Access Request Received',
      templateType: 'REGISTRATION_CONFIRMATION',
      html: getEmailWrapper(content, 'Your FreshGuard AI registration has been submitted and is pending review.'),
      metadata: { role: applicant.role, name: applicant.name },
    });
  }

  /**
   * 2. Approval Email
   */
  public async sendApprovalNotification(applicant: { name: string; email: string; role: string }) {
    const loginUrl = `${env.APP_BASE_URL}/login`;
    const content = `
      <p>Hello <strong>${applicant.name}</strong>,</p>
      <p>We are pleased to inform you that your request for access to <strong>FreshGuard AI</strong> has been <span style="color:#164e3d;font-weight:700;">APPROVED</span> by operations leadership.</p>
      <div class="card">
        <strong>Authorized Access:</strong><br/>
        Email: <strong>${applicant.email}</strong><br/>
        Permissions Level: <strong>${applicant.role.replace('_', ' ').toUpperCase()}</strong><br/>
        Status: <span style="color:#164e3d;font-weight:600;">ACTIVE</span>
      </div>
      <p>You may now sign in using your corporate credentials at the link below:</p>
      <p style="text-align: center;">
        <a href="${loginUrl}" class="button">Sign In to FreshGuard AI</a>
      </p>
      <p style="font-size: 12px; color: #64748b;">Direct URL: <a href="${loginUrl}">${loginUrl}</a></p>
    `;
    return this.sendEmail({
      to: applicant.email,
      subject: 'FreshGuard AI — Access Approved',
      templateType: 'ACCESS_APPROVED',
      html: getEmailWrapper(content, 'Your FreshGuard AI access request has been approved.'),
      metadata: { role: applicant.role, name: applicant.name },
    });
  }

  /**
   * 3. Rejection Email
   */
  public async sendRejectionNotification(applicant: { name: string; email: string; reason?: string }) {
    const reasonBlock = applicant.reason && applicant.reason.trim().length > 0
      ? `<div class="card"><strong>Reviewer Note:</strong><br/>${applicant.reason}</div>`
      : '';
    const content = `
      <p>Hello <strong>${applicant.name}</strong>,</p>
      <p>Thank you for submitting an access request for FreshGuard AI.</p>
      <p>After review by operations leadership, your registration could not be authorized at this time.</p>
      ${reasonBlock}
      <p>If you believe this decision was made in error or require further clarification, please contact your regional corporate operations director or IT administrator.</p>
    `;
    return this.sendEmail({
      to: applicant.email,
      subject: 'FreshGuard AI — Access Request Update',
      templateType: 'ACCESS_REJECTED',
      html: getEmailWrapper(content, 'Update regarding your FreshGuard AI access request.'),
      metadata: { reason: applicant.reason, name: applicant.name },
    });
  }

  /**
   * 4. Request More Information Email
   */
  public async sendMoreInfoRequired(applicant: { name: string; email: string; instructions: string }) {
    const content = `
      <p>Hello <strong>${applicant.name}</strong>,</p>
      <p>The operations management team is reviewing your access request for <strong>FreshGuard AI</strong> and requires additional information before an access decision can be made.</p>
      <div class="card" style="border-left-color: #d97706;">
        <strong>Instructions from Manager:</strong><br/>
        ${applicant.instructions}
      </div>
      <p>Please reply directly to this notification or contact HQ operations with the requested documentation.</p>
    `;
    return this.sendEmail({
      to: applicant.email,
      subject: 'FreshGuard AI — Action Required: Additional Information Needed',
      templateType: 'MORE_INFO_REQUIRED',
      html: getEmailWrapper(content, 'Additional details are required for your FreshGuard AI registration.'),
      metadata: { instructions: applicant.instructions, name: applicant.name },
    });
  }

  /**
   * 5. Manager Invitation Email
   */
  public async sendManagerInvitation(invitation: { email: string; invitedByName: string; invitationToken: string }) {
    const registerUrl = `${env.APP_BASE_URL}/login?action=register-manager&token=${invitation.invitationToken}`;
    const content = `
      <p>Hello,</p>
      <p>You have been invited by <strong>${invitation.invitedByName}</strong> to register as an authorized <strong>Main Manager</strong> on the FreshGuard AI retail intelligence platform.</p>
      <p>Click the link below to set up your executive credentials:</p>
      <p style="text-align: center;">
        <a href="${registerUrl}" class="button">Accept Invitation & Register</a>
      </p>
      <p style="font-size: 12px; color: #64748b;">Direct URL: <a href="${registerUrl}">${registerUrl}</a></p>
      <p>This invitation link will expire in 72 hours.</p>
    `;
    return this.sendEmail({
      to: invitation.email,
      subject: 'FreshGuard AI — Invitation to Register as Main Manager',
      templateType: 'MANAGER_INVITATION',
      html: getEmailWrapper(content, 'You have been invited to join FreshGuard AI as a Main Manager.'),
      metadata: { token: invitation.invitationToken },
    });
  }
}

export const emailService = new EmailService();
