'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Send,
  PenTool,
  HelpCircle,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-paper to-surface-raised/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pine-100 border border-pine-500/20 text-xs font-semibold text-pine-900 shadow-warm-sm">
            <ShieldCheck className="w-4 h-4 text-pine-600" />
            <span>Compliant with Bangladesh ICT Act 2006 (Sections 5–7)</span>
          </div>

          {/* Display Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-pine-900 max-w-4xl mx-auto leading-[1.1]">
            Signatures, sealed with authenticity.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-ink-soft max-w-2xl mx-auto font-body leading-relaxed">
            Upload any contract, drag fillable signature fields, and send email magic links.
            Signers execute without creating an account — backed by an immutable SHA-256 audit trail.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/signup">
              <Button variant="sign" size="lg" className="w-full sm:w-auto text-base px-8 h-12">
                Start Signing Free (5/mo)
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-6 h-12">
                Sign In with Demo User
              </Button>
            </Link>
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-border/60 text-xs text-ink-soft">
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
              <span>Zero-Account Signers</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
              <span>SHA-256 Hash Chain</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
              <span>Gemini AI Plain Summary</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0" />
              <span>BST Atomic Timestamps</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Document Teaser / Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="features">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            The SignDesk Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            From raw PDF to tamper-evident sealed contract in three steps
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="relative overflow-hidden border-border bg-surface">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-pine-100 flex items-center justify-center text-pine-900 font-bold">
                1
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Place Ratio-Preserved Fields
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Drag Signature, Initials, Date Signed, and Text fields onto your PDF.
                Coordinates are normalized ratios so scaling and zoom never corrupt field placement.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>xRatio: 0.15 · yRatio: 0.78</span>
                <span className="text-pine-600 font-semibold">Normalized</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative overflow-hidden border-border bg-surface">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-pine-100 flex items-center justify-center text-pine-900 font-bold">
                2
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Dispatch via Magic Link
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Signers receive a single-use token link with no password requirement.
                Sequential routing ensures Signer 2 is notified only after Signer 1 executes.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>Order: Rahim → Karim</span>
                <span className="text-seal-600 font-semibold">Sequential</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative overflow-hidden border-border bg-surface">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-pine-100 flex items-center justify-center text-pine-900 font-bold">
                3
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Seal & Certificate of Completion
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                The document is visually flattened and appended with a Certificate of Completion,
                linking each signer&apos;s IP, timestamp, and signature into an immutable SHA-256 digest.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>SHA-256 Merkle Chain</span>
                <span className="text-brass-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. AI Plain Language Summary Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[16px] bg-pine-900 text-dark-text p-8 lg:p-12 shadow-warm-lg grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-800 text-xs font-semibold text-pine-100 border border-pine-600/30">
              <Sparkles className="w-4 h-4 text-brass-500" />
              <span>Powered by Server-Side Gemini API</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
              Signers shouldn&apos;t need a lawyer to understand what they are signing.
            </h2>
            <p className="text-dark-text/90 text-base leading-relaxed">
              Before a signer executes, Gemini generates a plain-language summary highlighting key
              obligations, dates, penalties, and payment amounts — mapped directly to contract sections.
            </p>
            <div className="text-xs text-ink-faint italic">
              * AI summaries serve as reading aids and never replace legal counsel. Signing is never blocked if AI fails.
            </div>
          </div>

          {/* Mock Summary Card */}
          <div className="bg-surface text-ink rounded-[12px] p-6 shadow-warm-md border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-semibold text-sm text-pine-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-seal-600" />
                Plain-Language Contract Brief
              </span>
              <span className="text-xs font-mono bg-pine-100 text-pine-800 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
            <ul className="space-y-2.5 text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="text-pine-600 font-bold">•</span>
                <span><strong>Parties:</strong> Apex Commerce BD and Horizon Logistics Ltd.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pine-600 font-bold">•</span>
                <span><strong>Consideration:</strong> BDT ৳1,450,000 payable within 30 days of challan receipt (§4.2).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pine-600 font-bold">•</span>
                <span><strong>Term:</strong> 12 months with 30-day mutual notice for convenience (§8.1).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pine-600 font-bold">•</span>
                <span><strong>Dispute Resolution:</strong> Dhaka seat under Bangladesh Arbitration Act 2001.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Ready to Sign Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-8">
        <WaxSeal size={72} className="mx-auto" />
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
          Ready to streamline your contracts?
        </h2>
        <p className="text-ink-soft max-w-xl mx-auto">
          Create an account in 30 seconds. No credit card required. Free tier includes 5 envelopes every month.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button variant="sign" size="lg" className="px-8 h-12">
              Create Free Account
            </Button>
          </Link>
          <Link href="/legal">
            <Button variant="outline" size="lg" className="px-6 h-12">
              Read ICT Act 2006 Legal Guide
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
