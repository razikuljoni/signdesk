import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async listTemplates(workspaceId: string) {
    return this.prisma.template.findMany({
      where: { workspaceId },
      orderBy: [{ useCount: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getTemplate(id: string, workspaceId: string) {
    const template = await this.prisma.template.findFirst({
      where: { id, workspaceId },
    });
    if (!template) {
      throw new NotFoundException('Template not found');
    }
    return template;
  }

  async createTemplate(
    workspaceId: string,
    data: {
      name: string;
      pdfUrl: string;
      fieldLayout: any;
      message?: string;
      defaultExpiryDays?: number;
      defaultReminderHours?: number;
    },
  ) {
    if (!data.name || !data.pdfUrl || !data.fieldLayout) {
      throw new BadRequestException('Template requires name, pdfUrl, and fieldLayout');
    }

    return this.prisma.template.create({
      data: {
        workspaceId,
        name: data.name.trim(),
        pdfUrl: data.pdfUrl,
        fieldLayout: data.fieldLayout,
        message: data.message,
        defaultExpiryDays: data.defaultExpiryDays || 14,
        defaultReminderHours: data.defaultReminderHours || 48,
        useCount: 0,
      },
    });
  }

  /**
   * Creates a template from an existing envelope.
   */
  async createFromEnvelope(
    envelopeId: string,
    workspaceId: string,
    templateName?: string,
  ) {
    const envelope = await this.prisma.envelope.findFirst({
      where: { id: envelopeId, workspaceId },
      include: {
        recipients: { orderBy: { order: 'asc' } },
        fields: { orderBy: { page: 'asc' } },
      },
    });

    if (!envelope) {
      throw new NotFoundException('Source envelope not found');
    }

    // Map recipient orders/roles to abstract roles
    const roleMap = new Map<string, string>();
    const roles: string[] = [];

    envelope.recipients.forEach((r, idx) => {
      const roleName = r.role === 'SIGNER' ? `Signer ${idx + 1}` : `${r.role} ${idx + 1}`;
      roleMap.set(r.id, roleName);
      roles.push(roleName);
    });

    const templateFields = envelope.fields.map((f) => ({
      role: f.recipientId ? roleMap.get(f.recipientId) || 'Signer 1' : 'Signer 1',
      type: f.type,
      page: f.page,
      xRatio: f.xRatio,
      yRatio: f.yRatio,
      wRatio: f.wRatio,
      hRatio: f.hRatio,
      required: f.required,
      label: f.label,
      placeholder: f.placeholder,
      options: f.options,
    }));

    return this.prisma.template.create({
      data: {
        workspaceId,
        name: templateName?.trim() || `${envelope.title} Template`,
        pdfUrl: envelope.originalPdfUrl,
        message: envelope.messageToSigners,
        fieldLayout: {
          roles,
          fields: templateFields,
        },
        defaultExpiryDays: 14,
        defaultReminderHours: 48,
        useCount: 0,
      },
    });
  }

  /**
   * Instantiates a template into a ready draft envelope with supplied recipients.
   */
  async useTemplate(
    templateId: string,
    workspaceId: string,
    userId: string,
    data: {
      title?: string;
      recipients: Array<{
        role: string;
        name: string;
        email: string;
      }>;
    },
  ) {
    const template = await this.getTemplate(templateId, workspaceId);

    const layout = template.fieldLayout as {
      roles: string[];
      fields: Array<{
        role: string;
        type: any;
        page: number;
        xRatio: number;
        yRatio: number;
        wRatio: number;
        hRatio: number;
        required: boolean;
        label?: string;
        placeholder?: string;
        options?: any;
      }>;
    };

    if (!layout || !layout.fields) {
      throw new BadRequestException('Template has invalid field layout structure');
    }

    const originalHash = crypto
      .createHash('sha256')
      .update(template.pdfUrl + ':' + Date.now())
      .digest('hex');

    return this.prisma.$transaction(async (tx) => {
      // 1. Create Envelope
      const envelope = await tx.envelope.create({
        data: {
          workspaceId,
          ownerId: userId,
          title: data.title?.trim() || template.name,
          originalPdfUrl: template.pdfUrl,
          originalHash,
          messageToSigners: template.message,
          status: 'DRAFT',
          version: 1,
        },
      });

      // 2. Create Recipients and build role -> recipientId map
      const roleToRecipientId = new Map<string, string>();
      let orderCounter = 1;

      for (const r of data.recipients) {
        const createdRecipient = await tx.recipient.create({
          data: {
            envelopeId: envelope.id,
            name: r.name.trim(),
            email: r.email.toLowerCase().trim(),
            role: 'SIGNER',
            order: orderCounter++,
            status: 'PENDING',
          },
        });
        roleToRecipientId.set(r.role, createdRecipient.id);
        // Fallback match first role or index
        if (!roleToRecipientId.has(`Signer ${orderCounter - 1}`)) {
          roleToRecipientId.set(`Signer ${orderCounter - 1}`, createdRecipient.id);
        }
      }

      // 3. Create Fields attached to matching recipients
      for (const f of layout.fields) {
        let recipientId = roleToRecipientId.get(f.role);
        if (!recipientId && data.recipients.length > 0) {
          // Default to first recipient if role not exact match
          recipientId = Array.from(roleToRecipientId.values())[0];
        }

        await tx.field.create({
          data: {
            envelopeId: envelope.id,
            recipientId: recipientId || null,
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
      }

      // 4. Update template stats
      await tx.template.update({
        where: { id: templateId },
        data: {
          useCount: { increment: 1 },
          lastUsedAt: new Date(),
        },
      });

      // 5. Create Genesis audit event
      const eventHash = crypto
        .createHash('sha256')
        .update(originalHash + ':template_instantiated')
        .digest('hex');

      await tx.auditEvent.create({
        data: {
          envelopeId: envelope.id,
          actor: 'Sender',
          action: 'created',
          documentHash: originalHash,
          prevHash: originalHash,
          eventHash,
        },
      });

      return envelope;
    });
  }

  async deleteTemplate(id: string, workspaceId: string) {
    const template = await this.getTemplate(id, workspaceId);
    return this.prisma.template.delete({
      where: { id: template.id },
    });
  }
}
