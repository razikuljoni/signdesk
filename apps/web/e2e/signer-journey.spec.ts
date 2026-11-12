import { test, expect } from '@playwright/test';

const mockSession = {
  envelopeId: 'env_smoke_123',
  envelopeTitle: 'Commercial Supply Charter 2026',
  recipientName: 'Tanvir Ahmed',
  recipientEmail: 'tanvir@apexcommerce.bd',
  recipientRole: 'Managing Director',
  expiresAt: '2026-12-31T23:59:59Z',
  status: 'active',
  senderName: 'Ayesha Rahman',
  senderEmail: 'ayesha@rahimtextiles.bd',
  fields: [
    {
      id: 'fld_1',
      type: 'SIGNATURE',
      page: 1,
      x: 0.5,
      y: 0.7,
      w: 0.2,
      h: 0.05,
      recipientId: 'rec_1',
    },
  ],
};

const mockSummary = {
  summary: 'Bilateral commercial distribution charter for supply under Bangladesh ICT Act 2006.',
  clauses: ['Clause 4: Arbitration under Bangladesh Arbitration Act 2001'],
};

test.beforeEach(async ({ page }) => {
  // Intercept API fetch calls without intercepting Next.js page HTML navigations
  await page.route('**', async (route) => {
    const request = route.request();
    const url = request.url();

    const isApiCall =
      url.includes(':4000/sign/') ||
      (request.resourceType() === 'fetch' && url.includes('/sign/'));

    if (isApiCall) {
      if (url.endsWith('/sign/test-signer-token/summary')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockSummary),
        });
      }
      if (url.endsWith('/sign/test-signer-token/sign')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, signedAt: '2026-11-13T00:00:00Z' }),
        });
      }
      if (url.endsWith('/sign/test-signer-token/decline')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, declinedAt: '2026-11-13T00:00:00Z' }),
        });
      }
      if (url.endsWith('/sign/test-signer-token')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockSession),
        });
      }
    }

    return route.continue();
  });
});

test.describe('Signer Journey Smoke Spec (Plan §12)', () => {
  test('full signer journey: consent → summary → fields → signature → success', async ({ page }) => {
    // 1. Consent Screen (/sign/[token])
    await page.goto('/sign/test-signer-token');
    await expect(page.getByText('Commercial Supply Charter 2026')).toBeVisible();
    await expect(page.getByText('Tanvir Ahmed')).toBeVisible();

    // Navigate to Review & Summary
    await page.getByRole('button', { name: /Review Document & AI Summary/i }).click();
    await expect(page).toHaveURL(/\/sign\/test-signer-token\/review/);

    // 2. Summary & Assent Screen (/sign/[token]/review)
    await expect(page.getByText(/Section 7 of the Bangladesh/i).first()).toBeVisible();

    // Check statutory assent checkbox
    const consentCheckbox = page.locator('input[type="checkbox"]').first();
    await consentCheckbox.check();
    await expect(consentCheckbox).toBeChecked();

    // Proceed to Signing Canvas
    await page.getByRole('button', { name: /Proceed to Guided Signing Canvas/i }).click();
    await expect(page).toHaveURL(/\/sign\/test-signer-token\/sign/);

    // 3. Signing Canvas & Signature Adoption Modal (/sign/[token]/sign)
    // Click button to adopt signature
    const signButton = page.getByRole('button', { name: /Sign Obligatory Field|Tap to Sign/i }).first();
    await signButton.click();

    // Adoption modal appears
    await expect(page.getByText('Adopt Your Legal Signature')).toBeVisible();
    await page.getByRole('button', { name: /Adopt and Affix Seal/i }).click();

    // Finish & Seal Document
    const finishButton = page.getByRole('button', { name: /Finish & Seal Document/i });
    await expect(finishButton).toBeVisible();
    await finishButton.click();

    // 4. Success Receipt Screen (/sign/[token]/done)
    await expect(page).toHaveURL(/\/sign\/test-signer-token\/done/);
    await expect(page.getByText(/Agreement Irrevocably Executed & Sealed/i)).toBeVisible();
    await expect(page.getByText(/ICT Act 2006 §7 Validated/i)).toBeVisible();
  });

  test('decline path: opens decline modal and records refusal', async ({ page }) => {
    // Navigate to Signer Landing
    await page.goto('/sign/test-signer-token');
    await expect(page.getByText('Commercial Supply Charter 2026')).toBeVisible();

    // Click Decline button
    await page.getByRole('button', { name: /Decline to sign this agreement/i }).click();

    // Decline modal opens
    await expect(page.getByRole('heading', { name: 'Decline to Sign' })).toBeVisible();
    const reasonTextarea = page.locator('textarea');
    await reasonTextarea.fill('Pricing schedule requires commercial revision.');

    // Confirm declination
    await page.getByRole('button', { name: /Confirm Declination/i }).click();

    // Verify redirection to declined state
    await expect(page).toHaveURL(/\/sign\/test-signer-token\/declined/);
    await expect(page.getByRole('heading', { name: 'This Envelope Was Declined' })).toBeVisible();
  });
});
