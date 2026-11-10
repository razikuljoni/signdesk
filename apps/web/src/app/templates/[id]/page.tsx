'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Save,
  Eye,
  PenTool,
  Stamp,
  Building2,
  Fingerprint,
  Lock,
  Scale,
  Sparkles,
  Check,
} from 'lucide-react';

export default function TemplateEditorPage() {
  return (
    <AuthGuard>
      <TemplateEditorContent />
    </AuthGuard>
  );
}

function TemplateEditorContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || 'commercial-supply';

  const [activeRole, setActiveRole] = useState<'signer1' | 'signer2' | 'witness'>('signer2');
  const [isRequired, setIsRequired] = useState(true);
  const [enforceNid2fa, setEnforceNid2fa] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans flex flex-col justify-between">
      {/* Top Studio Header */}
      <div className="border-b border-border bg-surface px-6 py-3 sticky top-0 z-30 shadow-subtle">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="p-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Templates</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-base text-pine-900">
                  Commercial Supply Agreement (Specimen v2)
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SPECIMEN DRAFT
                </span>
              </div>
              <div className="text-[10px] font-mono text-ink-faint">
                Draft Auto-saved 14:10 BST • Template ID: #TPL-BD-COMM-2024
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs font-mono text-emerald-800 font-semibold animate-fadeIn flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to Vault!</span>
              </span>
            )}

            <Link href={`/templates/${id}/use`}>
              <button className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <Eye className="w-3.5 h-3.5 text-ink-soft" />
                <span>Preview Specimen</span>
              </button>
            </Link>

            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-1.5 shadow-warm transition-all"
            >
              <Save className="w-3.5 h-3.5 text-brass" />
              <span>Save Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* Three-Pane Studio Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (Roles & Palette - 3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Role Switcher Tabs */}
          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle space-y-3">
            <div className="text-xs font-serif font-bold text-pine-900 pb-1 border-b border-border">
              Signatory Roles (3 Roles)
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => setActiveRole('signer1')}
                className={`w-full p-2.5 rounded-lg text-left text-xs font-medium border transition-all flex items-center justify-between ${
                  activeRole === 'signer1'
                    ? 'bg-pine-900 text-paper border-pine-900 shadow-sm'
                    : 'bg-paper text-ink border-border hover:bg-surface'
                }`}
              >
                <div>
                  <div className="font-semibold">Signer 1 (Supplier)</div>
                  <div className={`text-[10px] ${activeRole === 'signer1' ? 'text-paper/80' : 'text-ink-faint'}`}>
                    Originator • Deep Pine
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-pine-800 border border-white" />
              </button>

              <button
                onClick={() => setActiveRole('signer2')}
                className={`w-full p-2.5 rounded-lg text-left text-xs font-medium border transition-all flex items-center justify-between ${
                  activeRole === 'signer2'
                    ? 'bg-vermilion text-paper border-vermilion shadow-sm'
                    : 'bg-paper text-ink border-border hover:bg-surface'
                }`}
              >
                <div>
                  <div className="font-semibold">Signer 2 (Buyer)</div>
                  <div className={`text-[10px] ${activeRole === 'signer2' ? 'text-paper/80' : 'text-ink-faint'}`}>
                    Designated Counterparty • Vermilion
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-vermilion border border-white" />
              </button>

              <button
                onClick={() => setActiveRole('witness')}
                className={`w-full p-2.5 rounded-lg text-left text-xs font-medium border transition-all flex items-center justify-between ${
                  activeRole === 'witness'
                    ? 'bg-brass text-pine-950 border-brass shadow-sm font-bold'
                    : 'bg-paper text-ink border-border hover:bg-surface'
                }`}
              >
                <div>
                  <div className="font-semibold">Witness (Legal Counsel)</div>
                  <div className={`text-[10px] ${activeRole === 'witness' ? 'text-pine-900' : 'text-ink-faint'}`}>
                    Observer CC • Gold
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-brass border border-black" />
              </button>
            </div>
          </div>

          {/* Draggable Field Chips Palette */}
          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle space-y-3">
            <div className="text-xs font-serif font-bold text-pine-900 pb-1 border-b border-border">
              Statutory Field Palette
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <PenTool className="w-4 h-4 text-pine-800" />
                <span className="font-medium text-pine-900">Signature Block</span>
              </div>

              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <Sparkles className="w-4 h-4 text-pine-800" />
                <span className="font-medium text-pine-900">Cryptographic Ink Mark</span>
              </div>

              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <Stamp className="w-4 h-4 text-brass-dark" />
                <span className="font-medium text-pine-900">Company Seal Crest</span>
              </div>

              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <Calendar className="w-4 h-4 text-ink-soft" />
                <span className="font-medium text-pine-900">Execution Date</span>
              </div>

              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <Building2 className="w-4 h-4 text-ink-soft" />
                <span className="font-medium text-pine-900">RJSC Registered Entity</span>
              </div>

              <div className="p-2.5 rounded-lg bg-paper border border-border text-xs flex items-center gap-2 cursor-grab hover:border-pine-800 transition-colors">
                <Fingerprint className="w-4 h-4 text-emerald-700" />
                <span className="font-medium text-pine-900">NID / Porichoy 2FA Gate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Pane (Parchment PDF Canvas - 6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-border shadow-warm p-6 sm:p-8 relative min-h-[600px] flex flex-col justify-between">
          {/* Subtle Stamp Duty Bar */}
          <div className="p-2.5 mb-4 bg-paper border border-brass/40 rounded-lg flex items-center justify-between text-[10px] font-mono">
            <span className="text-brass-dark font-bold">NON-JUDICIAL SPECIMEN • ৳1,000</span>
            <span className="text-ink-faint">RATIO A4 • 595 × 842 pt</span>
          </div>

          <div className="space-y-4 font-serif text-xs text-ink/90 leading-relaxed">
            <div className="text-center pb-4 border-b border-border">
              <h2 className="text-base font-bold text-pine-900 uppercase">
                Bilateral Commercial Supply Agreement
              </h2>
              <div className="font-mono text-[10px] text-ink-faint mt-0.5">
                Specimen Clause Schedule • ICT Act 2006 Compliant
              </div>
            </div>

            <p>
              BETWEEN <strong>[FIRST PARTY - SUPPLIER]</strong> of the one part, AND <strong>[SECOND PARTY - BUYER]</strong> of the other part...
            </p>

            <p>
              1. <strong>Supply Terms:</strong> The Supplier agrees to deliver the stipulated merchandise within the agreed timeframe subject to BSTI quality clearance...
            </p>

            <p>
              2. <strong>Financial Settlement:</strong> Consideration of <strong>৳ [CONTRACT_VALUE] BDT</strong> payable through confirmed Irrevocable Letter of Credit...
            </p>
          </div>

          {/* Role-Tinted Placement Overlays */}
          <div className="pt-6 border-t border-border grid grid-cols-2 gap-4">
            {/* Field 1: Signer 1 (Pine) */}
            <div className="p-3 rounded-lg border-2 border-pine-800 bg-pine-50/50 text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-pine-900 font-bold">
                <span>Signer 1 (Supplier)</span>
                <span>Page 2 • X: 120, Y: 620</span>
              </div>
              <div className="py-2 text-center font-caveat text-xl text-pine-900">
                [Signature Placeholder]
              </div>
            </div>

            {/* Field 2: Signer 2 (Vermilion Target) */}
            <div className="p-3 rounded-lg border-2 border-vermilion bg-vermilion/5 text-xs space-y-1 relative ring-2 ring-vermilion/30">
              <div className="flex items-center justify-between text-[10px] font-mono text-vermilion font-bold">
                <span>Signer 2 (Buyer)</span>
                <span>Active Inspector</span>
              </div>
              <div className="py-2 text-center font-caveat text-xl text-vermilion">
                [Obligatory Seal Block]
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane (Inspector & Field Properties - 3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle space-y-4">
            <div className="pb-2 border-b border-border">
              <div className="text-[10px] font-mono uppercase text-ink-faint">Inspector Target</div>
              <h3 className="font-serif font-bold text-sm text-pine-900">
                Signer 2 — Signature Block
              </h3>
            </div>

            {/* Toggles */}
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-paper border border-border cursor-pointer">
                <span className="font-medium text-ink">Required Field</span>
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                  className="rounded text-pine-900 focus:ring-pine-900/30"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-paper border border-border cursor-pointer">
                <div>
                  <div className="font-medium text-ink">Enforce Porichoy NID 2FA</div>
                  <div className="text-[10px] text-ink-faint">Biometric challenge required</div>
                </div>
                <input
                  type="checkbox"
                  checked={enforceNid2fa}
                  onChange={(e) => setEnforceNid2fa(e.target.checked)}
                  className="rounded text-pine-900 focus:ring-pine-900/30"
                />
              </label>
            </div>

            {/* Coordinates */}
            <div className="p-3 rounded-lg bg-paper border border-border font-mono text-[11px] text-ink-soft space-y-1">
              <div className="text-[10px] text-ink-faint uppercase">Parchment Coordinates:</div>
              <div className="text-pine-900 font-semibold">X: 480pt, Y: 620pt • Page 2 of 2</div>
            </div>

            {/* Legal Tooltip */}
            <div className="p-3 rounded-lg bg-pine-50/70 border border-pine-200 text-[11px] text-pine-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-pine-800" />
                <span>Statutory Instruction</span>
              </div>
              <p className="italic text-ink-soft">
                &ldquo;Signatory must complete biometric NID challenge prior to seal affixation.&rdquo;
              </p>
            </div>

            <Link href={`/templates/${id}/use`} className="block pt-2">
              <button className="w-full py-2 px-3 rounded-lg bg-vermilion hover:bg-vermilion-hover text-paper text-xs font-bold shadow-warm transition-all flex items-center justify-center gap-1.5">
                <span>Deploy Template in Envelope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
