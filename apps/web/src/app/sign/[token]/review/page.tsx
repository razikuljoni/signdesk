'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  const token = (params.token as string) || 'demo_token';

  const [aiLang, setAiLang] = useState<'en' | 'bn'>('en');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleProceed = () => {
    if (!consentAgreed) {
      setError(
        'You must confirm statutory assent under Section 7 of the Bangladesh ICT Act 2006 before proceeding.'
      );
      return;
    }
    router.push(`/sign/${token}/sign`);
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/sign/${token}/declined`);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Global Signer Banner & Meta */}
      <div className="border-b border-border bg-surface px-6 py-3.5 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
              <WaxSeal size={28} />
              <span>SignDesk</span>
            </Link>
            <span className="text-ink-faint">|</span>
            <div className="text-xs">
              <span className="font-semibold text-pine-900 block truncate max-w-xs sm:max-w-md">
                Rahim Traders — Commercial Supply Agreement
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-ink-faint">
                <span className="flex items-center gap-1 text-pine-800">
                  <Lock className="w-3 h-3" />
                  <span>Envelope: BD-2024-8849-ICT</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>ICT Act 2006 Validated</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-800">
                  <Clock className="w-3 h-3" />
                  <span>Expires in 4 days</span>
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
            {aiLang === 'en' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Handshake className="w-4 h-4 text-pine-800" />
                    <span>Counterparties & Legal Standing</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    <strong>Originator (Supplier):</strong> Rahim Textiles & Trade Ltd., Tejgaon I/A Dhaka.<br />
                    <strong>Buyer (Signer 2):</strong> Meghna Distribution Corp., Port Zone Chittagong.
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <CreditCard className="w-4 h-4 text-pine-800" />
                    <span>Consideration & Payment Terms</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    Total contract value: <strong>৳1,450,000 BDT</strong> (30% advance via irrevocable LC/RTGS, remaining 70% within 45 days against delivery challan).
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Truck className="w-4 h-4 text-pine-800" />
                    <span>Delivery & BSTI Quality Mandate</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    240,000 metric yards combed cotton weave delivered to Agrabad Depot. Mandatory BSTI inspection batch 2024/Q4.
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Scale className="w-4 h-4 text-pine-800" />
                    <span>Arbitration & Force Majeure</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    Clause 4.2 binding arbitration under Bangladesh Arbitration Act 2001 (Dhaka Venue). Liquidated damages capped at 5%. Chittagong port blockades qualify as Force Majeure.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Handshake className="w-4 h-4 text-pine-800" />
                    <span>পক্ষসমূহ ও আইনি অবস্থান</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    <strong>সরবরাহকারী (প্রথম পক্ষ):</strong> রহিম টেক্সটাইলস অ্যান্ড ট্রেড লিঃ, তেজগাঁও শিল্প এলাকা, ঢাকা।<br />
                    <strong>ক্রেতা (দ্বিতীয় পক্ষ):</strong> মেঘনা ডিস্ট্রিবিউশন কর্পোরেশন, চট্টগ্রাম বন্দর জোন।
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <CreditCard className="w-4 h-4 text-pine-800" />
                    <span>মোট মূল্য এবং পরিশোধের শর্ত</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    সর্বমোট চুক্তি মূল্য: <strong>১৪,৫০,০০০ টাকা</strong>। ৩০% অগ্রিম ব্যাংক এলসি/আরটিজিএস মারফত এবং অবশিষ্ট ৭০% চালান হস্তান্তরের ৪৫ দিনের মধ্যে প্রদেয়।
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Truck className="w-4 h-4 text-pine-800" />
                    <span>পণ্য সরবরাহ এবং বিএসটিআই মানদণ্ড</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    ২,৪০,০০০ মিটার ইয়ার্ন সুতি ফ্যাব্রিক চট্টগ্রাম আগ্রাবাদ ডিপোতে ডেলিভারি। বাধ্যতামূলক বিএসটিআই (BSTI) কোয়ালিটি সনদ সংযুক্ত থাকতে হবে।
                  </p>
                </div>

                <div className="bg-paper p-3.5 rounded-lg border border-border space-y-1">
                  <div className="flex items-center gap-2 text-pine-900 font-semibold">
                    <Scale className="w-4 h-4 text-pine-800" />
                    <span>সালিশি এবং বাধ্যতামূলক বিধান</span>
                  </div>
                  <p className="text-ink-soft leading-relaxed text-[11px]">
                    ধারা ৪.২: সালিশ আইন ২০০১ এর অধীন ঢাকা এখতিয়ারভূক্ত। ক্ষতিপূরণের সর্বোচ্চ সীমা ৫%। বন্দর অবরোধ বা হরতাল ফোর্সম্যাজিউর হিসেবে বিবেচিত হবে।
                  </p>
                </div>
              </div>
            )}
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
                    Managing Director, Rahim Textiles & Trade Ltd. • 24 Oct, 11:20 BST • NID Verified
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
                    <span>2. Tanvir Ahmed (YOUR TURN)</span>
                    <span className="text-[10px] font-mono font-bold text-vermilion uppercase">
                      Action Required
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Managing Director, Meghna Distribution Corp. • Action pending: 1 Signature field
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
                I confirm assent to enter into this commercial agreement electronically under Section 7 of the Bangladesh Information and Communication Technology (ICT) Act 2006.
              </div>
              <p className="text-[11px] text-ink-soft leading-relaxed">
                By ticking this box, you acknowledge that your electronic signature affixed herein has full legal equivalence to physical handwritten ink under Bangladesh law, and the resulting audit trail is admissible as primary evidence in all judicial courts and arbitration tribunals.
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

              <div className="font-bold text-xs text-pine-900">Tanvir Ahmed</div>
              <div className="text-[11px] text-ink-soft">Managing Director, Meghna Distribution Corp.</div>

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
                  Provide grounds for non-execution to sender Ayesha Rahman.
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
                  placeholder="e.g. Clause 14 indemnity needs revision — liability cap needs to align with bilateral 5% agreement..."
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink focus:outline-none focus:ring-2 focus:ring-vermilion/20 focus:border-vermilion text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-paper border border-border text-[11px] text-ink-soft">
                Declining will formally void your designated signing nonce under Section 7 ICT Act procedures and notify all parties.
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
