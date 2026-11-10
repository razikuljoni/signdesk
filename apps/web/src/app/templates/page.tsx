'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

export default function TemplatesPage() {
  return (
    <AuthGuard>
      <TemplatesContent />
    </AuthGuard>
  );
}

const STARTER_TEMPLATES = [
  {
    id: 'tpl-nda',
    name: 'Non-Disclosure Agreement (NDA)',
    category: 'Commercial',
    description: 'Mutual confidentiality and trade secret protection agreement between two Bangladeshi entities.',
    roles: ['Disclosing Party', 'Receiving Party'],
    fieldsCount: 4,
    useCount: 28,
    lastUsed: '2 hours ago',
    pdfUrl: '/samples/bd-standard-nda.pdf',
  },
  {
    id: 'tpl-msa',
    name: 'Master Services Agreement (MSA)',
    category: 'Commercial',
    description: 'Comprehensive deliverable, payment milestone, and warranty terms for B2B service delivery.',
    roles: ['Service Provider', 'Client Signatory'],
    fieldsCount: 6,
    useCount: 15,
    lastUsed: 'Yesterday',
    pdfUrl: '/samples/master-services-agreement.pdf',
  },
  {
    id: 'tpl-offer',
    name: 'Employment Offer Letter',
    category: 'Employment',
    description: 'Standard Bangladesh Labour Act 2006 compliant employment offer and confidentiality covenant.',
    roles: ['Employer Representative', 'Employee Candidate'],
    fieldsCount: 4,
    useCount: 34,
    lastUsed: '3 days ago',
    pdfUrl: '/samples/employment-agreement.pdf',
  },
  {
    id: 'tpl-freelancer',
    name: 'Freelancer / Contractor Agreement',
    category: 'Employment',
    description: 'Independent contractor agreement with full intellectual property assignment and delivery milestones.',
    roles: ['Client Signatory', 'Independent Contractor'],
    fieldsCount: 4,
    useCount: 19,
    lastUsed: '5 days ago',
    pdfUrl: '/samples/freelancer-agreement.pdf',
  },
  {
    id: 'tpl-invoice',
    name: 'Invoice / Payment Acknowledgement',
    category: 'Finance',
    description: 'Commercial invoice receipt acknowledgement and agreed payment schedule attestation.',
    roles: ['Issuer Signatory', 'Payee Signatory'],
    fieldsCount: 4,
    useCount: 42,
    lastUsed: 'Yesterday',
    pdfUrl: '/samples/invoice-acknowledgement.pdf',
  },
  {
    id: 'tpl-lease',
    name: 'Office Space Rental Agreement',
    category: 'Property',
    description: 'Commercial tenancy agreement for commercial and office property within Bangladesh.',
    roles: ['Landlord / Lessor', 'Tenant / Lessee'],
    fieldsCount: 6,
    useCount: 9,
    lastUsed: '1 week ago',
    pdfUrl: '/samples/commercial-lease.pdf',
  },
];

function TemplatesContent() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = STARTER_TEMPLATES.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'All' || t.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
              Contract Templates
            </h1>
            <span className="text-xs font-mono bg-pine-100 text-pine-900 px-2.5 py-0.5 rounded-full font-semibold border border-pine-500/20">
              6 BD Starter Packs
            </span>
          </div>
          <p className="text-sm text-ink-soft">
            Standardized commercial agreements for Bangladesh SME business. Instantiate and send to new signatories in seconds.
          </p>
        </div>

        <Link href="/envelopes/new">
          <Button variant="primary" size="default">
            <Plus className="w-4 h-4 mr-1.5" />
            Create From Custom PDF
          </Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Commercial', 'Employment', 'Finance', 'Property'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-pine-900 text-paper'
                  : 'bg-surface text-ink-soft hover:bg-surface-raised border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-ink-faint absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-border rounded-md text-ink placeholder:text-ink-faint focus:outline-none focus:border-pine-600"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <Card key={t.id} className="bg-surface flex flex-col justify-between hover:shadow-warm-md transition-shadow">
            <CardHeader className="space-y-3 pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-lg bg-pine-100 flex items-center justify-center text-pine-800">
                  <FileText className="w-5 h-5" />
                </div>
                <Badge variant="draft" className="text-[10px] font-mono">
                  {t.useCount} sends
                </Badge>
              </div>

              <div>
                <CardTitle className="text-base font-bold text-pine-900 leading-snug">
                  {t.name}
                </CardTitle>
                <CardDescription className="text-xs text-ink-soft mt-1 line-clamp-2">
                  {t.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-0 pb-4">
              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="text-[11px] font-semibold text-ink-faint uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-pine-600" />
                  Signatory Roles ({t.roles.length}):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {t.roles.map((role) => (
                    <span
                      key={role}
                      className="text-[11px] bg-paper px-2 py-0.5 rounded border border-border text-ink font-medium"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-faint pt-1">
                <span>{t.fieldsCount} Pre-placed Fields</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last used {t.lastUsed}
                </span>
              </div>
            </CardContent>

            <CardFooter className="pt-3 border-t border-border grid grid-cols-2 gap-2">
              <Link href={`/templates/${t.id}`} className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Inspect
                </Button>
              </Link>
              <Link href={`/templates/${t.id}/use`} className="w-full">
                <Button variant="primary" size="sm" className="w-full text-xs font-bold">
                  Use Template
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
