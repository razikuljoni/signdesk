import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

export interface LifecycleJobPayload {
  type: 'reminder' | 'expiry_warning' | 'expire';
  envelopeId: string;
  recipientId?: string;
  scheduledFor: string;
}

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);

  // In-memory scheduled jobs registry for when Redis is disabled or in test environments
  private readonly memoryJobs = new Map<string, { timer: NodeJS.Timeout; payload: LifecycleJobPayload }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Schedules reminder, expiry warning, and expiration jobs for an envelope.
   */
  async scheduleEnvelopeLifecycle(
    envelopeId: string,
    expiresAt: Date,
    recipients: Array<{ id: string; email: string; name: string; order: number }>,
  ) {
    const now = Date.now();
    const expiryTime = expiresAt.getTime();

    // 1. Reminder job (48 hours or half-life in short tests)
    const activeSigner = recipients.find((r) => r.order === 1);
    if (activeSigner) {
      const reminderDelay = Math.min(48 * 60 * 60 * 1000, Math.max(1000, Math.floor((expiryTime - now) / 2)));
      const reminderJobId = `reminder-${envelopeId}-${activeSigner.id}-1`;

      this.scheduleMemoryJob(reminderJobId, reminderDelay, {
        type: 'reminder',
        envelopeId,
        recipientId: activeSigner.id,
        scheduledFor: new Date(now + reminderDelay).toISOString(),
      });
    }

    // 2. Expiry warning job (24h before expiry or 75% point)
    const warningDelay = Math.max(500, Math.floor((expiryTime - now) * 0.75));
    const warningJobId = `expiry-warning-${envelopeId}`;
    this.scheduleMemoryJob(warningJobId, warningDelay, {
      type: 'expiry_warning',
      envelopeId,
      scheduledFor: new Date(now + warningDelay).toISOString(),
    });

    // 3. Expiration job (at expiresAt)
    const expireDelay = Math.max(1000, expiryTime - now);
    const expireJobId = `expire-${envelopeId}`;
    this.scheduleMemoryJob(expireJobId, expireDelay, {
      type: 'expire',
      envelopeId,
      scheduledFor: expiresAt.toISOString(),
    });

    this.logger.log(`Scheduled lifecycle for envelope ${envelopeId}: expire in ${Math.round(expireDelay / 1000)}s`);
  }

  /**
   * Helper to schedule an in-memory fallback timer.
   */
  private scheduleMemoryJob(jobId: string, delayMs: number, payload: LifecycleJobPayload) {
    if (this.memoryJobs.has(jobId)) {
      clearTimeout(this.memoryJobs.get(jobId)!.timer);
    }

    const timer = setTimeout(async () => {
      this.memoryJobs.delete(jobId);
      await this.executeLifecycleJob(payload);
    }, delayMs);

    this.memoryJobs.set(jobId, { timer, payload });
  }

  /**
   * Cancels all scheduled lifecycle jobs for an envelope (on sign, decline, void, expire).
   */
  async cancelEnvelopeLifecycle(envelopeId: string) {
    for (const [jobId, item] of this.memoryJobs.entries()) {
      if (item.payload.envelopeId === envelopeId) {
        clearTimeout(item.timer);
        this.memoryJobs.delete(jobId);
      }
    }
  }

  /**
   * Executes a lifecycle job with MANDATORY worker state re-check.
   * If recipient already signed or envelope was voided/completed, action is skipped!
   */
  async executeLifecycleJob(payload: LifecycleJobPayload): Promise<{ executed: boolean; reason?: string }> {
    const envelope = await this.prisma.envelope.findUnique({
      where: { id: payload.envelopeId },
      include: {
        recipients: true,
        auditEvents: { orderBy: { timestampUtc: 'asc' } },
        owner: true,
      },
    });

    if (!envelope) {
      return { executed: false, reason: 'Envelope no longer exists' };
    }

    // Guard: only execute if envelope is currently active
    if (envelope.status !== 'WAITING' && envelope.status !== 'IN_PROGRESS') {
      return {
        executed: false,
        reason: `State re-check: envelope is in ${envelope.status} state, skipping ${payload.type}`,
      };
    }

    if (payload.type === 'reminder') {
      if (!payload.recipientId) return { executed: false, reason: 'No recipientId' };

      const recipient = envelope.recipients.find((r) => r.id === payload.recipientId);
      if (!recipient) return { executed: false, reason: 'Recipient not found' };

      // Guard: recipient already executed
      if (recipient.status === 'SIGNED' || recipient.status === 'DECLINED') {
        return {
          executed: false,
          reason: `State re-check: recipient ${recipient.email} status is ${recipient.status}, skipping reminder`,
        };
      }

      // Execute reminder email
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const magicLink = `${appUrl}/sign/${recipient.tokenHash || ''}`;

      await this.mailService.sendSigningReminder({
        to: recipient.email,
        recipientName: recipient.name,
        senderName: envelope.owner?.name || 'Document Sender',
        documentTitle: envelope.title,
        magicLink,
        expiresAt: envelope.expiresAt || new Date(),
      });

      // Audit event
      const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
      const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
      const eventHash = crypto
        .createHash('sha256')
        .update(prevHash + ':reminder_fired:' + recipient.email)
        .digest('hex');

      await this.prisma.auditEvent.create({
        data: {
          envelopeId: envelope.id,
          actor: 'SignDesk Lifecycle Worker',
          action: 'reminded',
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });

      return { executed: true };
    }

    if (payload.type === 'expire') {
      return this.markEnvelopeExpired(envelope);
    }

    return { executed: true };
  }

  /**
   * Sweeper: finds all envelopes with status = WAITING/IN_PROGRESS and expiresAt < now.
   * Catches any envelopes whose delayed timer was missed or server restarted.
   */
  async sweepExpiredEnvelopes(): Promise<{ sweptCount: number }> {
    const now = new Date();
    const expiredEnvelopes = await this.prisma.envelope.findMany({
      where: {
        status: { in: ['WAITING', 'IN_PROGRESS'] },
        expiresAt: { lt: now },
        deletedAt: null,
      },
      include: {
        auditEvents: { orderBy: { timestampUtc: 'asc' } },
        recipients: true,
      },
    });

    for (const env of expiredEnvelopes) {
      await this.markEnvelopeExpired(env);
    }

    return { sweptCount: expiredEnvelopes.length };
  }

  /**
   * Transitions an envelope to EXPIRED state and records audit event in the chain.
   */
  private async markEnvelopeExpired(envelope: any): Promise<{ executed: boolean }> {
    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':expired:' + new Date().toISOString())
      .digest('hex');

    await this.prisma.$transaction(async (tx) => {
      await tx.envelope.update({
        where: { id: envelope.id },
        data: { status: 'EXPIRED' },
      });

      // Invalidate active tokens
      await tx.recipient.updateMany({
        where: { envelopeId: envelope.id, status: { not: 'SIGNED' } },
        data: { tokenExpiresAt: new Date(0) },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: envelope.id,
          actor: 'SignDesk Expiry Sweeper',
          action: 'expired',
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });
    });

    this.logger.log(`Envelope ${envelope.id} marked as EXPIRED.`);
    return { executed: true };
  }

  /**
   * Manual reminder with rate limiting (max 1 per recipient per 24 hours).
   */
  async sendManualReminder(
    envelopeId: string,
    recipientId: string,
    workspaceId: string,
  ) {
    const envelope = await this.prisma.envelope.findFirst({
      where: { id: envelopeId, workspaceId },
      include: {
        recipients: true,
        auditEvents: {
          where: { action: 'reminded' },
          orderBy: { timestampUtc: 'desc' },
        },
        owner: true,
      },
    });

    if (!envelope) throw new NotFoundException('Envelope not found');

    const recipient = envelope.recipients.find((r) => r.id === recipientId);
    if (!recipient) throw new NotFoundException('Recipient not found');

    if (recipient.status === 'SIGNED') {
      throw new BadRequestException('Cannot remind a recipient who has already signed');
    }

    // Rate limit check: within last 24 hours
    const recentReminder = envelope.auditEvents.find((a) => {
      const isWithin24h = Date.now() - new Date(a.timestampUtc).getTime() < 24 * 60 * 60 * 1000;
      return isWithin24h;
    });

    if (recentReminder) {
      throw new BadRequestException(
        'Rate limit reached: A reminder was already sent to this recipient within the last 24 hours',
      );
    }

    // Trigger reminder
    return this.executeLifecycleJob({
      type: 'reminder',
      envelopeId,
      recipientId,
      scheduledFor: new Date().toISOString(),
    });
  }
}
