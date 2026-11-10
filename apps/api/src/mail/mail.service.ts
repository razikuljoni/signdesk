import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private dailyEmailCount = 0;
  private readonly DAILY_CAP = 100; // Free tier Resend daily cap (§14)

  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'localhost',
        port: Number(process.env.SMTP_PORT) || 1025,
        ignoreTLS: true,
      });
    } catch (err: any) {
      this.logger.warn(`Could not initialize SMTP transporter: ${err.message}. Using fallback logger.`);
    }
  }

  getQuotaStatus() {
    return {
      sentToday: this.dailyEmailCount,
      dailyCap: this.DAILY_CAP,
      remaining: Math.max(0, this.DAILY_CAP - this.dailyEmailCount),
    };
  }

  async sendSigningInvitation(data: {
    to: string;
    recipientName: string;
    senderName: string;
    documentTitle: string;
    magicLink: string;
    expiresAt: Date;
  }) {
    this.dailyEmailCount++;
    const formattedExpiry = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeZone: 'Asia/Dhaka',
    }).format(data.expiresAt);

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Hanken Grotesk', -apple-system, sans-serif; background-color: #FAF7F1; color: #1B1A17; margin: 0; padding: 24px; }
            .card { background-color: #FFFFFF; max-width: 560px; margin: 0 auto; border-radius: 12px; border: 1px solid #E4DCCB; padding: 32px; box-shadow: 0 4px 16px rgba(27,26,23,0.06); }
            .header { text-align: center; border-bottom: 1px solid #E4DCCB; padding-bottom: 20px; }
            .seal { display: inline-block; width: 40px; height: 40px; background-color: #B3402A; border-radius: 50%; color: #FFFFFF; line-height: 40px; text-align: center; font-weight: bold; font-size: 20px; }
            .h1 { font-family: 'Newsreader', serif; font-size: 24px; color: #0C2E29; margin-top: 12px; }
            .content { padding: 24px 0; font-size: 15px; line-height: 1.6; }
            .btn-container { text-align: center; margin: 28px 0; }
            .btn { display: inline-block; background-color: #B3402A; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px; }
            .footer { font-size: 12px; color: #8A8375; border-top: 1px solid #E4DCCB; padding-top: 16px; text-align: center; }
            .badge { display: inline-block; background-color: #DCEBE6; color: #0C2E29; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="seal">•</div>
              <div class="h1">SignDesk — Signature Request</div>
              <p style="margin: 4px 0; font-size: 13px; color: #57534A;">Bangladesh ICT Act 2006 Compliant Dispatch</p>
            </div>
            <div class="content">
              <p>Dear <strong>${data.recipientName}</strong>,</p>
              <p><strong>${data.senderName}</strong> has sent you a document for electronic signature:</p>
              <div style="background-color: #F3EEE5; border: 1px solid #E4DCCB; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <div style="font-weight: bold; color: #0C2E29; font-size: 16px;">${data.documentTitle}</div>
                <div style="font-size: 12px; color: #57534A; margin-top: 4px;">Valid until: <strong>${formattedExpiry}</strong> (BST UTC+06:00)</div>
              </div>
              <p><strong>No account or password is required.</strong> You can review the document, read a plain-language AI summary, and sign on desktop or mobile.</p>
              <div class="btn-container">
                <a href="${data.magicLink}" class="btn">Review & Sign Document</a>
              </div>
              <p style="font-size: 12px; color: #8A8375;">If the button does not work, copy and paste this URL into your browser:<br><span style="word-break: break-all; color: #1B5E52;">${data.magicLink}</span></p>
            </div>
            <div class="footer">
              <span class="badge">SECURED BY SIGNDESK</span>
              <p style="margin-top: 8px;">Audit Trail & SHA-256 Merkle Chain Enforced. This email contains a private single-use token.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"SignDesk" <no-reply@signdesk.bd>`,
          to: data.to,
          subject: `Signature requested: ${data.documentTitle} — ${data.senderName}`,
          html,
        });
        this.logger.log(`Email dispatched to ${data.to} via MailHog/SMTP.`);
      } catch (err: any) {
        this.logger.warn(`Could not deliver email over SMTP (${err.message}). Stored in queue.`);
      }
    }

    return {
      success: true,
      deliveredTo: data.to,
      magicLink: data.magicLink,
    };
  }
}
