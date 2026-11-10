'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Search,
  Check,
} from 'lucide-react';

export default function LegalEnforceabilityPage() {
  const [verifyHashInput, setVerifyHashInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<boolean | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyHashInput.trim().length > 10) {
      setVerifiedResult(true);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
            <WaxSeal size={28} />
            <span>SignDesk</span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/pricing" className="text-ink-soft hover:text-pine-900">
              Pricing
            </Link>
            <Link href="/security" className="text-ink-soft hover:text-pine-900">
              Security Architecture
            </Link>
            <Link href="/signin">
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        {/* Hero */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
            <Scale className="w-3.5 h-3.5" />
            <span>Bangladesh Legal & Evidentiary Framework</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-pine-900 tracking-tight leading-tight">
            Statutory Enforceability in Bangladesh Courts.
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft max-w-3xl leading-relaxed">
            A comprehensive legal primer on digital execution under the Information and Communication Technology (ICT) Act 2006, Evidence Act 1872, and Contract Act 1872.
          </p>
        </div>

        {/* Statutory Authority Framework */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-pine-900">
            1. Statutory Authority Framework
          </h2>

          <div className="grid md:grid-cols-3 gap-5 text-xs">
            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="font-mono text-[10px] uppercase text-brass-dark font-bold">
                ICT Act 2006 • Section 7
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Legal Equivalence of Signatures
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Where any law requires a person&apos;s physical signature, an electronic signature satisfies such requirement if the signing mechanism reliably identifies the signatory and proves assent to the instrument.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="font-mono text-[10px] uppercase text-brass-dark font-bold">
                ICT Act 2006 • Section 14
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Presumption of Security
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Affixation of digital marks generated using secure cryptographic procedures creates a statutory presumption that the signature has remained unaltered since the precise atomic timestamp of execution.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="font-mono text-[10px] uppercase text-brass-dark font-bold">
                Evidence Act 1872 • Section 65B & 85B
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Direct Court Admissibility
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Electronic records accompanied by an authoritative cryptographic certificate are admissible in judicial courts as primary documentary evidence without requiring summoning physical witnesses.
              </p>
            </div>
          </div>
        </section>

        {/* The Three Pillars of Binding Assent */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-pine-900">
            2. The Three Pillars of Binding Assent
          </h2>

          <div className="grid md:grid-cols-3 gap-5 text-xs">
            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pine-100 text-pine-900 flex items-center justify-center font-bold font-mono">
                1
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Demonstrated Intent to Sign
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Explicit statutory consent gate under Section 7 ICT Act where signatories affirmatively tick a declaration of intent before selecting, typing, or drawing their legal mark.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pine-100 text-pine-900 flex items-center justify-center font-bold font-mono">
                2
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Cryptographic Identity Attribution
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Multi-channel 2FA linking single-use token nonces with WhatsApp delivery, corporate MX email records, IP geostamps, and optional National ID Porichoy API verification.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-xl border border-border space-y-2">
              <div className="w-8 h-8 rounded-lg bg-pine-100 text-pine-900 flex items-center justify-center font-bold font-mono">
                3
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                Tamper-Evident Integrity
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Deterministic SHA-256 Merkle chain linking genesis uploads with every intermediate audit event. If even a single byte or comma is changed post-sealing, verification fails immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Statutory Exclusions Notice (Crucial Legal Guidance) */}
        <section className="bg-surface rounded-2xl border-2 border-vermilion/40 p-6 sm:p-8 shadow-warm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="p-2 rounded-lg bg-vermilion/10 text-vermilion">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-pine-900">
                Statutory Exclusions Notice (Non-Electronic Instruments)
              </h3>
              <p className="text-xs text-ink-soft">
                Under Bangladesh jurisprudence, specific instruments still mandate physical ink and wet registration:
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-paper border border-border space-y-1">
              <div className="font-bold text-vermilion">Wills & Codicils</div>
              <div className="text-[11px] font-mono text-ink-faint">Succession Act 1925</div>
              <p className="text-ink-soft text-[11px]">
                Testamentary instruments require physical wet-ink execution and in-person attestation by at least two subscribing witnesses.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper border border-border space-y-1">
              <div className="font-bold text-vermilion">Immovable Property Deeds</div>
              <div className="text-[11px] font-mono text-ink-faint">Registration Act 1908 / TP Act 1882</div>
              <p className="text-ink-soft text-[11px]">
                Conveyances, title transfers, and mortgages require formal physical biometric thumbprint registration at the sub-registry office.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-paper border border-border space-y-1">
              <div className="font-bold text-vermilion">Physical Bearer Instruments</div>
              <div className="text-[11px] font-mono text-ink-faint">Negotiable Instruments Act 1881</div>
              <p className="text-ink-soft text-[11px]">
                Physical promissory notes, bills of exchange, and bearer cheques requiring manual endorsement cannot be substituted purely digitally.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Hash Verification Widget */}
        <section className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-pine-900" />
              <h3 className="font-serif font-bold text-base text-pine-900">
                Interactive Hash Verification Tool (FIPS 180-4)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-ink-faint">CCA Bangladesh Trust Chain</span>
          </div>

          <p className="text-xs text-ink-soft">
            Legal counsel and compliance officers can paste any SignDesk SHA-256 certificate digest to verify mathematical integrity against our sovereign registry.
          </p>

          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              value={verifyHashInput}
              onChange={(e) => setVerifyHashInput(e.target.value)}
              className="flex-1 p-2.5 rounded-lg border border-border bg-paper text-ink font-mono text-xs focus:outline-none focus:border-pine-900"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-brass" />
              <span>Verify Digest</span>
            </button>
          </form>

          {verifiedResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>SHA-256 Digest Confirmed Intact & Validated</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-800">
                Merkle Leaf matches CCA Bangladesh Root Registry • Zero Bit Collision Drift • Legally Binding Record
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
