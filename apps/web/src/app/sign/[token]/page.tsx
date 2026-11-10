'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Building2,
  CheckCircle2,
  ChevronRight,
  Scale,
  XCircle,
} from 'lucide-react';

export default function SignLandingPage() {
  const params = useParams();
  const router = useRouter();
  const token = (params.token as string) || 'demo_token';

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const signerName = 'Tanvir Ahmed';
  const signerRole = 'Managing Director, Meghna Distribution Corp.';
  const signerEmail = 't.ahmed@meghnadist.com';
  const senderName = 'Ayesha Rahman (Rahim Textiles & Trade Ltd.)';
  const documentTitle = 'Rahim Traders — Commercial Supply Agreement';
  const envelopeId = 'BD-2024-8849-ICT';
  const expiresDate = '28 Oct 2024, 23:59 BST (4 days remaining)';

  const handleDecline = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/sign/${token}/declined`);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>ICT Act 2006 Validated</span>
          </span>
          <span className="text-xs font-mono text-ink-faint">Dhaka Sovereign Node</span>
        </div>
      </div>

      {/* Main Signer Chamber Intake Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex justify-center">
              <WaxSeal size={56} className="shadow-warm" />
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-brass-dark font-semibold">
              Commercial Indenture & Electronic Execution Request
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-pine-900 leading-snug">
              {documentTitle}
            </h1>

            <p className="text-xs text-ink-soft max-w-md mx-auto">
              Initiated by <strong className="text-pine-900">{senderName}</strong> for formal commercial execution under Bangladesh e-Commerce law.
            </p>
          </div>

          {/* Signer Identity Callout */}
          <div className="p-4 rounded-xl bg-paper border border-border space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-[10px] font-mono uppercase text-ink-faint">Designated Signatory</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                NID 2FA READY
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pine-900 text-paper font-serif font-bold text-sm flex items-center justify-center">
                TA
              </div>
              <div>
                <div className="font-bold text-pine-900 text-sm">{signerName}</div>
                <div className="text-ink-soft text-[11px]">{signerRole}</div>
                <div className="font-mono text-ink-faint text-[10px] mt-0.5">{signerEmail}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border grid grid-cols-2 gap-2 text-[11px] font-mono text-ink-soft">
              <div>
                <span className="text-ink-faint">Envelope ID: </span>
                <span className="text-pine-900 font-semibold">{envelopeId}</span>
              </div>
              <div className="text-right">
                <span className="text-ink-faint">Validity: </span>
                <span className="text-amber-800">{expiresDate}</span>
              </div>
            </div>
          </div>

          {/* Statutory Comfort Box */}
          <div className="p-4 rounded-xl bg-pine-50/60 border border-pine-200/80 text-xs text-pine-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Scale className="w-4 h-4 text-pine-800" />
              <span>Section 7, ICT Act 2006 Statutory Assurance</span>
            </div>
            <p className="text-[11px] text-pine-800 leading-relaxed">
              Execution of this instrument generates an immutable SHA-256 Merkle chain compliant with Bangladesh Evidence Act 1872 admissibility requirements. No physical ink required.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link href={`/sign/${token}/review`} className="block">
              <button className="w-full py-3 px-6 rounded-xl bg-vermilion hover:bg-vermilion-hover text-paper font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2">
                <span>Review Document & AI Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => setShowDeclineModal(true)}
                className="text-ink-faint hover:text-vermilion transition-colors"
              >
                Decline to sign this agreement
              </button>

              <Link
                href={`/sign/${token}/sign`}
                className="text-pine-800 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Jump straight to Signing Canvas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Sovereign Bangladesh PKI Network • Regulated by Controller of Certifying Authorities (CCA)
      </div>

      {/* Decline Rejection Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-700">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-pine-900">
                  Decline to Sign
                </h3>
                <p className="text-xs text-ink-soft">
                  Provide formal reason for non-execution.
                </p>
              </div>
            </div>

            <form onSubmit={handleDecline} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">
                  Rejection Grounds (Required)
                </label>
                <textarea
                  required
                  rows={4}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Terms require revision before bilateral execution..."
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-vermilion hover:bg-vermilion-hover text-paper text-xs font-bold shadow-sm"
                >
                  Submit Declination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
