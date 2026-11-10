'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  FileText,
  Mail,
  ExternalLink,
  ArrowRight,
  Lock,
} from 'lucide-react';

export default function SignDonePage() {
  const params = useParams();
  const token = params.token as string;

  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const signerEmail = isRahim ? 'rahim@horizon-logistics.bd' : 'karim@apex-commerce.bd';
  const roleName = isRahim ? 'Receiving Party Signatory' : 'Disclosing Party Signatory';
  const documentTitle = 'Mutual Non-Disclosure Agreement — Horizon Logistics';
  const sha256Digest = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span>Execution Verified</span>
        </div>
      </div>

      {/* Main Done Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <Card className="bg-surface border-border shadow-warm-md p-6 sm:p-10 space-y-8 text-center">
          <div className="space-y-4">
            <WaxSeal size={80} className="mx-auto animate-pulse" />
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pine-800 bg-pine-100 px-3 py-1 rounded-full border border-pine-500/20">
              <CheckCircle2 className="w-4 h-4 text-pine-700" />
              Signed & Sealed
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-pine-900 leading-tight">
              Agreement Executed
            </h1>
            <p className="text-sm text-ink-soft max-w-lg mx-auto">
              Your signature has been cryptographically recorded and chained under the legal framework of the <strong>Bangladesh Information and Communication Technology (ICT) Act 2006</strong>.
            </p>
          </div>

          {/* Execution Details Block */}
          <div className="bg-surface-raised border border-border rounded-[8px] p-5 text-left space-y-3 text-xs">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pine-600" />
                {documentTitle}
              </span>
              <span className="text-[11px] font-mono text-ink-faint">Executed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-ink-faint block">Signatory:</span>
                <strong className="text-pine-900 text-sm">{signerName}</strong>
                <span className="text-[11px] font-mono text-ink-soft block">{signerEmail}</span>
              </div>
              <div>
                <span className="text-ink-faint block">Signing Capacity / Role:</span>
                <strong className="text-pine-900 text-sm">{roleName}</strong>
                <span className="text-[11px] text-ink-soft block">Dhaka, Bangladesh</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-ink-faint font-mono text-[11px]">SHA-256 Audit Digest Fingerprint:</span>
                <button
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 text-[11px] text-pine-700 hover:text-pine-900 font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-pine-700" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-[11px] bg-paper p-2.5 rounded border border-border break-all text-ink select-all">
                {sha256Digest}
              </div>
            </div>
          </div>

          {/* Download & Security Notice */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-bold"
                onClick={() => alert('Downloading executed PDF with embedded signatures and cryptographic digest...')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Executed PDF
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-xs font-bold"
                onClick={() => alert('Downloading Certificate of Completion (CoC) audit trail PDF...')}
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Certificate of Completion
              </Button>
            </div>

            <div className="p-3 bg-paper rounded border border-border flex items-center justify-center gap-2 text-xs text-ink-soft">
              <Mail className="w-4 h-4 text-pine-600" />
              <span>A certified copy with audit certificate has been dispatched to <strong>{signerEmail}</strong>.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-ink-faint">
            <Link href={`/security`} className="hover:text-pine-900 underline flex items-center gap-1">
              Verify cryptographic Merkle hash <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/" className="hover:text-pine-900 underline">
              Return to SignDesk Home
            </Link>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-ink-faint border-t border-border pt-4">
        SignDesk • Legally binding under Bangladesh Information and Communication Technology (ICT) Act 2006.
      </div>
    </div>
  );
}
