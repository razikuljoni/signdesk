'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  FileText,
  Mail,
  Send,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function SignExpiredPage() {
  const params = useParams();
  const token = params.token as string;

  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const signerEmail = isRahim ? 'rahim@horizon-logistics.bd' : 'karim@apex-commerce.bd';
  const documentTitle = 'Mutual Non-Disclosure Agreement — Horizon Logistics';
  const senderName = 'Tanvir Ahmed (Apex Commerce BD)';
  const senderEmail = 'tanvir@apex-commerce.bd';

  const [requested, setRequested] = useState(false);

  const handleRequestNewLink = () => {
    setRequested(true);
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
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Security Expired</span>
        </div>
      </div>

      {/* Main Expired Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <Card className="bg-surface border-border shadow-warm-md p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Access Token Inactive
            </span>
            <h1 className="font-display text-3xl font-bold text-pine-900">
              This Signing Link Has Expired
            </h1>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              Under SignDesk security guidelines, all unexecuted signature invitations expire automatically after 14 days to prevent unauthorized later access.
            </p>
          </div>

          {/* Details */}
          <div className="bg-surface-raised border border-border rounded-[8px] p-5 text-left space-y-3 text-xs">
            <div className="border-b border-border pb-2 flex items-center justify-between">
              <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pine-600" />
                {documentTitle}
              </span>
              <span className="text-[11px] font-mono text-amber-800 font-semibold">Expired</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-ink-faint block">Designated Signatory:</span>
                <strong className="text-pine-900 text-sm">{signerName}</strong>
                <span className="text-[11px] font-mono text-ink-soft block">{signerEmail}</span>
              </div>
              <div>
                <span className="text-ink-faint block">Original Sender:</span>
                <strong className="text-pine-900 text-sm">{senderName}</strong>
                <span className="text-[11px] font-mono text-ink-soft block">{senderEmail}</span>
              </div>
            </div>
          </div>

          {/* Request Action */}
          <div className="space-y-3 pt-2">
            {!requested ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full text-xs font-bold"
                onClick={handleRequestNewLink}
              >
                <Send className="w-4 h-4 mr-2" />
                Request Fresh Signing Link from Sender
              </Button>
            ) : (
              <div className="p-4 bg-pine-100/60 border border-pine-500/30 rounded-lg text-xs text-pine-900 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pine-700" />
                <span>A notification has been sent to <strong>{senderEmail}</strong> to re-issue your link.</span>
              </div>
            )}

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
