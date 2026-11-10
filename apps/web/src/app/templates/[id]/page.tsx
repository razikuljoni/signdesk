'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export default function TemplateDetailPage() {
  return (
    <AuthGuard>
      <TemplateDetailContent />
    </AuthGuard>
  );
}

function TemplateDetailContent() {
  const params = useParams();
  const id = params.id as string;

  const template = {
    id,
    name: 'Non-Disclosure Agreement (NDA)',
    category: 'Commercial',
    description: 'Mutual confidentiality and trade secret protection agreement between two Bangladeshi commercial entities.',
    roles: [
      { name: 'Disclosing Party', color: '#0C2E29', description: 'Originator sharing proprietary commercial information' },
      { name: 'Receiving Party', color: '#B3402A', description: 'Party covenanting strict confidentiality' },
    ],
    fields: [
      { page: 1, role: 'Disclosing Party', type: 'Signature', x: '15%', y: '78%' },
      { page: 1, role: 'Disclosing Party', type: 'Date Signed', x: '15%', y: '85%' },
      { page: 1, role: 'Receiving Party', type: 'Signature', x: '58%', y: '78%' },
      { page: 1, role: 'Receiving Party', type: 'Date Signed', x: '58%', y: '85%' },
    ],
    defaultExpiry: '14 days',
    defaultReminder: 'Every 48 hours',
    legalBasis: 'Bangladesh Information & Communication Technology (ICT) Act 2006 (Sec. 7)',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <Link href="/templates" className="text-xs font-semibold text-pine-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Templates Catalog
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
              {template.name}
            </h1>
            <p className="text-sm text-ink-soft mt-1 max-w-xl">
              {template.description}
            </p>
          </div>

          <Link href={`/templates/${id}/use`}>
            <Button variant="primary" size="default" className="font-bold">
              Use Template Now
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Template Properties */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2 text-pine-900 font-bold text-sm border-b border-border pb-3">
            <Users className="w-4 h-4 text-pine-600" />
            Configured Signatory Roles
          </div>

          <div className="space-y-3">
            {template.roles.map((r, i) => (
              <div key={r.name} className="p-3 bg-paper rounded border border-border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-pine-900">
                    Role #{i + 1}: {r.name}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                </div>
                <p className="text-[11px] text-ink-soft">{r.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2 text-pine-900 font-bold text-sm border-b border-border pb-3">
            <Layers className="w-4 h-4 text-pine-600" />
            Pre-placed Field Geometry ({template.fields.length} Fields)
          </div>

          <div className="space-y-2">
            {template.fields.map((f, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-paper rounded border border-border">
                <div className="space-y-0.5">
                  <strong className="text-pine-900 block">{f.type}</strong>
                  <span className="text-[11px] text-ink-faint">Assigned to: {f.role}</span>
                </div>
                <span className="font-mono text-[11px] text-ink-soft bg-surface px-2 py-1 rounded border border-border">
                  Page {f.page} • ({f.x}, {f.y})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Legal & Governance Footer */}
      <Card className="bg-surface-raised border border-border p-5 text-xs text-ink-soft space-y-2">
        <div className="font-bold text-pine-900 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-pine-600" />
          Statutory Framework
        </div>
        <p>
          Envelopes generated from this template automatically inherit digital SHA-256 Merkle chain attestation compliant with {template.legalBasis}.
        </p>
      </Card>
    </div>
  );
}
