'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<'timeline' | 'preview' | 'certificate'>('timeline');
  const [remindedSent, setRemindedSent] = useState(false);
  const [extendedNotice, setExtendedNotice] = useState(false);
  const [isVoided, setIsVoided] = useState(false);

  // Document model
  const doc = {
    id,
    title: 'Mutual Non-Disclosure Agreement — Horizon Logistics',
    status: isVoided ? 'voided' : 'waiting',
    sentAt: '2026-11-10T14:25:00Z',
    expiresAt: '2026-11-24T14:25:00Z',
    hash: '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c',
    signers: [
      {
        order: 1,
        name: 'Rahim Chowdhury',
        email: 'rahim@horizon-logistics.bd',
        status: 'notified',
        ip: '103.205.71.12 (Dhaka, BD)',
        notifiedAt: '2026-11-10 20:25:00 BST',
        token: 'demo_token_rahim_7a8b9c0d1e2f3a4b',
      },
      {
        order: 2,
        name: 'Karimul Islam',
        email: 'karim@apex-commerce.bd',
        status: 'pending',
        ip: null,
        notifiedAt: null,
        token: 'demo_token_karim_4b5c6d7e8f9a0b1c',
      },
    ],
    auditEvents: [
      {
        id: 'evt_1',
        action: 'Envelope Created & Uploaded',
        actor: 'Tanvir Ahmed (Sender)',
        timestamp: '10 Nov 2026, 20:24:12 BST (UTC+06:00)',
        ip: '103.205.71.12',
        hash: '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c',
        prevHash: 'GENESIS_ROOT',
      },
      {
        id: 'evt_2',
        action: 'Dispatched to Signer 1 (Rahim Chowdhury)',
        actor: 'SignDesk Notification Service',
        timestamp: '10 Nov 2026, 20:25:00 BST (UTC+06:00)',
        ip: '10.0.4.18 (System Dispatcher)',
        hash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
        prevHash: '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c',
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Link href="/documents" className="text-xs font-semibold text-pine-600 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Documents Repository
          </Link>
          <div className="flex items-center gap-3 pt-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
              {doc.title}
            </h1>
            <Badge variant={doc.status === 'voided' ? 'voided' : 'waiting'}>
              {doc.status}
            </Badge>
          </div>
          <div className="text-xs font-mono text-ink-faint flex flex-wrap items-center gap-4 pt-1">
            <span>ID: {doc.id}</span>
            <span>Sent: 10 Nov 2026, 20:25 BST</span>
            <span>Expires: 24 Nov 2026</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRemind} disabled={isVoided}>
            <Bell className="w-3.5 h-3.5 mr-1" />
            Send Reminder
          </Button>
          <Button variant="outline" size="sm" onClick={handleExtend} disabled={isVoided}>
            <Calendar className="w-3.5 h-3.5 mr-1" />
            Extend 7 Days
          </Button>
          <Button variant="destructive" size="sm" onClick={handleVoid} disabled={isVoided}>
            <Ban className="w-3.5 h-3.5 mr-1" />
            Void Envelope
          </Button>
        </div>
      </div>

      {remindedSent && (
        <div className="p-3 bg-[#E2F2E8] border border-success/30 text-success rounded-[8px] text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          Reminder dispatched to Rahim Chowdhury (rahim@horizon-logistics.bd).
        </div>
      )}

      {extendedNotice && (
        <div className="p-3 bg-pine-100 border border-pine-500/20 text-pine-900 rounded-[8px] text-xs flex items-center gap-2 font-semibold">
          <Clock className="w-4 h-4" />
          Envelope expiration extended by 7 days.
        </div>
      )}

      {/* Recipient Hierarchy Stepper Card */}
      <Card className="bg-surface">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-lg">Signer Routing & Execution Sequence</CardTitle>
          <CardDescription>Sequential execution: Signer 2 is gated until Signer 1 executes</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {doc.signers.map((signer) => (
              <div
                key={signer.order}
                className="p-4 bg-paper rounded-[8px] border border-border space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pine-900 text-paper font-bold text-xs flex items-center justify-center">
                      {signer.order}
                    </span>
                    <span className="font-bold text-sm text-pine-900">{signer.name}</span>
                  </div>
                  <Badge variant={signer.status === 'notified' ? 'waiting' : 'draft'}>
                    {signer.status === 'notified' ? 'Active Signer' : 'Pending Turn'}
                  </Badge>
                </div>
                <div className="text-xs text-ink-soft font-mono">{signer.email}</div>
                <div className="text-[11px] text-ink-faint pt-1 space-y-0.5">
                  <div>Status: {signer.status === 'notified' ? 'Dispatched via Magic Link' : 'Gated by predecessor'}</div>
                  {signer.notifiedAt && <div>Notified: {signer.notifiedAt}</div>}
                  {signer.ip && <div>IP: {signer.ip}</div>}
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="text-[11px] text-ink-faint">Direct Signing Link:</span>
                  <Link href={`/sign/${signer.token}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-pine-600 font-semibold">
                      Test Signer Portal
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex border-b border-border text-sm font-semibold">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'timeline'
                ? 'border-pine-900 text-pine-900'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            Forensic Audit Trail (SHA-256 Ledger)
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-pine-900 text-pine-900'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            Document Preview
          </button>
          <button
            onClick={() => setActiveTab('certificate')}
            className={`py-3 px-4 border-b-2 transition-colors ${
              activeTab === 'certificate'
                ? 'border-pine-900 text-pine-900'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            Certificate of Completion
          </button>
        </div>

        {/* Tab 1: Audit Trail */}
        {activeTab === 'timeline' && (
          <Card className="bg-surface">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pine-600" />
                  Append-Only Cryptographic Event Ledger
                </CardTitle>
                <CardDescription>
                  Chained hash verification ensures retroactive modifications are immediately detectable.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="w-3.5 h-3.5 mr-1" />
                Export Audit JSON
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {doc.auditEvents.map((evt, i) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-paper rounded-[8px] border border-border space-y-2 relative"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-pine-900 text-sm">
                        #{i + 1} {evt.action}
                      </span>
                      <span className="font-mono text-ink-faint">{evt.timestamp}</span>
                    </div>
                    <div className="text-xs text-ink-soft flex items-center gap-4">
                      <span>Actor: <strong>{evt.actor}</strong></span>
                      <span>IP: <code className="font-mono">{evt.ip}</code></span>
                    </div>
                    <div className="p-2.5 bg-surface rounded border border-border font-mono text-[11px] text-ink-faint space-y-1">
                      <div><strong className="text-pine-900">Prev Hash:</strong> {evt.prevHash}</div>
                      <div><strong className="text-pine-900">Event Digest:</strong> {evt.hash}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Document Preview */}
        {activeTab === 'preview' && (
          <Card className="bg-surface text-center p-8 space-y-4">
            <div className="p-8 bg-[#E9E4D8] rounded-[8px] flex justify-center">
              <div className="w-[480px] h-[640px] bg-white shadow-warm-md p-8 text-left space-y-4 text-ink-soft text-xs border border-border">
                <div className="border-b border-border pb-2 font-bold text-sm text-pine-900">
                  MUTUAL NON-DISCLOSURE AGREEMENT
                </div>
                <p>
                  This Non-Disclosure Agreement is executed this 10th day of November 2026,
                  by and between Apex Commerce BD and Horizon Logistics Ltd.
                </p>
                <div className="pt-24 grid grid-cols-2 gap-8 text-[11px]">
                  <div className="border border-dashed border-pine-600/40 p-3 rounded text-center">
                    <span className="text-pine-600 font-semibold block">Signature Area</span>
                    <span className="text-[10px] text-ink-faint">Rahim Chowdhury (Signer 1)</span>
                  </div>
                  <div className="border border-dashed border-border p-3 rounded text-center opacity-60">
                    <span className="font-semibold block">Signature Area</span>
                    <span className="text-[10px] text-ink-faint">Karimul Islam (Signer 2)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: Certificate of Completion */}
        {activeTab === 'certificate' && (
          <Card className="bg-surface p-8 space-y-6">
            <div className="border-4 border-double border-border-strong p-8 rounded-[8px] space-y-6 text-center bg-paper/50">
              <WaxSeal size={72} className="mx-auto" />
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
                  Bangladesh ICT Act 2006 • Section 7 Attestation
                </span>
                <h2 className="font-display text-3xl font-bold text-pine-900">
                  Certificate of Completion
                </h2>
                <p className="text-xs text-ink-soft font-mono">
                  Envelope Serial: ENV_9945996419550316910 · BST Atomic Timestamp
                </p>
              </div>

              <div className="text-left text-xs space-y-4 max-w-xl mx-auto pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-ink-faint block">Document Name:</span>
                    <strong className="text-pine-900">{doc.title}</strong>
                  </div>
                  <div>
                    <span className="text-ink-faint block">Original Genesis SHA-256:</span>
                    <code className="font-mono text-[11px] break-all">{doc.hash}</code>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded border border-border space-y-2">
                  <div className="font-bold text-pine-900">Statutory Disclosure & Assent:</div>
                  <p className="text-[11px] text-ink-soft leading-relaxed">
                    All parties consented to do business electronically in accordance with the Electronic Record
                    and Signature Disclosure v1.0. Signatures affixed via SignDesk Simple Electronic Signature (SES).
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="primary">
                  <Download className="w-4 h-4 mr-1.5" />
                  Download Certified PDF & Certificate
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
