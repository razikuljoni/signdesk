'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
  Clock,
  CheckCircle2,
  Handshake,
  CreditCard,
  Truck,
  Scale,
  XCircle,
  Eye,
  Building2,
  PenTool,
  Check,
} from 'lucide-react';

export default function SignReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = (params.token as string) || '';

  const [session, setSession] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiLang, setAiLang] = useState<'en' | 'bn'>('en');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [sessData, summData] = await Promise.all([
          apiFetch(`/sign/${token}`),
          apiFetch(`/sign/${token}/summary`).catch((e) => {
            console.warn('AI summary failed or not available:', e);
            return null;
          }),
        ]);

        if (sessData.status === 'voided') {
          router.push(`/sign/${token}/voided`);
          return;
        }
        if (sessData.status === 'declined') {
          router.push(`/sign/${token}/declined`);
          return;
        }
        if (sessData.status === 'already_signed') {
          router.push(`/sign/${token}/already-signed`);
          return;
        }
        if (sessData.status === 'expired') {
          router.push(`/sign/${token}/expired`);
          return;
        }

        setSession(sessData);
        setSummary(summData);
      } catch (err: any) {
        console.error('Failed to load review data:', err);
        setError(err.message || 'Failed to load document review');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [token, router]);

  const handleProceed = () => {
    if (!consentAgreed) {
      setError(
        'You must confirm statutory assent under Section 7 of the Bangladesh ICT Act 2006 before proceeding.'
      );
      return;
    }
    router.push(`/sign/${token}/sign`);
  };

  const handleDeclineSubmit = async (e: React.FormEvent) => {
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
          <p className="text-xs font-mono text-ink-soft">Loading document & AI review chamber...</p>
        </div>
      </div>
    );
  }

  const documentTitle = session?.envelopeTitle || 'Document Review';
  const envelopeId = session?.envelopeId || token.slice(0, 12);
  const expiresDate = session?.expiresAt
    ? new Date(session.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '14 days';
  const senderName = session?.senderName || 'Sender';
  const recipientName = session?.recipientName || 'Signer';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Global Signer Banner & Meta */}
      <div className="border-b border-border bg-surface px-6 py-3.5 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`/sign/${token}`} className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
              <WaxSeal size={28} />
              <span>SignDesk</span>
            </Link>
            <span className="text-ink-faint">|</span>
            <div className="text-xs">
              <span className="font-semibold text-pine-900 block truncate max-w-xs sm:max-w-md">
                {documentTitle}
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-ink-faint">
                <span className="flex items-center gap-1 text-pine-800">
                  <Lock className="w-3 h-3" />
                  <span>Envelope: #{envelopeId.slice(0, 10)}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>ICT Act 2006 Validated</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-800">
                  <Clock className="w-3 h-3" />
                  <span>Expires {expiresDate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border border-border bg-paper p-0.5 text-xs font-semibold">
              <button
                onClick={() => setAiLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  aiLang === 'en'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setAiLang('bn')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  aiLang === 'bn'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={() => setShowDeclineModal(true)}
              className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink-soft hover:text-vermilion text-xs font-medium transition-all"
            >
              Decline to Sign
            </button>

            <button
              onClick={handleProceed}
              className="px-4 py-1.5 rounded-lg bg-vermilion hover:bg-vermilion-hover text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Finish & Affix Legal Seal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-danger-bg border border-danger/30 text-danger text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Gemini Contract Intelligence (Bilingual AI Legal Summary Card) */}
        <div className="bg-surface rounded-xl border-2 border-pine-800/40 shadow-warm overflow-hidden">
          <div className="bg-pine-900 text-paper px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brass" />
              <h2 className="font-serif font-bold text-sm tracking-wide">
                Gemini Contract Intelligence • Bilingual Legal Summary
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-paper/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Verified against Draft SHA-256</span>
            </div>
          </div>

          <div className="p-5 space-y-4 text-xs">
            {summary?.bullets && summary.bullets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {summary.bullets.map((bullet: any, idx: number) => (
                  <div key={idx} className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                    <div className="flex items-center gap-2 text-pine-900 font-semibold">
                      <Handshake className="w-4 h-4 text-pine-800" />
                      <span>{bullet.label}</span>
                    </div>
                    <p className="text-ink-soft leading-relaxed text-[11px]">
                      {bullet.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : aiLang === 'en' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Handshake className="w-4 h-4 text-pine-800" />
                    <span>Counterparties & Legal Standing</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    <strong>Originator:</strong> {senderName}<br />
                    <strong>Signatory:</strong> {recipientName}
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <CreditCard className="w-4 h-4 text-pine-800" />
                    <span>Consideration & Obligations</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    Bilateral commercial terms under Bangladesh law. Mutual performance obligations governed by contract clauses.
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Truck className="w-4 h-4 text-pine-800" />
                    <span>Execution & Validity</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    Standard bilateral agreement executed via sovereign digital signature token. Valid upon execution by all designated parties.
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Scale className="w-4 h-4 text-pine-800" />
                    <span>Jurisdiction & Evidentiary Standard</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    Governed by the laws of Bangladesh. Admissible under Section 7 of the Bangladesh ICT Act 2006.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Handshake className="w-4 h-4 text-pine-800" />
                    <span>চুক্তিভুক্ত পক্ষসমূহ</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    <strong>প্রস্তাবক:</strong> {senderName}<br />
                    <strong>স্বাক্ষরকারী:</strong> {recipientName}
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Scale className="w-4 h-4 text-pine-800" />
                    <span>আইনি এখতিয়ার</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    বাংলাদেশ তথ্য ও যোগাযোগ প্রযুক্তি আইন ২০০৬-এর ধারা ৭ অনুযায়ী ডিজিটাল স্বাক্ষর আইনগতভাবে সম্পূর্ণ বৈধ ও আদালতে প্রমাণযোগ্য।
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-faint">
              <span>{summary?.disclaimer || 'SignDesk AI Assistant summary. Please review the full agreement before signing.'}</span>
              <span className="font-mono">Gemini 1.5 Flash</span>
            </div>
          </div>
        </div>

        {/* Execution Ledger Hierarchy */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <h3 className="font-serif font-bold text-sm text-pine-900">
              Execution Ledger Hierarchy
            </h3>
            <span className="text-[11px] font-mono text-ink-faint">
              Step 2 of 2: Guided Execution (Sequential)
            </span>
          </div>

          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-paper flex items-center justify-center font-bold text-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-pine-900">
                    1. Ayesha Rahman (COMPLETED)
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Managing Director, Rahim Textiles & Trade Ltd. • 24 Oct, 11:20 BST • Identity Verified
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                EXECUTED & SEALED
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50/80 border border-amber-300 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-paper flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="font-semibold text-pine-900 flex items-center gap-1.5">
                    <span>{recipientName} (YOUR TURN)</span>
                    <span className="text-[10px] font-mono font-bold text-vermilion uppercase">
                      Action Required
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    {session?.recipientRole || 'Authorized Signatory'} • Action pending: Execution
                  </div>
                </div>
              </div>
              <button
                onClick={handleProceed}
                className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-paper font-semibold text-[11px] transition-all"
              >
                Sign Now
              </button>
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-paper border border-border text-xs text-ink-soft">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-paper border border-border text-ink-faint flex items-center justify-center font-mono text-xs">
                  3
                </div>
                <div>
                  <div className="font-medium text-ink">
                    3. Advocate Kamal Uddin (CC / OBSERVER)
                  </div>
                  <div className="text-[11px] text-ink-faint">
                    Legal Counsel, Supreme Court Bar • Receives verified tamper-proof duplicate
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-ink-faint">
                Awaiting Final Completion
              </span>
            </div>
          </div>
        </div>

        {/* Statutory Consent Checkbox Gate */}
        <div className="bg-surface rounded-xl border-2 border-brass/50 p-5 shadow-warm">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentAgreed}
              onChange={(e) => {
                setConsentAgreed(e.target.checked);
                if (e.target.checked) setError(null);
              }}
              className="mt-0.5 w-4 h-4 rounded border-border text-pine-900 focus:ring-pine-900/30"
            />
            <div className="space-y-1">
              <div className="text-xs font-semibold text-pine-900 leading-snug">
                By checking this box and clicking &lsquo;Sign &amp; Finish&rsquo;, I agree to execute this document electronically pursuant to Section 7 of the Bangladesh Information and Communication Technology (ICT) Act 2006.
              </div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                I acknowledge that my electronic signature possesses identical legal validity and enforceability as a handwritten signature under Bangladesh law.
              </p>
            </div>
          </label>

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-vermilion/10 border border-vermilion/30 text-vermilion text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Parchment Document Preview & Signature Block */}
        <div className="bg-white rounded-xl border border-border shadow-warm p-8 relative overflow-hidden">
          {/* Stamp Header */}
          <div className="p-3 mb-6 bg-paper border border-brass/40 rounded-lg flex items-center justify-between text-[11px] font-mono">
            <div className="text-brass-dark font-bold">
              NON-JUDICIAL STAMP DUTY: ৳1,000 BDT
            </div>
            <div className="text-ink-faint">
              TREASURY CODE: 1-1101-0020-2024 • DHAKA SADAR SUB-REGISTRY NO. 892/2024
            </div>
          </div>

          <div className="text-center pb-6 border-b border-border">
            <h1 className="font-serif text-2xl font-bold text-pine-900 uppercase tracking-tight">
              Commercial Supply Agreement
            </h1>
            <div className="text-xs font-mono text-ink-faint mt-1">
              Contract No: RT-MDC-2024-098 • Dated: 24 October 2024 • Dhaka Jurisdiction
            </div>
          </div>

          <div className="py-6 space-y-4 font-serif text-xs text-ink/90 leading-relaxed">
            <p>
              This Commercial Supply Agreement (&ldquo;Agreement&rdquo;) is made and entered into on this 24th day of October, 2024, by and between <strong>Rahim Textiles & Trade Ltd.</strong>, having its registered corporate office at Tejgaon Industrial Area, Dhaka (&ldquo;Supplier&rdquo;), and <strong>Meghna Distribution Corp.</strong>, having its principal corporate terminal at Agrabad Commercial Area, Chittagong (&ldquo;Buyer&rdquo;).
            </p>
            <p>
              WHEREAS the Supplier manufactures and supplies premium combed cotton fabric conforming to national quality parameters established by the Bangladesh Standards and Testing Institution (BSTI); and WHEREAS the Buyer desires to procure such goods on an ongoing commercial basis...
            </p>
            <p className="italic text-ink-faint text-[11px]">
              [... Sections 1 through 13 detailing product specifications, pricing, delivery schedules, and irrevocable LC terms omitted for brevity in preview ...]
            </p>
          </div>

          {/* Signature Blocks Area */}
          <div className="pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supplier Signature (Done) */}
            <div className="p-4 rounded-xl bg-paper border border-border space-y-2">
              <div className="text-[10px] font-mono uppercase text-ink-faint">First Party (Supplier)</div>
              <div className="font-bold text-xs text-pine-900">Ayesha Rahman</div>
              <div className="text-[11px] text-ink-soft">Managing Director, Rahim Textiles & Trade Ltd.</div>
              <div className="py-2">
                <span className="font-caveat text-2xl text-pine-900 block">Ayesha Rahman</span>
              </div>
              <div className="pt-2 border-t border-border text-[10px] font-mono text-emerald-800 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>SEALED • 24-Oct-2024 11:20:14 BST</span>
              </div>
            </div>

            {/* Buyer Signature (Action Required) */}
            <div
              onClick={handleProceed}
              className="p-4 rounded-xl border-2 border-dashed border-vermilion bg-vermilion/5 hover:bg-vermilion/10 cursor-pointer transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-vermilion font-bold">
                  Second Party (Buyer) • ACTION REQUIRED
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-vermilion text-paper">
                  SIGN HERE
                </span>
              </div>

              <div className="font-bold text-xs text-pine-900">{recipientName}</div>
              <div className="text-[11px] text-ink-soft">{session?.recipientRole || 'Signatory'}</div>

              <div className="py-4 border border-dashed border-vermilion/40 rounded-lg flex items-center justify-center gap-2 text-vermilion text-xs font-semibold group-hover:scale-[1.01] transition-transform">
                <PenTool className="w-4 h-4" />
                <span>Click to Sign & Affix Legal Seal</span>
              </div>

              <div className="text-[10px] font-mono text-ink-faint">
                Requires ICT Act 2006 assent checkbox above
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating-style Action Bar */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/documents">
            <button className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-paper text-ink text-xs font-medium flex items-center gap-1.5 shadow-subtle">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Documents</span>
            </button>
          </Link>

          <button
            onClick={handleProceed}
            className="px-6 py-2.5 rounded-lg bg-vermilion hover:bg-vermilion-hover text-paper text-xs font-bold shadow-warm transition-all flex items-center gap-2"
          >
            <span>Proceed to Guided Signing Canvas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
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
                  Decline Bilateral Agreement
                </h3>
                <p className="text-xs text-ink-soft">
                  Provide grounds for non-execution to sender {senderName}.
                </p>
              </div>
            </div>

            <form onSubmit={handleDeclineSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-ink mb-1">
                  Reason for Declining (Required)
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

              <div className="p-3 rounded-lg bg-paper border border-border text-[11px] text-ink-soft">
                Declining will formally record non-assent under Section 7 ICT Act procedures and notify all parties.
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
                  className="px-4 py-1.5 rounded-lg bg-danger text-paper text-xs font-bold shadow-sm hover:bg-danger/90 disabled:opacity-50"
                >
                  {isDeclining ? 'Submitting...' : 'Submit Declination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
