'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  Clock,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  LayoutDashboard,
  PlusCircle,
  FileText,
  MessageSquare,
  Key,
  Layers,
  Fingerprint,
  Share2,
  Lock,
  ArrowLeft
} from 'lucide-react';

export default function EnvelopeSentPage() {
  return (
    <AuthGuard>
      <EnvelopeSentContent />
    </AuthGuard>
  );
}

function EnvelopeSentContent() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [envelope, setEnvelope] = useState<any>(null);

  const genesisHash = '4e7b819f03c289ad0e6b8f4a7c130b91e3b0c44298fc1c149afbf4c8996fb924';

  const mockNodes = [
    {
      order: 1,
      name: 'Ayesha Rahman',
      title: 'Managing Director, Rahim Textiles',
      email: 'ayesha.rahman@rahimtraders.com',
      channel: 'SMTP-TLS Email + SMS OTP',
      timestamp: 'Today at 11:24 AM BST (NTP-BD-01 Atomic Sync)',
      status: 'Email Delivered & Magic Link Active',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      token: 'demo_token_ayesha_7a8b9c0d1e2f3a4b',
      link: '/sign/demo_token_ayesha_7a8b9c0d1e2f3a4b',
      activeNow: true,
    },
    {
      order: 2,
      name: 'Tanvir Ahmed',
      title: 'Managing Director, Meghna Distribution Corp.',
      email: 'tanvir@meghnadist.com',
      channel: 'WhatsApp (+880 1711-884920) + Email',
      timestamp: 'Awaiting completion of Node #1',
      status: 'Queued for Sequential Dispatch',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      token: 'demo_token_tanvir_4b5c6d7e8f9a0b1c',
      link: '/sign/demo_token_tanvir_4b5c6d7e8f9a0b1c',
      activeNow: false,
    },
    {
      order: 3,
      name: 'Kamal Uddin, Advocate',
      title: 'Legal Counsel (Supreme Court of Bangladesh)',
      email: 'legal@dcibar.org.bd',
      channel: 'Corporate Email Delivery',
      timestamp: 'Observer / Legal CC · Receives final sealed deed',
      status: 'Dispatched Notification',
      statusColor: 'bg-paper text-ink-soft border-border',
      token: 'demo_token_kamal_cc',
      link: '/documents/ENV-892401',
      activeNow: false,
    },
  ];

  useEffect(() => {
    const envelopes = JSON.parse(localStorage.getItem('signdesk_envelopes') || '[]');
    if (envelopes.length > 0) {
      envelopes[0].status = 'waiting';
      localStorage.setItem('signdesk_envelopes', JSON.stringify(envelopes));
      setEnvelope(envelopes[0]);
    }
  }, []);

  const copyToClipboard = (text: string, idx: number) => {
    if (typeof window !== 'undefined') {
      const fullUrl = text.startsWith('http') ? text : `${window.location.origin}${text}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  const handleCopyHash = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(genesisHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header & Breadcrumb Context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-pine-900 hover:text-pine-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Workspace</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-ink-soft">
          <FileText className="w-3.5 h-3.5 text-pine-600" />
          <span>Rahim Traders Commercial Supply</span>
          <span>•</span>
          <span className="font-bold text-pine-900">#RT-2024-884A</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
          <span>ICT Act 2006 (BD) §6 Cert.</span>
        </div>
      </div>

      {/* Hero Dispatch Confirmation Card */}
      <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-warm-md text-center space-y-6">
        <div className="flex justify-center">
          <WaxSeal size={72} />
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Notarization &amp; Transmission</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-pine-900 tracking-tight">
            Envelope Successfully Dispatched
          </h1>
          <p className="text-sm text-ink-soft leading-relaxed">
            Envelope <strong className="font-mono text-pine-900">#ENV-BD-2024-8849-ICT</strong> has been cryptographically registered and dispatched for sequential execution under the Bangladesh ICT Act 2006.
          </p>
        </div>

        {/* Genesis Block Registry Box */}
        <div className="p-4 bg-surface-raised rounded-xl border border-border text-left space-y-2 max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-pine-900 flex items-center gap-1.5 uppercase font-mono tracking-wider text-[11px]">
              <Key className="w-3.5 h-3.5 text-pine-600" />
              Genesis Block Registry
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-pine-100 text-pine-900 font-bold">
              Block #0001 Genesis
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 p-2.5 bg-surface rounded-lg border border-border font-mono text-xs text-ink-faint">
            <span className="truncate">{genesisHash}</span>
            <button
              type="button"
              onClick={handleCopyHash}
              className="text-pine-600 hover:text-pine-800 text-xs font-semibold shrink-0 flex items-center gap-1 font-sans"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Sequential Execution Ledger */}
        <div className="text-left space-y-3 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-display text-lg font-bold text-pine-900">
                Sequential Execution Ledger
              </h2>
              <p className="text-xs text-ink-soft">
                Real-time status of execution nodes and transmission protocols • Sequential Route: Enforced
              </p>
            </div>
            <span className="text-[11px] font-mono text-ink-faint">Asia/Dhaka GMT+6</span>
          </div>

          <div className="space-y-3">
            {mockNodes.map((node, idx) => (
              <div
                key={idx}
                className="p-4 bg-paper rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-pine-900 text-paper text-[11px] font-bold font-mono flex items-center justify-center">
                      {node.order}
                    </span>
                    <strong className="text-xs text-pine-900 font-semibold">{node.name}</strong>
                    <span className="text-[11px] text-ink-soft">· {node.title}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${node.statusColor}`}>
                      {node.status}
                    </span>
                  </div>
                  <div className="text-xs text-ink-soft font-mono">
                    {node.email} • {node.channel}
                  </div>
                  <div className="text-[11px] text-ink-faint font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-pine-600" />
                    <span>{node.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(node.link, idx)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-warm-sm"
                  >
                    <Copy className="w-3.5 h-3.5 text-pine-600" />
                    <span>{copiedIndex === idx ? 'Copied URL!' : 'Copy Magic Link'}</span>
                  </button>

                  <Link href={node.link} target="_blank">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-1.5 transition-all shadow-warm-sm"
                    >
                      <span>Open Signer View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statutory Admissibility & Evidentiary Chain Card */}
        <div className="p-5 bg-surface-raised rounded-2xl border border-border text-left space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-pine-600" />
              <span>Statutory Admissibility &amp; Evidentiary Chain</span>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
              Sec 6 &amp; 7 ICT Act 2006
            </span>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            Audit ledger initialized. Every interaction will be recorded in the tamper-evident Merkle hash chain with BST atomic timestamps and NID authentication telemetry. Admissible as primary digital evidence under Sections 6 and 7 of the Information &amp; Communication Technology Act (Bangladesh).
          </p>
          <div className="text-[11px] text-ink-faint font-mono pt-1">
            SignDesk Node: dhaka-core-01.signdesk.bd • Root CA Anchored
          </div>
        </div>

        {/* Bottom Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-warm-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Return to Workspace Dashboard</span>
            </button>
          </Link>
          <Link href="/envelopes/new" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-warm-sm"
            >
              <PlusCircle className="w-4 h-4 text-pine-600" />
              <span>Send Another Envelope</span>
            </button>
          </Link>
          <Link href={`/documents/${envelope?.id || 'ENV-892401'}`} className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-paper hover:bg-surface-raised text-ink-soft text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Track in Document Detail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </div>

      {/* Legal Integrity Footer */}
      <div className="text-center space-y-1 text-[11px] text-ink-faint font-mono pt-2">
        <div>Statutory Validity Enforced Under Information &amp; Communication Technology (ICT) Act, 2006</div>
        <div>SHA-256 Digest: 8f42b910e39a1c... • © 2026 SignDesk Legal Operations. All rights reserved.</div>
      </div>
    </div>
  );
}