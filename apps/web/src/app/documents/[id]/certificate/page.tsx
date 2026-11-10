'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ShieldCheck,
  Download,
  Printer,
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Scale,
  Award,
  Fingerprint,
  Building2,
  Calendar,
  ExternalLink,
  FileCheck2,
} from 'lucide-react';

export default function CertificateOfCompletionPage() {
  return (
    <AuthGuard>
      <CertificateOfCompletionContent />
    </AuthGuard>
  );
}

function CertificateOfCompletionContent() {
  const params = useParams();
  const id = (params.id as string) || '8849-ICT';
  const envelopeId = id.startsWith('ENV-') ? id : `ENV-BD-2024-${id}`;

  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24 print:bg-white print:p-0">
      {/* Top Action Bar (hidden in print) */}
      <div className="border-b border-border bg-surface px-6 py-4 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/documents/${id}`}>
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Envelope</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
              <Lock className="w-3.5 h-3.5 text-brass-dark" />
              <span>{envelopeId}</span>
              <span>•</span>
              <span className="text-emerald-800 font-semibold">Irrevocable Sealed Record</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-ink-soft" />
              <span>Print Attestation</span>
            </button>

            <button
              onClick={() =>
                copyToClipboard(
                  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                  'verify'
                )
              }
              className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Fingerprint className="w-3.5 h-3.5 text-pine-900" />
              <span>{copiedHash === 'verify' ? 'Hash Copied!' : 'Verify Hash'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-4 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-1.5 shadow-warm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-brass" />
              <span>Cryptographic PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Certificate Document (A4 Ratio Sheet) */}
      <div className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 print:m-0 print:p-0 print:max-w-none">
        <div className="bg-surface rounded-2xl border-2 border-brass/50 p-8 sm:p-12 shadow-warm relative overflow-hidden print:border-none print:shadow-none print:p-8">
          {/* Subtle Guilloché / Watermark Border */}
          <div className="absolute inset-2 border border-brass/25 rounded-xl pointer-events-none" />

          {/* Statutory Crest Header */}
          <div className="text-center pb-6 border-b border-border/80 relative">
            <div className="inline-flex items-center justify-center mb-3">
              <WaxSeal size={64} className="shadow-warm" />
            </div>

            <div className="text-[10px] font-mono tracking-widest uppercase text-brass-dark font-bold mb-1">
              People&apos;s Republic of Bangladesh • Electronic Transactions & Notarial PKI Register
            </div>
            <div className="text-xs font-mono text-ink-faint tracking-wider uppercase mb-2">
              ICT Act 2006 §7 & §14 Validated • CCA Bangladesh
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-pine-900 tracking-tight">
              Certificate of Completion
            </h1>
            <p className="text-xs text-ink-soft mt-1.5 max-w-xl mx-auto">
              Formal Forensic Evidentiary Record and Statutory Verification of Electronic Execution
            </p>

            <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-ink-soft">
              <div>
                Certificate ID: <strong className="text-pine-900">BD-CERT-2024-8849X</strong>
              </div>
              <div>•</div>
              <div>
                Execution Date: <strong className="text-pine-900">24 Oct 2024, 11:28:44 BST</strong>
              </div>
              <div>•</div>
              <div>
                Standard: <strong className="text-pine-900">CCA Bangladesh / PKI-v2.4</strong>
              </div>
            </div>
          </div>

          {/* Section I: Instrument Summary */}
          <div className="py-6 border-b border-border/80">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif text-base font-bold text-pine-900">
                Section I. Execution Instrument Summary
              </span>
              <span className="text-xs font-mono text-ink-faint">(Bilateral Legal Deed)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-paper p-3.5 rounded-xl border border-border">
                <div className="text-[10px] font-mono uppercase text-ink-faint">Document Title & UUID</div>
                <div className="font-serif font-bold text-pine-900 text-sm mt-0.5">
                  Rahim Traders — Commercial Supply & Bilateral Logistics Agreement
                </div>
                <div className="font-mono text-[11px] text-ink-faint mt-1">
                  UUID: 8849-ICT-DHAKA-2024
                </div>
              </div>

              <div className="bg-paper p-3.5 rounded-xl border border-border">
                <div className="text-[10px] font-mono uppercase text-ink-faint">Initiating Entity & Tax ID</div>
                <div className="font-medium text-pine-900 mt-0.5">
                  Rahim Textiles & Trade Ltd.
                </div>
                <div className="font-mono text-[11px] text-ink-soft mt-1">
                  e-TIN: 8492048192-BD • Tejgaon Industrial Area, Dhaka
                </div>
              </div>

              <div className="bg-paper p-3.5 rounded-xl border border-border">
                <div className="text-[10px] font-mono uppercase text-ink-faint">Total Consideration</div>
                <div className="font-serif font-bold text-pine-900 text-base mt-0.5">
                  ৳ 1,450,000.00 BDT
                </div>
                <div className="text-[11px] text-ink-soft mt-0.5">
                  Confirmed Irrevocable Letter of Credit (LC) Terms
                </div>
              </div>

              <div className="bg-paper p-3.5 rounded-xl border border-border">
                <div className="text-[10px] font-mono uppercase text-ink-faint">Non-Judicial Stamp Duty Ref</div>
                <div className="font-mono font-medium text-pine-900 mt-0.5">
                  TR-DH-882914-2024
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                  Treasury Duty Paid ৳1,000 • Sub-Registry Sadar Dhaka
                </div>
              </div>
            </div>

            {/* Root SHA-256 Digest Box */}
            <div className="mt-4 p-3.5 rounded-xl bg-paper border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="truncate">
                <div className="text-[10px] font-mono uppercase text-ink-faint">Document Root SHA-256 Digest</div>
                <div className="font-mono text-xs text-pine-900 font-bold truncate mt-0.5">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <button
                onClick={() =>
                  copyToClipboard(
                    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                    'digest'
                  )
                }
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-ink hover:text-pine-900 font-mono text-[11px] font-semibold flex items-center gap-1.5 shadow-subtle whitespace-nowrap"
              >
                {copiedHash === 'digest' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Digest</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section II: Signatory Record */}
          <div className="py-6 border-b border-border/80">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-base font-bold text-pine-900">
                Section II. Certified Signatory Execution Record (2 of 2)
              </span>
              <span className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Bilateral Assent Complete
              </span>
            </div>

            <div className="space-y-4">
              {/* Signatory 1 */}
              <div className="p-4 rounded-xl bg-paper border border-border space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-pine-900 text-sm">
                      Ayesha Rahman
                    </span>
                    <span className="text-xs text-ink-soft ml-2">
                      (Managing Director, Rahim Textiles & Trade Ltd.)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    VERIFIED NID (#***-***-5521)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-ink-soft">
                  <div>Email: ayesha.rahman@rahimtraders.com</div>
                  <div>IP: 103.25.12.8 (Dhaka, BD)</div>
                  <div>Affixed: 24 Oct 2024, 10:14:22 BST</div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px]">
                  <span className="text-ink-faint">PKI Token Mark: HSM ECDSA P-256</span>
                  <span className="text-pine-900 font-semibold">
                    7b31c9a8e0f14d82...00ea
                  </span>
                </div>
              </div>

              {/* Signatory 2 */}
              <div className="p-4 rounded-xl bg-paper border border-border space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-pine-900 text-sm">
                      Tanvir Ahmed
                    </span>
                    <span className="text-xs text-ink-soft ml-2">
                      (Managing Director, Meghna Distribution Corp.)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    VERIFIED NID (#***-***-9120)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-ink-soft">
                  <div>Email: tanvir@meghnadist.com</div>
                  <div>IP: 103.114.98.24 (Agrabad, CTG)</div>
                  <div>Affixed: 24 Oct 2024, 11:28:44 BST</div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between font-mono text-[11px]">
                  <span className="text-ink-faint">Hardware Security Mark: ECDSA P-256</span>
                  <span className="text-pine-900 font-semibold">
                    e801fd2298ab41...bb91
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Notarial Attestation */}
          <div className="pt-6">
            <div className="p-5 rounded-xl bg-pine-900 text-paper space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-brass" />
                <span className="font-serif text-sm font-bold text-brass uppercase tracking-wider">
                  Statutory Notarial Attestation
                </span>
              </div>

              <blockquote className="italic font-serif text-xs leading-relaxed text-paper/90">
                &ldquo;It is hereby certified under Section 7 and Section 14 of the Bangladesh Information and Communication Technology (ICT) Act 2006 that this electronic document has been executed in due sequence, that each digital mark was affixed with the statutory assent of the signatories, and that the cryptographic payload has remained mathematically intact and unaltered since final sealing.&rdquo;
              </blockquote>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-paper/80">
                <div>FIPS 140-2 Level 3 HSM</div>
                <div>•</div>
                <div>CA-BD-2024-X (CCA Compliant)</div>
                <div>•</div>
                <div className="text-brass">10-Yr Vault (Until 24 Oct 2034)</div>
              </div>
            </div>

            {/* Verification Nodes */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-ink-faint">
              <div>SignDesk Cryptographic CA: BD-ROOT-0092-2024</div>
              <div>Controller of Certifying Authorities Node: DHAKA-REG-2024/774</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
