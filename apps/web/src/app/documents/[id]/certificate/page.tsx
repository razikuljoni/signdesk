'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import { apiFetch } from '@/lib/api';
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
  const id = params.id as string;

  const [envelope, setEnvelope] = useState<any>(null);
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      Promise.all([
        apiFetch<any>(`/envelopes/${id}`),
        apiFetch<any>(`/envelopes/${id}/audit-trail`).catch(() => null),
      ])
        .then(([envData, auditData]) => {
          setEnvelope(envData);
          setAudit(auditData);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('signdesk_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const url = `${apiUrl}/envelopes/${id}/certificate`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Download failed');
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `Certificate-of-Completion-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch(() => window.print());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <p className="font-mono text-xs text-ink-soft">Loading Certificate of Completion...</p>
      </div>
    );
  }

  const envelopeId = envelope?.id || id;
  const originalHash = envelope?.originalHash || audit?.genesisHash || 'Genesis Hash Pending';
  const recipients = envelope?.recipients || [];

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
              <Lock className="w-3.5 h-3.5 text-brass" />
              <span>#{envelopeId.slice(0, 8).toUpperCase()}</span>
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
              <span>Print Certificate</span>
            </button>

            <button
              onClick={() => copyToClipboard(originalHash, 'verify')}
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
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Parchment Document Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 print:p-0 print:max-w-none">
        <div className="bg-surface rounded-2xl border-2 border-border shadow-warm p-8 sm:p-12 space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Certificate Header Banner */}
          <div className="border-b-2 border-pine-900 pb-6 flex items-start justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brass font-bold">
                <span>Official Forensic Attestation</span>
                <span>•</span>
                <span>ICT Act 2006 §7</span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-pine-900 tracking-tight">
                Certificate of Completion
              </h1>
              <p className="text-xs text-ink-soft max-w-xl">
                Simple Electronic Signature under Bangladesh ICT Act 2006. Tamper-evident legal certificate proving electronic assent, timestamps, and unbroken SHA-256 audit hash chain.
              </p>
            </div>

            <div className="shrink-0 text-right">
              <WaxSeal size={56} className="mx-auto" />
              <div className="text-[10px] font-mono font-bold text-pine-900 uppercase mt-2">
                ICT ACT 2006 (SEC. 7)
              </div>
            </div>
          </div>

          {/* Instrument Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-paper border border-border text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint">Document Subject</span>
              <div className="font-semibold text-pine-900 text-sm mt-0.5">{envelope?.title}</div>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase text-ink-faint">Envelope Identifier</span>
              <div className="font-mono text-ink mt-0.5">{envelopeId}</div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] font-mono uppercase text-ink-faint">Genesis SHA-256 Digest</span>
              <div className="font-mono text-[11px] text-ink-soft mt-0.5 break-all select-all">
                {originalHash}
              </div>
            </div>
          </div>

          {/* Signatories Execution Table */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-base text-pine-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Attested Signatories &amp; Forensic Log</span>
            </h2>

            <div className="border border-border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-paper border-b border-border text-[11px] font-mono text-ink-soft uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Signer Name &amp; Role</th>
                    <th className="py-2.5 px-4">Email / Contact</th>
                    <th className="py-2.5 px-4">Execution Status</th>
                    <th className="py-2.5 px-4">Timestamp (BST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recipients.map((r: any, idx: number) => (
                    <tr key={r.id || idx}>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-pine-900">{r.name}</div>
                        <div className="text-[11px] text-ink-soft font-mono">{r.role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">{r.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            r.status === 'SIGNED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-900 border-amber-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">
                        {r.signedAt
                          ? new Date(r.signedAt).toLocaleString('en-GB')
                          : 'Pending Execution'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statutory Seal Bottom Note */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-pine-900">
                Simple Electronic Signature under Bangladesh ICT Act 2006 • SignDesk Technologies Ltd.
              </div>
              <div className="text-[11px] font-mono text-ink-faint">
                SHA-256 Merkle hash chain guarantees document integrity. Enforceable under ICT Act 2006 Section 7 &amp; Evidence Act 1872.
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-pine-100 text-pine-900 font-mono text-[11px] font-semibold">
              SHA-256 NOTARIZED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
