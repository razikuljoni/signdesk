import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as http from 'http';
import * as crypto from 'crypto';
import { AddressInfo } from 'net';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { DeveloperService } from '../src/developer/developer.service';

describe('SignDesk API E2E Suite', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let developerService: DeveloperService;

  let workspaceId: string;
  let userId: string;
  let env1Id: string;
  let env2Id: string;
  let envExpiredId: string;
  let token1: string;
  let token2: string;
  let tokenExpired: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    developerService = app.get(DeveloperService);
    developerService.backoffBaseMs = 1;

    const nonce = Date.now().toString();

    // 1. Create test user
    const user = await prisma.user.create({
      data: {
        email: `e2e-owner-${nonce}@test.bd`,
        name: 'E2E Suite Owner',
        passwordHash: 'dummy_hash',
      },
    });
    userId = user.id;

    // 2. Create test workspace owned by user
    const ws = await prisma.workspace.create({
      data: {
        name: `E2E Workspace ${nonce}`,
        ownerId: user.id,
      },
    });
    workspaceId = ws.id;

    await prisma.workspaceMember.create({
      data: {
        workspaceId: ws.id,
        userId: user.id,
        role: 'ADMIN',
      },
    });

    // 3. Create Envelope 1 + Recipient 1
    const env1 = await prisma.envelope.create({
      data: {
        title: 'Bilateral Supply Charter Alpha',
        status: 'WAITING',
        workspaceId: ws.id,
        ownerId: user.id,
        originalPdfUrl: 'uploads/test-env1.pdf',
        originalHash: crypto.randomBytes(32).toString('hex'),
      },
    });
    env1Id = env1.id;
    token1 = `token_e2e_env1_${nonce}`;

    await prisma.recipient.create({
      data: {
        envelopeId: env1.id,
        name: 'Alpha Signatory',
        email: `alpha-${nonce}@partner.bd`,
        tokenHash: crypto.createHash('sha256').update(token1).digest('hex'),
        order: 1,
        role: 'SIGNER',
        status: 'PENDING',
      },
    });

    // 4. Create Envelope 2 + Recipient 2
    const env2 = await prisma.envelope.create({
      data: {
        title: 'Bilateral Supply Charter Beta',
        status: 'WAITING',
        workspaceId: ws.id,
        ownerId: user.id,
        originalPdfUrl: 'uploads/test-env2.pdf',
        originalHash: crypto.randomBytes(32).toString('hex'),
      },
    });
    env2Id = env2.id;
    token2 = `token_e2e_env2_${nonce}`;

    await prisma.recipient.create({
      data: {
        envelopeId: env2.id,
        name: 'Beta Signatory',
        email: `beta-${nonce}@partner.bd`,
        tokenHash: crypto.createHash('sha256').update(token2).digest('hex'),
        order: 1,
        role: 'SIGNER',
        status: 'PENDING',
      },
    });

    // 5. Create Expired Envelope + Recipient
    const envExpired = await prisma.envelope.create({
      data: {
        title: 'Lapsed Procurement Agreement',
        status: 'EXPIRED',
        workspaceId: ws.id,
        ownerId: user.id,
        originalPdfUrl: 'uploads/test-expired.pdf',
        originalHash: crypto.randomBytes(32).toString('hex'),
        expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
    });
    envExpiredId = envExpired.id;
    tokenExpired = `token_e2e_expired_${nonce}`;

    await prisma.recipient.create({
      data: {
        envelopeId: envExpired.id,
        name: 'Lapsed Signatory',
        email: `lapsed-${nonce}@partner.bd`,
        tokenHash: crypto.createHash('sha256').update(tokenExpired).digest('hex'),
        order: 1,
        role: 'SIGNER',
        status: 'PENDING',
      },
    });
  });

  afterAll(async () => {
    try {
      await prisma.recipient.deleteMany({
        where: { envelopeId: { in: [env1Id, env2Id, envExpiredId] } },
      });
      await prisma.auditEvent.deleteMany({
        where: { envelopeId: { in: [env1Id, env2Id, envExpiredId] } },
      });
      await prisma.webhookDelivery.deleteMany({
        where: { endpoint: { workspaceId } },
      });
      await prisma.webhookEndpoint.deleteMany({
        where: { workspaceId },
      });
      await prisma.envelope.deleteMany({
        where: { id: { in: [env1Id, env2Id, envExpiredId] } },
      });
      await prisma.workspaceMember.deleteMany({
        where: { workspaceId },
      });
      await prisma.workspace.deleteMany({
        where: { id: workspaceId },
      });
      await prisma.user.deleteMany({
        where: { id: userId },
      });
    } catch {
      // Ignore teardown errors
    }
    await app.close();
  });

  it('/health (GET) returns status ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.service).toBe('SignDesk API');
      });
  });

  it('token-cannot-open-another-envelope: token1 opens env1 only and rejects cross-access or invalid tokens', async () => {
    // 1. Token 1 fetches session for Envelope 1
    const res1 = await request(app.getHttpServer())
      .get(`/sign/${token1}`)
      .expect(200);

    expect(res1.body.envelopeId).toBe(env1Id);
    expect(res1.body.envelopeTitle).toBe('Bilateral Supply Charter Alpha');
    expect(res1.body.recipientName).toBe('Alpha Signatory');
    expect(res1.body.envelopeId).not.toBe(env2Id);

    // 2. Token 2 fetches session for Envelope 2
    const res2 = await request(app.getHttpServer())
      .get(`/sign/${token2}`)
      .expect(200);

    expect(res2.body.envelopeId).toBe(env2Id);
    expect(res2.body.envelopeTitle).toBe('Bilateral Supply Charter Beta');
    expect(res2.body.recipientName).toBe('Beta Signatory');
    expect(res2.body.envelopeId).not.toBe(env1Id);

    // 3. Unknown / invalid token must return 404 NotFound
    await request(app.getHttpServer())
      .get('/sign/sd_fake_token_999999999999')
      .expect(404);
  });

  it('expired-token state: returns status: expired for lapsed envelope', async () => {
    const res = await request(app.getHttpServer())
      .get(`/sign/${tokenExpired}`)
      .expect(200);

    expect(res.body.status).toBe('expired');
    expect(res.body.envelopeTitle).toBe('Lapsed Procurement Agreement');
    expect(res.body.expiresAt).toBeDefined();
  });

  it('webhook-delivery: dispatches event to local listener and verifies X-SignDesk-Signature header', async () => {
    let capturedRawBody = '';
    let capturedPayload: any = null;
    let capturedSignature: string | null = null;

    // Spin up local HTTP receiver
    const server = http.createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        capturedRawBody = body;
        capturedPayload = JSON.parse(body);
        capturedSignature = (req.headers['x-signdesk-signature'] as string) || null;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
      });
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const port = (server.address() as AddressInfo).port;
    const targetUrl = `http://127.0.0.1:${port}/webhook-target`;

    try {
      // Register webhook endpoint in DB
      const endpointResult = await developerService.createWebhookEndpoint(workspaceId, {
        url: targetUrl,
        events: ['envelope.completed'],
      });
      const rawSecret = endpointResult.secret;

      // Dispatch event
      const testEventData = {
        envelopeId: env1Id,
        title: 'Bilateral Supply Charter Alpha',
        completedAt: new Date().toISOString(),
      };

      await developerService.dispatchEvent(
        workspaceId,
        env1Id,
        'envelope.completed',
        testEventData,
      );

      // Verify delivery to local HTTP receiver
      expect(capturedPayload).not.toBeNull();
      expect(capturedPayload.event).toBe('envelope.completed');
      expect(capturedPayload.data.envelopeId).toBe(env1Id);
      expect(capturedSignature).not.toBeNull();

      // Verify HMAC-SHA256 signature with raw secret
      const verifyResult = developerService.verifyWebhookSignature(
        capturedRawBody,
        capturedSignature!,
        rawSecret,
      );
      expect(verifyResult.valid).toBe(true);

      // Verify bad secret fails verification
      const badVerifyResult = developerService.verifyWebhookSignature(
        capturedRawBody,
        capturedSignature!,
        'whsec_wrong_secret_1234567890123456',
      );
      expect(badVerifyResult.valid).toBe(false);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
