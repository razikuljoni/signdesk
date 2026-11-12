'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { apiFetch } from '@/lib/api';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Download,
  Calendar,
  Building2,
  MoreVertical,
  Check,
  Ban,
  XCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Bell,
  Scale,
  Lock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <DocumentsRepositoryContent />
    </AuthGuard>
  );
}

function DocumentsRepositoryContent() {
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'action' | 'completed' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [remindedDocId, setRemindedDocId] = useState<string | null>(null);
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const data = await apiFetch<any[]>('/envelopes');
      setEnvelopes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load envelopes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const mappedEnvelopes = envelopes.map((env) => {
    const totalRecipients = env.recipients?.length || 0;
    const signedCount = env.recipients?.filter((r: any) => r.status === 'SIGNED').length || 0;
    const progress = totalRecipients > 0 ? Math.round((signedCount / totalRecipients) * 100) : 0;
    const signersDetail = env.recipients?.map((r: any) => `${r.name} (${r.status})`).join(' • ') || 'None';

    let status = 'waiting';
    let statusLabel = 'In Progress';
    let actionLabel = 'View Envelope';
    let actionType: 'view' | 'sign_now' | 'remind' | 'cert_void' = 'view';

    if (env.status === 'COMPLETED') {
      status = 'completed';
      statusLabel = 'Signed & Sealed';
      actionLabel = 'Download PDF';
    } else if (env.status === 'DRAFT') {
      status = 'drafts';
      statusLabel = 'Draft';
      actionLabel = 'Resume';
    } else if (env.status === 'VOIDED') {
      status = 'voided';
      statusLabel = 'Voided';
      actionLabel = 'Voided';
      actionType = 'cert_void';
    } else if (env.status === 'DECLINED') {
      status = 'declined';
      statusLabel = 'Declined';
    } else {
      status = 'waiting';
      statusLabel = 'Waiting on Others';
      actionType = 'remind';
      actionLabel = 'Remind Signer';
    }

    return {
      id: env.id,
      refCode: `#${env.id.slice(0, 8).toUpperCase()}`,
      title: env.title || 'Untitled Agreement',
      size: env.status === 'COMPLETED' ? 'Sealed PDF/A' : 'Draft PDF',
      sectorTag: env.status === 'COMPLETED' ? 'Executed' : env.status === 'DRAFT' ? 'Draft' : 'In Flight',
      signersSummary: `${signedCount} of ${totalRecipients} Signed (${progress}%)`,
      signersProgress: progress,
      signersDetail,
      sentBST: new Date(env.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' BST',
      validity: env.status === 'COMPLETED' ? 'Permanent Record' : env.expiresAt ? `Expires in ${Math.max(0, Math.ceil((new Date(env.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}d` : '14 days',
      status,
      statusLabel,
      actionType,
      actionLabel,
      recipients: env.recipients || [],
    };
  });

  const filteredEnvelopes = mappedEnvelopes.filter((doc) => {
    if (filterTab === 'waiting') return doc.status === 'waiting';
    if (filterTab === 'completed') return doc.status === 'completed';
    if (filterTab === 'drafts') return doc.status === 'drafts';
    return true;
  }).filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.refCode.toLowerCase().includes(q) ||
      doc.signersDetail.toLowerCase().includes(q)
    );
  });

  const toggleSelect = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDocs.length === filteredEnvelopes.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(filteredEnvelopes.map((d) => d.id));
    }
  };

  const handleRemind = async (envelopeId: string, recipientId?: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (recipientId) {
        await apiFetch(`/envelopes/${envelopeId}/remind/${recipientId}`, { method: 'POST' });
      }
      setRemindedDocId(envelopeId);
      setTimeout(() => setRemindedDocId(null), 3000);
    } catch (err) {
      console.error('Failed to send reminder', err);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Reference,Title,Sector,Progress,Sent_BST,Validity,Status',
        ...mappedEnvelopes.map(
          (d) =>
            `"${d.refCode}","${d.title}","${d.sectorTag}","${d.signersSummary}","${d.sentBST}","${d.validity}","${d.statusLabel}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'SignDesk_Envelopes_Register.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Banner Context Header */}
      <div className="border-b border-border bg-surface px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-soft mb-1">
              <span>Institution Vault</span>
              <span>/</span>
              <span className="text-pine-900 font-semibold">Deeds &amp; Instruments Registry</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-pine-900">
              Documents &amp; Execution Registry
            </h1>
            <p className="text-xs text-ink-soft mt-1">
              Forensic repository of all in-flight, executed, and archived contracts under Bangladesh ICT Act 2006.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <Download className="w-3.5 h-3.5 text-ink-soft" />
              <span>Export Audit Ledger</span>
            </button>

            <Link href="/envelopes/new">
              <button className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-2 shadow-warm transition-all">
                <Plus className="w-4 h-4 text-brass" />
                <span>Prepare New Envelope</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Filter Tabs & Search Controls */}
        <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 text-xs font-medium">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                filterTab === 'all'
                  ? 'bg-pine-900 text-paper font-semibold shadow-subtle'
                  : 'text-ink-soft hover:text-ink hover:bg-paper'
              }`}
            >
              All Instruments ({mappedEnvelopes.length})
            </button>
            <button
              onClick={() => setFilterTab('waiting')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === 'waiting'
                  ? 'bg-pine-900 text-paper font-semibold shadow-subtle'
                  : 'text-ink-soft hover:text-ink hover:bg-paper'
              }`}
            >
              <span>Waiting on Others</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-mono">
                {mappedEnvelopes.filter((e) => e.status === 'waiting').length}
              </span>
            </button>
            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === 'completed'
                  ? 'bg-pine-900 text-paper font-semibold shadow-subtle'
                  : 'text-ink-soft hover:text-ink hover:bg-paper'
              }`}
            >
              <span>Executed &amp; Sealed</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
                {mappedEnvelopes.filter((e) => e.status === 'completed').length}
              </span>
            </button>
            <button
              onClick={() => setFilterTab('drafts')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === 'drafts'
                  ? 'bg-pine-900 text-paper font-semibold shadow-subtle'
                  : 'text-ink-soft hover:text-ink hover:bg-paper'
              }`}
            >
              <span>Drafts</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-paper text-ink-soft font-mono">
                {mappedEnvelopes.filter((e) => e.status === 'drafts').length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, ref code, or signer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-border bg-paper text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-pine-900"
            />
          </div>
        </div>

        {/* Master Documents Table */}
        <div className="bg-surface rounded-xl border border-border shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper border-b border-border text-[11px] font-mono text-ink-soft uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredEnvelopes.length > 0 &&
                        selectedDocs.length === filteredEnvelopes.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border text-pine-900 focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold">Document Title &amp; Ref</th>
                  <th className="py-3 px-4 font-semibold">Parties / Signatures</th>
                  <th className="py-3 px-4 font-semibold">Sent (BST)</th>
                  <th className="py-3 px-4 font-semibold">Validity</th>
                  <th className="py-3 px-4 font-semibold">Legal Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-ink-soft font-mono">
                      Loading envelopes from API...
                    </td>
                  </tr>
                ) : filteredEnvelopes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-ink-soft">
                      No documents found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredEnvelopes.map((doc) => {
                    const isSelected = selectedDocs.includes(doc.id);
                    const isDraft = doc.status === 'drafts';
                    const targetHref = isDraft ? `/envelopes/${doc.id}/prepare` : `/documents/${doc.id}`;

                    return (
                      <tr
                        key={doc.id}
                        className={`hover:bg-paper/70 transition-colors ${
                          isSelected ? 'bg-pine-50/50' : ''
                        }`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(doc.id)}
                            className="rounded border-border text-pine-900 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <Link href={targetHref} className="group block">
                            <div className="font-semibold text-pine-900 group-hover:underline flex items-center gap-1.5">
                              <span>{doc.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-pine-600" />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-soft font-mono">
                              <span>{doc.refCode}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                            </div>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-ink">{doc.signersSummary}</div>
                          <div className="text-[11px] text-ink-soft mt-0.5 max-w-xs truncate">
                            {doc.signersDetail}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-ink-soft whitespace-nowrap">
                          {doc.sentBST}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="text-[11px] font-mono text-ink-soft">
                            {doc.validity}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                              doc.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : doc.status === 'voided'
                                ? 'bg-rose-50 text-rose-800 border-rose-200'
                                : 'bg-amber-50 text-amber-900 border-amber-200'
                            }`}
                          >
                            {doc.statusLabel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {doc.actionType === 'remind' && doc.recipients?.find((r: any) => r.status !== 'SIGNED') ? (
                              <button
                                onClick={(e) =>
                                  handleRemind(
                                    doc.id,
                                    doc.recipients.find((r: any) => r.status !== 'SIGNED')?.id,
                                    e
                                  )
                                }
                                className="px-2.5 py-1 rounded border border-border bg-paper hover:bg-surface text-ink text-[11px] font-semibold flex items-center gap-1 shadow-subtle transition-all"
                              >
                                {remindedDocId === doc.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700">Reminded!</span>
                                  </>
                                ) : (
                                  <>
                                    <Bell className="w-3 h-3 text-amber-600" />
                                    <span>Remind</span>
                                  </>
                                )}
                              </button>
                            ) : null}

                            <Link href={targetHref}>
                              <button className="px-3 py-1 rounded bg-pine-900 hover:bg-pine-800 text-paper text-[11px] font-semibold transition-all">
                                {doc.actionLabel}
                              </button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-border flex items-center justify-between text-xs text-ink-soft bg-paper">
            <div>
              Showing {filteredEnvelopes.length} of {mappedEnvelopes.length} documents
            </div>
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
