'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

export default function DocumentsPage() {
  return (
    <AuthGuard>
      <DocumentsContent />
    </AuthGuard>
  );
}

function DocumentsContent() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    // Initial sample documents matching Stitch designs
    const defaultDocs = [
      {
        id: 'doc_1',
        title: 'Mutual Non-Disclosure Agreement — Horizon Logistics',
        status: 'waiting',
        sentAt: '2026-11-10T14:00:00Z',
        expiresAt: '2026-11-24T14:00:00Z',
        signedCount: 0,
        totalSigners: 2,
        recipients: [
          { name: 'Rahim Chowdhury', status: 'notified' },
          { name: 'Karimul Islam', status: 'pending' },
        ],
        hash: '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c',
      },
      {
        id: 'doc_2',
        title: 'Standard Supply Deed — Apex Commerce & Brothers',
        status: 'completed',
        sentAt: '2026-11-05T10:00:00Z',
        completedAt: '2026-11-07T12:30:00Z',
        signedCount: 2,
        totalSigners: 2,
        recipients: [
          { name: 'Tariq Hasan', status: 'signed' },
          { name: 'Tanvir Ahmed', status: 'signed' },
        ],
        hash: '8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      },
      {
        id: 'doc_3',
        title: 'Senior Software Engineer Employment Offer',
        status: 'in_progress',
        sentAt: '2026-11-08T09:00:00Z',
        expiresAt: '2026-11-22T09:00:00Z',
        signedCount: 1,
        totalSigners: 2,
        recipients: [
          { name: 'Kamrul Hasan', status: 'signed' },
          { name: 'Tanvir Ahmed', status: 'notified' },
        ],
        hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      },
    ];

    // Combine with stored local storage envelopes
    const saved = localStorage.getItem('signdesk_envelopes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          const merged = [...parsed, ...defaultDocs.filter(d => !parsed.some((p: any) => p.id === d.id))];
          setDocuments(merged);
          return;
        }
      } catch (e) {}
    }
    setDocuments(defaultDocs);
  }, []);

  const filtered = documents.filter((doc) => {
    if (filter !== 'all' && doc.status !== filter) return false;
    if (search && !doc.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Documents Repository (§6.7)
          </span>
          <h1 className="font-display text-3xl font-bold text-pine-900 mt-1">
            Executed Agreements & Envelopes
          </h1>
          <p className="text-sm text-ink-soft">
            All electronic records are tracked with SHA-256 Merkle chain integrity.
          </p>
        </div>
        <Link href="/envelopes/new">
          <Button variant="primary" className="h-10">
            <Plus className="w-4 h-4 mr-1.5" />
            New Envelope
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'All Envelopes' },
            { id: 'waiting', label: 'Waiting' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
            { id: 'declined', label: 'Declined' },
            { id: 'expired', label: 'Expired' },
            { id: 'voided', label: 'Voided' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-full font-medium transition-all ${
                filter === item.id
                  ? 'bg-pine-900 text-paper font-semibold shadow-warm-sm'
                  : 'bg-surface border border-border text-ink-soft hover:bg-surface-raised hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            placeholder="Search by title or party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-[4px] border border-border bg-surface text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-surface rounded-[12px] border border-border shadow-warm-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-raised border-b border-border text-xs uppercase font-mono text-ink-faint">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Signer Progress</th>
                <th className="py-3 px-4">Dispatch / Expiry</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((doc) => {
                const signed = doc.signedCount || (doc.status === 'completed' ? 2 : 0);
                const total = doc.totalSigners || 2;
                const percent = Math.round((signed / total) * 100);

                return (
                  <tr key={doc.id} className="hover:bg-surface-raised/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="font-bold text-pine-900 hover:underline block"
                        >
                          {doc.title}
                        </Link>
                        <span className="text-[11px] font-mono text-ink-faint block truncate max-w-sm">
                          SHA: {doc.hash?.slice(0, 16)}...{doc.hash?.slice(-8)}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        variant={
                          doc.status === 'completed'
                            ? 'completed'
                            : doc.status === 'waiting'
                            ? 'waiting'
                            : doc.status === 'in_progress'
                            ? 'inProgress'
                            : doc.status === 'declined'
                            ? 'declined'
                            : 'draft'
                        }
                      >
                        {doc.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-36 space-y-1">
                        <div className="flex items-center justify-between text-xs text-ink-soft">
                          <span>{signed} of {total} Signed</span>
                          <span className="font-mono text-[11px] font-semibold">{percent}%</span>
                        </div>
                        <div className="w-full bg-surface-raised h-1.5 rounded-full overflow-hidden border border-border">
                          <div
                            className={`h-full rounded-full ${
                              doc.status === 'completed' ? 'bg-success' : 'bg-pine-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-mono text-ink-soft whitespace-nowrap">
                      <div>Sent: {new Date(doc.sentAt || Date.now()).toLocaleDateString('en-GB')}</div>
                      <div className="text-[11px] text-ink-faint">
                        {doc.status === 'completed'
                          ? 'Sealed: ' + new Date(doc.completedAt || Date.now()).toLocaleDateString('en-GB')
                          : 'Expires: 14 Days'}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Link href={`/documents/${doc.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          Inspect & Track
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
