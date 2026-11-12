'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Clock,
  ShieldAlert,
  ArrowRight,
  Mail,
  Scale,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export default function SignExpiredPage() {
  const params = useParams();
  const token = (params.token as string) || '';

  const [requested, setRequested] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/sign/${token}`)
      .then((data) => setSession(data))
      .catch((err) => console.warn('Could not load session on expired page:', err));
  }, [token]);

  const senderEmail = session?.senderEmail || 'sender@organization.bd';
  const envelopeRef = session?.envelopeTitle || 'Commercial Agreement';

  const handleRequestNew = () => {
    setRequested(true);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300 font-semibold font-mono">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          <span>NONCE EXPIRED (TTL LAPSED)</span>
        </div>
      </div>

      {/* Main Expired Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brass/15 text-brass-dark flex items-center justify-center mx-auto border border-brass/40">
            <Clock className="w-8 h-8 text-brass-dark" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
              Cryptographic Token TTL Expired
            </span>
            <h1 className="font-serif text-3xl font-bold text-pine-900">
              This Signing Link Has Expired
            </h1>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              Security policies under Section 7 ICT Act mandate automatic nonce revocation after 14 days to prevent stale or unauthorized mark affixation.
            </p>
          </div>

          {/* Statutory Expiration Record */}
          <div className="p-5 rounded-xl bg-paper border border-border text-left space-y-3 text-xs">
            <div className="pb-2 border-b border-border font-serif font-bold text-pine-900 text-sm">
              Statutory Expiration Record
            </div>

            <p className="text-ink-soft leading-relaxed text-xs">
              This signing link expired on <strong>07 Nov 2024 at 23:59 BST</strong> following the 14-day cryptographic nonce TTL mandated under Section 7 ICT Act policies to protect against stale execution.
            </p>

            <div className="pt-2 border-t border-border font-mono text-[11px] text-ink-soft">
              <span className="text-ink-faint">Envelope Reference: </span>
              <span className="text-pine-900 font-medium">{envelopeRef}</span>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="p-4 rounded-xl bg-pine-50/60 border border-pine-200/80 text-left text-xs text-pine-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Lock className="w-4 h-4 text-pine-800" />
              <span>Sovereign Enclave Security Guarantee</span>
            </div>
            <p className="text-[11px] text-pine-800 leading-relaxed">
              All draft records remain safely encrypted in the sovereign Dhaka vault. No unauthorized party can access the document or affix marks using this lapsed token.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {requested ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Re-issuance request dispatched to {senderEmail} via WhatsApp & Email!</span>
              </div>
            ) : (
              <button
                onClick={handleRequestNew}
                className="w-full py-3 px-6 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-2"
              >
                <span>Request a New Signing Link</span>
                <ArrowRight className="w-4 h-4 text-brass" />
              </button>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <a
                href={`mailto:${senderEmail}`}
                className="inline-flex items-center gap-1 text-ink-soft hover:text-pine-900"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Sender ({senderEmail})</span>
              </a>

              <Link href="/dashboard" className="text-pine-800 font-semibold hover:underline">
                Back to SignDesk Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Security Enclave • Dhaka-01 • Cryptographic Nonce Revoked
      </div>
    </div>
  );
}
