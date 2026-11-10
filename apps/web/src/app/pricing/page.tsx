'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Check,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Scale,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
            <WaxSeal size={28} />
            <span>SignDesk</span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/legal" className="text-ink-soft hover:text-pine-900">
              Legal Admissibility
            </Link>
            <Link href="/security" className="text-ink-soft hover:text-pine-900">
              Security Architecture
            </Link>
            <Link href="/signin">
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        {/* Hero & Value Proposition */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
            Transparent Pricing for Sovereign Commerce
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-pine-900 tracking-tight leading-tight">
            Transparent pricing for sovereign commerce.
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
            All plans billed natively in Bangladeshi Taka (BDT) with automated NBR-recognized Mushak-6.3 VAT invoices.
          </p>

          {/* Billing Frequency Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs font-semibold">
            <span className={!annual ? 'text-pine-900 font-bold' : 'text-ink-faint'}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-11 h-6 rounded-full bg-pine-900 p-1 flex items-center transition-colors relative"
              aria-label="Toggle annual billing"
            >
              <div
                className={`w-4 h-4 rounded-full bg-paper transition-transform ${
                  annual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={annual ? 'text-pine-900 font-bold flex items-center gap-1.5' : 'text-ink-faint'}>
              <span>Annual</span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Save 17% • 2 Months Free
              </span>
            </span>
          </div>
        </div>

        {/* Three Pricing Tier Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* 1. Free Explorer */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint tracking-wider">
                  Individual & Micro-Traders
                </span>
                <h3 className="font-serif text-2xl font-bold text-pine-900 mt-1">
                  Free Explorer
                </h3>
                <p className="text-xs text-ink-soft mt-1">
                  Individual traders and startup covenants needing legally binding e-signatures.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="font-serif text-3xl font-bold text-pine-900">৳0</div>
                <div className="text-[11px] font-mono text-ink-faint">Free forever • No credit card required</div>
              </div>

              <ul className="space-y-2.5 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>5 sealed envelopes per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>1 authorized sender user</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Standard email & WhatsApp signer delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>SHA-256 court-admissible audit certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Standard web community support</span>
                </li>
              </ul>
            </div>

            <Link href="/signup" className="block">
              <button className="w-full py-2.5 px-4 rounded-xl border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold shadow-subtle transition-all">
                Start Free Explorer
              </button>
            </Link>
          </div>

          {/* 2. Corporate Starter (Featured) */}
          <div className="bg-surface rounded-2xl border-2 border-pine-900 p-6 shadow-warm relative flex flex-col justify-between space-y-6">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-brass text-pine-950 shadow-sm uppercase tracking-wider">
              Most Popular in Dhaka Commerce
            </span>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-pine-800 font-semibold tracking-wider">
                  Commercial Entities
                </span>
                <h3 className="font-serif text-2xl font-bold text-pine-900 mt-1">
                  Corporate Starter
                </h3>
                <p className="text-xs text-ink-soft mt-1">
                  Growing RMG exporters, distributors, and logistics firms executing bilateral deeds.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="font-serif text-3xl font-bold text-pine-900">
                  {annual ? '৳1,249' : '৳1,499'}
                  <span className="text-xs font-normal font-sans text-ink-soft"> / month</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-800 font-semibold">
                  Billed in BDT with 5% VAT Mushak-6.3
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-ink">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <strong className="text-pine-900">50 sealed envelopes per month</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>5 team seats with RBAC delegated roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Porichoy National ID 2FA biometric verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Gemini AI bilingual legal summary extraction</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>10-year safe harbor sovereign archival</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Automated NBR Mushak-6.3 tax receipts</span>
                </li>
              </ul>
            </div>

            <Link href="/signup" className="block">
              <button className="w-full py-2.5 px-4 rounded-xl bg-vermilion hover:bg-vermilion-hover text-paper text-xs font-bold shadow-warm transition-all flex items-center justify-center gap-1.5">
                <span>Subscribe to Corporate Starter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* 3. Enterprise Pro */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint tracking-wider">
                  Conglomerates & Banks
                </span>
                <h3 className="font-serif text-2xl font-bold text-pine-900 mt-1">
                  Enterprise Pro
                </h3>
                <p className="text-xs text-ink-soft mt-1">
                  Commercial banks, NBFIs, and multi-facility industrial groups with custom workflows.
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="font-serif text-3xl font-bold text-pine-900">
                  {annual ? '৳3,299' : '৳3,999'}
                  <span className="text-xs font-normal font-sans text-ink-soft"> / month</span>
                </div>
                <div className="text-[11px] font-mono text-ink-faint">Custom volume tiers available</div>
              </div>

              <ul className="space-y-2.5 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <strong className="text-pine-900">Unlimited envelopes & team members</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Full REST API, webhooks & SDK access</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Sonali Bank e-Challan stamp duty integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Dedicated Dhaka enterprise account director</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>99.9% uptime SLA & custom legal indemnity</span>
                </li>
              </ul>
            </div>

            <Link href="/signup" className="block">
              <button className="w-full py-2.5 px-4 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all">
                Contact Enterprise Sales
              </button>
            </Link>
          </div>
        </div>

        {/* Domestic Settlement Strip */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-ink-soft">
            <CreditCard className="w-4 h-4 text-pine-900" />
            <span className="font-semibold text-pine-900">Domestic BDT Settlement Channels:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-faint">
            <span className="bg-paper px-2 py-0.5 rounded border border-border">bKash Merchant</span>
            <span className="bg-paper px-2 py-0.5 rounded border border-border">Nagad Direct</span>
            <span className="bg-paper px-2 py-0.5 rounded border border-border">Rocket</span>
            <span className="bg-paper px-2 py-0.5 rounded border border-border">Local Visa / Mastercard</span>
            <span className="bg-paper px-2 py-0.5 rounded border border-border">BEFTN / RTGS Corporate Bank Transfer</span>
          </div>
        </div>

        {/* FAQ Strip */}
        <div className="bg-surface rounded-xl border border-border p-8 shadow-subtle space-y-6">
          <h2 className="font-serif font-bold text-xl text-pine-900 text-center">
            Frequently Asked Commercial Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-pine-900">
                Do my counterparties need a paid SignDesk account to sign?
              </div>
              <p className="text-ink-soft leading-relaxed">
                No. Counterparties sign 100% free via authenticated magic link on any phone or desktop browser. Only the document sender requires an active workspace plan.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-pine-900">
                How does the 5% VAT deduction work on invoices?
              </div>
              <p className="text-ink-soft leading-relaxed">
                Under NBR guidelines for cloud software, SignDesk generates automated Mushak-6.3 tax challans for corporate accounts so your accounts department can claim VAT input credits.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-pine-900">
                What happens if our organization exceeds monthly envelope quotas?
              </div>
              <p className="text-ink-soft leading-relaxed">
                We never disrupt in-flight signatures. Overages on the Corporate Starter tier are billed at a flat ৳25 BDT per envelope on your next cycle, or you can upgrade instantly.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-pine-900">
                Are digital signatures on the Free plan admissible in Bangladesh courts?
              </div>
              <p className="text-ink-soft leading-relaxed">
                Yes. Every single envelope across all plans generates a Section 7 compliant SHA-256 Merkle chain and tamper-evident Certificate of Completion admissible in court.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
