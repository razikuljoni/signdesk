'use client';

import React from 'react';
import Link from 'next/link';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileQuestion,
  ArrowLeft,
  Home,
  ShieldCheck,
  Mail,
  AlertCircle,
} from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>
        <span className="text-xs font-mono text-ink-faint">Error 404 • Vault Lookup Failed</span>
      </div>

      {/* Main 404 Parchment Card */}
      <div className="max-w-xl mx-auto w-full my-12">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-8 sm:p-10 text-center space-y-6">
          <div className="inline-flex justify-center relative">
            <WaxSeal size={72} className="shadow-warm opacity-80" />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-vermilion text-paper flex items-center justify-center font-bold text-xs shadow-sm">
              ?
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
              Cryptographic Record Lookup
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-pine-900">
              Instrument Not Found
            </h1>
            <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
              This envelope or document link could not be located in the sovereign vault. It may have expired, been voided by the initiator, or the URL token was mistyped.
            </p>
          </div>

          {/* Reassurance Note */}
          <div className="p-4 rounded-xl bg-pine-50/60 border border-pine-200 text-left text-xs text-pine-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pine-800" />
              <span>Sovereign Enclave Guarantee</span>
            </div>
            <p className="text-[11px] text-pine-800 leading-relaxed">
              All existing and previously sealed records in your workspace remain secure, encrypted, and tamper-proof under Bangladesh ICT Act 2006 protocols.
            </p>
          </div>

          {/* Initiator Assistance Card */}
          <div className="p-3.5 rounded-xl bg-paper border border-border text-left text-xs text-ink-soft flex items-start gap-2.5">
            <Mail className="w-4 h-4 text-pine-900 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Were you sent a signing invitation?</strong> Please contact the document sender or issuing entity to request a fresh, authenticated magic link.
            </p>
          </div>

          {/* Action Navigation Buttons */}
          <div className="space-y-3 pt-2">
            <Link href="/dashboard" className="block">
              <button className="w-full py-3 px-6 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-2">
                <span>Go to Workspace Dashboard</span>
                <Home className="w-4 h-4 text-brass" />
              </button>
            </Link>

            <Link href="/" className="inline-block text-xs font-semibold text-pine-900 hover:underline">
              ← Back to SignDesk Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Sovereign PKI Network • Dhaka Node 01
      </div>
    </div>
  );
}
