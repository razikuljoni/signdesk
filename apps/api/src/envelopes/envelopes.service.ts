import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import { EnvelopeStatus, FieldType, RecipientRole } from '@signdesk/shared';

@Injectable()
export class EnvelopesService {
  constructor(private readonly prisma: PrismaService) {}

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

      // Log initial genesis audit event
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
    if (envelope.status !== 'DRAFT') {
      throw new BadRequestException('Cannot change recipients on non-draft envelope');
    }

    return this.prisma.$transaction(async (tx) => {
      // Delete previous recipients and recreate for draft
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

      // Clone recipients
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

      // Clone fields with mapped recipients
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
}
