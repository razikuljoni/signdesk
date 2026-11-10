'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
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

interface EnvelopeItem {
  id: string;
  refCode: string;
  title: string;
  size: string;
  sectorTag: string;
  signersSummary: string;
  signersProgress: number;
  signersDetail: string;
  sentBST: string;
  validity: string;
  validityType: 'permanent' | 'urgent' | 'warning' | 'void' | 'expired';
  status: 'completed' | 'pending_you' | 'waiting' | 'voided' | 'declined';
  statusLabel: string;
  actionType: 'view' | 'sign_now' | 'remind' | 'cert_void' | 'reissue';
  actionLabel: string;
  routeId: string;
}

const ENVELOPES: EnvelopeItem[] = [
  {
    id: 'doc-8924',
    refCode: '#ENV-8924-DH',
    title: 'Rahim Traders — Annual Supply Master Agreement',
    size: '1.8 MB PDF/A-1b',
    sectorTag: 'RMG Sector',
    signersSummary: '2 of 2 Executed (100%) Complete',
    signersProgress: 100,
    signersDetail: 'Ayesha Rahman • Tanvir Ahmed',
    sentBST: '18 Oct, 2024, 02:45 PM BST',
    validity: 'Permanent Record',
    validityType: 'permanent',
    status: 'completed',
    statusLabel: 'Signed & Sealed',
    actionType: 'view',
    actionLabel: 'View Envelope',
    routeId: '8849-ICT',
  },
  {
    id: 'doc-9102',
    refCode: '#ENV-9102-PR',
    title: 'Pran Distribution — Logistics Franchise Agreement',
    size: '3.4 MB',
    sectorTag: 'Action Required',
    signersSummary: '1 of 3 Pending (You) (33%)',
    signersProgress: 33,
    signersDetail: 'AR (Signed), You (Pending), SZ (Queued)',
    sentBST: '24 Oct, 2024, 11:10 AM BST',
    validity: 'Expires in 2 days',
    validityType: 'urgent',
    status: 'pending_you',
    statusLabel: 'Pending Signature',
    actionType: 'sign_now',
    actionLabel: 'Sign Now',
    routeId: '9102-PR',
  },
  {
    id: 'doc-8711',
    refCode: '#ENV-8711-MP',
    title: 'Meghna Paper Mills — Industrial Machinery Lease Deed',
    size: '4.1 MB',
    sectorTag: 'Chattogram Unit',
    signersSummary: '1 of 2 Signed (50%)',
    signersProgress: 50,
    signersDetail: 'Waiting on: CFO (Meghna Dist.)',
    sentBST: '22 Oct, 2024, 04:12 PM BST',
    validity: 'Expires in 5 days',
    validityType: 'warning',
    status: 'waiting',
    statusLabel: 'Waiting on Others',
    actionType: 'remind',
    actionLabel: 'Remind Signer',
    routeId: '8849-ICT',
  },
  {
    id: 'doc-7933',
    refCode: '#ENV-7933-GL',
    title: 'Grameen Logistics — Inter-District Freight SLA',
    size: '890 KB',
    sectorTag: 'Multi-Party',
    signersSummary: '3 of 3 Executed (100%)',
    signersProgress: 100,
    signersDetail: 'Tamper-Proof Cryptographic Hash',
    sentBST: '15 Oct, 2024, 09:30 AM BST',
    validity: 'Vault Archived',
    validityType: 'permanent',
    status: 'completed',
    statusLabel: 'Signed & Sealed',
    actionType: 'view',
    actionLabel: 'View Envelope',
    routeId: '7933-GL',
  },
  {
    id: 'doc-6401',
    refCode: '#ENV-6401-BX',
    title: 'Beximco Synthetics — Raw Cotton Purchase Memo',
    size: 'Voided by Initiator',
    sectorTag: 'Workflow Terminated',
    signersSummary: 'Revocation Memo Attached',
    signersProgress: 0,
    signersDetail: 'Superseded by Incoterms 2020 schedule',
    sentBST: '02 Oct, 2024, 10:05 AM BST',
    validity: 'Rescinded',
    validityType: 'void',
    status: 'voided',
    statusLabel: 'Voided',
    actionType: 'cert_void',
    actionLabel: 'Cert. Void',
    routeId: '6401-BX',
  },
  {
    id: 'doc-7119',
    refCode: '#ENV-7119-SQ',
    title: 'Square Pharma — Cold Chain Transport NDA',
    size: 'Rejection: Cl. 14 Indemnity',
    sectorTag: 'Pharmaceuticals',
    signersSummary: 'Declined at Stage 2',
    signersProgress: 0,
    signersDetail: 'Legal Counsel rejected liability clause',
    sentBST: '28 Sep, 2024, 05:40 PM BST',
    validity: 'Expired',
    validityType: 'expired',
    status: 'declined',
    statusLabel: 'Declined',
    actionType: 'reissue',
    actionLabel: 'Re-issue',
    routeId: '7119-SQ',
  },
];

