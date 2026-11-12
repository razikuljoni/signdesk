'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Ban,
  FileText,
  Mail,
  ArrowLeft,
  ShieldOff,
  Scale,
  Clock,
  Building2,
  Lock,
} from 'lucide-react';

export default function SignVoidedPage() {
  const params = useParams();
  const token = (params.token as string) || '';

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/sign/${token}`)
      .then((data) => setSession(data))
      .catch((err) => console.warn('Could not load session on voided page:', err));
  }, [token]);

  const targetEnvelope = session?.envelopeTitle || 'Commercial Agreement';
  const revokingAuthority = 'Document Sender';
  const formalReason = 'Envelope has been voided by the originator.';
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) + ' BST';
  const senderEmail = session?.senderEmail || 'sender@signdesk.bd';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-vermilion bg-vermilion/10 px-2.5 py-1 rounded-full border border-vermilion/30 font-semibold font-mono">
          <ShieldOff className="w-3.5 h-3.5" />
          <span>REVOCATION REGISTERED</span>
        </div>
      </div>

      {/* Main Voided Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-6 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-vermilion/10 text-vermilion flex items-center justify-center mx-auto border border-vermilion/30">
            <Ban className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-vermilion font-bold">
              Execution Nullified • Nonce Cancelled
            </span>
            <h1 className="font-serif text-3xl font-bold text-pine-900">
              This Envelope Was Voided by the Sender
            </h1>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              The initiator has cancelled this execution workflow. All pending signature tokens have been revoked.
            </p>
          </div>

          {/* Revocation Particulars Card */}
          <div className="p-5 rounded-xl bg-paper border border-border text-left space-y-3 text-xs">
            <div className="pb-2 border-b border-border font-serif font-bold text-pine-900 text-sm">
              Revocation Particulars & Formal Record
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Revoking Authority:</span>
                <div className="text-pine-900 font-semibold">{revokingAuthority}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Target Instrument:</span>
                <div className="font-mono text-xs text-pine-900">{targetEnvelope}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Formal Stated Reason:</span>
                <blockquote className="italic font-serif text-ink-soft mt-0.5 border-l-2 border-vermilion pl-2.5">
                  &ldquo;{formalReason}&rdquo;
                </blockquote>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-faint">
                <span>Revocation BST Timestamp:</span>
                <span className="text-pine-900 font-medium">{timestamp}</span>
              </div>
            </div>
          </div>

          {/* Plain-Language Legal Comfort */}
          <div className="p-4 rounded-xl bg-pine-50/60 border border-pine-200/80 text-left text-xs text-pine-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <Scale className="w-4 h-4 text-pine-800" />
              <span>Statutory Notice & Zero Legal Liability</span>
            </div>
            <p className="text-[11px] text-pine-800 leading-relaxed">
              Zero legal liability accrues to recipients. Any partial tokens or preliminary initial marks have been permanently struck from execution. Immutable draft logs are preserved for 7 years under statutory audit rules.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Link href="/dashboard" className="block">
              <button className="w-full py-3 px-6 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-bold text-xs shadow-warm transition-all">
                Return to SignDesk Home / Dashboard
              </button>
            </Link>

            <a
              href={`mailto:${senderEmail}`}
              className="inline-flex items-center gap-1.5 text-xs text-pine-900 font-semibold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Initiator ({senderEmail})</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Sovereign Cloud • Audit Proof #VOID-BD-2024-8849
      </div>
    </div>
  );
}
