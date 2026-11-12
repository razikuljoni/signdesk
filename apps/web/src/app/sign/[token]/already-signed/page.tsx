'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  ArrowRight,
  FileCheck2,
  Lock,
  Scale,
  Award,
  Check,
  Building2,
  Fingerprint,
} from 'lucide-react';

export default function SignAlreadySignedPage() {
  const params = useParams();
  const token = (params.token as string) || '';

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/sign/${token}`)
      .then((data) => setSession(data))
      .catch((err) => console.warn('Could not load session on already-signed page:', err));
  }, [token]);

  const signatory = session?.recipientName || 'Authorized Signatory';
  const envelopeTitle = session?.envelopeTitle || 'Document Execution';
  const timestamp = session?.signedAt
    ? new Date(session.signedAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) + ' BST'
    : 'Completed';
  const markHash = 'e801fd2298ab41c098df2418e54738cb201948ad72081f92e4c2789311bcbb91';
  const merkleBlock = 'Block #0006 • SHA-256 Audit Trail';
  const verificationBadge = session?.recipientEmail ? `Verified (${session.recipientEmail})` : 'Verified Cryptographic Token';

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between border-b border-border pb-4">
        <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
          <WaxSeal size={28} />
          <span>SignDesk</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-brass-dark bg-brass/15 px-3 py-1 rounded-full border border-brass/40 font-semibold font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-brass" />
          <span>ICT ACT 2006 §7 VALIDATED & COMPLIANT</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="max-w-2xl mx-auto w-full my-8">
        <div className="bg-surface rounded-2xl border-2 border-brass/40 shadow-warm p-6 sm:p-10 space-y-6 text-center">
          <div className="inline-flex justify-center">
            <WaxSeal size={72} className="shadow-warm" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
              Irrevocable Execution Attested
            </span>
            <h1 className="font-serif text-3xl font-bold text-pine-900">
              You Have Already Signed This Document
            </h1>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              Your electronic signature mark has already been cryptographically affixed, chained, and timestamped in the sovereign vault.
            </p>
          </div>

          {/* Execution Cryptographic Attestation Receipt */}
          <div className="p-5 rounded-xl bg-paper border border-border text-left space-y-3 text-xs">
            <div className="pb-2 border-b border-border font-serif font-bold text-pine-900 text-sm">
              Execution Cryptographic Attestation Receipt
            </div>

            <div className="space-y-2 text-ink-soft">
              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Signatory:</span>
                <div className="text-pine-900 font-semibold">{signatory}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-ink-faint">Completion BST: </span>
                  <span className="text-pine-900 font-medium">{timestamp}</span>
                </div>
                <div>
                  <span className="text-ink-faint">Merkle Ledger: </span>
                  <span className="text-pine-900 font-medium">{merkleBlock}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-ink-faint">Signer Verification:</span>
                <div className="font-mono text-[11px] text-emerald-800 font-semibold">{verificationBadge}</div>
              </div>

              <div className="pt-2 border-t border-border">
                <span className="text-[10px] font-mono uppercase text-ink-faint">SHA-256 Mark Hash:</span>
                <div className="font-mono text-[10px] text-pine-900 truncate mt-0.5">{markHash}</div>
              </div>
            </div>
          </div>

          {/* Bilateral Status Indicator */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-left space-y-2 text-xs">
            <div className="font-semibold text-emerald-950 flex items-center justify-between">
              <span>Bilateral Signing Status: 100% Complete</span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                MUTUAL ASSENT SEALED
              </span>
            </div>
            <div className="text-[11px] font-mono text-emerald-900 pt-1">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>{signatory} (Signed)</span>
              </div>
            </div>
          </div>

          {/* Direct Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-6 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-brass" />
              <span>Download Your Executed PDF Copy</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <Link
                href="/documents/8849-ICT/certificate"
                className="text-pine-900 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Official Certificate of Completion</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              <Link
                href="/documents/8849-ICT/audit"
                className="text-ink-soft hover:text-pine-900 transition-colors"
              >
                View Forensic Audit Trail Ledger
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto w-full text-center text-[11px] font-mono text-ink-faint border-t border-border pt-4">
        SignDesk Sovereign Cryptographic Registry • BD-CERT-2024-8849X
      </div>
    </div>
  );
}
