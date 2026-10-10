/**
 * FreshGuard AI - Transactional Email Service
 * Handles email notifications for access requests, approvals, rejections, and invitations.
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static fromEmail = process.env.EMAIL_FROM || 'FreshGuard AI Operations <no-reply@freshguard.ai>';
  private static apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  private static appBaseUrl = process.env.APP_BASE_URL || 'https://marketmanager-xi.vercel.app';

  /**
   * Generic send email method
   */
  public static async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; simulated?: boolean }> {
    const recipient = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    // Log transactional email execution
    console.log(`[EMAIL SERVICE] Sending "${options.subject}" to ${recipient}`);

    if (!this.apiKey) {
      console.log(`[EMAIL SERVICE - SIMULATION/LOG MODE] (No EMAIL_PROVIDER_API_KEY configured)`);
      console.log(`To: ${recipient}`);
      console.log(`From: ${this.fromEmail}`);
      console.log(`Subject: ${options.subject}`);
      console.log(`Content:\n${options.text || options.html}`);
      return { success: true, simulated: true, messageId: `sim_${Date.now()}` };
    }

    try {
      // Optional Resend / HTTP API dispatch if API key provided
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: this.fromEmail,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`[EMAIL SERVICE ERROR] Provider response failed: ${errText}`);
        return { success: false };
      }

      const data = await res.json();
      return { success: true, messageId: data.id };
    } catch (err: any) {
      console.error(`[EMAIL SERVICE EXCEPTION] Failed to dispatch email:`, err.message);
      return { success: false };
    }
  }

  /**
   * 1. Registration Confirmation email to Applicant
   */
  public static async sendRegistrationConfirmation(to: string, fullName: string, role: string) {
    const readableRole = role.replace('_', ' ').toLowerCase();
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #064e3b; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">FreshGuard AI</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #a7f3d0;">Grocery Operations Intelligence</p>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #064e3b;">Registration Request Received</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Thank you for submitting your access request to FreshGuard AI as a <strong>${readableRole}</strong>.</p>
          <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #065f46;">
              <strong>Status: PENDING REVIEW</strong><br/>
              Your registration has been submitted. A Main Manager must review and approve your request before you can sign in.
            </p>
          </div>
          <p style="font-size: 14px; color: #64748b;">You will receive an email notification as soon as your access request is reviewed.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          &copy; ${new Date().getFullYear()} FreshGuard AI — Automated Operational Governance
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'FreshGuard AI — Access Request Submitted',
      html,
      text: `Hello ${fullName},\n\nYour registration request as a ${readableRole} has been received and is pending Main Manager approval.`
    });
  }

  /**
   * 2. New Access Request Notification to Main Managers
   */
  public static async sendNewAccessRequestNotification(managerEmails: string[], applicantName: string, applicantEmail: string, role: string) {
    if (!managerEmails || managerEmails.length === 0) return;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #064e3b; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">FreshGuard AI — Manager Action Needed</h1>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #064e3b;">New Access Request Awaiting Review</h2>
          <p>A new registration request requires Main Manager review:</p>
          <ul>
            <li><strong>Applicant:</strong> ${applicantName}</li>
            <li><strong>Email:</strong> ${applicantEmail}</li>
            <li><strong>Requested Role:</strong> ${role}</li>
          </ul>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${this.appBaseUrl}/login" style="background-color: #10b981; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Review in Dashboard</a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: managerEmails,
      subject: `FreshGuard AI — New Access Request (${applicantName})`,
      html
    });
  }

  /**
   * 3. Access Approved email
   */
  public static async sendAccessApprovedEmail(to: string, fullName: string, role: string) {
    const loginUrl = `${this.appBaseUrl}/login`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #047857; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">FreshGuard AI</h1>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #047857;">Access Approved!</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Great news! Your access request for FreshGuard AI as a <strong>${role}</strong> has been <strong>APPROVED</strong> by a Main Manager.</p>
          <p>You can now sign in using your registered credentials:</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${loginUrl}" style="background-color: #047857; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Sign In to FreshGuard AI</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">If the button above does not work, copy and paste this URL into your browser:<br/><a href="${loginUrl}">${loginUrl}</a></p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          &copy; ${new Date().getFullYear()} FreshGuard AI
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'FreshGuard AI — Access Approved',
      html,
      text: `Hello ${fullName},\n\nYour access request for FreshGuard AI has been APPROVED. You can sign in at ${loginUrl}`
    });
  }

  /**
   * 4. Access Rejected email
   */
  public static async sendAccessRejectedEmail(to: string, fullName: string, reason?: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #991b1b; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">FreshGuard AI</h1>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #991b1b;">Access Request Update</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>Thank you for your interest in FreshGuard AI. After review, your access request could not be approved at this time.</p>
          ${reason ? `
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #991b1b;">
                <strong>Reason provided by manager:</strong><br/>
                ${reason}
              </p>
            </div>
          ` : ''}
          <p style="font-size: 14px; color: #64748b;">If you believe this decision was made in error or if you have updated information, please contact your organization administrator.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'FreshGuard AI — Access Request Update',
      html,
      text: `Hello ${fullName},\n\nYour access request was not approved.${reason ? ` Reason: ${reason}` : ''}`
    });
  }

  /**
   * 5. Additional Info Requested email
   */
  public static async sendMoreInfoRequestedEmail(to: string, fullName: string, note: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #d97706; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">FreshGuard AI</h1>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #d97706;">Action Required: Additional Information Needed</h2>
          <p>Hello <strong>${fullName}</strong>,</p>
          <p>A Main Manager has reviewed your access request and requires additional information before finalizing approval:</p>
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              <strong>Manager Note:</strong><br/>
              ${note}
            </p>
          </div>
          <p style="font-size: 14px; color: #64748b;">Please reply to this message or contact your Main Manager directly with the requested details.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'FreshGuard AI — Additional Information Required for Access',
      html,
      text: `Hello ${fullName},\n\nAdditional information is required for your FreshGuard AI request:\n${note}`
    });
  }

  /**
   * 6. Main Manager Invitation email
   */
  public static async sendMainManagerInvitation(to: string, inviteToken: string) {
    const inviteUrl = `${this.appBaseUrl}/login?invite=${inviteToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #064e3b; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px;">FreshGuard AI</h1>
        </div>
        <div style="padding: 24px; color: #1e293b;">
          <h2 style="margin-top: 0; color: #064e3b;">Invitation to Join as Main Manager</h2>
          <p>You have been authorized to register as a <strong>Main Manager</strong> for FreshGuard AI.</p>
          <p>Click the link below to complete your registration:</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${inviteUrl}" style="background-color: #064e3b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold;">Accept Invitation & Register</a>
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'FreshGuard AI — Invitation to Register as Main Manager',
      html
    });
  }
}
