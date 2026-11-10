'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CreditCard,
  CheckCircle2,
  Mail,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function BillingSettingsPage() {
  return (
    <AuthGuard>
      <BillingSettingsContent />
    </AuthGuard>
  );
}

function BillingSettingsContent() {
  // Usage statistics
  const envelopesUsed = 3;
  const envelopesLimit = 5;
  const envelopesPercentage = (envelopesUsed / envelopesLimit) * 100;

  const emailsUsedToday = 22;
  const emailsDailyCap = 100;
  const emailsRemaining = emailsDailyCap - emailsUsedToday;
  const emailsPercentage = (emailsUsedToday / emailsDailyCap) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
            Subscription & Usage Quotas
          </h1>
          <span className="text-xs font-mono font-bold bg-[#E2F2E8] text-success px-2.5 py-0.5 rounded-full border border-success/30">
            Free Active
          </span>
        </div>
        <p className="text-sm text-ink-soft">
          Monitor your monthly envelope limits and daily Resend email dispatch allowances.
        </p>
      </div>

      {/* Usage Overview Cards */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Envelope Usage */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-bold text-xs text-pine-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-pine-600" />
              Monthly Envelopes Quota
            </span>
            <span className="text-xs font-mono font-bold text-pine-900">
              {envelopesUsed} of {envelopesLimit} used
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-paper h-3 rounded-full overflow-hidden border border-border">
              <div
                className="bg-pine-600 h-full rounded-full transition-all"
                style={{ width: `${envelopesPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-ink-soft">
              <span>{envelopesLimit - envelopesUsed} envelopes remaining this calendar month</span>
              <span>Resets on 1st of next month</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-faint">
            Free tier includes 5 envelopes each month (mirroring Zoho Sign and PandaDoc free plans).
          </p>
        </Card>

        {/* Email Quota */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-bold text-xs text-pine-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-pine-600" />
              Daily Email Dispatch Allowance
            </span>
            <span className="text-xs font-mono font-bold text-pine-900">
              {emailsUsedToday} of {emailsDailyCap} sent today
            </span>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-paper h-3 rounded-full overflow-hidden border border-border">
              <div
                className="bg-brass-500 h-full rounded-full transition-all"
                style={{ width: `${emailsPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-ink-soft">
              <strong className="text-pine-900">{emailsRemaining}/100 emails left today</strong>
              <span>Resets at midnight BST</span>
            </div>
          </div>

          <p className="text-[11px] text-ink-faint">
            Strictly enforces the permanent Resend free-tier 100/day hard cap to protect zero-cost infrastructure.
          </p>
        </Card>
      </div>

      {/* Plan Comparison Cards */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-pine-900">Available Plans</h2>
          <p className="text-xs text-ink-soft">
            Upgrade when you need unlimited envelopes, additional team seats, and API access.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <Card className="bg-surface border-2 border-pine-900 flex flex-col justify-between p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xl text-pine-900">Free</span>
                <span className="text-xs font-bold bg-pine-100 text-pine-900 px-2 py-0.5 rounded">Current Plan</span>
              </div>
              <div className="text-3xl font-display font-bold text-pine-900">
                ৳0 <span className="text-xs font-sans text-ink-soft">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  5 envelopes per calendar month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  1 team seat (Single sender)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  SHA-256 Merkle audit chain
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Certificate of Completion PDF
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  All 6 BD SME Starter Templates
                </li>
              </ul>
            </div>

            <Button variant="outline" size="default" disabled className="w-full text-xs">
              Current Plan
            </Button>
          </Card>

          {/* Starter Plan */}
          <Card className="bg-surface border border-border flex flex-col justify-between p-6 space-y-6 hover:shadow-warm-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xl text-pine-900">Starter</span>
                <span className="text-xs font-mono text-ink-faint">Small Business</span>
              </div>
              <div className="text-3xl font-display font-bold text-pine-900">
                ৳1,499 <span className="text-xs font-sans text-ink-soft">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Unlimited monthly envelopes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Up to 3 team member seats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Custom workspace logo & seal
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Automated lifecycle reminders
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Priority Bangladesh support
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="default"
              className="w-full text-xs font-bold text-ink-soft"
              onClick={() => alert('Payment integration with local MFS (bKash/Nagad) is in review per §15. Commercial tiers will activate following payment provider selection.')}
            >
              Upgrade (Coming Soon)
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card className="bg-surface border border-border flex flex-col justify-between p-6 space-y-6 hover:shadow-warm-md transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xl text-pine-900">Pro</span>
                <span className="text-xs font-mono text-ink-faint">Enterprise</span>
              </div>
              <div className="text-3xl font-display font-bold text-pine-900">
                ৳3,999 <span className="text-xs font-sans text-ink-soft">/ month</span>
              </div>
              <ul className="space-y-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Unlimited envelopes & team seats
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  REST API v1 & Secret API keys
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Real-time HMAC Webhooks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Custom SLA & 99.9% uptime
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
                  Dedicated Bangladesh Account Manager
                </li>
              </ul>
            </div>

            <Button
              variant="outline"
              size="default"
              className="w-full text-xs font-bold text-ink-soft"
              onClick={() => alert('Payment integration with local MFS (bKash/Nagad) is in review per §15. Commercial tiers will activate following payment provider selection.')}
            >
              Upgrade (Coming Soon)
            </Button>
          </Card>
        </div>
      </div>

      {/* Disclosure / Open Question Notice (§15) */}
      <Card className="bg-surface-raised border border-border p-5 text-xs text-ink-soft space-y-1.5">
        <div className="font-bold text-pine-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-pine-600" />
          Honest Architecture & Payment Disclaimer (§15)
        </div>
        <p className="leading-relaxed">
          SignDesk operates strictly on permanent free tiers. Pricing figures shown above are representative estimates from our Stitch design mockup.
          Local MFS payment integration (bKash, Nagad, SSLCommerz) is deliberately deferred per §15 and will be activated upon commercial provider sign-off.
        </p>
      </Card>
    </div>
  );
}
