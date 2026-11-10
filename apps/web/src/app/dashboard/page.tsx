'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
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
  FolderClosed
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
  const [searchQuery, setSearchQuery] = useState('');
  const [triageDismissed, setTriageDismissed] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('signdesk_envelopes');
    if (saved) {
      try {
        setEnvelopes(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Demo seeded records matching Stitch mockup
  const defaultRecent = [
    {
      id: 'ENV-892401',
      title: 'Rahim Traders — Supply Agreement 2025',
      meta: '৳1,450,000 BDT • Combed Cotton Yarn',
      signers: ['TA'],
      sentBST: 'Oct 24, 14:10',
      expiry: '18h left',
      status: 'In Progress',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      actionText: 'Remind',
      actionHref: '/documents/ENV-892401',
      type: 'pending'
    },
    {
      id: 'ENV-892398',
      title: 'Agrani Foods — Vendor Onboarding Deed',
      meta: 'PKI Hash Verified • NBR Mushak 6.3 Registered',
      signers: ['MA', 'SZ'],
      sentBST: 'Oct 23, 11:20',
      expiry: 'Executed',
      status: 'Sealed & Done',
      statusColor: 'bg-brass-500/20 text-brass-600 border-brass-500/30',
      actionText: 'Download',
      actionHref: '/documents/ENV-892398',
      type: 'completed'
    },
    {
      id: 'ENV-892342',
      title: 'Chittagong Port Logistics Master Contract',
      meta: 'Your Signature Required • Terminal 4 Jetty',
      signers: ['YOU', 'KC'],
      sentBST: 'Oct 22, 17:45',
      expiry: '5 days left',
      status: 'Action Required',
      statusColor: 'bg-seal-100 text-seal-700 border-seal-500/30',
      actionText: 'Sign Now',
      actionHref: '/documents/ENV-892342',
      type: 'action'
    },
    {
      id: 'ENV-892210',
      title: 'Executive Employment Agreement — S. Hossain',
      meta: 'Unsent Draft • VP Engineering & Infrastructure',
      signers: ['Unassigned'],
      sentBST: 'Created Oct 21',
      expiry: '—',
      status: 'Draft',
      statusColor: 'bg-paper text-ink-soft border-border',
      actionText: 'Resume',
      actionHref: '/envelopes/new',
      type: 'draft'
    }
  ];

  const allRecords = [
    ...envelopes.map(e => ({
      id: e.id,
      title: e.title || 'Untitled Agreement',
      meta: `Created ${new Date(e.createdAt || Date.now()).toLocaleDateString('en-GB')}`,
      signers: [e.recipients?.[0]?.name ? e.recipients[0].name.slice(0, 2).toUpperCase() : 'TA'],
      sentBST: new Date(e.createdAt || Date.now()).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      expiry: '14 days',
      status: e.status === 'completed' ? 'Sealed & Done' : 'In Progress',
      statusColor: e.status === 'completed' ? 'bg-brass-500/20 text-brass-600 border-brass-500/30' : 'bg-amber-100 text-amber-900 border-amber-300',
      actionText: 'Details',
      actionHref: `/documents/${e.id}`,
      type: e.status
    })),
    ...defaultRecent
  ];

  const filteredRecords = allRecords.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {workspace?.name || 'Rahim Textiles & Trade Ltd.'} • Node: Motijheel Sub-Registry • Logged in as <strong>{user?.name || 'Ayesha Rahman'}</strong> ({user?.email || 'ayesha@rahimtraders.com'})
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
      <div className="bg-amber-50/70 border border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span className="uppercase tracking-wider">Priority Triage Required</span>
            <span className="text-[11px] font-normal text-amber-800 font-mono">
              (3 Critical Items • Real-time BST Dispatch Sync)
            </span>
          </div>
          <span className="text-[11px] text-amber-800 hidden sm:inline">Active monitoring</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Triage Item 1 */}
          <div className="p-3 bg-surface rounded-xl border border-amber-200 shadow-warm-sm flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="font-semibold text-pine-900 truncate">Rahim Traders — Supply Agreement</div>
              <div className="text-[11px] text-amber-800 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Expires in 18 hrs • 1 Signer Pending</span>
              </div>
            </div>
            <Link href="/documents/ENV-892401">
              <button className="px-2.5 py-1 rounded bg-pine-900 text-paper text-[11px] font-semibold hover:bg-pine-800 shrink-0">
                Remind
              </button>
            </Link>
          </div>

          {/* Triage Item 2 */}
          <div className="p-3 bg-surface rounded-xl border border-danger/30 shadow-warm-sm flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="font-semibold text-pine-900 truncate">Beximco Logistics MoA</div>
              <div className="text-[11px] text-danger flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3 text-danger" />
                <span>Declined by Legal Counsel</span>
              </div>
            </div>
            <Link href="/documents/beximco-moa">
              <button className="px-2.5 py-1 rounded bg-danger-bg text-danger border border-danger/30 text-[11px] font-semibold hover:bg-danger/20 shrink-0">
                Reason
              </button>
            </Link>
          </div>

          {/* Triage Item 3 */}
          <div className="p-3 bg-surface rounded-xl border border-border shadow-warm-sm flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 min-w-0">
              <div className="font-semibold text-pine-900 truncate">Bounce (kazi@delta.com.bd)</div>
              <div className="text-[11px] text-ink-soft flex items-center gap-1 font-mono">
                <RefreshCw className="w-3 h-3 text-pine-600" />
                <span>Apex Footwear Contract v2</span>
              </div>
            </div>
            <Link href="/documents/apex-footwear">
              <button className="px-2.5 py-1 rounded bg-paper text-pine-900 border border-border text-[11px] font-semibold hover:bg-surface-raised shrink-0">
                Resend
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 KPI Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pending Execution */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Pending Execution</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pine-900">14</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              3 need you
            </span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">Active en route • BST SLA: 24h</p>
        </div>

        {/* Card 2: Executed Deeds */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Executed Deeds (MTD)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-emerald-800">82</span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">৳4.8M protected</span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">+18.4% MoM • 100% Notarized</p>
        </div>

        {/* Card 3: Turnaround Velocity */}
        <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-ink-soft">
            <span className="font-medium">Turnaround Velocity</span>
            <Sparkles className="w-4 h-4 text-brass-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-pine-900">4.2</span>
            <span className="text-xs font-semibold text-pine-600">hours avg</span>
          </div>
          <p className="text-[11px] text-ink-faint font-mono">88% faster than paper parchment</p>
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
            <span className="font-display text-3xl font-bold text-pine-900">{envelopes.length} / 5</span>
            <span className="text-xs text-ink-soft">envelopes</span>
          </div>
          <div className="w-full bg-paper rounded-full h-1.5 border border-border overflow-hidden">
            <div
              className="bg-pine-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (envelopes.length / 5) * 100)}%` }}
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
              <p className="text-xs text-ink-soft">84 Active Deeds in Dhaka Motijheel Registry</p>
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
              <button
                type="button"
                className="p-2 rounded-lg border border-border bg-paper hover:bg-surface-raised text-ink-soft text-xs"
                title="Filter deeds"
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-5 sm:-mx-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised/80 border-y border-border text-[11px] font-mono text-ink-faint uppercase">
                <tr>
                  <th className="py-2.5 px-5">Document Title</th>
                  <th className="py-2.5 px-3">Signer</th>
                  <th className="py-2.5 px-3">Sent (BST)</th>
                  <th className="py-2.5 px-3">Expiry</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-paper/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-pine-900">{rec.title}</div>
                      <div className="text-[11px] text-ink-soft font-mono">{rec.id} • {rec.meta}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex -space-x-1.5">
                        {rec.signers.map((s: string, idx: number) => (
                          <span
                            key={idx}
                            className="w-6 h-6 rounded-full bg-pine-100 text-pine-900 border border-surface text-[10px] font-bold flex items-center justify-center font-mono shadow-sm"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-ink-soft text-[11px]">
                      {rec.sentBST}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-ink-faint text-[11px]">
                      {rec.expiry}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${rec.statusColor}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link href={rec.actionHref}>
                        <button className="px-2.5 py-1 rounded bg-paper hover:bg-surface-raised border border-border text-pine-900 font-semibold text-[11px] transition-all">
                          {rec.actionText}
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between text-xs text-ink-soft pt-2 border-t border-border">
            <span>Showing {filteredRecords.length} records</span>
            <div className="flex items-center gap-2">
              <button disabled className="px-2.5 py-1 rounded border border-border text-ink-faint text-xs disabled:opacity-50">
                Previous
              </button>
              <span className="font-mono text-xs text-pine-900 font-semibold">Page 1 of 1</span>
              <button disabled className="px-2.5 py-1 rounded border border-border text-ink-faint text-xs disabled:opacity-50">
                Next
              </button>
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
              <div className="truncate">Root Genesis: 4e7b819f03c289ad0e6b...</div>
            </div>
          </div>

          {/* Gemini Velocity Insight Widget */}
          <div className="bg-surface-raised rounded-2xl border border-border p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-brass-600" />
              <span>AI Contract Velocity Insight</span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Predictive dispatch analysis based on 312 corporate deeds completed across Dhaka &amp; Chittagong registries.
            </p>
            <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-1.5">
              <div className="flex justify-between items-center font-semibold text-pine-900">
                <span>Avg Signing Speed:</span>
                <span className="font-mono text-brass-600 font-bold">4.2 hrs (Top 5%)</span>
              </div>
              <p className="text-[11px] text-ink-faint">
                💡 Signers respond 2.4x quicker when dispatched between 10:00 AM – 11:30 AM BST on banking weekdays.
              </p>
            </div>
          </div>

          {/* Certified Templates Widget */}
          <div className="bg-surface rounded-2xl border border-border p-5 shadow-warm-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-pine-900 uppercase tracking-wider">
              <span>Certified Templates (16)</span>
              <Link href="/templates" className="text-pine-600 hover:underline normal-case font-semibold">
                Browse All &rarr;
              </Link>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/templates"
                  className="p-2.5 rounded-xl border border-border/70 hover:border-pine-600 bg-paper hover:bg-surface block transition-all group"
                >
                  <div className="font-semibold text-pine-900 group-hover:text-pine-600">
                    Commercial Lease Deed (BDT)
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Includes ৳300 Non-Judicial Stamp clause • NBR compliant
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="p-2.5 rounded-xl border border-border/70 hover:border-pine-600 bg-paper hover:bg-surface block transition-all group"
                >
                  <div className="font-semibold text-pine-900 group-hover:text-pine-600">
                    Institutional Bilateral NDA
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Strict IP Protection • High Court Jurisdiction Dhaka
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  href="/templates"
                  className="p-2.5 rounded-xl border border-border/70 hover:border-pine-600 bg-paper hover:bg-surface block transition-all group"
                >
                  <div className="font-semibold text-pine-900 group-hover:text-pine-600">
                    Corporate PO &amp; Delivery Acceptance
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Mushak-6.3 VAT references • Cross-border standard
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statutory Footer Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-pine-950 text-paper border border-pine-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-brass-500 shrink-0" />
          <div>
            <strong className="text-paper block font-sans font-semibold">
              Section 7 • ICT ACT 2006 • Universal Legal Evidentiary Status
            </strong>
            <span className="text-paper/70 text-[11px]">
              All documents executed via SignDesk comply with the Information and Communication Technology Act 2006 (Bangladesh) and are admissible before the Supreme Court &amp; Civil Benches.
            </span>
          </div>
        </div>
        <div className="text-[11px] text-paper/80 font-mono whitespace-nowrap self-end sm:self-auto">
          Certifier ID: CA-BD-2026-X • 100% Validated
        </div>
      </div>
    </div>
  );
}