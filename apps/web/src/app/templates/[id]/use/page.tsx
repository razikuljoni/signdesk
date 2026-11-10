'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Users,
  Send,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Mail,
  Scale,
  Sparkles,
  Phone,
  Building2,
  Lock,
  Check,
} from 'lucide-react';

export default function UseTemplatePage() {
  return (
    <AuthGuard>
      <UseTemplateContent />
    </AuthGuard>
  );
}

function UseTemplateContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || 'commercial-supply';

  // Role 2 inputs
  const [signer2Name, setSigner2Name] = useState('Tanvir Ahmed');
  const [signer2Email, setSigner2Email] = useState('tanvir@meghnadist.com');
  const [signer2Phone, setSigner2Phone] = useState('+880 1711-884920');
  const [mandate2FA, setMandate2FA] = useState(true);

  // Role 3 inputs
  const [witnessName, setWitnessName] = useState('Advocate Kamal Uddin');
  const [witnessEmail, setWitnessEmail] = useState('legal@dcibar.org.bd');

  // Variables
  const [contractValue, setContractValue] = useState('৳ 1,450,000 BDT');
  const [deliveryTimeline, setDeliveryTimeline] = useState('30 Days FOB Chittagong Port Zone');
  const [customNote, setCustomNote] = useState(
    'Please review the bilateral supply deed. Clause 14 indemnity is aligned with standard 5% cap.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      router.push('/envelopes/sent');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header & Stepper */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/templates/${id}`}
              className="p-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Specimen</span>
            </Link>

            <div>
              <div className="font-serif font-bold text-lg text-pine-900">
                Deploy Specimen: Commercial Supply Agreement
              </div>
              <div className="text-[11px] font-mono text-ink-faint">
                Template #TPL-BD-COMM-2024 • Section 7 ICT Act Compliant
              </div>
            </div>
          </div>

          {/* 3-Step Stepper Header */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-paper text-[10px] flex items-center justify-center font-bold">
                ✓
              </span>
              <span>1. Select Template</span>
            </div>
            <span className="text-ink-faint">›</span>
            <div className="flex items-center gap-1 text-pine-900 font-bold">
              <span className="w-5 h-5 rounded-full bg-pine-900 text-paper text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>2. Assign Recipient Roles</span>
            </div>
            <span className="text-ink-faint">›</span>
            <div className="flex items-center gap-1 text-ink-faint">
              <span className="w-5 h-5 rounded-full bg-paper border border-border text-ink-faint text-[10px] flex items-center justify-center">
                3
              </span>
              <span>3. Review & Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column (8 cols) */}
        <form onSubmit={handleDispatch} className="lg:col-span-8 space-y-6">
          {/* Role Assignment Configuration Cards */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-serif font-bold text-base text-pine-900">
                Signatory Hierarchy & Roles
              </div>
              <span className="text-xs font-mono text-ink-faint">Sequential Protocol Enforced</span>
            </div>

            {/* Role 1 (Supplier / Originator) */}
            <div className="p-4 rounded-xl bg-paper border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-pine-900">
                  Role 1: Supplier / Originator (First Signer)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  VERIFIED NID (#***-***-5521)
                </span>
              </div>
              <div className="font-bold text-sm text-pine-900">Ayesha Rahman</div>
              <div className="text-xs text-ink-soft">
                Managing Director, Rahim Textiles & Trade Ltd. • ayesha.rahman@rahimtrade.com.bd
              </div>
            </div>

            {/* Role 2 (Buyer / Counterparty) */}
            <div className="p-4 rounded-xl border-2 border-vermilion/50 bg-vermilion/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-vermilion">
                  Role 2: Buyer / Counterparty (Designated Signer)
                </span>
                <span className="text-[10px] font-mono text-ink-faint">Action Pending Turn</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-ink font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={signer2Name}
                    onChange={(e) => setSigner2Name(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-surface text-ink text-xs focus:outline-none focus:border-pine-900"
                  />
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={signer2Email}
                    onChange={(e) => setSigner2Email(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-surface text-ink text-xs focus:outline-none focus:border-pine-900"
                  />
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">WhatsApp Mobile (OTP Delivery)</label>
                  <input
                    type="text"
                    required
                    value={signer2Phone}
                    onChange={(e) => setSigner2Phone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-surface text-ink text-xs font-mono focus:outline-none focus:border-pine-900"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={mandate2FA}
                      onChange={(e) => setMandate2FA(e.target.checked)}
                      className="rounded text-pine-900 focus:ring-pine-900/30"
                    />
                    <span className="text-xs font-semibold text-pine-900">
                      Mandate Porichoy NID 2FA Verification
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Role 3 (Witness / Legal Custodian) */}
            <div className="p-4 rounded-xl bg-paper border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-brass-dark">
                  Role 3: Witness / Legal Custodian (Observer CC)
                </span>
                <span className="text-[10px] font-mono text-ink-faint">
                  Receives sealed duplicate upon completion
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-ink font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    value={witnessName}
                    onChange={(e) => setWitnessName(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-surface text-ink text-xs focus:outline-none focus:border-pine-900"
                  />
                </div>

                <div>
                  <label className="block text-ink font-medium mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={witnessEmail}
                    onChange={(e) => setWitnessEmail(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-surface text-ink text-xs focus:outline-none focus:border-pine-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contract Variables Injection Panel */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
            <div className="font-serif font-bold text-base text-pine-900 pb-2 border-b border-border">
              Contract Variables Injection
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-ink font-medium mb-1">
                  Variable 1: Consideration Value
                </label>
                <input
                  type="text"
                  required
                  value={contractValue}
                  onChange={(e) => setContractValue(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-paper text-ink text-xs font-semibold focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">
                  Variable 2: Delivery Timeline & Incoterm
                </label>
                <input
                  type="text"
                  required
                  value={deliveryTimeline}
                  onChange={(e) => setDeliveryTimeline(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ink font-medium mb-1">
                  Variable 3: Custom Greeting & Instruction Note
                </label>
                <textarea
                  rows={2}
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right Summary & Dispatch Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle space-y-4 sticky top-20">
            <div className="font-serif font-bold text-sm text-pine-900 pb-2 border-b border-border">
              Envelope Manifest Summary
            </div>

            {/* Document Thumbnail Preview */}
            <div className="p-4 rounded-xl bg-paper border border-border text-center space-y-2">
              <WaxSeal size={40} className="mx-auto" />
              <div className="font-serif font-bold text-xs text-pine-900">
                Commercial Supply Agreement
              </div>
              <div className="text-[10px] font-mono text-ink-faint">
                2 Pages • 3 Signatories • 6 Anchored Fields
              </div>
            </div>

            {/* Compliance Guarantee */}
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>ICT Act Section 7 Sealed</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Deterministic SHA-256 Pre-calculated. Admissible in Bangladesh commercial courts without witness subpoena.
              </p>
            </div>

            <div className="text-[11px] font-mono text-ink-soft space-y-1">
              <div className="flex justify-between">
                <span className="text-ink-faint">Stamp Duty Ref:</span>
                <span className="text-pine-900 font-semibold">TR-DH-882914</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-faint">Expiry TTL:</span>
                <span className="text-pine-900 font-semibold">14 Days (BST)</span>
              </div>
            </div>

            <button
              onClick={handleDispatch}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-pine-900 hover:bg-pine-800 disabled:opacity-50 text-paper text-xs font-bold shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Sealing & Dispatching...' : 'Review & Send Envelope'}</span>
              <ArrowRight className="w-4 h-4 text-brass" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
