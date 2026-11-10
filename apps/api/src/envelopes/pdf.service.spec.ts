import { PdfService } from './pdf.service';
import * as crypto from 'crypto';

describe('PdfService (Phase 5 - PDF Finalization & Merkle Audit Proof)', () => {
  let pdfService: PdfService;

  beforeEach(() => {
    pdfService = new PdfService();
  });

  it('generates a valid sample contract PDF', async () => {
    const pdfBytes = await pdfService.generateSampleContractPdf('Sample Commercial NDA');
    expect(pdfBytes).toBeInstanceOf(Buffer);
    expect(pdfBytes.length).toBeGreaterThan(1000);
    // PDF header check
    expect(pdfBytes.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('flattens fields, appends Certificate of Completion, and computes SHA-256 finalHash', async () => {
    const sampleOriginal = await pdfService.generateSampleContractPdf('Mutual NDA Test');
    const originalHash = crypto.createHash('sha256').update(sampleOriginal).digest('hex');

    const mockEnvelope = {
      id: 'env-12345678',
      title: 'Mutual NDA Test',
      originalHash,
    };

    const mockRecipients = [
      {
        id: 'rec-1',
        name: 'Rahim Chowdhury',
        email: 'rahim@horizon-logistics.bd',
        role: 'SIGNER',
        signedAt: new Date().toISOString(),
        ipAddress: '103.145.12.89',
      },
    ];

    const mockFields = [
      {
        page: 1,
        type: 'SIGNATURE',
        xRatio: 0.1,
        yRatio: 0.7,
        wRatio: 0.3,
        hRatio: 0.08,
        value: 'Rahim Chowdhury',
        recipient: mockRecipients[0],
      },
      {
        page: 1,
        type: 'DATE_SIGNED',
        xRatio: 0.5,
        yRatio: 0.7,
        wRatio: 0.2,
        hRatio: 0.05,
        value: '2026-11-10',
      },
    ];

    const mockAuditEvents = [
      {
        timestampUtc: new Date().toISOString(),
        actor: 'Sender',
        action: 'created',
        prevHash: originalHash,
        eventHash: 'hash-11111111111111111111111111111111',
      },
      {
        timestampUtc: new Date().toISOString(),
        actor: 'Rahim Chowdhury',
        action: 'signed',
        prevHash: 'hash-11111111111111111111111111111111',
        eventHash: 'hash-22222222222222222222222222222222',
      },
    ];

    const result = await pdfService.flattenAndFinalize({
      originalBytes: sampleOriginal,
      fields: mockFields,
      recipients: mockRecipients,
      envelope: mockEnvelope,
      auditEvents: mockAuditEvents,
    });

    expect(result.finalPdfBytes).toBeInstanceOf(Buffer);
    expect(result.finalHash).toBeDefined();
    expect(result.cocBytes).toBeInstanceOf(Buffer);

    // Verify finalHash matches SHA-256 of finalPdfBytes exactly
    const recomputedHash = crypto.createHash('sha256').update(result.finalPdfBytes).digest('hex');
    expect(result.finalHash).toBe(recomputedHash);

    // Verify verification succeeds on untampered PDF
    expect(pdfService.verifyPdfHash(result.finalPdfBytes, result.finalHash)).toBe(true);

    // Tampering test: alter a single byte in the stored PDF
    const tamperedBytes = Buffer.from(result.finalPdfBytes);
    tamperedBytes[tamperedBytes.length - 20] = tamperedBytes[tamperedBytes.length - 20] ^ 0xff;

    // Must detect tampering
    expect(pdfService.verifyPdfHash(tamperedBytes, result.finalHash)).toBe(false);
  });

  it('validates audit event hash chain and detects tampering', () => {
    const genesis = 'genesis-hash-000000000000000000000000';
    const validChain = [
      { prevHash: genesis, eventHash: 'hash-111' },
      { prevHash: 'hash-111', eventHash: 'hash-222' },
      { prevHash: 'hash-222', eventHash: 'hash-333' },
    ];

    const validResult = pdfService.verifyAuditChain(validChain, genesis);
    expect(validResult.valid).toBe(true);

    // Tampered event in the middle
    const tamperedChain = [
      { prevHash: genesis, eventHash: 'hash-111' },
      { prevHash: 'tampered-hash-999', eventHash: 'hash-222' },
      { prevHash: 'hash-222', eventHash: 'hash-333' },
    ];

    const tamperedResult = pdfService.verifyAuditChain(tamperedChain, genesis);
    expect(tamperedResult.valid).toBe(false);
    expect(tamperedResult.brokenAtStep).toBe(1);
  });
});
