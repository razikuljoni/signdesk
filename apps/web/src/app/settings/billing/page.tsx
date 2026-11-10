'use client';

import React from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CreditCard,
  CheckCircle2,
  FileText,
  Download,
  Receipt,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function BillingSettingsPage() {
  return (
    <AuthGuard>
      <BillingSettingsContent />
    </AuthGuard>
  );
}

function BillingSettingsContent() {
  const invoices = [
    {
      mushakNo: 'MUSHAK-6.3-2024-10-884',
      date: '24 Oct 2024',
      tier: 'Corporate Starter Tier',
      baseBDT: '৳ 1,427.62',
      vat5BDT: '৳ 71.38',
      totalBDT: '৳ 1,499.00',
      status: 'Paid (bKash Auto-Debit)',
    },
    {
      mushakNo: 'MUSHAK-6.3-2024-09-512',
      date: '24 Sep 2024',
      tier: 'Corporate Starter Tier',
      baseBDT: '৳ 1,427.62',
      vat5BDT: '৳ 71.38',
      totalBDT: '৳ 1,499.00',
      status: 'Paid (bKash Auto-Debit)',
    },
  ];

  const handleDownloadInvoice = (mushakNo: string) => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-pine-900">
              Workspace Settings
            </h1>
            <p className="text-xs text-ink-soft mt-0.5">
              Subscription tiers, local BDT settlements, and statutory Mushak-6.3 VAT tax invoices.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brass/15 text-brass-dark border border-brass/40">
            CORPORATE STARTER TIER
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Subscription Overview Card */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase text-brass-dark font-bold">
                  Active Subscription
                </span>
                <h3 className="font-serif font-bold text-xl text-pine-900 mt-0.5">
                  Corporate Starter Tier
                </h3>
                <div className="text-xs font-mono text-ink-soft mt-0.5">
                  ৳ 1,499 BDT / month (VAT Inclusive)
                </div>
              </div>

              <Link href="/pricing">
                <button className="px-3.5 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-1">
                  <span>Change Tier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brass" />
                </button>
              </Link>
            </div>

            {/* Quota Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-pine-900">
                  Monthly Allowance: 28 of 50 Envelopes Used (56%)
                </span>
                <span className="font-mono text-ink-faint text-[11px]">22 Remaining</span>
              </div>
              <div className="w-full bg-paper border border-border rounded-full h-2.5 overflow-hidden">
                <div className="bg-pine-900 h-full rounded-full" style={{ width: '56%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-paper border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
              <div>
                <span className="text-ink-faint">Next Billing Date: </span>
                <span className="text-pine-900 font-semibold">24 November 2024</span>
              </div>
              <div className="text-emerald-800 font-medium">
                Payment Channel: bKash Corporate Merchant Auto-Debit (••••9120)
              </div>
            </div>
          </div>

          {/* Mushak-6.3 VAT Tax Invoicing Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  National Board of Revenue (NBR) Mushak-6.3 Tax Invoices
                </h3>
                <p className="text-[11px] text-ink-soft">
                  Official statutory VAT deduction challans automatically generated per billing cycle.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                5% VAT RECOGNIZED
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper/70 text-ink-soft border-b border-border font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Mushak-6.3 Ref</th>
                    <th className="py-2.5 px-4">Billing Date</th>
                    <th className="py-2.5 px-4">Base (BDT)</th>
                    <th className="py-2.5 px-4">5% VAT</th>
                    <th className="py-2.5 px-4">Total</th>
                    <th className="py-2.5 px-4 text-right">Challan PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono text-[11px]">
                  {invoices.map((inv) => (
                    <tr key={inv.mushakNo} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-pine-900">
                        {inv.mushakNo}
                      </td>
                      <td className="py-3 px-4 text-ink-soft">{inv.date}</td>
                      <td className="py-3 px-4 text-ink-soft">{inv.baseBDT}</td>
                      <td className="py-3 px-4 text-emerald-800 font-medium">{inv.vat5BDT}</td>
                      <td className="py-3 px-4 font-bold text-pine-900">{inv.totalBDT}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(inv.mushakNo)}
                          className="px-2.5 py-1 rounded border border-border bg-paper hover:bg-surface text-pine-900 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3 text-ink-soft" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
