'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  UserCheck,
  AlertOctagon,
  Lock,
  Calendar,
} from 'lucide-react';

export default function SignLandingPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [declineOpen, setDeclineOpen] = useState(false);
  const [reasonPreset, setReasonPreset] = useState('Incorrect details');
  const [reasonText, setReasonText] = useState('');

  // Sample signer session data
  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const signerEmail = isRahim ? 'rahim@horizon-logistics.bd' : 'karim@apex-commerce.bd';
  const senderName = 'Tanvir Ahmed (Apex Commerce BD)';
  const documentTitle = 'Mutual Non-Disclosure Agreement — Horizon Logistics';
  const expiresDate = '24 Nov 2026';

  const handleDecline = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/sign/${token}/declined`);
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Trust Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-seal-600 flex items-center justify-center text-white text-xs font-bold">
            •
          </div>
          <span className="font-body font-bold text-lg text-pine-900">SignDesk</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-pine-600 bg-pine-100 px-2.5 py-1 rounded-full border border-pine-500/20 font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>Secured Signer Portal</span>
        </div>
      </div>

      {/* Main Landing Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <Card className="bg-surface border-border shadow-warm-md p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-3">
            <WaxSeal size={64} className="mx-auto" />
            <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
              Electronic Signature Request
            </span>
            <h1 className="font-display text-3xl font-bold text-pine-900 leading-tight">
              {documentTitle}
            </h1>
            <p className="text-sm text-ink-soft">
              Sent by <strong>{senderName}</strong> for your review and execution.
            </p>
          </div>

          {/* Signer Identity Verification Block */}
          <div className="p-4 bg-surface-raised rounded-[8px] border border-border space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-pine-600" />
                Signatory Identity
              </span>
              <span className="text-[11px] font-mono text-ink-faint">No account required</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-ink-faint block">Full Name:</span>
                <strong className="text-pine-900">{signerName}</strong>
              </div>
              <div>
                <span className="text-ink-faint block">Email Address:</span>
                <strong className="text-pine-900 font-mono text-[11px]">{signerEmail}</strong>
              </div>
            </div>
          </div>

          {/* Document Properties */}
          <div className="grid grid-cols-2 gap-4 text-xs text-ink-soft pt-1">
            <div className="p-3 bg-paper rounded border border-border space-y-1">
              <span className="text-ink-faint block">Execution Validity:</span>
              <strong className="text-pine-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-pine-600" />
                Until {expiresDate}
              </strong>
            </div>
            <div className="p-3 bg-paper rounded border border-border space-y-1">
              <span className="text-ink-faint block">Legal Governance:</span>
              <strong className="text-pine-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pine-600" />
                ICT Act 2006 (Sec. 7)
              </strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <Link href={`/sign/${token}/review`} className="w-full block">
              <Button variant="sign" size="lg" className="w-full h-12 text-base font-bold">
                Review & Sign Agreement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setDeclineOpen(true)}
                className="text-xs text-ink-faint hover:text-danger underline transition-colors"
              >
                Decline to sign this agreement
              </button>
            </div>
          </div>
        </Card>

        {/* Decline Modal Dialog */}
        {declineOpen && (
          <div className="fixed inset-0 z-50 bg-pine-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-surface p-6 space-y-4">
              <div className="flex items-center gap-2 text-danger font-bold text-lg border-b border-border pb-3">
                <AlertOctagon className="w-5 h-5" />
                Decline to Sign Agreement
              </div>
              <p className="text-xs text-ink-soft">
                Declining will immediately notify the sender and cancel the agreement execution workflow.
              </p>

              <form onSubmit={handleDecline} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-ink">Reason for declining (required):</label>
                  <select
                    value={reasonPreset}
                    onChange={(e) => setReasonPreset(e.target.value)}
                    className="w-full p-2 border border-border rounded text-xs bg-surface"
                  >
                    <option value="Incorrect details">Incorrect commercial terms or details</option>
                    <option value="Do not agree to terms">Do not agree to contract terms</option>
                    <option value="Wrong person">I am not the intended signatory</option>
                    <option value="Other">Other reason</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-ink">Additional explanation:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details for the sender..."
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    className="w-full p-2 border border-border rounded text-xs bg-surface"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="outline" size="sm" onClick={() => setDeclineOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" size="sm">
                    Confirm Decline
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Notice */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-ink-faint border-t border-border pt-4">
        Protected by 256-bit SHA Merkle integrity chaining. Compliant with Bangladesh ICT Act 2006.
      </div>
    </div>
  );
}
