export enum EnvelopeStatus {
  DRAFT = 'draft',
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  VOIDED = 'voided',
}

export enum RecipientStatus {
  PENDING = 'pending',
  NOTIFIED = 'notified',
  VIEWED = 'viewed',
  SIGNED = 'signed',
  DECLINED = 'declined',
  EXPIRED = 'expired',
}

export enum RecipientRole {
  SIGNER = 'SIGNER',
  APPROVER = 'APPROVER',
  VIEWER = 'VIEWER',
}

export enum FieldType {
  SIGNATURE = 'SIGNATURE',
  INITIALS = 'INITIALS',
  DATE_SIGNED = 'DATE_SIGNED',
  FULL_NAME = 'FULL_NAME',
  EMAIL = 'EMAIL',
  COMPANY = 'COMPANY',
  TEXT = 'TEXT',
  CHECKBOX = 'CHECKBOX',
  DROPDOWN = 'DROPDOWN',
}

export enum WorkspaceRole {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
  VIEWER = 'VIEWER',
}

export enum SignatureCaptureMode {
  DRAW = 'DRAW',
  TYPE = 'TYPE',
  UPLOAD = 'UPLOAD',
}

export enum AuditAction {
  CREATED = 'created',
  SENT = 'sent',
  VIEWED = 'viewed',
  FIELD_FILLED = 'field_filled',
  SIGNED = 'signed',
  DECLINED = 'declined',
  REMINDED = 'reminded',
  EXPIRED = 'expired',
  VOIDED = 'voided',
  COMPLETED = 'completed',
  DOWNLOADED = 'downloaded',
}

export enum WebhookEvent {
  ENVELOPE_SENT = 'envelope.sent',
  ENVELOPE_VIEWED = 'envelope.viewed',
  ENVELOPE_SIGNED = 'envelope.signed',
  ENVELOPE_COMPLETED = 'envelope.completed',
  ENVELOPE_DECLINED = 'envelope.declined',
  ENVELOPE_EXPIRED = 'envelope.expired',
  ENVELOPE_VOIDED = 'envelope.voided',
}
