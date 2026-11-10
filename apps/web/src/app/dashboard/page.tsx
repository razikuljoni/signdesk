'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Search,
  Filter,
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

  useEffect(() => {
    // Load local storage envelopes if any
    const saved = localStorage.getItem('signdesk_envelopes');
    if (saved) {
      try {
        setEnvelopes(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Workspace Dashboard
          </span>
          <h1 className="font-display text-3xl font-bold text-pine-900 mt-1">
            {workspace?.name || 'Workspace'}
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/envelopes/new">
            <Button variant="primary" className="h-10 px-5">
              <Plus className="w-4 h-4 mr-1.5" />
              New Envelope
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-surface">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-medium text-ink-soft">Waiting for Signatures</span>
            <div className="font-display text-3xl font-bold text-pine-900">
              {envelopes.filter((e) => e.status === 'waiting').length}
            </div>
            <span className="text-[11px] text-pine-600 font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Awaiting signers
            </span>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-medium text-ink-soft">Completed this Month</span>
            <div className="font-display text-3xl font-bold text-success">
              {envelopes.filter((e) => e.status === 'completed').length}
            </div>
            <span className="text-[11px] text-success font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Sealed with Certificate
            </span>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-medium text-ink-soft">Drafts in Progress</span>
            <div className="font-display text-3xl font-bold text-ink">
              {envelopes.filter((e) => e.status === 'draft').length}
            </div>
            <span className="text-[11px] text-ink-faint">
              Unsent field layouts
            </span>
          </CardContent>
        </Card>

        <Card className="bg-surface">
          <CardContent className="p-5 space-y-1">
            <span className="text-xs font-medium text-ink-soft">Free Plan Quota</span>
            <div className="font-display text-3xl font-bold text-pine-900">
              {envelopes.length} / 5
            </div>
            <span className="text-[11px] text-ink-soft font-mono">
              Resets 1st of month
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Envelopes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-pine-900">
            Recent Envelopes
          </h2>
          <Link href="/documents" className="text-xs font-semibold text-pine-600 hover:underline">
            View All Documents →
          </Link>
        </div>

        {envelopes.length === 0 ? (
          /* Empty State per spec §3.4 */
          <Card className="bg-surface text-center p-12 space-y-4 border-dashed border-2">
            <div className="w-16 h-16 rounded-full bg-pine-100 flex items-center justify-center mx-auto text-pine-900">
              <FileText className="w-8 h-8 text-pine-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-pine-900">
              No envelopes yet
            </h3>
            <p className="text-sm text-ink-soft max-w-md mx-auto">
              Upload your first agreement, place signature fields, and send via email magic link.
            </p>
            <Link href="/envelopes/new">
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-1.5" />
                Upload PDF & Send
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-surface rounded-[12px] border border-border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-raised border-b border-border text-xs uppercase font-mono text-ink-faint">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {envelopes.map((env) => (
                  <tr key={env.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-pine-900">
                      {env.title}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={env.status === 'completed' ? 'completed' : 'waiting'}>
                        {env.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-ink-soft">
                      {env.recipients?.length || 1} recipient(s)
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-ink-faint">
                      {new Date(env.createdAt || Date.now()).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link href={`/documents/${env.id}`}>
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
