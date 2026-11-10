'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Ban,
  FileText,
  Mail,
  ArrowLeft,
  ShieldOff,
} from 'lucide-react';

export default function SignVoidedPage() {
  const params = useParams();
  const token = params.token as string;

  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const documentTitle = 'Mutual Non-Disclosure Agreement — Horizon Logistics';
  const senderName = 'Tanvir Ahmed (Apex Commerce BD)';
  const senderEmail = 'tanvir@apex-commerce.bd';

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-seal-600 flex items-center justify-center text-white text-xs font-bold">
            •
          </div>
          <span className="font-body font-bold text-lg text-pine-900">SignDesk</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-danger bg-danger/10 px-2.5 py-1 rounded-full border border-danger/20 font-semibold">
          <ShieldOff className="w-3.5 h-3.5" />
          <span>Envelope Voided</span>
        </div>
      </div>

      {/* Main Voided Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <Card className="bg-surface border-border shadow-warm-md p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto border border-danger/20">
            <Ban className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-danger">
              Execution Cancelled
            </span>
            <h1 className="font-display text-3xl font-bold text-pine-900">
              Envelope Has Been Voided
            </h1>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              The sender voided this envelope. Under Bangladesh legal evidentiary rules, all prior actions, tokens, and partial signatures for this workflow are now null and void.
            </p>
          </div>

          {/* Voided Details */}
          <div className="bg-surface-raised border border-border rounded-[8px] p-5 text-left space-y-3 text-xs">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pine-600" />
                {documentTitle}
              </span>
              <span className="text-[11px] font-mono text-danger font-semibold">Status: Voided</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-ink-faint block">Recipient:</span>
                <strong className="text-pine-900 text-sm">{signerName}</strong>
              </div>
              <div>
                <span className="text-ink-faint block">Voided By Sender:</span>
                <strong className="text-pine-900 text-sm">{senderName}</strong>
                <span className="text-[11px] font-mono text-ink-soft block">{senderEmail}</span>
              </div>
            </div>

            <div className="p-3 bg-paper rounded border border-border mt-2 space-y-1">
              <span className="text-ink-faint block font-semibold">Sender&apos;s Void Reason:</span>
              <p className="text-ink italic">
                &ldquo;Commercial terms updated in newer version. Please discard this link.&rdquo;
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <a href={`mailto:${senderEmail}?subject=Question%20about%20voided%20envelope`} className="w-full block">
              <Button variant="outline" size="lg" className="w-full text-xs font-bold">
                <Mail className="w-4 h-4 mr-2" />
                Contact Sender
              </Button>
            </a>

            <Link href="/" className="w-full block">
              <Button variant="ghost" size="sm" className="w-full text-xs text-ink-soft">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Return to SignDesk Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-ink-faint border-t border-border pt-4">
        SignDesk • Secure Bangladeshi E-Signature Platform
      </div>
    </div>
  );
}
