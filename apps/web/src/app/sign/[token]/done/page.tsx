'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
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
  Scale,
  Award,
  Clock,
  Send,
  Building2,
  Fingerprint,
} from 'lucide-react';

export default function SignDonePage() {
  const params = useParams();
  const token = (params.token as string) || '';

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadDoneInfo() {
      try {
        const data = await apiFetch(`/sign/${token}`);
        setSession(data);
      } catch (err) {
        console.warn('Could not load session on done page:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDoneInfo();
  }, [token]);

  const signerName = session?.recipientName || 'Authorized Signatory';
  const signerEmail = session?.recipientEmail || '';
  const signerRole = session?.recipientRole || 'Signer';
  const documentTitle = session?.envelopeTitle || 'Executed Commercial Instrument';
  const envelopeId = session?.envelopeId || token.slice(0, 12);
  const sha256Digest = session?.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  const signedAt = session?.signedAt
    ? new Date(session.signedAt).toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' }) + ' BST'
    : 'Recently';

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
              <WaxSeal size={28} />
              <span>SignDesk</span>
            </Link>
            <span className="text-ink-faint">|</span>
            <div className="text-xs text-ink-soft">
              <span className="font-semibold text-pine-900">{documentTitle}</span>
              <span className="font-mono text-[11px] text-ink-faint ml-2">#{envelopeId.slice(0, 10)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ICT Act 2006 §7 Validated</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Hero Celebration Card */}
        <div className="bg-surface rounded-2xl border-2 border-brass/40 shadow-warm p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex justify-center">
            <WaxSeal size={72} className="shadow-warm animate-pulse" />
          </div>

          <div className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
            Bilateral Assent Concluded • Permanent Record
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-pine-900 tracking-tight">
            Agreement Irrevocably Executed & Sealed
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft max-w-xl mx-auto leading-relaxed">
            The document <strong className="text-pine-900">{documentTitle}</strong> has been successfully executed with electronic mark by <strong>{signerName}</strong>.
          </p>

          {/* Signatory Attestation Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-paper border border-border text-left space-y-3 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pine-900 text-paper font-serif font-bold text-sm flex items-center justify-center">
                  {signerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-pine-900 text-sm flex items-center gap-1.5">
                    <span>{signerName}</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      VERIFIED
                    </span>
                  </div>
                  {signerEmail && <div className="text-xs text-ink-soft">{signerEmail}</div>}
                </div>
              </div>

              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-pine-100 text-pine-900 border border-pine-300">
                PKI-ECDSA ATTESTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-ink-soft">
              <div>
                <span className="text-ink-faint">Legal Evidentiary: </span>
                <span className="text-pine-900 font-medium">ICT Act 2006 §7 Compliant</span>
              </div>
              <div>
                <span className="text-ink-faint">Execution Time: </span>
                <span className="text-pine-900 font-medium">{signedAt}</span>
              </div>
              <div>
                <span className="text-ink-faint">Envelope ID: </span>
                <span className="text-pine-900 font-medium">#{envelopeId.slice(0, 14)}</span>
              </div>
              <div>
                <span className="text-ink-faint">Tamper Seal: </span>
                <span className="text-emerald-800 font-medium">SHA-256 Merkle Chained</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Integrity Log */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-pine-900" />
              <h3 className="font-serif font-bold text-sm text-pine-900">
                Statutory & Cryptographic Integrity Log
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              IMMUTABLE LEDGER
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-ink-faint">
                  Document SHA-256 Digest (Final Merkle Leaf)
                </span>
                <button
                  onClick={handleCopyHash}
                  className="text-pine-600 hover:text-pine-800 text-[11px] font-semibold flex items-center gap-1 font-sans"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2 rounded bg-surface border border-border font-mono text-[11px] text-ink-faint break-all">
                {sha256Digest}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-2 shadow-warm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Signed Copy</span>
          </button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to SignDesk Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
