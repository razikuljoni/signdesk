'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CheckCircle2,
  ArrowRight,
  FileText,
  Building2,
  Mail,
  Clock,
  ShieldCheck,
  Upload,
  PenTool,
  Users,
  Check,
  RefreshCw,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <OnboardingContent />
    </AuthGuard>
  );
}

function OnboardingContent() {
  const router = useRouter();

  const [orgName, setOrgName] = useState('Rahim Textiles & Trade Ltd.');
  const [eTin, setETin] = useState('8492048192-BD');
  const [timezone, setTimezone] = useState('Asia/Dhaka (BST • UTC+06:00 Atomic NTP)');
  const [resendNotice, setResendNotice] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [executiveSignature, setExecutiveSignature] = useState('Ayesha Rahman');

  const handleResendToken = () => {
    setResendNotice(true);
    setTimeout(() => setResendNotice(false), 3000);
  };

  const handleFinishOnboarding = () => {
    router.push('/envelopes/new');
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
            <WaxSeal size={28} />
            <span>SignDesk</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
            <span>Sovereign Onboarding Protocol</span>
            <span>•</span>
            <span className="text-emerald-800 font-semibold">ICT Act 2006 Standard</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
            Institutional Setup
          </span>
          <h1 className="font-serif text-3xl font-bold text-pine-900 mt-1">
            Configure Your Legal Workspace
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Establish your organization&apos;s cryptographic signing identity compliant with Bangladesh commerce regulations.
          </p>
        </div>

        {/* 1. Email Verification Alert Banner */}
        <div className="p-4 rounded-xl bg-surface border border-border shadow-subtle space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-pine-900 text-xs flex items-center gap-1.5">
                  <span>Institutional Handshake Dispatched</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Pre-validated Corporate Domain (@rahimtraders.com)
                  </span>
                </div>
                <div className="text-[11px] text-ink-soft">
                  A secure verification token has been delivered to <strong>ayesha@rahimtraders.com</strong>.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResendToken}
                className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1 shadow-subtle transition-all"
              >
                <RefreshCw className="w-3 h-3 text-ink-soft" />
                <span>Resend Token</span>
              </button>
            </div>
          </div>

          {resendNotice && (
            <div className="text-[11px] font-mono text-emerald-800 font-semibold pt-1">
              ✓ Fresh verification token dispatched to ayesha@rahimtraders.com!
            </div>
          )}
        </div>

        {/* 2. Workspace Configuration Matrix */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-5">
          <div className="font-serif font-bold text-base text-pine-900 pb-2 border-b border-border">
            Workspace Configuration Matrix
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-ink font-medium mb-1">Organization Legal Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-semibold focus:outline-none focus:border-pine-900"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-ink font-medium">Corporate Tax Identification (e-TIN)</label>
                <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                  Pre-linked with NBR
                </span>
              </div>
              <input
                type="text"
                value={eTin}
                onChange={(e) => setETin(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink font-mono text-xs focus:outline-none focus:border-pine-900"
              />
            </div>

            <div>
              <label className="block text-ink font-medium mb-1">Operational Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink font-mono text-xs focus:outline-none focus:border-pine-900"
              >
                <option value="Asia/Dhaka (BST • UTC+06:00 Atomic NTP)">
                  Asia/Dhaka (BST • UTC+06:00 Atomic NTP)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-ink font-medium mb-1">Corporate Seal & Embossment</label>
              <div className="p-3 rounded-lg border-2 border-dashed border-border bg-paper flex items-center justify-between text-xs">
                <span className="text-ink-soft text-[11px]">PNG, SVG seal with alpha transparency</span>
                <label className="px-2.5 py-1 rounded bg-surface border border-border text-pine-900 font-semibold text-[11px] cursor-pointer hover:bg-paper">
                  Upload Seal
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. First Envelope Journey Stepper (4-Step Checklist) */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="font-serif font-bold text-base text-pine-900 pb-2 border-b border-border">
            First Envelope Journey Stepper (Checklist)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-paper text-xs flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <div className="font-semibold text-pine-900">Step 1: Verify Corporate Email</div>
                <div className="text-[11px] text-emerald-800">Completed & Verified</div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setShowSignatureModal(true)}
              className="p-3.5 rounded-xl bg-paper border border-border hover:border-pine-800 cursor-pointer flex items-start gap-3 transition-colors group"
            >
              <div className="w-5 h-5 rounded-full bg-pine-900 text-paper text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <div className="font-semibold text-pine-900 group-hover:underline flex items-center justify-between">
                  <span>Step 2: Adopt Digital Signature</span>
                  <PenTool className="w-3.5 h-3.5 text-brass" />
                </div>
                <div className="text-[11px] font-caveat text-xl text-pine-900">
                  {executiveSignature}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-paper border border-border flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-paper border border-border text-ink-faint text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                3
              </div>
              <div>
                <div className="font-semibold text-pine-900">Step 3: Upload Deed / Contract</div>
                <div className="text-[11px] text-ink-soft">PDF intake with SHA-256 genesis hashing</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-paper border border-border flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-paper border border-border text-ink-faint text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                4
              </div>
              <div>
                <div className="font-semibold text-pine-900">Step 4: Invite Signatories</div>
                <div className="text-[11px] text-ink-soft">Define sequential order & WhatsApp OTP</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Pre-Approved Legal Templates Grid (Quick-Start) */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="font-serif font-bold text-base text-pine-900">
              Quick-Start: Pre-Approved Legal Templates
            </div>
            <Link href="/templates" className="text-xs font-semibold text-pine-800 hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link href="/templates/commercial-supply/use">
              <div className="p-3.5 rounded-xl bg-paper border border-border hover:border-pine-800 transition-all space-y-1 group">
                <div className="font-semibold text-pine-900 group-hover:underline">
                  Commercial Supply Agreement
                </div>
                <div className="text-[11px] text-ink-soft">
                  RMG & Manufacturing • Duty ৳1,000
                </div>
              </div>
            </Link>

            <Link href="/templates/bilateral-nda/use">
              <div className="p-3.5 rounded-xl bg-paper border border-border hover:border-pine-800 transition-all space-y-1 group">
                <div className="font-semibold text-pine-900 group-hover:underline">
                  Bilateral Non-Disclosure Deed
                </div>
                <div className="text-[11px] text-ink-soft">
                  Corporate & Tech • Non-Judicial Duty
                </div>
              </div>
            </Link>

            <Link href="/templates/board-resolution/use">
              <div className="p-3.5 rounded-xl bg-paper border border-border hover:border-pine-800 transition-all space-y-1 group">
                <div className="font-semibold text-pine-900 group-hover:underline">
                  Board Resolution of Authority
                </div>
                <div className="text-[11px] text-ink-soft">
                  RJSC Governance • 3 Signatories
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 5. Bottom Navigation Dock */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/dashboard">
            <button className="px-4 py-2 rounded-lg border border-border bg-surface hover:bg-paper text-ink text-xs font-semibold shadow-subtle">
              Go to Workspace Dashboard
            </button>
          </Link>

          <button
            onClick={handleFinishOnboarding}
            className="px-6 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-bold shadow-warm transition-all flex items-center gap-2"
          >
            <span>Upload & Send First Envelope</span>
            <ArrowRight className="w-4 h-4 text-brass" />
          </button>
        </div>
      </div>

      {/* Signature Adoption Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="font-serif font-bold text-lg text-pine-900">
              Adopt Executive Signature Specimen
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-ink font-medium mb-1">Executive Signer Name</label>
                <input
                  type="text"
                  value={executiveSignature}
                  onChange={(e) => setExecutiveSignature(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-medium focus:outline-none focus:border-pine-900"
                />
              </div>

              <div className="p-6 rounded-xl bg-paper border border-border text-center">
                <div className="text-[10px] font-mono uppercase text-ink-faint">
                  Archival Script Preview
                </div>
                <div className="font-caveat text-4xl text-pine-900 py-3">
                  {executiveSignature}
                </div>
                <div className="text-[11px] font-mono text-emerald-800">
                  ✓ Bound to Porichoy NID Verification
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-1.5 rounded-lg bg-pine-900 text-paper text-xs font-semibold"
              >
                Confirm Specimen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
