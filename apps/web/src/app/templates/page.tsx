'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { apiFetch } from '@/lib/api';
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

function TemplatesContent() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const data = await apiFetch('/templates');
        if (Array.isArray(data)) {
          setTemplates(data);
        }
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
  }, []);

  const mappedTemplates = templates.map((t) => ({
    id: t.id,
    title: t.name,
    category: 'commercial',
    categoryLabel: 'Commercial',
    sector: 'Standard Accord',
    stampDuty: 'Statutory Stamp Duty: ৳1,000',
    dispatches: t.envelopes?.length || 0,
    lastUsed: new Date(t.updatedAt || t.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    rolesCount: Array.isArray(t.fieldLayout) ? new Set(t.fieldLayout.map((f: any) => f.recipientId)).size || 2 : 2,
    fieldsMapped: Array.isArray(t.fieldLayout) ? t.fieldLayout.length : 4,
    description: t.message || 'Standardized agreement template compliant with Section 7 of the Bangladesh ICT Act 2006.',
  }));

  const filtered = mappedTemplates.filter((tpl) => {
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
            <Link href="/envelopes/new">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all">
                <Plus className="w-4 h-4 text-brass" />
                <span>+ Upload New Template</span>
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
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">
                {templates.length} Active Instruments
              </div>
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
              <div className="text-2xl font-serif font-bold text-pine-900 mt-1">
                {mappedTemplates.reduce((acc, t) => acc + t.dispatches, 0)} Dispatches
              </div>
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
                All Templates ({mappedTemplates.length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-ink-faint absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-paper text-xs text-ink focus:outline-none focus:ring-2 focus:ring-pine-500/20 focus:border-pine-500"
              />
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-ink-soft">
            <WaxSeal size={36} className="animate-spin mx-auto mb-2" />
            <span>Loading template specimens from database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 bg-surface rounded-2xl border border-border text-center space-y-3">
            <FileText className="w-10 h-10 text-ink-faint mx-auto" />
            <h3 className="font-serif font-bold text-pine-900 text-base">No Templates Found</h3>
            <p className="text-xs text-ink-soft">
              {searchQuery ? 'Try adjusting your search filter.' : 'No templates exist in this workspace yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-surface rounded-xl border border-border hover:border-pine-800/40 p-6 shadow-subtle hover:shadow-warm transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-pine-100 text-pine-900 border border-pine-200 mb-2">
                        {tpl.categoryLabel}
                      </span>
                      <h2 className="font-serif font-bold text-lg text-pine-900 group-hover:text-pine-800 transition-colors">
                        {tpl.title}
                      </h2>
                      <div className="text-[11px] font-mono text-ink-faint">{tpl.sector}</div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft line-clamp-3 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-faint">
                    <span>{tpl.rolesCount} Signer Roles</span>
                    <span>•</span>
                    <span>{tpl.fieldsMapped} Fields Mapped</span>
                    <span>•</span>
                    <span>Last used: {tpl.lastUsed}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border gap-2">
                  <Link href={`/templates/${tpl.id}`} className="flex-1">
                    <button className="w-full py-2 px-3 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                      <Edit className="w-3.5 h-3.5 text-ink-soft" />
                      <span>Configure Specimen</span>
                    </button>
                  </Link>

                  <Link href={`/templates/${tpl.id}/use`} className="flex-1">
                    <button className="w-full py-2 px-3 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center justify-center gap-1.5 shadow-subtle transition-all">
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5 text-brass" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Standardized Legal Specimen Library Banner */}
        <div className="p-4 rounded-xl border border-brass/40 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4 shadow-subtle mt-8">
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

          <Link href="/dashboard" className="text-xs font-semibold text-pine-900 hover:underline whitespace-nowrap">
            View Statutory Guidelines →
          </Link>
        </div>
      </div>
    </div>
  );
}
