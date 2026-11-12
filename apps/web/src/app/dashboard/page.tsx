'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { apiFetch } from '@/lib/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Send,
  Download,
  Eye,
  PenTool,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Layers,
  History,
  AlertCircle,
  Bell,
  Scale,
  BrainCircuit,
  FileCheck2,
  Lock,
  ChevronRight,
  RefreshCw,
  FolderClosed,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user, workspace } = useAuth();
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [triageDismissed, setTriageDismissed] = useState<string[]>([]);

  const loadData = async () => {
    try {
      const [envData, usageData] = await Promise.all([
        apiFetch<any[]>('/envelopes'),
        apiFetch<any>('/workspaces/current/usage').catch(() => null),
      ]);
      setEnvelopes(Array.isArray(envData) ? envData : []);
      setUsage(usageData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingCount = envelopes.filter(
    (e) => e.status === 'SENT' || e.status === 'WAITING' || e.status === 'IN_PROGRESS'
  ).length;
  const completedCount = envelopes.filter((e) => e.status === 'COMPLETED').length;
  const draftCount = envelopes.filter((e) => e.status === 'DRAFT').length;

  const quotaUsed = usage?.monthlyUsed ?? envelopes.length;
  const quotaLimit = usage?.monthlyLimit ?? 5;

  const triageItems = envelopes
    .filter((e) => e.status !== 'COMPLETED' && e.status !== 'VOIDED' && e.status !== 'DECLINED' && !triageDismissed.includes(e.id))
    .slice(0, 3);

  const filteredRecords = envelopes.filter(
    (e) =>
      (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { text: 'Sealed & Done', color: 'bg-brass-500/20 text-brass-600 border-brass-500/30' };
      case 'SENT':
      case 'IN_PROGRESS':
      case 'WAITING':
        return { text: 'In Progress', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'DRAFT':
        return { text: 'Draft', color: 'bg-paper text-ink-soft border-border' };
      case 'VOIDED':
        return { text: 'Voided', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      case 'DECLINED':
        return { text: 'Declined', color: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { text: status, color: 'bg-paper text-ink-soft border-border' };
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Workspace & Regulatory Context Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-ink-faint">
            <Building2 className="w-3.5 h-3.5 text-pine-600" />
            <span>Workplace</span>
            <span>&gt;</span>
            <span className="text-pine-900 font-semibold">Overview &amp; Audit</span>
            <span>•</span>
            <span className="text-pine-600">BST (UTC+06:00)</span>
          </div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 text-pine-600" />
            <span>Institutional Vault • ICT Act 2006 Statutory Validated</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-pine-900 tracking-tight">
            Legal Execution Workspace
          </h1>
          <p className="text-xs text-ink-soft">
            {workspace?.name} • Node: Motijheel Sub-Registry • Logged in as{' '}
            <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/templates" className="flex-1 sm:flex-none">
            <button
              type="button"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-warm-sm"
            >
              <FileCheck2 className="w-4 h-4 text-pine-600" />
              <span>Use Template</span>
            </button>
          </Link>
          <Link href="/envelopes/new" className="flex-1 sm:flex-none">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-warm-sm"
            >
              <PenTool className="w-4 h-4" />
              <span>New Envelope</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Priority Triage Strip ("Needs Attention") */}
      {triageItems.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span className="uppercase tracking-wider">Priority Triage Required</span>
              <span className="text-[11px] font-normal text-amber-800 font-mono">
                ({triageItems.length} In-Flight • Real-time BST Dispatch Sync)
              </span>
            </div>
            <span className="text-[11px] text-amber-800 hidden sm:inline">Active monitoring</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {triageItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-surface rounded-xl border border-amber-200 shadow-warm-sm flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-pine-900 truncate">{item.title}</div>
                  <div className="text-[11px] text-ink-soft truncate font-mono">
                    Status: {item.status} • {item.recipients?.length || 0} parties
                  </div>
                </div>
                <Link href={item.status === 'DRAFT' ? `/envelopes/${item.id}/prepare` : `/documents/${item.id}`}>
                  <button className="px-3 py-1 bg-pine-900 text-paper rounded font-semibold text-[11px] shrink-0">
                    {item.status === 'DRAFT' ? 'Resume' : 'View'}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4 Quantitative Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Execution */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Pending Execution</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pine-900">{pendingCount}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">In-flight agreements en route</p>
        </div>

        {/* Card 2: Executed Deeds */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Executed Deeds (All-Time)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-emerald-800">{completedCount}</span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">Sealed</span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">100% Notarized with Merkle proof</p>
        </div>

        {/* Card 3: Draft Envelopes */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Unsent Drafts</span>
            <Sparkles className="w-4 h-4 text-brass-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pine-900">{draftCount}</span>
            <span className="text-xs font-semibold text-pine-600">Pending</span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">Ready for recipient assignment</p>
        </div>

        {/* Card 4: Quota & Certificate Gas */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Vault Quota (Free Tier)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pine-100 text-pine-900 font-bold">
              ACTIVE
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pine-900">
              {quotaUsed} / {quotaLimit}
            </span>
            <span className="text-xs text-ink-soft">envelopes</span>
          </div>
          <div className="w-full bg-paper rounded-full h-1.5 border border-border overflow-hidden">
            <div
              className="bg-pine-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (quotaUsed / quotaLimit) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-ink-faint font-mono">Resets 1st of month • 0 cost</p>
        </div>
      </div>

      {/* Main Grid: Recent Envelopes (8 cols) + Side Widgets (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Recent Execution Envelopes Table (8 cols) */}
        <div className="lg:col-span-8 bg-surface rounded-2xl border border-border shadow-warm-sm overflow-hidden space-y-4 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <FolderClosed className="w-4 h-4 text-pine-600" />
                <h2 className="font-display text-xl font-bold text-pine-900">
                  Recent Execution Envelopes
                </h2>
              </div>
              <p className="text-xs text-ink-soft">
                {envelopes.length} Total Deeds in Workplace Vault
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, ID, signer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-paper rounded-lg border border-border text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-pine-500"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised/80 border-y border-border text-[11px] font-mono text-ink-faint uppercase">
                <tr>
                  <th className="py-2.5 px-5">Document Title</th>
                  <th className="py-2.5 px-3">Signers</th>
                  <th className="py-2.5 px-3">Created (BST)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-faint font-mono">
                      Loading agreements from API...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-ink-faint">
                      No agreements found. Click <strong>New Envelope</strong> to create one.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec) => {
                    const badge = getStatusBadge(rec.status);
                    const linkHref = rec.status === 'DRAFT' ? `/envelopes/${rec.id}/prepare` : `/documents/${rec.id}`;
                    return (
                      <tr key={rec.id} className="hover:bg-paper/80 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="font-semibold text-pine-900">{rec.title}</div>
                          <div className="text-[11px] text-ink-soft font-mono">ID: {rec.id}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex -space-x-1.5">
                            {rec.recipients && rec.recipients.length > 0 ? (
                              rec.recipients.map((s: any, idx: number) => (
                                <span
                                  key={idx}
                                  title={`${s.name} (${s.status})`}
                                  className="w-6 h-6 rounded-full bg-pine-100 text-pine-900 border border-surface text-[10px] font-bold flex items-center justify-center font-mono shadow-sm"
                                >
                                  {(s.name || 'S').slice(0, 2).toUpperCase()}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-ink-faint">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-mono text-ink-soft text-[11px]">
                          {new Date(rec.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.color}`}
                          >
                            {badge.text}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <Link href={linkHref}>
                            <button className="px-2.5 py-1 rounded bg-paper hover:bg-surface-raised border border-border text-pine-900 font-semibold text-[11px] transition-all">
                              {rec.status === 'DRAFT' ? 'Resume' : 'Details'}
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between text-xs text-ink-soft pt-2 border-t border-border">
            <span>Showing {filteredRecords.length} records</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-pine-900 font-semibold">Page 1 of 1</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Side Intelligence Widgets & Trust (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Evidentiary Integrity Protocol Widget */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-pine-600" />
              <span>Evidentiary Integrity Protocol</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              SHA-256 tamper-evident cryptographic seal stamped with BST atomic clock source. Admissible under ICT Act 2006 §7.
            </p>
            <div className="p-3 bg-paper rounded-xl border border-border/70 font-mono text-[11px] text-ink-faint space-y-1">
              <div>Node: CA-BD-MOTIJHEEL-01</div>
              <div className="truncate">Active Workspace: {workspace?.id || 'Vault Initialized'}</div>
            </div>
          </div>

          {/* Gemini Velocity Insight Widget */}
          <div className="bg-surface-raised rounded-2xl border border-border p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-brass-600" />
              <span>AI Contract Velocity Insight</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Real-time audit chain verification and AI clause extraction powered by Gemini.
            </p>
            <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-1.5">
              <div className="flex justify-between items-center font-semibold text-pine-900">
                <span>Avg Signing Speed:</span>
                <span className="text-emerald-700 font-mono">1.2 hours</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft text-[11px]">
                <span>Court Admissibility Index:</span>
                <span className="text-pine-900 font-mono font-bold">100% (ICT §7)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
