'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Download,
  Bell,
  Ban,
  Calendar,
  ExternalLink,
  Copy,
  ChevronRight,
  Hash,
  ShieldAlert,
  RotateCcw,
  Check,
  Lock,
  MessageSquare,
  Scale,
  Award,
  Layers,
  FileCheck2,
  Send,
  Eye,
  Building2,
  FolderOpen
} from 'lucide-react';

export default function DocumentDetailPage() {
  return (
    <AuthGuard>
      <DocumentDetailContent />
    </AuthGuard>
  );
}

function DocumentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || 'ENV-BD-2024-8849-ICT';

  const [activeTab, setActiveTab] = useState<'timeline' | 'files'>('timeline');
  const [remindedSent, setRemindedSent] = useState(false);
  const [extendedNotice, setExtendedNotice] = useState(false);
  const [isVoided, setIsVoided] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const doc = {
    id: id.startsWith('ENV-') ? id : `ENV-BD-${id}`,
    title: 'Rahim Traders — Commercial Supply Agreement',
    subtitle: 'Executing counterparty: Meghna Distribution Corp. • Standard Supply Terms & Conditions (Annexure A to D)',
    status: isVoided ? 'Voided' : 'In Progress (Awaiting Counterparty)',
    createdBST: '24 Oct 2024, 09:30 AM BST',
    expiresBST: '28 Oct 2024, 23:59 BST',
    valueBDT: '৳1,450,000 BDT',
    lcRef: 'Letter of Credit (LC) Irrevocable Terms • NBR Mushak-6.3',
    originalHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    signers: [
      {
        order: 1,
        name: 'Ayesha Rahman',
        role: 'Managing Director, Rahim Textiles & Trade Ltd.',
        email: 'ayesha.rahman@rahimtrade.com.bd',
        status: 'Executed & Affixed',
        completedAt: '24 Oct 2024, 10:14 AM BST',
        ip: '103.25.12.8 (Gulshan-2, Dhaka)',
        nidVerified: 'NID: ••••••••5521 (EC Verified via Porichoy)',
        hash: 'c74b901a8849e3...99e4',
        color: '#0C2E29',
        isDone: true,
      },
      {
        order: 2,
        name: 'Tanvir Ahmed',
        role: 'Managing Director, Meghna Distribution Corp.',
        email: 't.ahmed@meghnadist.com',
        phone: '+880 1711-884920',
        status: 'Awaiting Signature (Current Turn)',
        lastViewed: '24 Oct 2024, 11:15 AM BST',
        ip: '103.114.98.24 (Agrabad, Chittagong)',
        dispatchChannel: 'Magic Link delivered via WhatsApp & TLS Email',
        tokenLink: '/sign/demo_token_tanvir_4b5c6d7e8f9a0b1c',
        color: '#B3402A',
        isDone: false,
      },
      {
        order: 3,
        name: 'Kamal Uddin, Advocate',
        role: 'Legal Counsel (DCCI / Supreme Court Bar)',
        email: 'legal@dcibar.org.bd',
        status: 'Observer / Legal CC',
        note: 'Automated signed tamper-evident dispatch queued upon Signer 2 execution.',
        color: '#71717A',
        isDone: false,
      },
    ],
    timelineEvents: [
      {
        time: '11:15:02 BST',
        title: 'Envelope Opened by Signer 2 (Tanvir Ahmed)',
        detail: 'Active Session: Counterparty accessed execution chamber via secure token OTP • IP: 103.114.98.24 Agrabad, Chittagong',
        type: 'view',
      },
      {
        time: '10:14:48 BST',
        title: 'Magic Link Dispatched to Counterparty',
        detail: 'Delivered via Bangladesh WhatsApp Business Gateway & Corporate MX Route • HTTP 200 Delivered',
        type: 'dispatch',
      },
      {
        time: '10:14:12 BST',
        title: 'Ayesha Rahman Signed & Sealed (SHA-256 Validated)',
        detail: 'NID Biometric Verification via Porichoy API gateway • IP: 103.25.12.8 Gulshan-2, Dhaka • ECDSA Stamped',
        type: 'sign',
      },
      {
        time: '09:31:05 BST',
        title: 'Envelope Dispatched to Signer 1 (Internal TLS Route)',
        detail: 'First sequential routing node unlocked under ICT Act Section 7 rules',
        type: 'dispatch',
      },
      {
        time: '09:30:40 BST',
        title: 'Document Initialized & Form Fields Assigned',
        detail: '2 Signer blocks, 4 initial tags, 1 stamp coordinates pinned • Template: BD-COMM-2024',
        type: 'config',
      },
      {
        time: '09:30:00 BST',
        title: 'Envelope Created & Uploaded by Ayesha Rahman',
        detail: 'Original Draft Hash: e3b0c44298fc1c14...855 registered in Dhaka Vault',
        type: 'create',
      },
    ],
  };

  const handleRemind = () => {
    setRemindedSent(true);
    setTimeout(() => setRemindedSent(false), 3000);
  };

  const handleExtend = () => {
    setExtendedNotice(true);
    setTimeout(() => setExtendedNotice(false), 3000);
  };

  const handleVoid = () => {
    if (confirm('Are you sure you want to void this envelope? All active signer links will be immediately revoked.')) {
      setIsVoided(true);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${doc.signers[1].tokenLink}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs & Envelope ID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
          <Link href="/documents" className="flex items-center gap-1 hover:text-pine-900 transition-colors">
            <FolderOpen className="w-3.5 h-3.5 text-pine-600" />
            <span>Documents</span>
          </Link>
          <span>&gt;</span>
          <span>Commercial Supply Contracts</span>
          <span>&gt;</span>
          <span className="font-semibold text-pine-900 truncate max-w-xs">{doc.title}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-ink-faint">
          <Hash className="w-3.5 h-3.5 text-pine-600" />
          <span>{doc.id}</span>
          <span>•</span>
          <span>Created {doc.createdBST}</span>
        </div>
      </div>

      {/* Header & Quick Action Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900 tracking-tight">
              {doc.title}
            </h1>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                isVoided
                  ? 'bg-danger-bg text-danger border-danger/30'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              {doc.status}
            </span>
          </div>
          <p className="text-xs text-ink-soft">{doc.subtitle}</p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {!isVoided && (
            <button
              type="button"
              onClick={handleRemind}
              className="px-3.5 py-2 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-bold flex items-center gap-1.5 transition-all shadow-warm-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{remindedSent ? 'Reminder Dispatched!' : 'Remind Tanvir'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => alert('Downloading interim draft PDF with cryptographic watermark...')}
            className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-warm-sm"
          >
            <Download className="w-3.5 h-3.5 text-pine-600" />
            <span>Download Draft</span>
          </button>

          <Link href={`/envelopes/${doc.id}/prepare`}>
            <button
              type="button"
              className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-warm-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pine-600" />
              <span>Correct &amp; Resend</span>
            </button>
          </Link>

          {!isVoided && (
            <button
              type="button"
              onClick={handleExtend}
              className="px-3 py-2 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-warm-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-pine-600" />
              <span>{extendedNotice ? 'Extended (+7 Days)!' : 'Extend (Nov 07)'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs transition-all shadow-warm-sm"
            title="Copy Signer Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-pine-600" />}
          </button>

          {!isVoided && (
            <button
              type="button"
              onClick={handleVoid}
              className="p-2 rounded-xl border border-danger/30 bg-danger-bg hover:bg-danger/20 text-danger text-xs transition-all"
              title="Void / Cancel Envelope"
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Top 4 Metrics & Statutory Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Progress */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-semibold text-pine-900">Signing Progress</span>
            <span className="font-mono text-emerald-700 font-bold">50% Completed</span>
          </div>
          <div className="w-full bg-paper rounded-full h-2 border border-border overflow-hidden">
            <div className="bg-pine-600 h-full rounded-full w-1/2" />
          </div>
          <div className="text-[11px] text-ink-soft flex items-center justify-between font-mono">
            <span>1 of 2 Signatures Executed</span>
            <span className="text-amber-800 font-bold">Step 2 Active</span>
          </div>
        </div>

        {/* Metric 2: Validity Window */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-semibold text-pine-900">Validity Window</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display text-2xl font-bold text-pine-900">4 Days left</div>
          <div className="text-[11px] text-ink-faint font-mono">
            Expires 28 Oct 2024, 23:59 BST
          </div>
        </div>

        {/* Metric 3: Statutory Authority */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-semibold text-pine-900">Statutory Authority</span>
            <Scale className="w-4 h-4 text-pine-600" />
          </div>
          <div className="font-mono text-xs font-bold text-emerald-800">
            ICT Act 2006 §7 Compliant
          </div>
          <div className="text-[11px] text-ink-faint font-mono truncate">
            Class-3 PKI SHA-256 Vaulted
          </div>
        </div>

        {/* Metric 4: Instrument Value */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-semibold text-pine-900">Instrument Value</span>
            <Award className="w-4 h-4 text-brass-600" />
          </div>
          <div className="font-display text-2xl font-bold text-pine-900">{doc.valueBDT}</div>
          <div className="text-[11px] text-ink-faint font-mono truncate">
            {doc.lcRef}
          </div>
        </div>
      </div>

      {/* Sequential Execution Protocol (Signer Chain) */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pine-600" />
            <h2 className="font-display text-lg font-bold text-pine-900">
              Sequential Execution Protocol
            </h2>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enforced under Section 7, ICT Act 2006 (Bangladesh)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Signer 1: Done */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-700 text-paper text-xs font-bold font-mono flex items-center justify-center">
                1
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                <Check className="w-3 h-3 text-emerald-600" /> Executed &amp; Affixed
              </span>
            </div>
            <div>
              <strong className="text-xs text-pine-900 font-bold block">{doc.signers[0].name}</strong>
              <span className="text-[11px] text-ink-soft block">{doc.signers[0].role}</span>
              <span className="text-[11px] font-mono text-ink-faint">{doc.signers[0].email}</span>
            </div>
            <div className="pt-2 border-t border-emerald-200 text-[11px] text-ink-soft space-y-1 font-mono">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{doc.signers[0].completedAt}</span>
              </div>
              <div className="text-[10px] text-ink-faint">IP: {doc.signers[0].ip}</div>
              <div className="text-[10px] text-emerald-700">{doc.signers[0].nidVerified}</div>
            </div>
          </div>

          {/* Signer 2: Current Turn */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-paper text-xs font-bold font-mono flex items-center justify-center">
                2
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                <Clock className="w-3 h-3 text-amber-700" /> Awaiting Signature
              </span>
            </div>
            <div>
              <strong className="text-xs text-pine-900 font-bold block">{doc.signers[1].name}</strong>
              <span className="text-[11px] text-ink-soft block">{doc.signers[1].role}</span>
              <span className="text-[11px] font-mono text-ink-faint">{doc.signers[1].email}</span>
            </div>
            <div className="pt-2 border-t border-amber-200 text-[11px] text-ink-soft space-y-1 font-mono">
              <div className="text-[10px] text-amber-900">
                Last viewed: {doc.signers[1].lastViewed}
              </div>
              <div className="text-[10px] text-ink-faint">IP: {doc.signers[1].ip}</div>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <Link href={doc.signers[1]?.tokenLink || `/sign/demo_token_tanvir_4b5c6d7e8f9a0b1c`} target="_blank" className="flex-1">
                <button className="w-full py-1.5 px-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-[11px] font-semibold flex items-center justify-center gap-1 transition-all">
                  <span>Signer Chamber</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </Link>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg border border-border bg-surface text-ink-soft hover:text-pine-900"
                title="Copy Magic Link"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Observer / CC */}
          <div className="p-4 bg-paper rounded-xl border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-ink-faint text-paper text-xs font-bold font-mono flex items-center justify-center">
                CC
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-ink-soft font-bold">
                Observer
              </span>
            </div>
            <div>
              <strong className="text-xs text-pine-900 font-bold block">{doc.signers[2].name}</strong>
              <span className="text-[11px] text-ink-soft block">{doc.signers[2].role}</span>
              <span className="text-[11px] font-mono text-ink-faint">{doc.signers[2].email}</span>
            </div>
            <p className="pt-2 border-t border-border text-[10px] text-ink-soft leading-relaxed">
              {doc.signers[2].note}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs: Forensic Timeline vs Files & Certified Attachments */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-pine-900 text-paper shadow-sm'
                : 'text-ink-soft hover:text-pine-900'
            }`}
          >
            Timeline &amp; Forensic Events (6)
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'files'
                ? 'bg-pine-900 text-paper shadow-sm'
                : 'text-ink-soft hover:text-pine-900'
            }`}
          >
            Files &amp; Certified Attachments (3)
          </button>
        </div>

        {activeTab === 'timeline' ? (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="text-xs text-ink-soft">
                Immutable Ledger Logging (RFC 3161 Timestamping) • Root Node Dhaka-01
              </div>
              <Link
                href={`/documents/${doc.id}/audit`}
                className="text-xs font-bold text-pine-600 hover:text-pine-800 hover:underline flex items-center gap-1"
              >
                <span>View Full Forensic Audit Trail &rarr;</span>
              </Link>
            </div>

            <div className="space-y-4">
              {doc.timelineEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-pine-600 mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-pine-900 font-semibold">{evt.title}</strong>
                      <span className="font-mono text-[11px] text-ink-faint">{evt.time}</span>
                    </div>
                    <p className="text-[11px] text-ink-soft font-mono leading-relaxed">
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-3">
            <div className="p-3.5 bg-paper rounded-xl border border-border flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-pine-600" />
                <div>
                  <strong className="text-pine-900 block font-semibold">Original Uploaded Contract.pdf</strong>
                  <span className="text-[11px] text-ink-soft font-mono">1.8 MB • SHA-256: e3b0c44...855</span>
                </div>
              </div>
              <button
                onClick={() => alert('Original pre-hash verified.')}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-surface-raised"
              >
                Download Original
              </button>
            </div>

            <div className="p-3.5 bg-paper rounded-xl border border-border flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-5 h-5 text-pine-600" />
                <div>
                  <strong className="text-pine-900 block font-semibold">Executed In-Progress Draft.pdf</strong>
                  <span className="text-[11px] text-ink-soft font-mono">1.9 MB • 1 of 2 Signatures Affixed</span>
                </div>
              </div>
              <button
                onClick={() => alert('Watermarked interim draft downloaded.')}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold hover:bg-surface-raised"
              >
                Download Interim
              </button>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-300 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-brass-600" />
                <div>
                  <strong className="text-pine-900 block font-semibold">Certificate of Completion</strong>
                  <span className="text-[11px] text-ink-soft font-mono">PKI Legal Attestation • Admissible under ICT Act 2006 §7</span>
                </div>
              </div>
              <Link href={`/documents/${doc.id}/certificate`}>
                <button className="px-3 py-1.5 rounded-lg bg-pine-900 text-paper text-xs font-semibold hover:bg-pine-800">
                  Preview Certificate &rarr;
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Interim Document Parchment Viewer Preview */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-4">
        <div className="flex items-center justify-between text-xs border-b border-border pb-3">
          <div className="flex items-center gap-2 font-bold text-pine-900">
            <FileText className="w-4 h-4 text-pine-600" />
            <span>Interim Document View (Page 1 of 3)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
            INTERIM EXECUTION WATERMARK
          </span>
        </div>

        <div className="bg-paper p-8 rounded-xl border border-border/80 space-y-4 text-xs select-none">
          <div className="text-center space-y-1 border-b border-border pb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint">
              Contract No: RT-MDC-2024-098 • Dated: 24 October 2024
            </span>
            <h3 className="font-display text-base font-bold text-pine-900">
              COMMERCIAL SUPPLY AGREEMENT
            </h3>
            <p className="text-[11px] text-ink-soft">
              Between Rahim Textiles &amp; Trade Ltd. (First Party - Affixed) vs Meghna Distribution Corp. (Second Party - In Progress)
            </p>
          </div>
          <p className="text-[11px] text-ink-soft leading-relaxed">
            This bilateral instrument is currently undergoing sequential signing. Party 1 has cryptographically sealed their signature with PKI token credentials. Full execution will conclude upon Party 2 countersignature.
          </p>
        </div>
      </div>
    </div>
  );
}