function DocumentsRepositoryContent() {
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'action' | 'completed' | 'drafts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [remindedDocId, setRemindedDocId] = useState<string | null>(null);

  const filteredEnvelopes = ENVELOPES.filter((doc) => {
    if (filterTab === 'waiting') return doc.status === 'waiting';
    if (filterTab === 'action') return doc.status === 'pending_you';
    if (filterTab === 'completed') return doc.status === 'completed';
    if (filterTab === 'drafts') return false; // currently 1 hypothetical draft
    return true;
  }).filter((doc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.refCode.toLowerCase().includes(q) ||
      doc.sectorTag.toLowerCase().includes(q) ||
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

  const handleRemind = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRemindedDocId(id);
    setTimeout(() => setRemindedDocId(null), 3000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Reference,Title,Sector,Progress,Sent_BST,Validity,Status',
        ...ENVELOPES.map(
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
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-pine-800 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>PKI Central Repository • ICT Act 2006</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-pine-900 tracking-tight">
              Envelopes & Agreements
            </h1>
            <p className="text-sm text-ink-soft mt-1 max-w-2xl">
              Manage, track, and export cryptographically verifiable audit trails for all executed agreements across Bangladesh jurisdiction.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold shadow-subtle transition-all"
            >
              <Download className="w-3.5 h-3.5 text-ink-soft" />
              <span>Export CSV</span>
            </button>
            <Link href="/envelopes/new">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all">
                <Plus className="w-4 h-4 text-brass" />
                <span>New Envelope</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Metric Cards Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                30D Execution Rate
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">94.2%</div>
              <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                +3.1% vs preceding 30d
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                Mean Turnaround
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">4.2 hrs</div>
              <div className="text-[11px] text-pine-800 font-medium mt-0.5">
                Dhaka & Chittagong Corporate Hubs
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-pine-50 text-pine-900 border border-pine-200 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                Active Seal Keys
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">Class-3 PKI</div>
              <div className="text-[11px] text-brass-dark font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                <span>FIPS 140-2 Level 3 HSM Enclave</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brass/10 text-brass-dark border border-brass/30 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="bg-surface rounded-t-xl border border-border border-b-0 p-4 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTab === 'all'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                All Envelopes (42)
              </button>
              <button
                onClick={() => setFilterTab('waiting')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTab === 'waiting'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Waiting on Others (14)
              </button>
              <button
                onClick={() => setFilterTab('action')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTab === 'action'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Action Required (3)
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTab === 'completed'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Completed (24)
              </button>
              <button
                onClick={() => setFilterTab('drafts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterTab === 'drafts'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Drafts (1)
              </button>
            </div>

            {/* Search Input & Quick Dropdowns */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by document name, signer email, or envelope ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-12 py-1.5 text-xs bg-paper border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-pine-900/20 focus:border-pine-900"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-ink-faint bg-surface border border-border rounded">
                  ⌘K
                </span>
              </div>

              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-medium flex items-center gap-1.5 shadow-subtle">
                <Calendar className="w-3.5 h-3.5 text-ink-soft" />
                <span>Last 30 Days</span>
                <ChevronDown className="w-3 h-3 text-ink-faint" />
              </button>

              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-medium flex items-center gap-1.5 shadow-subtle">
                <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                <span>Corporate Tag</span>
                <ChevronDown className="w-3 h-3 text-ink-faint" />
              </button>
            </div>
          </div>
        </div>

        {/* Remind Notification Banner */}
        {remindedDocId && (
          <div className="bg-emerald-50 border-x border-b border-emerald-200 px-4 py-2.5 flex items-center justify-between text-xs text-emerald-900 font-medium">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700 animate-bounce" />
              <span>
                Automated legal signing reminder with cryptographic link delivered via WhatsApp & TLS SMTP!
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">200 OK Gateway Dispatched</span>
          </div>
        )}

        {/* Envelopes Table */}
        <div className="bg-surface rounded-b-xl border border-border overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-paper/70 text-ink-soft border-b border-border font-medium">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedDocs.length > 0 &&
                        selectedDocs.length === filteredEnvelopes.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border text-pine-900 focus:ring-pine-900/30"
                    />
                  </th>
                  <th className="py-3 px-4 min-w-[280px]">Document & Reference ID</th>
                  <th className="py-3 px-4 min-w-[220px]">Signer Hierarchy & Progress</th>
                  <th className="py-3 px-4 min-w-[150px]">Sent (BST)</th>
                  <th className="py-3 px-4 min-w-[140px]">Validity / Expiration</th>
                  <th className="py-3 px-4 min-w-[130px]">Status</th>
                  <th className="py-3 px-4 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEnvelopes.map((doc) => {
                  const isSelected = selectedDocs.includes(doc.id);
                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-paper/50 transition-colors ${
                        isSelected ? 'bg-pine-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(doc.id)}
                          className="rounded border-border text-pine-900 focus:ring-pine-900/30"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1.5 rounded-md bg-paper border border-border text-pine-900">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <Link
                              href={`/documents/${doc.routeId}`}
                              className="font-medium text-pine-900 hover:underline block leading-snug"
                            >
                              {doc.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-ink-faint">
                              <span className="text-pine-800 font-semibold">{doc.refCode}</span>
                              <span>•</span>
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span className="bg-paper px-1.5 py-0.5 rounded border border-border text-ink-soft">
                                {doc.sectorTag}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-medium text-ink-soft mb-1">
                            <span>{doc.signersSummary}</span>
                          </div>
                          <div className="w-full bg-paper border border-border rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                doc.signersProgress === 100
                                  ? 'bg-emerald-600'
                                  : doc.signersProgress > 0
                                  ? 'bg-amber-600'
                                  : 'bg-zinc-300'
                              }`}
                              style={{ width: `${doc.signersProgress}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-ink-faint mt-1 truncate">
                            {doc.signersDetail}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-ink-soft">
                        {doc.sentBST}
                      </td>

                      <td className="py-3.5 px-4">
                        {doc.validityType === 'permanent' && (
                          <div className="flex items-center gap-1.5 text-ink-soft font-mono text-[11px]">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{doc.validity}</span>
                          </div>
                        )}
                        {doc.validityType === 'urgent' && (
                          <div className="flex items-center gap-1.5 text-vermilion font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{doc.validity}</span>
                          </div>
                        )}
                        {doc.validityType === 'warning' && (
                          <div className="flex items-center gap-1.5 text-amber-800 font-mono text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{doc.validity}</span>
                          </div>
                        )}
                        {doc.validityType === 'void' && (
                          <div className="flex items-center gap-1.5 text-vermilion-muted font-mono text-[11px]">
                            <Ban className="w-3.5 h-3.5" />
                            <span>{doc.validity}</span>
                          </div>
                        )}
                        {doc.validityType === 'expired' && (
                          <div className="flex items-center gap-1.5 text-ink-faint font-mono text-[11px]">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{doc.validity}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {doc.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Signed & Sealed</span>
                          </span>
                        )}
                        {doc.status === 'pending_you' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Pending Signature</span>
                          </span>
                        )}
                        {doc.status === 'waiting' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-paper text-ink-soft border border-border">
                            <Clock className="w-3.5 h-3.5 text-ink-faint" />
                            <span>Waiting on Others</span>
                          </span>
                        )}
                        {doc.status === 'voided' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-vermilion/10 text-vermilion border border-vermilion/30">
                            <Ban className="w-3.5 h-3.5 text-vermilion" />
                            <span>Voided</span>
                          </span>
                        )}
                        {doc.status === 'declined' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-800 border border-red-200">
                            <XCircle className="w-3.5 h-3.5 text-red-700" />
                            <span>Declined</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {doc.actionType === 'sign_now' ? (
                            <Link href="/sign/demo_token_tanvir_4b5c6d7e8f9a0b1c">
                              <button className="px-3 py-1 rounded-md bg-vermilion hover:bg-vermilion-hover text-paper font-semibold text-xs shadow-sm transition-all flex items-center gap-1">
                                <span>Sign Now</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </Link>
                          ) : doc.actionType === 'remind' ? (
                            <button
                              onClick={(e) => handleRemind(doc.id, e)}
                              className="px-2.5 py-1 rounded-md border border-border bg-paper hover:bg-surface text-ink text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <Bell className="w-3 h-3 text-pine-800" />
                              <span>Remind</span>
                            </button>
                          ) : (
                            <Link href={`/documents/${doc.routeId}`}>
                              <button className="px-2.5 py-1 rounded-md border border-border bg-paper hover:bg-surface text-ink text-xs font-medium transition-all">
                                {doc.actionLabel}
                              </button>
                            </Link>
                          )}

                          <Link
                            href={`/documents/${doc.routeId}/audit`}
                            className="p-1 rounded text-ink-faint hover:text-pine-900 transition-colors"
                            title="Forensic Audit Trail"
                          >
                            <Scale className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination & Sync Status */}
          <div className="border-t border-border px-4 py-3 bg-paper/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
            <div className="font-mono text-[11px] text-ink-faint">
              Showing 1–{filteredEnvelopes.length} of 42 envelopes | Cryptographic Hash Ledger Synced: 24 Oct 2024, 17:30 BST
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1.5 rounded border border-border text-ink-faint cursor-not-allowed opacity-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="px-2.5 py-1 rounded border border-pine-900 bg-pine-900 text-paper font-semibold text-[11px]">
                1
              </button>
              <button className="px-2.5 py-1 rounded border border-border bg-surface text-ink hover:bg-paper font-medium text-[11px]">
                2
              </button>
              <button className="px-2.5 py-1 rounded border border-border bg-surface text-ink hover:bg-paper font-medium text-[11px]">
                3
              </button>
              <span className="px-1 text-ink-faint">…</span>
              <button className="px-2.5 py-1 rounded border border-border bg-surface text-ink hover:bg-paper font-medium text-[11px]">
                5
              </button>
              <button className="p-1.5 rounded border border-border bg-surface text-ink hover:bg-paper">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Statutory Compliance Footer Callout */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brass/10 border border-brass/30 text-brass-dark mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-pine-900 text-xs">
                Bangladesh Information & Communication Technology (ICT) Act 2006 Compliant
              </div>
              <div className="text-[11px] text-ink-soft mt-0.5">
                All signatures generate an immutable SHA-256 PKI cryptographic digest paired with authoritative timestamping under CCA Bangladesh.
              </div>
            </div>
          </div>

          <Link
            href="/legal"
            className="text-xs font-semibold text-pine-900 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View Legal Audit Log</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
