import { z } from 'zod';
import {
  EnvelopeStatus,
  RecipientStatus,
  RecipientRole,
  FieldType,
  WorkspaceRole,
  SignatureCaptureMode,
  AuditAction,
  WebhookEvent,
} from './enums.js';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  emailVerifiedAt: z.date().nullable(),
  createdAt: z.date(),
});

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  logoUrl: z.string().url().nullable().optional(),
  ownerId: z.string().uuid(),
  defaultExpiryDays: z.number().int().min(1).max(90).default(14),
  defaultReminderHours: z.number().int().min(1).default(48),
  createdAt: z.date(),
});

export const FieldGeometrySchema = z.object({
  page: z.number().int().min(0),
  xRatio: z.number().min(0).max(1),
  yRatio: z.number().min(0).max(1),
  wRatio: z.number().min(0).max(1),
  hRatio: z.number().min(0).max(1),
});

export const CreateFieldInputSchema = FieldGeometrySchema.extend({
  recipientId: z.string().uuid().nullable().optional(),
  type: z.nativeEnum(FieldType),
  required: z.boolean().default(true),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  value: z.any().optional(),
});

export const CreateRecipientInputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(RecipientRole).default(RecipientRole.SIGNER),
  order: z.number().int().min(1).default(1),
});

export const CreateEnvelopeInputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  messageToSigners: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  recipients: z.array(CreateRecipientInputSchema).optional(),
});

export const UpdateEnvelopeDraftSchema = z.object({
  title: z.string().min(1).optional(),
  messageToSigners: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const SignerConsentSchema = z.object({
  disclosureVersion: z.string().min(1),
  agreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Electronic Record & Signature Disclosure' }),
  }),
});

export const SubmitSignatureSchema = z.object({
  captureMode: z.nativeEnum(SignatureCaptureMode),
  pngBase64: z.string().min(10, 'Signature asset data is required'),
  fields: z.record(z.string(), z.any()),
  disclosureVersion: z.string().min(1),
  consentAgreed: z.literal(true),
});

export const DeclineEnvelopeSchema = z.object({
  reasonPreset: z.enum([
    'Incorrect details',
    'Do not agree to terms',
    'Wrong person',
    'Other',
  ]),
  reasonText: z.string().min(5, 'Please provide details for declining'),
});

export const SignUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  workspaceName: z.string().min(2, 'Company/Workspace name is required'),
});

export const SignInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
