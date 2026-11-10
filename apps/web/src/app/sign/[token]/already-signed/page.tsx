'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CheckCircle2,
  Download,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export default function SignAlreadySignedPage() {
  const params = useParams();
  const token = params.token as string;

  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const signerEmail = isRahim ? 'rahim@horizon-logistics.bd' : 'karim@apex-commerce.bd';
  const documentTitle = 'Mutual Non-Disclosure Agreement — Horizon Logistics';
  const signedAt = '10 Nov 2026, 03:45 PM BST';

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
        <div className="flex items-center gap-1.5 text-xs text-pine-600 bg-pine-100 px-2.5 py-1 rounded-full border border-pine-500/20 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Already Executed</span>
        </div>
      </div>

      {/* Main Already Signed Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <Card className="bg-surface border-border shadow-warm-md p-6 sm:p-10 space-y-6 text-center">
          <WaxSeal size={72} className="mx-auto" />

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pine-700 bg-pine-100 px-3 py-1 rounded-full">
              Signature on File
            </span>
            <h1 className="font-display text-3xl font-bold text-pine-900">
              You Have Already Signed
            </h1>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              Your electronic signature for this agreement was securely submitted and chained on <strong>{signedAt}</strong>. No further action is required from you.
            </p>
          </div>

          {/* Details */}
          <div className="bg-surface-raised border border-border rounded-[8px] p-5 text-left space-y-3 text-xs">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pine-600" />
                {documentTitle}
              </span>
              <span className="text-[11px] font-mono text-pine-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-pine-600" />
                Signed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-ink-faint block">Signatory:</span>
                <strong className="text-pine-900 text-sm">{signerName}</strong>
                <span className="text-[11px] font-mono text-ink-soft block">{signerEmail}</span>
              </div>
              <div>
                <span className="text-ink-faint block">Execution Timestamp:</span>
                <strong className="text-pine-900 text-sm">{signedAt}</strong>
                <span className="text-[11px] text-ink-soft block">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-bold"
                onClick={() => alert('Downloading your copy of the executed document...')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Executed PDF
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xs font-bold"
                onClick={() => alert('Downloading Certificate of Completion...')}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Audit Certificate
              </Button>
            </div>

            <div className="pt-2">
              <Link href={`/sign/${token}/done`} className="text-xs text-pine-700 hover:text-pine-900 underline">
                View execution confirmation receipt
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-faint">
            <Link href="/security" className="hover:text-pine-900 underline flex items-center gap-1">
              Verify cryptographic integrity <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/" className="hover:text-pine-900 underline">
              Return to SignDesk Home
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
