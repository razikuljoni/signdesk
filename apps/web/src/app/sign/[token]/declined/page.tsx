'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  XCircle,
  FileText,
  Mail,
  ArrowLeft,
  AlertTriangle,
  Scale,
  Clock,
  Phone,
  Building2,
} from 'lucide-react';

export default function SignDeclinedPage() {
  const params = useParams();
  const token = (params.token as string) || 'demo_token';

  const targetDoc = 'Rahim Traders — Commercial Supply Agreement (#ENV-BD-2024-8849-ICT)';
  const decliningSignatory = 'Tanvir Ahmed (Managing Director, Meghna Distribution Corp.)';
  const timestamp = '24 Oct 2024, 11:30:15 BST';
  const rejectionGrounds =
    'Clause 14 indemnity needs revision — liability cap needs to align with bilateral 5% agreement rather than unilateral indemnification';
  const senderContact = {
    name: 'Ayesha Rahman',
    email: 'ayesha.rahman@rahimtraders.com',
    phone: '+880 1711-884920',
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-vermilion bg-vermilion/10 px-2.5 py-1 rounded-full border border-vermilion/30 font-semibold font-mono">
          <XCircle className="w-3.5 h-3.5" />
          <span>DECLINATION RECORDED</span>
        </div>
      </div>

      {/* Main Declined Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center mx-auto border border-vermilion/30">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              Signatory Non-Assent Registered
            </span>
            <h1 className="font-serif text-3xl font-bold text-pine-900">
              This Envelope Was Declined
            </h1>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              Formal declination has been logged into the audit ledger under Section 7 of the Bangladesh ICT Act 2006.
            </p>
          </div>

          {/* Formal Declination Record */}
          <div className="p-5 rounded-xl bg-paper border border-border text-left space-y-3 text-xs">
            <div className="pb-2 border-b border-border font-serif font-bold text-pine-900 text-sm">
              Formal Declination Record
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Target Document:</span>
                <div className="font-mono text-xs text-pine-900 font-medium">{targetDoc}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Declining Signatory:</span>
                <div className="text-pine-900 font-semibold">{decliningSignatory}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Verbatim Rejection Grounds:</span>
                <blockquote className="italic font-serif text-ink-soft mt-0.5 border-l-2 border-vermilion pl-2.5">
                  &ldquo;{rejectionGrounds}&rdquo;
                </blockquote>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-faint">
                <span>Declination Timestamp:</span>
                <span className="text-pine-900 font-medium">{timestamp}</span>
              </div>
            </div>
          </div>

          {/* Actionable Next Steps & Contact Card */}
          <div className="p-4 rounded-xl bg-paper border border-border text-left space-y-2 text-xs">
            <div className="font-semibold text-pine-900">
              Sender Notified & Next Steps
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              Ayesha Rahman has been immediately notified via corporate email and WhatsApp with your exact comments. A revised agreement reflecting the updated indemnity clause will be re-issued for bilateral execution.
            </p>
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-soft">
              <div>Direct Contact: <strong className="text-pine-900">{senderContact.name}</strong></div>
              <div className="flex items-center gap-3">
                <a href={`mailto:${senderContact.email}`} className="text-pine-900 hover:underline">
                  {senderContact.email}
                </a>
                <span>•</span>
                <a href={`tel:${senderContact.phone}`} className="text-pine-900 hover:underline">
                  {senderContact.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link href="/dashboard" className="block">
              <button className="w-full py-3 px-6 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-bold text-xs shadow-warm transition-all">
                Return to SignDesk Home / Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Sovereign Audit Ledger • Event #DECLINE-BD-2024-8849
      </div>
    </div>
  );
}
