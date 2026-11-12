'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import { apiFetch } from '@/lib/api';
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
  FolderOpen,
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
  const id = params.id as string;

  const [envelope, setEnvelope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'timeline' | 'files'>('timeline');
  const [remindedSent, setRemindedSent] = useState<string | null>(null);
  const [extendedNotice, setExtendedNotice] = useState(false);
  const [isVoiding, setIsVoiding] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadEnvelope = async () => {
    try {
      const data = await apiFetch<any>(`/envelopes/${id}`);
      setEnvelope(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load envelope');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadEnvelope();
    }
  }, [id]);

  const handleRemind = async (recipientId: string) => {
    try {
      await apiFetch(`/envelopes/${id}/remind/${recipientId}`, { method: 'POST' });
      setRemindedSent(recipientId);
      setTimeout(() => setRemindedSent(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to send reminder');
    }
  };

  const handleExtend = async () => {
    try {
      await apiFetch(`/envelopes/${id}/extend`, {
        method: 'POST',
        body: JSON.stringify({ extraDays: 7 }),
      });
      setExtendedNotice(true);
      setTimeout(() => setExtendedNotice(false), 3000);
      loadEnvelope();
    } catch (err: any) {
      alert(err.message || 'Failed to extend expiry');
    }
  };

  const handleVoid = async () => {
    const reason = prompt('Please enter a reason for voiding this envelope:');
    if (!reason) return;
    try {
      setIsVoiding(true);
      await apiFetch(`/envelopes/${id}/void`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      loadEnvelope();
    } catch (err: any) {
      alert(err.message || 'Failed to void envelope');
    } finally {
      setIsVoiding(false);
    }
  };

  const downloadFile = (type: 'final' | 'original' | 'coc') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('signdesk_token') : null;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const url = `${apiUrl}/envelopes/${id}/download?type=${type}`;
    
    // Download via authenticated fetch or link
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
        a.download = `${envelope?.title || 'document'}-${type}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      })
      .catch((err) => alert(err.message));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <WaxSeal size={40} className="animate-pulse mx-auto" />
          <p className="font-mono text-xs text-ink-soft">Loading envelope data from API...</p>
        </div>
      </div>
    );
  }

  if (error || !envelope) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-surface p-6 rounded-xl border border-border space-y-4 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-pine-900">Envelope Not Found</h2>
          <p className="text-xs text-ink-soft">{error || 'Requested agreement record is not accessible.'}</p>
          <Link href="/documents">
            <button className="px-4 py-2 bg-pine-900 text-paper rounded-lg text-xs font-semibold">
              Return to Documents
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = envelope.status === 'COMPLETED';
  const isVoided = envelope.status === 'VOIDED';

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Banner Navigation & Quick Action Bar */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/documents">
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Documents Registry</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-soft">
              <span>#{envelope.id.slice(0, 8).toUpperCase()}</span>
              <span>•</span>
              <span
                className={`font-semibold ${
                  isCompleted
                    ? 'text-emerald-800'
                    : isVoided
                    ? 'text-rose-800'
                    : 'text-amber-800'
                }`}
              >
                {envelope.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isVoided && !isCompleted && (
              <>
                <button
                  onClick={handleExtend}
                  className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
                >
                  <Clock className="w-3.5 h-3.5 text-ink-soft" />
                  <span>{extendedNotice ? 'Extended +7 Days!' : 'Extend Expiry'}</span>
                </button>

                <button
                  onClick={handleVoid}
                  disabled={isVoiding}
                  className="px-3.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50/60 hover:bg-rose-100/60 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-700" />
                  <span>Void Envelope</span>
                </button>
              </>
            )}

            <Link href={`/documents/${id}/audit`}>
              <button className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <ShieldCheck className="w-3.5 h-3.5 text-pine-900" />
                <span>Forensic Audit Trail</span>
              </button>
            </Link>

            <button
              onClick={() => downloadFile(isCompleted ? 'final' : 'original')}
              className="px-4 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-1.5 shadow-warm transition-all"
            >
              <Download className="w-3.5 h-3.5 text-brass" />
              <span>{isCompleted ? 'Download Sealed PDF' : 'Download Document'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isVoided
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    {envelope.status}
                  </span>
                  <span className="text-xs font-mono text-ink-soft">
                    Created {new Date(envelope.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <h1 className="font-serif text-2xl font-bold text-pine-900">{envelope.title}</h1>
                <p className="text-xs text-ink-soft mt-1">
                  Workspace: {envelope.workspace?.name || 'Main Vault'} • Initiator:{' '}
                  {envelope.owner?.name || envelope.createdByUser?.name || 'Administrator'}
                </p>
              </div>

              <div className="shrink-0 hidden sm:block">
                <WaxSeal size={48} />
              </div>
            </div>

            {/* Document Hash */}
            <div className="p-3 bg-paper rounded-xl border border-border font-mono text-[11px] text-ink-soft space-y-1">
              <div className="flex items-center justify-between text-ink font-semibold">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-pine-600" />
                  <span>Original PDF Genesis SHA-256 Digest</span>
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  SEALED
                </span>
              </div>
              <div className="break-all text-ink-faint select-all">{envelope.originalHash}</div>
            </div>
          </div>

          {/* Signers Execution Chain Section */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-pine-900">Signers Execution Chain</h2>
                <p className="text-xs text-ink-soft">
                  Sequential execution order under Bangladesh ICT Act 2006.
                </p>
              </div>
              <span className="text-xs font-mono text-ink-faint">
                {envelope.recipients?.filter((r: any) => r.status === 'SIGNED').length || 0} of{' '}
                {envelope.recipients?.length || 0} Affixed
              </span>
            </div>

            <div className="space-y-4">
              {envelope.recipients?.map((signer: any, idx: number) => {
                const isSigned = signer.status === 'SIGNED';
                const isSignerTurn = !isSigned && signer.status !== 'DECLINED';

                return (
                  <div
                    key={signer.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSigned
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isSignerTurn
                        ? 'bg-surface border-pine-900/30 shadow-subtle'
                        : 'bg-paper border-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSigned
                              ? 'bg-emerald-700 text-white'
                              : 'bg-pine-900 text-paper'
                          }`}
                        >
                          {signer.order || idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-pine-900 text-sm">{signer.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-paper border border-border text-ink-soft">
                              {signer.role}
                            </span>
                          </div>
                          <div className="text-xs text-ink-soft font-mono mt-0.5">{signer.email}</div>
                          {isSigned && signer.signedAt && (
                            <div className="text-[11px] text-emerald-800 font-mono mt-1 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Signed on {new Date(signer.signedAt).toLocaleString('en-GB')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            isSigned
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {signer.status}
                        </span>

                        {!isSigned && !isCompleted && !isVoided && (
                          <button
                            onClick={() => handleRemind(signer.id)}
                            className="px-2.5 py-1 rounded bg-paper hover:bg-surface border border-border text-ink text-xs font-semibold flex items-center gap-1 shadow-subtle transition-all"
                          >
                            <Bell className="w-3 h-3 text-amber-600" />
                            <span>{remindedSent === signer.id ? 'Sent!' : 'Remind'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Info (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Statutory Certificate Box */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
              <Award className="w-4 h-4 text-brass" />
              <span>Certificate of Completion</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Official legal record under Bangladesh ICT Act 2006 Section 7. Includes signatory IP, time attestation, and SHA-256 Merkle chain.
            </p>
            <div className="pt-2 border-t border-border space-y-2">
              <Link href={`/documents/${id}/certificate`} className="block">
                <button className="w-full py-2 px-3 rounded-lg border border-border bg-paper hover:bg-surface text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 shadow-subtle transition-all">
                  <FileCheck2 className="w-3.5 h-3.5 text-pine-600" />
                  <span>View Certificate Online</span>
                </button>
              </Link>
              {isCompleted && (
                <button
                  onClick={() => downloadFile('coc')}
                  className="w-full py-2 px-3 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-2 shadow-warm transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-brass" />
                  <span>Download Certificate PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Legal Compliance Summary */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-subtle space-y-3 text-xs">
            <div className="font-bold text-pine-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-pine-600" />
              <span>Statutory Legal Framework</span>
            </div>
            <ul className="space-y-2 text-ink-soft">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>ICT Act 2006 §7: Electronic records recognized in Bangladesh courts.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Contract Act 1872: Offer, acceptance &amp; electronic consideration verified.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Evidence Act 1872: Digital audit trail admissible without special forensics.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
