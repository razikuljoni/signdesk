'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Plus,
  Send,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  Scale,
  Award,
  Layers,
  ChevronRight,
  Building2,
  FolderOpen,
  Edit,
} from 'lucide-react';

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  );
}

interface TemplateCard {
  id: string;
  title: string;
  category: 'commercial' | 'governance' | 'procurement' | 'statutory';
  categoryLabel: string;
  sector: string;
  stampDuty: string;
  dispatches: number;
  lastUsed: string;
  rolesCount: number;
  fieldsMapped: number;
  description: string;
}

const TEMPLATES: TemplateCard[] = [
  {
    id: 'commercial-supply',
    title: 'Commercial Supply Agreement',
    category: 'commercial',
    categoryLabel: 'Commercial',
    sector: 'RMG & Manufacturing',
    stampDuty: 'Statutory Stamp Duty: ৳1,000',
    dispatches: 24,
    lastUsed: '24 Oct',
    rolesCount: 3,
    fieldsMapped: 6,
    description:
      'Standardized bilateral supply deed with Incoterms 2020 delivery parameters, BSTI conformity mandates, and LC irrevocable consideration terms.',
  },
  {
    id: 'bilateral-nda',
    title: 'Bilateral Non-Disclosure Agreement (NDA)',
    category: 'governance',
    categoryLabel: 'Governance',
    sector: 'Corporate & Tech',
    stampDuty: 'Non-Judicial Duty: ৳300',
    dispatches: 18,
    lastUsed: '19 Oct',
    rolesCount: 2,
    fieldsMapped: 4,
    description:
      'Comprehensive mutual confidentiality covenant and IP safeguarding indenture compliant with the Copyright Act and ICT Act 2006.',
  },
  {
    id: 'standard-sla',
    title: 'Standard Work Order & SLA',
    category: 'procurement',
    categoryLabel: 'Procurement',
    sector: 'Procurement & Services',
    stampDuty: 'Duty Exemption Applicable',
    dispatches: 12,
    lastUsed: '14 Oct',
    rolesCount: 2,
    fieldsMapped: 5,
    description:
      'Turnkey vendor procurement agreement with milestone release gates, acceptance protocols, and liquidated damage indemnity caps.',
  },
  {
    id: 'board-resolution',
    title: 'Board Resolution of Authority',
    category: 'statutory',
    categoryLabel: 'Statutory',
    sector: 'Corporate Governance (RJSC)',
    stampDuty: 'Statutory Stamp Duty: ৳500',
    dispatches: 9,
    lastUsed: '08 Oct',
    rolesCount: 3,
    fieldsMapped: 7,
    description:
      'Official corporate board minute authorizing managing directors to execute credit facilities, bank deeds, and property conveyances under RJSC rules.',
  },
];

function TemplatesContent() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = TEMPLATES.filter((tpl) => {
    if (filterCategory !== 'all' && tpl.category !== filterCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      tpl.title.toLowerCase().includes(q) ||
      tpl.sector.toLowerCase().includes(q) ||
      tpl.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pine-800 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Standardized Legal Specimen Repository</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-pine-900 tracking-tight">
              Document Templates
            </h1>
            <p className="text-sm text-ink-soft mt-1 max-w-2xl">
              Standardized, court-admissible commercial templates compliant with Section 7 of the Bangladesh ICT Act 2006.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/templates/commercial-supply">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all">
                <Plus className="w-4 h-4 text-brass" />
                <span>+ Create Template</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6">
        {/* Metric Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                Active Instruments
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">4 Active Instruments</div>
              <div className="text-[11px] text-emerald-800 font-medium mt-0.5">
                All pre-cleared for BD commerce
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-pine-50 text-pine-900 border border-pine-200 flex items-center justify-center">
              <FolderOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                Historical Dispatches
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">63 Dispatches</div>
              <div className="text-[11px] text-pine-800 font-medium mt-0.5">
                Across Dhaka & CTG enterprise hubs
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-4 shadow-subtle flex items-center justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider">
                Statutory Admissibility
              </div>
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">Section 7 Guaranteed</div>
              <div className="text-[11px] text-brass-dark font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                <span>ICT Act 2006 & Evidence Act 1872</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-brass/10 text-brass-dark border border-brass/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Toolbar & Filters */}
        <div className="bg-surface rounded-xl border border-border p-4 mb-6 shadow-subtle space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === 'all'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                All Templates ({TEMPLATES.length})
              </button>
              <button
                onClick={() => setFilterCategory('commercial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === 'commercial'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Commercial (1)
              </button>
              <button
                onClick={() => setFilterCategory('governance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === 'governance'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Governance (1)
              </button>
              <button
                onClick={() => setFilterCategory('procurement')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === 'procurement'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Procurement (1)
              </button>
              <button
                onClick={() => setFilterCategory('statutory')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterCategory === 'statutory'
                    ? 'bg-pine-900 text-paper shadow-sm'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`}
              >
                Statutory (1)
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative sm:w-80">
              <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates by title, sector, or clause type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-paper border border-border rounded-lg text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-pine-900/20 focus:border-pine-900"
              />
            </div>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {filtered.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-surface rounded-xl border border-border p-6 shadow-subtle hover:shadow-warm transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-paper border border-border text-pine-800">
                      {tpl.categoryLabel} • {tpl.sector}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-pine-900 mt-1.5">
                      {tpl.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                    {tpl.stampDuty}
                  </span>
                </div>

                <p className="text-xs text-ink-soft leading-relaxed">
                  {tpl.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border font-mono text-[11px] text-ink-faint">
                  <div>
                    <span className="block text-[10px] uppercase">Dispatches</span>
                    <strong className="text-pine-900">{tpl.dispatches}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">Last Used</span>
                    <strong className="text-pine-900">{tpl.lastUsed}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">Signers</span>
                    <strong className="text-pine-900">{tpl.rolesCount} Roles</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase">Mapped</span>
                    <strong className="text-pine-900">{tpl.fieldsMapped} Fields</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-5 mt-4 border-t border-border">
                <Link href={`/templates/${tpl.id}`} className="flex-1">
                  <button className="w-full py-2 px-3 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center justify-center gap-1.5 shadow-subtle transition-all">
                    <Edit className="w-3.5 h-3.5 text-ink-soft" />
                    <span>Edit Specimen</span>
                  </button>
                </Link>

                <Link href={`/templates/${tpl.id}/use`} className="flex-1">
                  <button className="w-full py-2 px-3 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-1.5 shadow-warm transition-all">
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brass" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Standardized Legal Specimen Library Banner */}
        <div className="p-4 rounded-xl border border-brass/40 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-brass/15 text-brass-dark">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-pine-900 text-xs">
                Dhaka Chamber of Commerce & Industry (DCCI) & Supreme Court Bar Specimen Vetted
              </div>
              <div className="text-[11px] text-ink-soft mt-0.5">
                All templates comply with non-judicial stamp duty schedules under the Stamp Act 1899 and electronic record criteria under ICT Act 2006.
              </div>
            </div>
          </div>

          <Link href="/legal" className="text-xs font-semibold text-pine-900 hover:underline whitespace-nowrap">
            View Statutory Guidelines →
          </Link>
        </div>
      </div>
    </div>
  );
}
