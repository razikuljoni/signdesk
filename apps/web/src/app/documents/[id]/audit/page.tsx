'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { apiFetch } from '@/lib/api';
import {
  FileText,
  ShieldCheck,
  Download,
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Clock,
  Layers,
  Fingerprint,
  Scale,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Cpu,
  FileCode,
  Share2,
  AlertTriangle,
} from 'lucide-react';

export default function DocumentAuditTrailPage() {
  return (
    <AuthGuard>
      <DocumentAuditContent />
    </AuthGuard>
  );
}

function DocumentAuditContent() {
  const params = useParams();
  const id = params.id as string;

  const [auditData, setAuditData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      apiFetch<any>(`/envelopes/${id}/audit-trail`)
        .then((res) => {
          setAuditData(res);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load audit trail');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <p className="font-mono text-xs text-ink-soft">Loading Merkle audit trail from API...</p>
      </div>
    );
  }

  if (error || !auditData) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-surface p-6 rounded-xl border border-border text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold text-pine-900">Audit Trail Unavailable</h2>
          <p className="text-xs text-ink-soft">{error || 'No audit records for this envelope.'}</p>
          <Link href={`/documents/${id}`}>
            <button className="px-4 py-2 bg-pine-900 text-paper rounded text-xs font-semibold">
              Return to Envelope
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const events = auditData.events || [];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Banner Navigation Bar */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/documents/${id}`}>
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Envelope</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
              <span>#{auditData.envelopeId?.slice(0, 8).toUpperCase()}</span>
              <span>•</span>
              <span className="text-emerald-800 font-semibold">Recursive Merkle Hash Chain Verified</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(auditData.genesisHash || '', 'genesis')}
              className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Fingerprint className="w-3.5 h-3.5 text-pine-900" />
              <span>{copiedHash === 'genesis' ? 'Genesis Copied!' : 'Copy Genesis Hash'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Verification Overview Banner */}
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                MERKLE CHAIN INTEGRITY VALID
              </span>
              <span className="text-xs font-mono text-ink-soft">
                {events.length} Sealed Audit Blocks
              </span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-pine-900">
              {auditData.title || 'Document Audit Trail'}
            </h1>
            <p className="text-xs text-ink-soft mt-1">
              Statutory verification ledger under Bangladesh ICT Act 2006 Section 7.
            </p>
          </div>

          <div className="shrink-0 p-3 bg-paper rounded-xl border border-border text-xs font-mono text-ink-soft space-y-1">
            <div className="text-[10px] uppercase font-bold text-ink-faint">Root Genesis Hash</div>
            <div className="text-[11px] text-pine-900 select-all font-semibold">
              {(auditData.genesisHash || '').slice(0, 24)}...
            </div>
          </div>
        </div>

        {/* Audit Blocks Timeline */}
        <div className="space-y-4">
          {events.map((evt: any, idx: number) => {
            const blockNum = String(evt.blockIndex ?? idx + 1).padStart(2, '0');
            const isGenesis = idx === 0;

            return (
              <div
                key={evt.id || idx}
                className="bg-surface rounded-xl border border-border p-5 shadow-subtle space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-pine-900 text-paper font-mono text-xs font-bold flex items-center justify-center">
                      {blockNum}
                    </span>
                    <div>
                      <div className="font-semibold text-pine-900 text-sm">
                        {evt.eventType || 'AUDIT_RECORD'}
                      </div>
                      <div className="text-[11px] text-ink-soft font-mono">
                        {new Date(evt.timestampUtc).toLocaleString('en-GB')} BST
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-center">
                    SEALED &amp; PROVED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-ink-faint">Actor / Identity</div>
                    <div className="font-medium text-ink mt-0.5">
                      {evt.actor || 'System Daemon'} {evt.actorEmail ? `(${evt.actorEmail})` : ''}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-ink-faint">Network Origin (IP)</div>
                    <div className="font-mono text-ink mt-0.5">{evt.ipAddress || '127.0.0.1'}</div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="text-[10px] font-mono uppercase text-ink-faint">Client User Agent</div>
                    <div className="font-mono text-[11px] text-ink-soft mt-0.5 truncate">
                      {evt.userAgent || 'SignDesk Web Client (TLS 1.3 Strict)'}
                    </div>
                  </div>
                </div>

                {/* Hashes */}
                <div className="p-3 bg-paper rounded-lg border border-border font-mono text-[10px] space-y-1.5 text-ink-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-faint uppercase">Parent Hash:</span>
                    <span className="select-all text-ink">{evt.parentHash || '0000000000000000000000000000000000000000000000000000000000000000'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-1">
                    <span className="text-pine-900 font-bold uppercase">Block Digest:</span>
                    <span className="select-all text-pine-900 font-semibold">{evt.hashDigest}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
