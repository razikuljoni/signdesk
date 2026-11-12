'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
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
  AlertCircle
} from 'lucide-react';

export default function SignLandingPage() {
  const params = useParams();
  const router = useRouter();
  const token = (params.token as string) || '';

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function verifySession() {
      try {
        const data = await apiFetch(`/sign/${token}`);
        if (data.status === 'voided') {
          router.push(`/sign/${token}/voided`);
          return;
        }
        if (data.status === 'declined') {
          router.push(`/sign/${token}/declined`);
          return;
        }
        if (data.status === 'already_signed') {
          router.push(`/sign/${token}/already-signed`);
          return;
        }
        if (data.status === 'expired') {
          router.push(`/sign/${token}/expired`);
          return;
        }
        setSession(data);
      } catch (err: any) {
        console.error('Failed to verify signing session:', err);
        setError(err.message || 'Invalid or expired signing link');
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token, router]);

  const handleDecline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!declineReason.trim()) return;

    setIsDeclining(true);
    try {
      await apiFetch(`/sign/${token}/decline`, {
        method: 'POST',
        body: JSON.stringify({
          reasonPreset: 'OTHER',
          reasonText: declineReason.trim(),
        }),
      });
      router.push(`/sign/${token}/declined`);
    } catch (err: any) {
      console.error('Failed to decline envelope:', err);
      setError(err.message || 'Failed to submit declination');
      setIsDeclining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <WaxSeal size={48} className="animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-soft">Verifying cryptographic signing token...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full text-center space-y-4 shadow-warm">
          <XCircle className="w-12 h-12 text-danger mx-auto" />
          <h2 className="font-serif text-xl font-bold text-pine-900">Signing Link Unavailable</h2>
          <p className="text-xs text-ink-soft">{error || 'This signing link is invalid or has expired.'}</p>
          <Link href="/">
            <button className="px-4 py-2 rounded-lg bg-pine-900 text-paper text-xs font-semibold">
              Return to Homepage
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (session.status === 'pending_turn') {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full text-center space-y-4 shadow-warm">
          <Clock className="w-12 h-12 text-amber-600 mx-auto" />
          <h2 className="font-serif text-xl font-bold text-pine-900">Pending Prior Signer</h2>
          <p className="text-xs text-ink-soft">
            This document enforces sequential signing under the Bangladesh ICT Act 2006. Previous signers must complete their execution before your turn opens.
          </p>
          <div className="p-3 bg-paper rounded-lg border border-border text-xs font-mono text-pine-900">
            {session.envelopeTitle}
          </div>
          <p className="text-[11px] text-ink-faint">You will receive an automated notification as soon as your turn begins.</p>
        </div>
      </div>
    );
  }

  const signerName = session.recipientName || 'Authorized Signatory';
  const signerRole = session.recipientRole || 'Signer';
  const signerEmail = session.recipientEmail || '';
  const senderName = session.senderName || 'Document Sender';
  const documentTitle = session.envelopeTitle || 'Document for Signature';
  const envelopeId = session.envelopeId || token.slice(0, 12);
  const expiresDate = session.expiresAt
    ? new Date(session.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '14 days';

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
          <span className="text-xs font-mono text-ink-faint hidden sm:inline">Dhaka Sovereign Node</span>
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
                VERIFIED RECIPIENT
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pine-900 text-paper font-serif font-bold text-sm flex items-center justify-center shrink-0">
                {signerName.slice(0, 2).toUpperCase()}
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
                <span className="text-pine-900 font-semibold">{envelopeId.slice(0, 14)}</span>
              </div>
              <div className="text-right">
                <span className="text-ink-faint">Expires: </span>
                <span className="text-amber-800 font-semibold">{expiresDate}</span>
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
        Simple Electronic Signature under Bangladesh ICT Act 2006 • Tamper-Evident SHA-256 Audit Trail
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
                  placeholder="e.g. Terms require revision before execution..."
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeclineModal(false)}
                  disabled={isDeclining}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeclining || !declineReason.trim()}
                  className="px-4 py-1.5 rounded-lg bg-danger text-paper text-xs font-semibold hover:bg-danger/90 disabled:opacity-50"
                >
                  {isDeclining ? 'Submitting...' : 'Confirm Declination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
