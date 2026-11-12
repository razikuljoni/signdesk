'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ShieldCheck,
  Lock,
  Key,
  Server,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  Layers,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';

export default function SecurityArchitecturePage() {
  const [copiedHash, setCopiedHash] = useState(false);
  const sampleHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
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
            <Link href="/legal" className="text-ink-soft hover:text-pine-900">
              Legal Admissibility
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
        {/* Hero & Avalanche Effect Explainer */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brass-dark font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Cryptographic Architecture & Sovereign Trust</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-pine-900 tracking-tight leading-tight">
            Mathematical Finality. Zero Ambiguity.
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft max-w-3xl leading-relaxed">
            How SignDesk guarantees that an executed contract in Bangladesh cannot be altered by even a single comma or bit without breaking the cryptographic Merkle chain.
          </p>
        </div>

        {/* Avalanche Effect Explainer Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-warm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <Cpu className="w-5 h-5 text-pine-900" />
            <h2 className="font-serif font-bold text-base text-pine-900">
              The SHA-256 Avalanche Principle
            </h2>
          </div>

          <p className="text-xs text-ink-soft leading-relaxed">
            In SignDesk&apos;s cryptographic audit engine, every uploaded contract and execution event produces a 256-bit (64 hexadecimal character) deterministic mathematical digest. If an adversary modifies a single punctuation mark or monetary figure in the PDF, the resulting hash mutates drastically, instantly invalidating the Certificate of Completion.
          </p>

          <div className="p-4 rounded-xl bg-paper border border-border font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-[10px] text-ink-faint uppercase">
              <span>Canonical FIPS 180-4 Master Hash Specimen:</span>
              <button
                onClick={handleCopy}
                className="text-pine-900 font-semibold hover:underline flex items-center gap-1"
              >
                {copiedHash ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Hash</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-pine-900 font-bold break-all">{sampleHash}</div>
          </div>
        </div>

        {/* Four Core Architectural Pillars */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-pine-900">
            Four Core Architectural Pillars
          </h2>

          <div className="grid md:grid-cols-2 gap-5 text-xs">
            {/* Pillar 1 */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                1. Encryption at Rest & Transit
              </h3>
              <p className="text-ink-soft leading-relaxed">
                All communications mandate TLS 1.3 with AES-256 GCM authenticated encryption. Sensitive data and cryptographic token hashes are stored strictly inside secure hardware-backed enclaves.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                2. Sovereign Cloud & Residency
              </h3>
              <p className="text-ink-soft leading-relaxed">
                100% of document payload data and cryptographic ledgers reside strictly inside sovereign data centers in Dhaka, fully compliant with Bangladesh Bank Core Banking data residency rules.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                3. Granular Zero-Trust Access
              </h3>
              <p className="text-ink-soft leading-relaxed">
                Single-use cryptographic nonces expire automatically after 14 days. Signatories undergo multi-factor authentication via secure email magic links with strict IP geofencing and audit tracking.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center">
                <HardDrive className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-pine-900">
                4. 10-Year Safe Harbor Archival
              </h3>
              <p className="text-ink-soft leading-relaxed">
                WORM (Write Once, Read Many) cold storage preserves sealed deeds and audit trails for a minimum statutory period of 10 years, meeting NBR, RJSC, and Bankers&apos; Books Evidence Act standards.
              </p>
            </div>
          </div>
        </section>

        {/* Institutional Compliance Badges */}
        <section className="p-6 rounded-2xl bg-surface border border-brass/40 shadow-subtle space-y-4">
          <div className="font-serif font-bold text-sm text-pine-900 text-center">
            Institutional Trust & Regulatory Certifications
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs font-mono">
            <div className="p-3 bg-paper rounded-xl border border-border">
              <div className="font-bold text-pine-900">ICT Act 2006</div>
              <div className="text-[10px] text-ink-faint mt-0.5">Statutory Standard</div>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-border">
              <div className="font-bold text-pine-900">ISO 27001</div>
              <div className="text-[10px] text-ink-faint mt-0.5">Security Certified</div>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-border">
              <div className="font-bold text-pine-900">SOC 2 Type II</div>
              <div className="text-[10px] text-ink-faint mt-0.5">Trust Services</div>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-border">
              <div className="font-bold text-pine-900">FIPS 180-4</div>
              <div className="text-[10px] text-ink-faint mt-0.5">SHA-256 Digest</div>
            </div>
            <div className="p-3 bg-paper rounded-xl border border-border col-span-2 sm:col-span-1">
              <div className="font-bold text-pine-900">NTP-BD-01</div>
              <div className="text-[10px] text-ink-faint mt-0.5">Atomic Sync ±2µs</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
