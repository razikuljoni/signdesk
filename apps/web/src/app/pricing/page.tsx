'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, HelpCircle, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
          Transparent Pricing for Bangladeshi Commerce
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-pine-900">
          Start free, upgrade as your business scales.
        </h1>
        <p className="text-ink-soft text-lg">
          No hidden fees. Every plan includes legally binding electronic signatures under the Bangladesh ICT Act 2006.
        </p>

        {/* Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3 text-sm font-semibold">
          <span className={!annual ? 'text-pine-900' : 'text-ink-faint'}>Monthly Billing</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-pine-900 p-1 flex items-center transition-colors relative"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-4 h-4 rounded-full bg-paper transition-transform ${
                annual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={annual ? 'text-pine-900 flex items-center gap-1.5' : 'text-ink-faint'}>
            Annual Billing
            <span className="text-[11px] bg-seal-100 text-seal-700 px-2 py-0.5 rounded-full font-bold">
              2 Months Free
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {/* 1. Free Explorer */}
        <Card className="flex flex-col justify-between border-2 border-border bg-surface">
          <CardHeader className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Standard MVP Tier
            </span>
            <CardTitle className="text-2xl">Free Explorer</CardTitle>
            <CardDescription>
              Ideal for independent professionals and small businesses starting with digital contracts.
            </CardDescription>
            <div className="pt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-pine-900">৳0</span>
              <span className="text-sm text-ink-soft">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink">
            <div className="font-semibold text-xs uppercase tracking-wider text-ink-soft border-b border-border pb-2">
              Features Included:
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span><strong>5 envelopes / month</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>Unlimited signers per envelope</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>Gemini AI plain-language contract summary</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>SHA-256 Merkle chain audit trail</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>Formal Certificate of Completion</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>All 6 pre-built BD contract templates</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="primary" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* 2. Corporate Starter */}
        <Card className="flex flex-col justify-between border-2 border-seal-600 bg-surface relative shadow-warm-md">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-seal-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            Most Popular for BD SMEs
          </div>
          <CardHeader className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              Growth Tier (Sample)
            </span>
            <CardTitle className="text-2xl">Corporate Starter</CardTitle>
            <CardDescription>
              For expanding teams needing higher volume, custom branding, and team delegation.
            </CardDescription>
            <div className="pt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-pine-900">
                {annual ? '৳1,249' : '৳1,499'}
              </span>
              <span className="text-sm text-ink-soft">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink">
            <div className="font-semibold text-xs uppercase tracking-wider text-ink-soft border-b border-border pb-2">
              Everything in Free, plus:
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-seal-600 shrink-0" />
                <span><strong>50 envelopes / month</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-seal-600 shrink-0" />
                <span>Up to 5 team workspace seats</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-seal-600 shrink-0" />
                <span>Custom company logo on signing portal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-seal-600 shrink-0" />
                <span>Automated reminder schedules (48h/72h)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-seal-600 shrink-0" />
                <span>Priority email support & audit export</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="sign" className="w-full">
                Start 14-Day Trial
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* 3. Enterprise Pro */}
        <Card className="flex flex-col justify-between border-2 border-border bg-surface">
          <CardHeader className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-ink-faint">
              API & Automation (Sample)
            </span>
            <CardTitle className="text-2xl">Enterprise Pro</CardTitle>
            <CardDescription>
              High volume dispatch with REST API keys, webhooks, and team roles.
            </CardDescription>
            <div className="pt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-pine-900">
                {annual ? '৳3,329' : '৳3,999'}
              </span>
              <span className="text-sm text-ink-soft">/ month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink">
            <div className="font-semibold text-xs uppercase tracking-wider text-ink-soft border-b border-border pb-2">
              Everything in Starter, plus:
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span><strong>Unlimited envelopes / month</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>REST API access (`sd_live_...` keys)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>HMAC-SHA256 Signed Webhooks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>Role-Based Access Control (Admin/Sender/Viewer)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-pine-600 shrink-0" />
                <span>Dedicated account manager</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Link href="/signup" className="w-full">
              <Button variant="secondary" className="w-full">
                Upgrade to Pro
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Payment Notice */}
      <div className="p-4 bg-surface-raised rounded-[12px] border border-border text-center text-xs text-ink-soft max-w-2xl mx-auto">
        <p className="font-semibold text-pine-900 mb-1">
          Payment Methods & Pricing Note (§15):
        </p>
        <p>
          Starter and Pro pricing figures are sample references. All accounts receive the free 5 envelopes/month tier.
          Direct bKash, Nagad, and corporate bank transfer billing integrations are coming soon in Phase 10.
        </p>
      </div>
    </div>
  );
}
