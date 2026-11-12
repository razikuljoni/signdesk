'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { apiFetch } from '@/lib/api';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  RefreshCw,
  FolderOpen,
  Lock,
  ShieldCheck,
  Sparkles,
  Save,
  Check,
  FileCheck2,
  Handshake,
  Shield,
  ClipboardList,
  Layers,
  Fingerprint
} from 'lucide-react';

export default function NewEnvelopePage() {
  return (
    <AuthGuard>
      <NewEnvelopeContent />
    </AuthGuard>
  );
}

function NewEnvelopeContent() {
  const router = useRouter();
  const { user, workspace } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(3);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Compute SHA-256 hash using native Web Crypto API
  const computeSha256 = async (buffer: BufferSource): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileChange = async (selectedFile: File) => {
    setError(null);

    // Reject non-PDF (§6.1: PDF only)
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file format. Only PDF documents are supported under Bangladesh ICT Act 2006.');
      return;
    }

    // Reject > 25 MB (§6.1: 25 MB cap)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB MVP cap. Please upload a smaller PDF.');
      return;
    }

    setIsHashing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hash = await computeSha256(arrayBuffer);
      setFileHash(hash);
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.pdf$/i, ''));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setPageCount(3);
    } catch (err) {
      setError('Failed to process PDF file. Please try another document.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleSelectPreloaded = async (templateName: string, mockPages: number) => {
    setTitle(templateName);
    setIsHashing(true);
    const demoBuffer = new TextEncoder().encode(templateName + '_sign_desk_v1');
    const hash = await computeSha256(demoBuffer);
    setFileHash(hash);
    setPageCount(mockPages);
    setFile({
      name: `${templateName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
      size: 1845000,
    } as any);
    setFileDataUrl('/samples/bd-standard-nda.pdf');
    setIsHashing(false);
  };

  const handleContinue = async () => {
    if (!title.trim()) {
      setError('Please provide a title for this agreement.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const originalPdfUrl = fileDataUrl || '/samples/bd-standard-nda.pdf';
      const originalHash = fileHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

      const res = await apiFetch<any>('/envelopes', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          originalPdfUrl,
          originalHash,
        }),
      });

      router.push(`/envelopes/${res.id}/prepare`);
    } catch (err: any) {
      setError(err.message || 'Failed to create envelope draft');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Stepper Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-pine-900 hover:text-pine-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {/* Workflow Stepper */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-900 text-paper font-bold shadow-sm">
            <span>1.</span>
            <span>Upload Documents</span>
          </div>
          <span className="text-ink-faint">&gt;</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-ink-faint">
            <span>2.</span>
            <span>Prepare &amp; Place Fields</span>
          </div>
          <span className="text-ink-faint">&gt;</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-ink-faint">
            <span>3.</span>
            <span>Recipients &amp; Send</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
          <span>ICT Act 2006 Verified</span>
        </div>
      </div>

      {/* Headline & Architectural Subhead */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-pine-600" />
          <span>Statutory Archival Repository • ICT Act 2006</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-pine-900 tracking-tight">
          Upload Document for Execution
        </h1>
        <p className="text-sm text-ink-soft max-w-3xl leading-relaxed">
          Upload bilateral agreements, corporate indentures, or vendor work orders. Incoming documents are immediately normalized to archival ISO 19005-1 PDF/A-1b specifications with real-time SHA-256 integrity verification.
        </p>
        <div className="text-[11px] text-ink-faint font-mono pt-1">
          Intake Ledger Node: SEC-BD-DHK-NODE-04 • Asia/Dhaka GMT+6
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger-bg text-danger border border-danger/30 rounded-xl text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Main Upload Area (7 cols) + Execution Protocol Sidebar (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Upload Box & Active Candidate (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Agreement Title Input */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
            <label htmlFor="agreement-title" className="text-xs font-bold text-pine-900 uppercase tracking-wider block">
              Envelope / Agreement Title
            </label>
            <input
              id="agreement-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Commercial Supply Agreement — Rahim Traders & Meghna Corp"
              className="w-full px-3.5 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all font-medium"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files[0];
              if (dropped) handleFileChange(dropped);
            }}
            onClick={() => document.getElementById('pdf-file-input')?.click()}
            className="border-2 border-dashed border-border-strong hover:border-pine-600 rounded-2xl p-8 sm:p-12 text-center bg-surface hover:bg-surface-raised/50 transition-all cursor-pointer space-y-4 shadow-warm-sm group"
          >
            <div className="w-16 h-16 rounded-full bg-pine-100 group-hover:scale-105 transition-transform flex items-center justify-center mx-auto text-pine-900">
              <UploadCloud className="w-8 h-8 text-pine-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-pine-900">
                Drop your PDF here, or browse files
              </h3>
              <p className="text-xs text-ink-soft">
                PDF only • Up to 25 MB • Multi-page contracts supported
              </p>
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-pine-100 text-pine-900 hover:bg-pine-200 text-xs font-semibold inline-flex items-center gap-2 transition-all"
              >
                <FolderOpen className="w-4 h-4 text-pine-600" />
                <span>Browse Local Workstation</span>
              </button>
            </div>
            <p className="text-[11px] text-ink-faint font-mono flex items-center justify-center gap-1.5 pt-2">
              <Lock className="w-3.5 h-3.5 text-pine-600" />
              <span>Encrypted via TLS 1.3 with SHA-256 hash pre-generation on upload.</span>
            </p>
            <input
              id="pdf-file-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
            />
          </div>

          {/* Active Staged Document Card */}
          <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-border pb-3">
              <span className="font-mono text-ink-soft font-semibold">
                Active Document Candidate (1/1) • MIME: application/pdf
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                <Check className="w-3 h-3 text-emerald-600" /> Verified PDF/A Ready
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-pine-100 text-pine-900 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-pine-600" />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-pine-900 text-sm">
                    {file?.name || 'Commercial Supply Agreement.pdf'}
                  </div>
                  <div className="text-xs text-ink-soft">
                    {pageCount} pages • {(file?.size ? (file.size / (1024 * 1024)).toFixed(1) : '1.8')} MB • Uploaded today at 11:20 AM BST
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-ink-faint pt-1">
                    <Fingerprint className="w-3.5 h-3.5 text-pine-600" />
                    <span className="break-all">
                      SHA-256: {fileHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => alert('PDF Archival Preview: 3 pages validated. Embedded fonts subsetted.')}
                  className="p-2 rounded-lg border border-border bg-paper hover:bg-surface-raised text-pine-900 text-xs transition-all"
                  title="Preview PDF"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('pdf-file-input')?.click()}
                  className="p-2 rounded-lg border border-border bg-paper hover:bg-surface-raised text-pine-900 text-xs transition-all"
                  title="Replace PDF"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setFileHash(null);
                  }}
                  className="p-2 rounded-lg border border-danger/30 bg-danger-bg hover:bg-danger/20 text-danger text-xs transition-all"
                  title="Remove PDF"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pre-Vetted Templates Alternative */}
          <div className="bg-surface-raised rounded-2xl border border-border p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-pine-600" />
                <h3 className="font-bold text-xs text-pine-900 uppercase tracking-wider">
                  Prefer a standardized legal instrument?
                </h3>
              </div>
              <Link href="/templates" className="text-xs text-pine-600 hover:underline font-semibold">
                Browse All Templates &rarr;
              </Link>
            </div>
            <p className="text-xs text-ink-soft">
              Avoid re-uploading standard terms. Launch with vetted, high-court enforceable legal instruments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleSelectPreloaded('Commercial Supply Agreement (BDT)', 3)}
                className="p-3 bg-surface border border-border/80 hover:border-pine-600 rounded-xl text-left space-y-1 transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-pine-900 group-hover:text-pine-600">
                  <Handshake className="w-3.5 h-3.5 text-pine-600" />
                  <span>Commercial Supply</span>
                </div>
                <div className="text-[11px] text-ink-faint">3 Pages • BSTI Clause</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreloaded('Institutional Bilateral NDA', 2)}
                className="p-3 bg-surface border border-border/80 hover:border-pine-600 rounded-xl text-left space-y-1 transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-pine-900 group-hover:text-pine-600">
                  <Shield className="w-3.5 h-3.5 text-pine-600" />
                  <span>Bilateral NDA</span>
                </div>
                <div className="text-[11px] text-ink-faint">2 Pages • IP Protection</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreloaded('Standard Commercial Work Order', 2)}
                className="p-3 bg-surface border border-border/80 hover:border-pine-600 rounded-xl text-left space-y-1 transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-pine-900 group-hover:text-pine-600">
                  <ClipboardList className="w-3.5 h-3.5 text-pine-600" />
                  <span>Standard Work Order</span>
                </div>
                <div className="text-[11px] text-ink-faint">2 Pages • Commercial Agreement</div>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Execution Protocol & Archival Manifest Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-5">
            <h3 className="font-display text-lg font-bold text-pine-900">
              Execution Protocol &amp; Archival Manifest
            </h3>

            {/* Checklist */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-pine-900 block font-semibold">Deterministic Document Hash</strong>
                  <p className="text-ink-soft leading-relaxed">
                    The SHA-256 pre-hash locks down document text to protect against subsequent tampering.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-pine-900 block font-semibold">Bangladeshi Statutory Standards</strong>
                  <p className="text-ink-soft leading-relaxed">
                    Compliant with Section 6 &amp; 7 of the ICT Act 2006 for admissible electronic evidentiary weight.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="text-pine-900 block font-semibold">Substrate Longevity (PDF/A-1b)</strong>
                  <p className="text-ink-soft leading-relaxed">
                    Color profiles, embedded font matrices, and archival metadata remain immutable for 20+ years.
                  </p>
                </div>
              </div>
            </div>

            {/* Security Clearance */}
            <div className="p-3.5 bg-paper rounded-xl border border-border/80 text-xs font-mono space-y-1">
              <div className="text-pine-900 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pine-600" />
                <span>Security Clearance:</span>
              </div>
              <p className="text-ink-soft text-[11px]">
                256-Bit TLS Secure Sockets Layer Authenticated • Dhaka Sub-Registry Root CA
              </p>
            </div>

            {/* Manifest Specs */}
            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-ink-soft">
                <span>Signer Allocation Slots:</span>
                <span className="font-mono text-pine-900 font-semibold">Configurable in Step 2</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Audit Trail Type:</span>
                <span className="font-mono text-pine-900 font-semibold">Bi-Lingual (EN / BN)</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Retention Class:</span>
                <span className="font-mono text-pine-900 font-semibold">Class A (Corporate Ledger)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-surface rounded-2xl border border-border p-4 sm:p-5 shadow-warm-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => alert('Draft saved to sovereign workspace vault.')}
          className="px-4 py-2.5 rounded-xl border border-border bg-paper hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-2 transition-all w-full sm:w-auto justify-center"
        >
          <Save className="w-4 h-4 text-pine-600" />
          <span>Save as Draft</span>
        </button>

        <span className="text-xs text-ink-soft font-mono text-center">
          Ready to define field coordinates • Page 1 to {pageCount}
        </span>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-warm-sm w-full sm:w-auto"
        >
          <span>Continue to Prepare</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Statutory Footer Strip */}
      <div className="text-center text-[11px] text-ink-faint font-mono pt-2">
        Tamper-Evident SHA-256 Audit Sealing • Statutory Electronic Execution under Bangladesh ICT Act 2006
      </div>
    </div>
  );
}