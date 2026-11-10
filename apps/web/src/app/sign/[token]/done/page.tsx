'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  const token = (params.token as string) || 'demo_token';

  const signerName = 'Tanvir Ahmed';
  const signerEmail = 'tanvir@meghnadist.com';
  const signerRole = 'Managing Director, Meghna Distribution Corp.';
  const documentTitle = 'Rahim Traders — Commercial Supply Agreement';
  const contractRef = '#RT-2024-884A';
  const envelopeId = 'BD-2024-MEGHNA-8849';
  const sha256Digest = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const [copied, setCopied] = useState(false);

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
            <Link href="/dashboard" className="flex items-center gap-2 text-pine-900 font-serif font-bold text-lg">
              <WaxSeal size={28} />
              <span>SignDesk</span>
            </Link>
            <span className="text-ink-faint">|</span>
            <div className="text-xs text-ink-soft">
              <span className="font-semibold text-pine-900">{documentTitle}</span>
              <span className="font-mono text-[11px] text-ink-faint ml-2">{contractRef}</span>
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
            The Commercial Supply & Bilateral Logistics Agreement between <strong>Rahim Textiles & Trade Ltd.</strong> and <strong>Meghna Distribution Corp.</strong> has been successfully signed by <strong>{signerName}</strong> ({signerRole}).
          </p>

          {/* Signatory Attestation Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-paper border border-border text-left space-y-3 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pine-900 text-paper font-serif font-bold text-sm flex items-center justify-center">
                  TA
                </div>
                <div>
                  <div className="font-bold text-pine-900 text-sm flex items-center gap-1.5">
                    <span>{signerName}</span>
                    <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-ink-soft">{signerEmail}</div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-pine-100 text-pine-900 border border-pine-300">
                PKI-ECDSA ATTESTED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-ink-soft">
              <div>
                <span className="text-ink-faint">NID Identity: </span>
                <span className="text-pine-900 font-medium">••••••••9120 (EC Verified)</span>
              </div>
              <div>
                <span className="text-ink-faint">IP Geostamp: </span>
                <span className="text-pine-900 font-medium">103.114.98.24 (Chittagong)</span>
              </div>
              <div>
                <span className="text-ink-faint">Authentication: </span>
                <span className="text-pine-900 font-medium">2FA OTP + Biometric Hash</span>
              </div>
              <div>
                <span className="text-ink-faint">Execution Time: </span>
                <span className="text-pine-900 font-medium">24 Oct 2024, 11:28:44 BST</span>
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
                  className="text-[11px] font-mono text-pine-900 font-semibold hover:underline flex items-center gap-1"
                >
                  {copied ? (
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
              <div className="font-mono text-xs text-pine-900 break-all font-medium">
                {sha256Digest}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono text-ink-soft">
              <div>
                Certificate Ref: <strong className="text-pine-900">BD-CERT-2024-8849X</strong>
              </div>
              <div>
                Security: <strong className="text-pine-900">FIPS 140-2 Level 3 HSM</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-pine-50/60 border border-pine-200/80 text-[11px] text-pine-900 leading-relaxed flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-pine-800 shrink-0 mt-0.5" />
              <span>
                <strong>Admissibility Statement:</strong> Admissible as primary electronic evidence under Section 7 of the Bangladesh ICT Act 2006. Valid in any Court of Law or Admiralty Jurisdiction in Bangladesh.
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="py-3 px-4 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-brass" />
            <span>Download Sealed PDF & Certificate</span>
          </button>

          <Link href={`/documents/8849-ICT/audit`}>
            <button className="w-full py-3 px-4 rounded-xl border border-border bg-surface hover:bg-paper text-ink text-xs font-semibold shadow-subtle transition-all flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pine-900" />
              <span>View Forensic Audit Trail</span>
            </button>
          </Link>
        </div>

        {/* Automated Post-Execution Workflow Steps (3 of 3 Active) */}
        <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle space-y-3">
          <div className="font-serif font-bold text-xs text-pine-900 pb-2 border-b border-border">
            Automated Post-Execution Workflow Steps (3 of 3 Active)
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-paper border border-border">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-paper text-xs flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <div className="font-semibold text-pine-900">
                  Step 01: Cryptographic PDF Dispatched
                </div>
                <div className="text-[11px] text-ink-soft">
                  Sealed PDF with embedded PKI signature delivered to all signatories Ayesha Rahman, Tanvir Ahmed, and CC observer Advocate Kamal Uddin via SMTP-TLS.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-paper border border-border">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-paper text-xs flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <div className="font-semibold text-pine-900">
                  Step 02: Certificate of Completion
                </div>
                <div className="text-[11px] text-ink-soft">
                  Tamper-evident ledger detailing IP geostamps, telecom cell records, and NID verification hashes permanently archived with digital thumbprints.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-paper border border-border">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-paper text-xs flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <div className="font-semibold text-pine-900">
                  Step 03: Statutory 10-Year Safe Harbor
                </div>
                <div className="text-[11px] text-ink-soft">
                  Deed deposited into SignDesk&apos;s HSM-encrypted legal vault compliant with Bangladesh Sub-Registry and NBR corporate filing guidelines (Retention Lock: Oct 2034).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Navigation */}
        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="text-xs text-pine-900 font-semibold hover:underline"
          >
            Return to Workspace Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
