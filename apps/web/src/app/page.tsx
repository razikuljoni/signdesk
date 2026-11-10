'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Clock,
  Send,
  PenTool,
  HelpCircle,
  Gavel,
  Shield,
  Fingerprint,
  ChevronDown,
  Building,
  Smartphone,
  Check,
  X as XIcon,
  Languages,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Calendar,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  // Interactive state for hero document preview signing simulation
  const [partyBSigned, setPartyBSigned] = useState(false);

  // Interactive state for simulator canvas
  const [activeSigner, setActiveSigner] = useState<'ayesha' | 'tanvir'>('tanvir');
  const [placedField, setPlacedField] = useState<'signature' | 'date' | 'nid' | 'stamp'>('signature');
  const [fieldPosition, setFieldPosition] = useState({ x: 55, y: 70 });

  // Interactive state for AI summary language toggle
  const [aiLang, setAiLang] = useState<'en' | 'bn'>('en');

  // Interactive state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is an e-signature executed on SignDesk legally binding in Bangladesh?',
      a: 'Yes. Under Section 7 of the Bangladesh Information and Communication Technology (ICT) Act, 2006 (amended 2013), where any law provides that information or any other matter shall be authenticated by affixing a signature, that requirement is satisfied if authenticated by means of an electronic signature. SignDesk provides cryptographic verification satisfying Section 8 regarding legal recognition of electronic records in high courts and arbitration tribunals.',
    },
    {
      q: 'What forensic details are permanently recorded in the Audit Trail?',
      a: 'Every completed envelope generates an immutable Certificate of Completion. It records: chronological UTC/BST timestamps, IP addresses, geolocations, authentication handshakes, browser user-agents, cryptographic SHA-256 document digests, and signer signature vectors. This trail cannot be edited or purged, ensuring foolproof evidentiary weight.',
    },
    {
      q: 'Do external signers or vendor suppliers need to register for SignDesk?',
      a: 'No. Signers can open their personalized secure magic link from any mobile device, tablet, or desktop web browser without creating an account or downloading an app. They verify identity via secure email token and sign smoothly in less than 30 seconds.',
    },
    {
      q: 'Can I pay subscription charges in Bangladeshi Taka (BDT)?',
      a: 'Absolutely. We support direct local billing in BDT (৳) and corporate invoices. All invoices include registered BIN numbers and automated Mushak 6.3 challans for NBR corporate tax audits.',
    },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-paper via-surface-raised/30 to-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pine-100 border border-pine-500/20 text-xs font-semibold text-pine-900 shadow-warm-sm">
            <ShieldCheck className="w-4 h-4 text-pine-600" />
            <span>Statutory Digital Notarization · Govt Gazetted Tech · ICT Act 2006</span>
          </div>

          {/* Display Headline */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-pine-900 max-w-4xl mx-auto leading-[1.08]">
            Signatures, sealed.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-ink-soft max-w-3xl mx-auto font-body leading-relaxed">
            The tamper-evident e-signature and contract execution platform crafted for Bangladeshi commerce.
            Fully enforceable under the Information &amp; Communication Technology (ICT) Act 2006.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/signup">
              <Button variant="sign" size="lg" className="w-full sm:w-auto text-base px-8 h-12">
                Start Free — 5 Envelopes/mo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-6 h-12 border-border-strong text-pine-900 hover:bg-surface-raised">
                Sign In with Demo User
              </Button>
            </Link>
          </div>

          {/* Core Trust Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-border/60 text-xs text-ink-soft">
            <div className="flex items-center justify-center gap-2 p-2 bg-surface/60 rounded-[8px] border border-border/40">
              <Gavel className="w-4 h-4 text-pine-600 shrink-0" />
              <span><strong>ICT Act 2006</strong> · Sec 7 Admissible</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 bg-surface/60 rounded-[8px] border border-border/40">
              <Fingerprint className="w-4 h-4 text-pine-600 shrink-0" />
              <span><strong>SHA-256</strong> · Chained Crypto</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 bg-surface/60 rounded-[8px] border border-border/40">
              <Smartphone className="w-4 h-4 text-pine-600 shrink-0" />
              <span><strong>Zero-Account</strong> · Magic Link</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-2 bg-surface/60 rounded-[8px] border border-border/40">
              <Lock className="w-4 h-4 text-pine-600 shrink-0" />
              <span><strong>256-Bit Vault</strong> · Bank-Grade</span>
            </div>
          </div>

          {/* Hero Visual Mockup: Sealed Contract Preview */}
          <div className="max-w-3xl mx-auto pt-6 text-left">
            <div className="bg-surface rounded-[12px] border border-border shadow-warm-lg overflow-hidden">
              {/* Envelope Header Bar */}
              <div className="bg-surface-raised px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-pine-900 font-mono font-medium">
                  <ShieldCheck className="w-4 h-4 text-brass-600" />
                  <span>ENVELOPE #BD-2025-0819</span>
                  <span className="text-ink-faint">·</span>
                  <span className="text-ink-soft">Chittagong Port Supply Consortium</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brass-700 bg-brass-500/10 px-2 py-0.5 rounded border border-brass-500/20">
                  <Clock className="w-3 h-3" />
                  <span>Execution In Progress</span>
                </div>
              </div>

              {/* Document Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-ink-faint mb-1">
                    Non-Judicial Deed Registration Annexure
                  </div>
                  <h3 className="font-display text-2xl font-bold text-pine-900">
                    Commercial Supply &amp; Bilateral Escrow Accord
                  </h3>
                  <div className="text-xs text-ink-faint mt-1">
                    Execution under Bangladesh Bank Circular 14/2023 Guidelines · BST Atomic Timestamp: 24 Feb 2025
                  </div>
                </div>

                <div className="p-4 bg-paper rounded-[8px] border border-border/70 text-xs text-ink-soft leading-relaxed font-body">
                  &ldquo;This Covenant is executed this 24th day of February, 2025, between <strong>Rahim Textiles &amp; Trade Ltd.</strong> (First Party) and <strong>Apex Logistics Dhaka LLC</strong> (Second Party). Both signatories recognize the electronic hash as admissible prima facie evidence under Chapter II of the ICT Act 2006.&rdquo;
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-ink-soft border-y border-border/60 py-2.5">
                  <div><strong>Contract Value:</strong> ৳4,85,00,000 BDT</div>
                  <div><strong>Stamp Duty:</strong> Registered via Sonali e-Challan</div>
                </div>

                {/* Signer Slots */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Party A (Executed) */}
                  <div className="p-3.5 bg-pine-50/50 rounded-[8px] border border-pine-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-ink-faint uppercase font-bold text-[10px]">Party A (Executed)</span>
                      <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Affixed
                      </span>
                    </div>
                    <div className="font-display text-base font-bold text-pine-900">
                      Ayesha Rahman
                    </div>
                    <div className="font-mono text-[10px] text-ink-faint truncate">
                      SHA256: 8a4f9b2c...ec01 · NID Verified
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      24 Feb 2025 • 14:32 BST
                    </div>
                  </div>

                  {/* Party B (Interactive / Awaiting) */}
                  <div
                    onClick={() => setPartyBSigned(!partyBSigned)}
                    className={`p-3.5 rounded-[8px] border transition-all cursor-pointer select-none space-y-2 ${
                      partyBSigned
                        ? 'bg-pine-50/50 border-pine-500/30'
                        : 'bg-seal-50/40 border-dashed border-seal-500/40 hover:bg-seal-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-ink-faint uppercase font-bold text-[10px]">Party B (Counterparty)</span>
                      {partyBSigned ? (
                        <span className="text-[11px] font-semibold text-success flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Affixed
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-seal-700 bg-seal-100 px-2 py-0.5 rounded">
                          Click to Sign
                        </span>
                      )}
                    </div>
                    <div className="font-display text-base font-bold text-pine-900 flex items-center justify-between">
                      <span>Tanvir Ahmed</span>
                      {partyBSigned && <WaxSeal size={24} />}
                    </div>
                    <div className="font-mono text-[10px] text-ink-faint">
                      {partyBSigned
                        ? 'SHA256: 3c7a10fd...994b · Sealed'
                        : 'Invited via secure magic link (+880 171...)'}
                    </div>
                    <div className="text-[10px] text-ink-faint">
                      {partyBSigned ? 'Just now • Verified BST' : 'Status: Awaiting Counterparty execution'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Studio Canvas Section (Field Editor Simulation) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="simulator">
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs font-mono uppercase tracking-wider text-pine-900">
            <Sliders className="w-3.5 h-3.5 text-seal-600" />
            <span>Interactive Studio Canvas</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            Simulate the Envelope Preparation
          </h2>
          <p className="text-ink-soft max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Drag and position statutory fields directly onto multi-page PDF records.
            Assign color-coded signer protocols compliant with Bangladesh commercial registries.
          </p>
        </div>

        {/* Simulator Studio Box */}
        <div className="bg-surface rounded-[12px] border border-border shadow-warm-md overflow-hidden grid lg:grid-cols-12">
          {/* Left Toolbar: Signers & Field Palette */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-border bg-surface-raised/40 space-y-6">
            {/* Signer Switcher */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-2 font-semibold">
                Active Signer Assignment
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setActiveSigner('ayesha')}
                  className={`w-full text-left p-3 rounded-[8px] border text-xs transition-colors flex items-center justify-between ${
                    activeSigner === 'ayesha'
                      ? 'bg-pine-900 text-white border-pine-900 shadow-warm-sm'
                      : 'bg-surface text-ink border-border hover:bg-surface-raised'
                  }`}
                >
                  <div>
                    <div className="font-bold">Ayesha Rahman</div>
                    <div className={activeSigner === 'ayesha' ? 'text-pine-200' : 'text-ink-faint'}>
                      Signer 1 · First Party (Supplier)
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-pine-400" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSigner('tanvir')}
                  className={`w-full text-left p-3 rounded-[8px] border text-xs transition-colors flex items-center justify-between ${
                    activeSigner === 'tanvir'
                      ? 'bg-seal-600 text-white border-seal-600 shadow-warm-sm'
                      : 'bg-surface text-ink border-border hover:bg-surface-raised'
                  }`}
                >
                  <div>
                    <div className="font-bold">Tanvir Ahmed</div>
                    <div className={activeSigner === 'tanvir' ? 'text-seal-200' : 'text-ink-faint'}>
                      Signer 2 · Second Party (Distributor)
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-seal-400" />
                </button>
              </div>
            </div>

            {/* Standard Fields Palette */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-2 font-semibold">
                Standard Field Palette
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlacedField('signature')}
                  className={`p-3 rounded-[8px] border text-left text-xs space-y-1 transition-all ${
                    placedField === 'signature'
                      ? 'bg-pine-100 border-pine-600 text-pine-900 font-bold'
                      : 'bg-surface border-border hover:bg-surface-raised text-ink-soft'
                  }`}
                >
                  <PenTool className="w-4 h-4 text-seal-600" />
                  <div>Signature Pad</div>
                  <div className="text-[10px] text-ink-faint font-normal">e-Signature mark</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlacedField('date')}
                  className={`p-3 rounded-[8px] border text-left text-xs space-y-1 transition-all ${
                    placedField === 'date'
                      ? 'bg-pine-100 border-pine-600 text-pine-900 font-bold'
                      : 'bg-surface border-border hover:bg-surface-raised text-ink-soft'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-pine-600" />
                  <div>Execution Date</div>
                  <div className="text-[10px] text-ink-faint font-normal">Auto-filled BST time</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlacedField('nid')}
                  className={`p-3 rounded-[8px] border text-left text-xs space-y-1 transition-all ${
                    placedField === 'nid'
                      ? 'bg-pine-100 border-pine-600 text-pine-900 font-bold'
                      : 'bg-surface border-border hover:bg-surface-raised text-ink-soft'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-brass-600" />
                  <div>NID / Smart Card</div>
                  <div className="text-[10px] text-ink-faint font-normal">10/17 Digit Verification</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPlacedField('stamp')}
                  className={`p-3 rounded-[8px] border text-left text-xs space-y-1 transition-all ${
                    placedField === 'stamp'
                      ? 'bg-pine-100 border-pine-600 text-pine-900 font-bold'
                      : 'bg-surface border-border hover:bg-surface-raised text-ink-soft'
                  }`}
                >
                  <Building className="w-4 h-4 text-pine-700" />
                  <div>Corporate Stamp</div>
                  <div className="text-[10px] text-ink-faint font-normal">Seal &amp; Organization</div>
                </button>
              </div>
            </div>

            {/* Instruction Tip */}
            <div className="p-3 bg-surface rounded-[8px] border border-border text-xs text-ink-soft space-y-1">
              <div className="font-semibold text-pine-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-seal-600" />
                Ratio-Preserved Coordinates
              </div>
              <p className="text-[11px] leading-relaxed text-ink-faint">
                Fields are anchored by normalized percentages. Scaling, zooming, or printing maintains exact legal placement across all PDF readers.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFieldPosition({ x: 55, y: 70 });
                setActiveSigner('tanvir');
                setPlacedField('signature');
              }}
              className="w-full text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Restore Default Layout
            </Button>
          </div>

          {/* Right Canvas: Parchment Contract Viewer */}
          <div className="lg:col-span-8 p-6 lg:p-8 bg-paper flex items-center justify-center">
            <div className="w-full max-w-xl bg-surface rounded-[8px] border border-border shadow-warm-sm p-6 sm:p-8 relative min-h-[440px] space-y-4">
              {/* Document Header */}
              <div className="border-b border-border/80 pb-3 flex items-center justify-between text-xs text-ink-faint">
                <span className="font-mono font-bold text-pine-900">DISTRIBUTION CHARTER</span>
                <span>Rahim Textiles &amp; Trade Ltd. • Dhaka 1212</span>
                <span className="font-mono">Page 1 of 3</span>
              </div>

              {/* Sample Contract Clauses */}
              <div className="text-xs text-ink-soft space-y-3 leading-relaxed">
                <p>
                  <strong>Clause 4.2 (Arbitration &amp; Dispute Resolution):</strong> Any dispute, controversy, or claim arising out of or relating to this bilateral commercial supply agreement shall be referred to and finally resolved by arbitration in accordance with the <strong>Arbitration Act, 2001 of Bangladesh</strong>.
                </p>
                <p>
                  <strong>Clause 4.3 (Evidentiary Weight):</strong> The parties hereby covenant that electronic signatures affixed through SignDesk constitute admissible evidence under <strong>Section 7 of the Information &amp; Communication Technology (ICT) Act 2006</strong>.
                </p>
                <div className="pt-2 text-[11px] text-ink-faint border-t border-dashed border-border">
                  Click on the parchment below to place or re-position the active field:
                </div>
              </div>

              {/* Interactive Parchment Field Placement Surface */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setFieldPosition({ x: Math.max(5, Math.min(80, x)), y: Math.max(10, Math.min(85, y)) });
                }}
                className="relative h-48 border border-border/60 rounded bg-paper/50 cursor-crosshair overflow-hidden"
              >
                {/* Pre-placed Signer 1 signature */}
                <div className="absolute left-6 top-8 p-2 rounded bg-pine-100/90 border border-pine-500/40 text-[10px] text-pine-900 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
                  <div>
                    <div className="font-bold">A. Rahman (Signed)</div>
                    <div className="text-[9px] text-pine-700 font-mono">24/10/24 BST</div>
                  </div>
                </div>

                {/* Dynamic Placed Field */}
                <div
                  style={{ left: `${fieldPosition.x}%`, top: `${fieldPosition.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-[6px] border text-xs shadow-warm-md flex items-center gap-2 pointer-events-none transition-all ${
                    activeSigner === 'ayesha'
                      ? 'bg-pine-900 text-white border-pine-800'
                      : 'bg-seal-600 text-white border-seal-700'
                  }`}
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <div>
                    <div className="font-bold text-[11px] capitalize">
                      {placedField}: {activeSigner === 'ayesha' ? 'Ayesha Rahman' : 'Tanvir Ahmed'}
                    </div>
                    <div className="text-[9px] opacity-80 font-mono">
                      x: {Math.round(fieldPosition.x)}% · y: {Math.round(fieldPosition.y)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Canvas Footer */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-ink-faint border-t border-border">
                <span>Coordinates: Ratio-based (0.00–1.00)</span>
                <span className="text-pine-600 font-semibold">Interactive Sandbox</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Execution in Three Irrevocable Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="workflow">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Protocol Architecture
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            Execution in Three Irrevocable Steps
          </h2>
          <p className="text-sm sm:text-base text-ink-soft max-w-2xl mx-auto">
            Crafted specifically for the nuances of local enterprise: low digital literacy barriers,
            high evidentiary rigour, and direct magic link dispatch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className="relative overflow-hidden border-border bg-surface shadow-warm-sm">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-pine-100 flex items-center justify-center text-pine-900 font-bold font-mono">
                01
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Upload &amp; Place Custom Fields
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Drop any multi-page PDF, deed, or trade order. Position required signature fields,
                signatory dates, text inputs, and company stamp seals in seconds.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>Auto Field Snapping</span>
                <span className="text-pine-600 font-semibold">A4 / Legal / Deed</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="relative overflow-hidden border-border bg-surface shadow-warm-sm">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-seal-100 flex items-center justify-center text-seal-800 font-bold font-mono">
                02
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Signers Sign via Magic Link
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Sent directly via secure single-use magic link. Zero app download, zero password friction.
                Automated Gemini AI summarizes key clauses in plain Bengali or English.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>Email Delivery</span>
                <span className="text-seal-600 font-semibold">Instant Access</span>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="relative overflow-hidden border-border bg-surface shadow-warm-sm">
            <CardContent className="p-6 space-y-4">
              <div className="w-10 h-10 rounded-[8px] bg-brass-500/20 flex items-center justify-center text-brass-800 font-bold font-mono">
                03
              </div>
              <h3 className="font-display text-xl font-bold text-pine-900">
                Tamper-Evident Seal &amp; Audit
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                The finalized PDF is cryptographically sealed with a SHA-256 certificate of completion,
                IP geostamps, atomic timestamps, and a digital wax signet.
              </p>
              <div className="p-3 bg-surface-raised rounded-[8px] border border-border text-xs font-mono text-ink-faint flex items-center justify-between">
                <span>SHA-256 Hash Chain</span>
                <span className="text-brass-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Court Admissible
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. Gemini Contract Intelligence ("Never Sign Blindly Again") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[16px] bg-pine-900 text-dark-text p-8 lg:p-12 shadow-warm-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pine-800 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-800 text-xs font-semibold text-pine-100 border border-pine-600/30">
                <Sparkles className="w-4 h-4 text-brass-500" />
                <span>Gemini Contract Intelligence</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                Never Sign Blindly Again.
              </h2>
              <p className="text-dark-text/80 text-sm sm:text-base max-w-2xl leading-relaxed">
                Commercial agreements in Bangladesh are often laden with obscure covenants.
                Our integrated Gemini AI synthesizes complex legal terms into plain-language bullet points before signers ink.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="inline-flex rounded-[8px] border border-pine-700 bg-pine-950 p-1 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setAiLang('en')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
                  aiLang === 'en'
                    ? 'bg-pine-800 text-white'
                    : 'text-dark-text/70 hover:text-white'
                }`}
              >
                English Brief
              </button>
              <button
                type="button"
                onClick={() => setAiLang('bn')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-[6px] transition-colors ${
                  aiLang === 'bn'
                    ? 'bg-pine-800 text-white'
                    : 'text-dark-text/70 hover:text-white'
                }`}
              >
                বাংলা বিবরণী
              </button>
            </div>
          </div>

          {/* 3 AI Plain Language Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1: Financial */}
            <div className="bg-pine-950/80 rounded-[12px] p-6 border border-pine-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-brass-400 font-bold">
                  {aiLang === 'en' ? 'Financial Obligations' : 'আর্থিক বাধ্যবাধকতা'}
                </span>
                <DollarSign className="w-4 h-4 text-brass-400" />
              </div>
              <p className="text-sm text-dark-text/90 leading-relaxed font-body">
                {aiLang === 'en'
                  ? 'Payment is 30% advance via Bank LC / RTGS, balance within 45 days post Delivery Challan verification.'
                  : 'ব্যাংক এলসি বা আরটিজিএসের মাধ্যমে ৩০% অগ্রিম প্রদান এবং চালান প্রাপ্তির ৪৫ দিনের মধ্যে অবশিষ্ট পরিশোধ।'}
              </p>
              <div className="pt-2 border-t border-pine-900 flex items-center justify-between text-[11px] text-dark-text/70 font-mono">
                <span>BDT Exposure: ৳4.85 Crore</span>
                <span className="text-success font-semibold">Standard Risk</span>
              </div>
            </div>

            {/* Card 2: Liquidated Damages */}
            <div className="bg-pine-950/80 rounded-[12px] p-6 border border-pine-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-seal-400 font-bold">
                  {aiLang === 'en' ? 'Liquidated Damages' : 'ক্ষতিপূরণ ও জরিমানা'}
                </span>
                <AlertTriangle className="w-4 h-4 text-seal-400" />
              </div>
              <p className="text-sm text-dark-text/90 leading-relaxed font-body">
                {aiLang === 'en'
                  ? 'Delay incurs 0.5% fine per week capped at 5% of gross invoice. Force majeure clause explicitly includes hartals and port blockades.'
                  : 'বিলম্বের ক্ষেত্রে প্রতি সপ্তাহে ০.৫% জরিমানা (সর্বোচ্চ ৫%)। অনিবার্য কারণের মধ্যে হরতাল ও বন্দর ধর্মঘট অন্তর্ভুক্ত।'}
              </p>
              <div className="pt-2 border-t border-pine-900 flex items-center justify-between text-[11px] text-dark-text/70 font-mono">
                <span>Strict Cap: 5% Max</span>
                <span className="text-brass-400 font-semibold">Notice: 7 Days</span>
              </div>
            </div>

            {/* Card 3: Tax & Dispute */}
            <div className="bg-pine-950/80 rounded-[12px] p-6 border border-pine-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-pine-300 font-bold">
                  {aiLang === 'en' ? 'Tax & Jurisdiction' : 'কর ও বিচারিক এখতিয়ার'}
                </span>
                <Gavel className="w-4 h-4 text-pine-300" />
              </div>
              <p className="text-sm text-dark-text/90 leading-relaxed font-body">
                {aiLang === 'en'
                  ? 'All tax deductions at source (TDS & VDS) comply with Income Tax Act 2023. Venue restricted solely to Metropolitan Dhaka Courts.'
                  : 'উৎস কর ও ভ্যাট কর্তন আয়কর আইন ২০২৩ অনুযায়ী প্রযোজ্য। বিরোধ নিষ্পত্তির বিচারিক এখতিয়ার ঢাকা মেট্রোপলিটন আদালত।'}
              </p>
              <div className="pt-2 border-t border-pine-900 flex items-center justify-between text-[11px] text-dark-text/70 font-mono">
                <span>Courts of Dhaka</span>
                <span className="text-success font-semibold">NBR Tax Compliant</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-dark-text/60 italic text-center sm:text-left">
            * AI summaries serve as reading aids and never replace legal counsel. Signing ceremony is never blocked if Gemini API is unreachable.
          </div>
        </div>
      </section>

      {/* 5. Priced for Sustainable Local Commerce (Pricing Teaser) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="pricing">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Honest Commercial Tiers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            Priced for Sustainable Local Commerce
          </h2>
          <p className="text-sm sm:text-base text-ink-soft max-w-2xl mx-auto">
            Billed transparently in BDT with auto-generated Mushak 6.3 VAT tax invoices.
            Pay via bKash, Nagad, or Bank Wire.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Free Explorer */}
          <Card className="border-border bg-surface flex flex-col justify-between shadow-warm-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-ink-faint font-semibold">Individual</span>
                <h3 className="font-display text-2xl font-bold text-pine-900 mt-1">Free Explorer</h3>
                <p className="text-xs text-ink-soft mt-1">Perfect for solo proprietors, freelancers, and small traders.</p>
              </div>

              <div className="text-3xl font-bold text-pine-900 font-mono">
                ৳0 <span className="text-sm font-normal text-ink-soft font-body">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>5 Sealed Envelopes / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Email Signer Delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>SHA-256 Audit Certificate</span>
                </li>
                <li className="flex items-center gap-2 text-ink-faint line-through">
                  <XIcon className="w-4 h-4 text-ink-faint shrink-0" />
                  <span>Custom Organization Branding</span>
                </li>
              </ul>

              <Link href="/signup" className="block pt-2">
                <Button variant="outline" className="w-full">
                  Start With Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Corporate Starter (Most Popular) */}
          <Card className="border-2 border-pine-900 bg-surface flex flex-col justify-between shadow-warm-md relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pine-900 text-white text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full font-bold">
              Most Popular
            </div>
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-pine-800 font-semibold">Growth SMEs</span>
                <h3 className="font-display text-2xl font-bold text-pine-900 mt-1">Corporate Starter</h3>
                <p className="text-xs text-ink-soft mt-1">Tailored for manufacturing units, buying houses, and legal firms.</p>
              </div>

              <div className="text-3xl font-bold text-pine-900 font-mono">
                ৳1,499 <span className="text-sm font-normal text-ink-soft font-body">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>50 Sealed Envelopes / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Gemini AI Bilingual Summaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Audit Trail &amp; Geostamps</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Custom Company Seal Watermark</span>
                </li>
              </ul>

              <Link href="/signup" className="block pt-2">
                <Button variant="sign" className="w-full">
                  Activate Starter
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Enterprise Pro */}
          <Card className="border-border bg-surface flex flex-col justify-between shadow-warm-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-ink-faint font-semibold">Large Scale</span>
                <h3 className="font-display text-2xl font-bold text-pine-900 mt-1">Enterprise Pro</h3>
                <p className="text-xs text-ink-soft mt-1">Unlimited scale with dedicated API webhooks and ERP integration.</p>
              </div>

              <div className="text-3xl font-bold text-pine-900 font-mono">
                ৳3,999 <span className="text-sm font-normal text-ink-soft font-body">/ month</span>
              </div>

              <ul className="space-y-3 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Unlimited Envelope Generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>REST API, Webhooks &amp; ERP Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Dedicated Account Support in Dhaka</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>Priority Cryptographic Notarization</span>
                </li>
              </ul>

              <Link href="/pricing" className="block pt-2">
                <Button variant="outline" className="w-full">
                  View Full Comparison
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 6. Frequently Addressed Inquiries (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" id="faq">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Statutory Enforceability
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            Frequently Addressed Inquiries
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-surface rounded-[8px] border border-border overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-pine-900 hover:bg-surface-raised/50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-faint shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-pine-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ink-soft leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Immediate Deployment CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6 pt-4">
        <WaxSeal size={72} className="mx-auto" />
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-seal-700 font-bold">
            Immediate Deployment
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-pine-900">
            Begin Executing Binding Deeds Today.
          </h2>
          <p className="text-ink-soft max-w-xl mx-auto text-sm sm:text-base">
            No credit card required. Free tier includes 5 envelopes every month.
            Upgrade or transition to custom enterprise tenancy anytime.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/signup">
            <Button variant="sign" size="lg" className="px-8 h-12 text-base font-bold">
              Create Free Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/legal">
            <Button variant="outline" size="lg" className="px-6 h-12 border-border-strong text-pine-900 hover:bg-surface-raised">
              Read ICT Act 2006 Legal Guide
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}