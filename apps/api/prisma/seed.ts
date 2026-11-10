import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SignDesk database...');

  // 1. Demo User
  // Password hash for 'SignDesk2026!' using SHA-256 with salt
  const salt = 'signdesk_demo_salt';
  const passwordHash = crypto.createHash('sha256').update(`SignDesk2026!${salt}`).digest('hex');

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@signdesk.bd' },
    update: {},
    create: {
      name: 'Tanvir Ahmed',
      email: 'demo@signdesk.bd',
      passwordHash: `${salt}:${passwordHash}`,
      emailVerifiedAt: new Date(),
    },
  });

  console.log(`Demo User created: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Demo Workspace
  let workspace = await prisma.workspace.findFirst({
    where: { ownerId: demoUser.id },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'Apex Commerce BD',
        ownerId: demoUser.id,
        defaultExpiryDays: 14,
        defaultReminderHours: 48,
        members: {
          create: {
            userId: demoUser.id,
            role: 'ADMIN',
            acceptedAt: new Date(),
          },
        },
      },
    });
    console.log(`Demo Workspace created: ${workspace.name} (ID: ${workspace.id})`);
  }

  // 3. Six Starter Templates (BD SME Agreements per §6.4 & §11 Phase 6)
  const starterTemplates = [
    {
      name: 'Non-Disclosure Agreement (NDA)',
      message: 'Please review and sign our standard mutual NDA before commencing commercial discussions.',
      fieldLayout: {
        roles: ['Disclosing Party', 'Receiving Party'],
        fields: [
          { role: 'Disclosing Party', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.78, wRatio: 0.28, hRatio: 0.06, required: true },
          { role: 'Disclosing Party', type: 'DATE_SIGNED', page: 0, xRatio: 0.15, yRatio: 0.85, wRatio: 0.20, hRatio: 0.04, required: true },
          { role: 'Receiving Party', type: 'SIGNATURE', page: 0, xRatio: 0.58, yRatio: 0.78, wRatio: 0.28, hRatio: 0.06, required: true },
          { role: 'Receiving Party', type: 'DATE_SIGNED', page: 0, xRatio: 0.58, yRatio: 0.85, wRatio: 0.20, hRatio: 0.04, required: true },
        ],
      },
      pdfUrl: '/samples/bd-standard-nda.pdf',
    },
    {
      name: 'Master Services Agreement (MSA)',
      message: 'Please sign this Master Services Agreement to execute our delivery scope under Bangladesh Contract Act 1872.',
      fieldLayout: {
        roles: ['Service Provider', 'Client Authorized Signatory'],
        fields: [
          { role: 'Service Provider', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.8, wRatio: 0.3, hRatio: 0.06, required: true },
          { role: 'Client Authorized Signatory', type: 'SIGNATURE', page: 0, xRatio: 0.55, yRatio: 0.8, wRatio: 0.3, hRatio: 0.06, required: true },
        ],
      },
      pdfUrl: '/samples/master-services-agreement.pdf',
    },
    {
      name: 'Employment Offer Letter',
      message: 'Please sign this employment agreement to confirm acceptance of the employment offer.',
      fieldLayout: {
        roles: ['Employer Representative', 'Employee Candidate'],
        fields: [
          { role: 'Employer Representative', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.75, wRatio: 0.3, hRatio: 0.06, required: true },
          { role: 'Employee Candidate', type: 'SIGNATURE', page: 0, xRatio: 0.55, yRatio: 0.75, wRatio: 0.3, hRatio: 0.06, required: true },
        ],
      },
      pdfUrl: '/samples/employment-agreement.pdf',
    },
    {
      name: 'Freelancer / Independent Contractor Agreement',
      message: 'Please execute this independent contractor agreement for project deliverables and IP assignment.',
      fieldLayout: {
        roles: ['Client Signatory', 'Independent Contractor'],
        fields: [
          { role: 'Client Signatory', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.8, wRatio: 0.3, hRatio: 0.06, required: true },
          { role: 'Independent Contractor', type: 'SIGNATURE', page: 0, xRatio: 0.55, yRatio: 0.8, wRatio: 0.3, hRatio: 0.06, required: true },
        ],
      },
      pdfUrl: '/samples/freelancer-agreement.pdf',
    },
    {
      name: 'Commercial Invoice / Payment Acknowledgement',
      message: 'Please acknowledge invoice receipt and assent to agreed payment schedule.',
      fieldLayout: {
        roles: ['Issuer Signatory', 'Payee Signatory'],
        fields: [
          { role: 'Issuer Signatory', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.85, wRatio: 0.3, hRatio: 0.05, required: true },
          { role: 'Payee Signatory', type: 'SIGNATURE', page: 0, xRatio: 0.55, yRatio: 0.85, wRatio: 0.3, hRatio: 0.05, required: true },
        ],
      },
      pdfUrl: '/samples/invoice-acknowledgement.pdf',
    },
    {
      name: 'Office Space Lease / Rental Agreement',
      message: 'Commercial lease agreement for premises in Dhaka, Bangladesh.',
      fieldLayout: {
        roles: ['Landlord / Lessor', 'Tenant / Lessee'],
        fields: [
          { role: 'Landlord / Lessor', type: 'SIGNATURE', page: 0, xRatio: 0.15, yRatio: 0.82, wRatio: 0.3, hRatio: 0.06, required: true },
          { role: 'Tenant / Lessee', type: 'SIGNATURE', page: 0, xRatio: 0.55, yRatio: 0.82, wRatio: 0.3, hRatio: 0.06, required: true },
        ],
      },
      pdfUrl: '/samples/commercial-lease.pdf',
    },
  ];

  for (const t of starterTemplates) {
    const existing = await prisma.template.findFirst({
      where: { workspaceId: workspace.id, name: t.name },
    });
    if (!existing) {
      await prisma.template.create({
        data: {
          workspaceId: workspace.id,
          name: t.name,
          message: t.message,
          pdfUrl: t.pdfUrl,
          fieldLayout: t.fieldLayout,
          defaultExpiryDays: 14,
          defaultReminderHours: 48,
        },
      });
      console.log(`Starter Template created: ${t.name}`);
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
