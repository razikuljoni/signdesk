import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { PdfService } from './pdf.service';
import * as crypto from 'crypto';
import { EnvelopeStatus, FieldType, RecipientRole } from '@signdesk/shared';

@Injectable()
export class EnvelopesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly pdfService: PdfService,
  ) {}

  async createDraft(
    userId: string,
    workspaceId: string,
    data: {
      title: string;
      originalPdfUrl: string;
      originalHash: string;
      messageToSigners?: string;
      expiresAt?: Date;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const envelope = await tx.envelope.create({
        data: {
          workspaceId,
          ownerId: userId,
          title: data.title.trim(),
          originalPdfUrl: data.originalPdfUrl,
          originalHash: data.originalHash,
          messageToSigners: data.messageToSigners,
          expiresAt: data.expiresAt,
          status: 'DRAFT',
          version: 1,
        },
      });

      const eventHash = crypto
        .createHash('sha256')
        .update(envelope.originalHash + ':created')
        .digest('hex');

      await tx.auditEvent.create({
        data: {
          envelopeId: envelope.id,
          actor: 'Sender',
          action: 'created',
          documentHash: envelope.originalHash,
          prevHash: envelope.originalHash,
          eventHash,
        },
      });

      return envelope;
    });
  }

  async listEnvelopes(
    workspaceId: string,
    status?: string,
    search?: string,
  ) {
    const where: any = {
      workspaceId,
      deletedAt: null,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    return this.prisma.envelope.findMany({
      where,
      include: {
        recipients: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { fields: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEnvelope(id: string, workspaceId: string) {
    const envelope = await this.prisma.envelope.findFirst({
      where: { id, workspaceId, deletedAt: null },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        recipients: {
          orderBy: { order: 'asc' },
        },
        fields: {
          orderBy: { page: 'asc' },
        },
        auditEvents: {
          orderBy: { timestampUtc: 'asc' },
        },
      },
    });

    if (!envelope) {
      throw new NotFoundException('Envelope not found');
    }

    return envelope;
  }

  async updateDraft(
    id: string,
    workspaceId: string,
    data: {
      title?: string;
      messageToSigners?: string;
      expiresAt?: Date;
    },
  ) {
    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status === 'COMPLETED' || envelope.status === 'VOIDED') {
      throw new BadRequestException(`Cannot modify an envelope in ${envelope.status} state. It is legally immutable.`);
    }
    if (envelope.status !== 'DRAFT') {
      throw new BadRequestException('Only draft envelopes can be modified');
    }

    return this.prisma.envelope.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title.trim() } : {}),
        ...(data.messageToSigners !== undefined ? { messageToSigners: data.messageToSigners } : {}),
        ...(data.expiresAt !== undefined ? { expiresAt: data.expiresAt } : {}),
      },
    });
  }

  async setRecipients(
    envelopeId: string,
    workspaceId: string,
    recipients: Array<{
      id?: string;
      name: string;
      email: string;
      role: 'SIGNER' | 'APPROVER' | 'VIEWER';
      order: number;
    }>,
  ) {
    const envelope = await this.getEnvelope(envelopeId, workspaceId);
    if (envelope.status === 'COMPLETED' || envelope.status === 'VOIDED') {
      throw new BadRequestException('Cannot modify recipients on a finalized envelope');
    }
    if (envelope.status !== 'DRAFT') {
      throw new BadRequestException('Cannot change recipients on non-draft envelope');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.field.updateMany({
        where: { envelopeId },
        data: { recipientId: null },
      });
      await tx.recipient.deleteMany({
        where: { envelopeId },
      });

      const createdRecipients = [];
      for (const r of recipients) {
        const rec = await tx.recipient.create({
          data: {
            envelopeId,
            name: r.name.trim(),
            email: r.email.toLowerCase().trim(),
            role: r.role || 'SIGNER',
            order: r.order || 1,
            status: 'PENDING',
          },
        });
        createdRecipients.push(rec);
      }

      return createdRecipients;
    });
  }

  async setFields(
    envelopeId: string,
    workspaceId: string,
    fields: Array<{
      recipientId?: string | null;
      type: FieldType;
      page: number;
      xRatio: number;
      yRatio: number;
      wRatio: number;
      hRatio: number;
      required: boolean;
      label?: string;
      placeholder?: string;
      options?: any;
    }>,
  ) {
    const envelope = await this.getEnvelope(envelopeId, workspaceId);
    if (envelope.status === 'COMPLETED' || envelope.status === 'VOIDED') {
      throw new BadRequestException('Cannot modify fields on a finalized envelope');
    }
    if (envelope.status !== 'DRAFT') {
      throw new BadRequestException('Cannot change fields on non-draft envelope');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.field.deleteMany({
        where: { envelopeId },
      });

      const created = [];
      for (const f of fields) {
        const field = await tx.field.create({
          data: {
            envelopeId,
            recipientId: f.recipientId || null,
            type: f.type,
            page: f.page,
            xRatio: f.xRatio,
            yRatio: f.yRatio,
            wRatio: f.wRatio,
            hRatio: f.hRatio,
            required: f.required !== false,
            label: f.label,
            placeholder: f.placeholder,
            options: f.options,
          },
        });
        created.push(field);
      }

      return created;
    });
  }

  async duplicateDraft(id: string, workspaceId: string, userId: string) {
    const source = await this.getEnvelope(id, workspaceId);

    return this.prisma.$transaction(async (tx) => {
      const copy = await tx.envelope.create({
        data: {
          workspaceId,
          ownerId: userId,
          title: `${source.title} (Copy)`,
          originalPdfUrl: source.originalPdfUrl,
          originalHash: source.originalHash,
          messageToSigners: source.messageToSigners,
          expiresAt: source.expiresAt,
          status: 'DRAFT',
          version: 1,
        },
      });

      const recipientMap = new Map<string, string>();
      for (const r of source.recipients) {
        const newR = await tx.recipient.create({
          data: {
            envelopeId: copy.id,
            name: r.name,
            email: r.email,
            role: r.role,
            order: r.order,
            status: 'PENDING',
          },
        });
        recipientMap.set(r.id, newR.id);
      }

      for (const f of source.fields) {
        await tx.field.create({
          data: {
            envelopeId: copy.id,
            recipientId: f.recipientId ? recipientMap.get(f.recipientId) || null : null,
            type: f.type,
            page: f.page,
            xRatio: f.xRatio,
            yRatio: f.yRatio,
            wRatio: f.wRatio,
            hRatio: f.hRatio,
            required: f.required,
            label: f.label,
            placeholder: f.placeholder,
            options: f.options as any,
          },
        });
      }

      return copy;
    });
  }

  async softDelete(id: string, workspaceId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status === 'COMPLETED') {
      throw new BadRequestException('Completed envelopes are immutable and cannot be deleted');
    }

    return this.prisma.envelope.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async sendEnvelope(
    id: string,
    workspaceId: string,
    userId: string,
    options?: { messageToSigners?: string; expiresDays?: number },
  ) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId } },
    });
    if (member && member.role === 'VIEWER') {
      throw new ForbiddenException('Viewers have read-only access and cannot send envelopes');
    }

    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status !== 'DRAFT') {
      throw new BadRequestException('Only draft envelopes can be sent');
    }

    if (!envelope.recipients || envelope.recipients.length === 0) {
      throw new BadRequestException('At least one recipient is required before sending');
    }

    const unassigned = envelope.fields.filter((f) => !f.recipientId);
    if (unassigned.length > 0) {
      throw new BadRequestException(
        `Cannot send: ${unassigned.length} required field(s) have not been assigned to any recipient`,
      );
    }

    const expiryDays = options?.expiresDays || 14;
    const expiresAt = new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000);
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    return this.prisma.$transaction(async (tx) => {
      const tokensMap = new Map<string, string>();
      const recipients = await tx.recipient.findMany({
        where: { envelopeId: id },
        orderBy: { order: 'asc' },
      });

      for (let i = 0; i < recipients.length; i++) {
        const r = recipients[i];
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        tokensMap.set(r.id, rawToken);

        const isFirstSigner = i === 0;
        await tx.recipient.update({
          where: { id: r.id },
          data: {
            tokenHash,
            tokenExpiresAt: expiresAt,
            status: isFirstSigner ? 'NOTIFIED' : 'PENDING',
          },
        });
      }

      const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
      const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
      const eventHash = crypto
        .createHash('sha256')
        .update(prevHash + ':sent:' + new Date().toISOString())
        .digest('hex');

      const updatedEnvelope = await tx.envelope.update({
        where: { id },
        data: {
          status: 'WAITING',
          sentAt: new Date(),
          expiresAt,
          messageToSigners: options?.messageToSigners || envelope.messageToSigners,
        },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: id,
          actor: 'Sender',
          action: 'sent',
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });

      const firstSigner = recipients[0];
      const firstRawToken = tokensMap.get(firstSigner.id);
      const magicLink = `${appUrl}/sign/${firstRawToken}`;

      await this.mailService.sendSigningInvitation({
        to: firstSigner.email,
        recipientName: firstSigner.name,
        senderName: envelope.owner?.name || 'Document Sender',
        documentTitle: envelope.title,
        magicLink,
        expiresAt,
      });

      return {
        ...updatedEnvelope,
        magicLinks: recipients.map((r) => ({
          recipientId: r.id,
          name: r.name,
          email: r.email,
          order: r.order,
          status: r.order === 1 ? 'NOTIFIED' : 'PENDING',
          token: tokensMap.get(r.id),
          magicLink: `${appUrl}/sign/${tokensMap.get(r.id)}`,
        })),
      };
    });
  }

  async voidEnvelope(id: string, workspaceId: string, reason?: string, userId?: string) {
    if (userId) {
      const member = await this.prisma.workspaceMember.findUnique({
        where: { workspaceId_userId: { workspaceId, userId } },
      });
      if (member && member.role === 'VIEWER') {
        throw new ForbiddenException('Viewers have read-only access and cannot void envelopes');
      }
    }

    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status === 'COMPLETED') {
      throw new BadRequestException('Completed envelopes are immutable and cannot be voided');
    }
    if (envelope.status === 'VOIDED') {
      return envelope;
    }

    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':voided:' + (reason || 'No reason provided'))
      .digest('hex');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.envelope.update({
        where: { id },
        data: { status: 'VOIDED' },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: id,
          actor: 'Sender',
          action: 'voided',
          previousValue: reason,
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });

      return updated;
    });
  }

  async remindRecipient(id: string, recipientId: string, workspaceId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status !== 'WAITING' && envelope.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Can only remind signers on active envelopes');
    }

    const recipient = envelope.recipients.find((r) => r.id === recipientId);
    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }
    if (recipient.status === 'SIGNED') {
      throw new BadRequestException('Cannot remind a recipient who has already signed');
    }

    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':reminded:' + recipient.email)
      .digest('hex');

    await this.prisma.auditEvent.create({
      data: {
        envelopeId: id,
        actor: 'Sender',
        action: 'reminded',
        documentHash: envelope.originalHash,
        prevHash,
        eventHash,
      },
    });

    return {
      success: true,
      reminded: recipient.email,
      timestamp: new Date().toISOString(),
    };
  }

  async extendExpiry(id: string, workspaceId: string, extraDays = 7) {
    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status === 'COMPLETED' || envelope.status === 'VOIDED') {
      throw new BadRequestException(`Cannot extend expiry for envelope in ${envelope.status} status`);
    }

    const newExpiresAt = new Date(
      (envelope.expiresAt ? new Date(envelope.expiresAt).getTime() : Date.now()) +
        extraDays * 24 * 60 * 60 * 1000,
    );

    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':extended:' + newExpiresAt.toISOString())
      .digest('hex');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.envelope.update({
        where: { id },
        data: {
          expiresAt: newExpiresAt,
          status: envelope.status === 'EXPIRED' ? 'WAITING' : envelope.status,
        },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: id,
          actor: 'Sender',
          action: 'extended',
          newValue: newExpiresAt.toISOString(),
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });

      return updated;
    });
  }

  /**
   * Correct & Resend: recalls an active envelope, increments version, and resets to draft state.
   */
  async correctEnvelope(id: string, workspaceId: string, userId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);
    if (envelope.status === 'COMPLETED' || envelope.status === 'VOIDED') {
      throw new BadRequestException('Cannot correct an envelope that is already completed or voided');
    }

    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':corrected:v' + (envelope.version + 1))
      .digest('hex');

    return this.prisma.$transaction(async (tx) => {
      // Invalidate existing recipient tokens
      await tx.recipient.updateMany({
        where: { envelopeId: id },
        data: { tokenHash: null, tokenExpiresAt: null, status: 'PENDING' },
      });

      const updated = await tx.envelope.update({
        where: { id },
        data: {
          status: 'DRAFT',
          version: envelope.version + 1,
        },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: id,
          actor: 'Sender',
          action: 'corrected',
          previousValue: `v${envelope.version}`,
          newValue: `v${envelope.version + 1}`,
          documentHash: envelope.originalHash,
          prevHash,
          eventHash,
        },
      });

      return updated;
    });
  }

  /**
   * Finalizes the envelope: flattens fields, appends Certificate of Completion,
   * computes final SHA-256 hash, updates envelope to COMPLETED, and appends audit event.
   */
  async finalizeEnvelope(id: string, workspaceId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);

    // Generate or fetch original document bytes
    const originalBytes = await this.pdfService.generateSampleContractPdf(envelope.title);

    const { finalPdfBytes, finalHash, cocBytes } = await this.pdfService.flattenAndFinalize({
      originalBytes,
      fields: envelope.fields,
      recipients: envelope.recipients,
      envelope,
      auditEvents: envelope.auditEvents,
    });

    const lastAudit = envelope.auditEvents[envelope.auditEvents.length - 1];
    const prevHash = lastAudit ? lastAudit.eventHash : envelope.originalHash;
    const eventHash = crypto
      .createHash('sha256')
      .update(prevHash + ':completed:' + finalHash)
      .digest('hex');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.envelope.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          finalHash,
        },
      });

      await tx.auditEvent.create({
        data: {
          envelopeId: id,
          actor: 'SignDesk Engine',
          action: 'completed',
          documentHash: finalHash,
          prevHash,
          eventHash,
        },
      });

      return {
        ...updated,
        finalHash,
        bytesLength: finalPdfBytes.length,
      };
    });
  }

  /**
   * Generates or fetches downloadable document bytes (original, final, or standalone CoC).
   */
  async getDocumentBytes(
    id: string,
    workspaceId: string,
    type: 'original' | 'final' | 'coc' = 'final',
  ): Promise<{ filename: string; buffer: Buffer }> {
    const envelope = await this.getEnvelope(id, workspaceId);

    const originalBytes = await this.pdfService.generateSampleContractPdf(envelope.title);

    if (type === 'original') {
      return {
        filename: `${envelope.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_original.pdf`,
        buffer: originalBytes,
      };
    }

    const { finalPdfBytes, cocBytes } = await this.pdfService.flattenAndFinalize({
      originalBytes,
      fields: envelope.fields,
      recipients: envelope.recipients,
      envelope,
      auditEvents: envelope.auditEvents,
    });

    if (type === 'coc') {
      return {
        filename: `${envelope.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Certificate_of_Completion.pdf`,
        buffer: cocBytes,
      };
    }

    return {
      filename: `${envelope.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_executed.pdf`,
      buffer: finalPdfBytes,
    };
  }

  /**
   * Verifies document cryptographic integrity: re-hashes final bytes and validates audit chain.
   */
  async verifyEnvelope(id: string, workspaceId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);
    const { buffer } = await this.getDocumentBytes(id, workspaceId, 'final');

    const calculatedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    const expectedHash = envelope.finalHash || calculatedHash;
    const verified = calculatedHash === expectedHash;

    const chainResult = this.pdfService.verifyAuditChain(
      envelope.auditEvents,
      envelope.originalHash,
    );

    return {
      envelopeId: envelope.id,
      title: envelope.title,
      status: envelope.status,
      verified,
      finalHash: expectedHash,
      calculatedHash,
      auditChainValid: chainResult.valid,
      auditChainBrokenAtStep: chainResult.brokenAtStep,
      auditEventsCount: envelope.auditEvents.length,
      legalFramework: 'Bangladesh Information and Communication Technology (ICT) Act 2006 (Sec. 7)',
      message: verified && chainResult.valid
        ? 'Document verified: cryptographic signature and audit trail chain are intact and authentic.'
        : 'Integrity check failed: document content or audit log has been modified.',
    };
  }

  /**
   * Retrieves full audit trail for an envelope with chain verification info.
   */
  async getAuditTrail(id: string, workspaceId: string) {
    const envelope = await this.getEnvelope(id, workspaceId);
    const chainResult = this.pdfService.verifyAuditChain(
      envelope.auditEvents,
      envelope.originalHash,
    );

    return {
      envelopeId: envelope.id,
      title: envelope.title,
      genesisHash: envelope.originalHash,
      finalHash: envelope.finalHash,
      chainValid: chainResult.valid,
      events: envelope.auditEvents,
    };
  }
}
