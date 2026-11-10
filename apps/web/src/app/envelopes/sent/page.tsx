'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  CheckCircle2,
  Mail,
  ArrowRight,
  Clock,
  ExternalLink,
  Copy,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';

export default function EnvelopeSentPage() {
  return (
    <AuthGuard>
      <EnvelopeSentContent />
    </AuthGuard>
  );
}

function EnvelopeSentContent() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [envelope, setEnvelope] = useState<any>(null);

  // Generate demo magic links for direct browser testing
  const mockTokens = [
    {
      name: 'Rahim Chowdhury',
      email: 'rahim@horizon-logistics.bd',
      role: 'SIGNER',
      order: 1,
      status: 'NOTIFIED',
      token: 'demo_token_rahim_7a8b9c0d1e2f3a4b',
      link: '/sign/demo_token_rahim_7a8b9c0d1e2f3a4b',
    },
    {
      name: 'Karimul Islam',
      email: 'karim@apex-commerce.bd',
      role: 'SIGNER',
      order: 2,
      status: 'PENDING',
      token: 'demo_token_karim_4b5c6d7e8f9a0b1c',
      link: '/sign/demo_token_karim_4b5c6d7e8f9a0b1c',
    },
  ];

  useEffect(() => {
    // Read the latest created envelope from storage and mark it waiting
    const envelopes = JSON.parse(localStorage.getItem('signdesk_envelopes') || '[]');
    if (envelopes.length > 0) {
      envelopes[0].status = 'waiting';
      localStorage.setItem('signdesk_envelopes', JSON.stringify(envelopes));
      setEnvelope(envelopes[0]);
    }
  }, []);

  const copyToClipboard = (text: string, idx: number) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}${text}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-8">
      {/* Hero Success Card */}
      <Card className="bg-surface border-border text-center p-8 md:p-12 shadow-warm-md space-y-6">
        <div className="flex justify-center">
          <WaxSeal size={80} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-pine-600 font-bold bg-pine-100 px-3 py-1 rounded-full border border-pine-500/20">
            Dispatched • ICT Act 2006
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-pine-900">
            Envelope Dispatched for Signature
          </h1>
          <p className="text-sm text-ink-soft max-w-lg mx-auto leading-relaxed">
            Invitations have been sent via email. Signers can review and sign without creating an account.
            The audit trail has begun with genesis SHA-256 fingerprinting.
          </p>
        </div>

        {/* Recipients Dispatch Status Box */}
        <div className="text-left bg-surface-raised rounded-[12px] p-6 border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono uppercase font-bold text-pine-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-pine-600" />
              Signer Dispatch Hierarchy (Sequential)
            </span>
            <span className="text-[11px] text-ink-faint">
              Expires in 14 days
            </span>
          </div>

          <div className="space-y-3">
            {mockTokens.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-[8px] border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-warm-sm"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-pine-900">
                      #{item.order} {item.name}
                    </span>
                    <Badge variant={item.status === 'NOTIFIED' ? 'waiting' : 'draft'}>
                      {item.status === 'NOTIFIED' ? 'Link Active (Notified)' : 'Pending Turn'}
                    </Badge>
                  </div>
                  <div className="text-xs text-ink-soft font-mono">
                    {item.email}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(item.link, idx)}
                    className="text-xs font-semibold text-pine-600 hover:text-pine-800 bg-pine-100/60 hover:bg-pine-100 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedIndex === idx ? 'Copied Link!' : 'Copy Magic Link'}
                  </button>
                  <Link href={item.link} target="_blank">
                    <Button variant="sign" size="sm" className="h-8 text-xs font-bold">
                      Open Signer View
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Genesis Notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-ink-faint font-mono">
          <ShieldCheck className="w-4 h-4 text-brass-600" />
          <span>Genesis Hash chained: 4f82d1c9...c21e · Audit Event #1 logged</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-border">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
          <Link href={`/documents/${envelope?.id || 'env_latest'}`} className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto font-bold">
              View Document Detail & Tracking
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
