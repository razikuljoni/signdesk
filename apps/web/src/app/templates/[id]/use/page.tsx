'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  Send,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Mail,
} from 'lucide-react';

export default function UseTemplatePage() {
  return (
    <AuthGuard>
      <UseTemplateContent />
    </AuthGuard>
  );
}

function UseTemplateContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const templateName = 'Mutual Non-Disclosure Agreement (NDA)';

  // Form states
  const [docTitle, setDocTitle] = useState('Mutual Non-Disclosure Agreement — Horizon Logistics');
  const [message, setMessage] = useState('Please review and execute our standard commercial mutual NDA.');
  const [expiryDays, setExpiryDays] = useState(14);

  // Role signatories
  const [party1Name, setParty1Name] = useState('Tanvir Ahmed');
  const [party1Email, setParty1Email] = useState('tanvir@apex-commerce.bd');

  const [party2Name, setParty2Name] = useState('Rahim Chowdhury');
  const [party2Email, setParty2Email] = useState('rahim@horizon-logistics.bd');

  const [isSending, setIsSending] = useState(false);

  const handleSendFromTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Save newly instantiated envelope to localStorage demo store
    const newEnvelope = {
      id: 'env_' + Math.random().toString(36).substring(2, 9),
      title: docTitle,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      recipients: [
        { name: party1Name, email: party1Email, role: 'Disclosing Party', status: 'signed' },
        { name: party2Name, email: party2Email, role: 'Receiving Party', status: 'notified' },
      ],
      progress: 50,
      sourceTemplate: templateName,
    };

    const existing = JSON.parse(localStorage.getItem('signdesk_envelopes') || '[]');
    localStorage.setItem('signdesk_envelopes', JSON.stringify([newEnvelope, ...existing]));

    setTimeout(() => {
      router.push('/envelopes/sent');
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-border pb-6">
        <Link href="/templates" className="text-xs font-semibold text-pine-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Templates
        </Link>
        <div className="pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-pine-700 bg-pine-100 px-2 py-0.5 rounded font-semibold border border-pine-500/20">
            Instant 1-Click Send
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900 mt-2">
            Send from Template: {templateName}
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Assign the two signatory roles below. Pre-placed fields and legal compliance settings are applied automatically without touching the canvas.
          </p>
        </div>
      </div>

      <form onSubmit={handleSendFromTemplate} className="space-y-6">
        {/* Document Details */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-pine-600" />
            Envelope Information
          </div>

          <div className="space-y-2">
            <Label htmlFor="docTitle" className="text-xs">Document Title</Label>
            <Input
              id="docTitle"
              required
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs">Message to Signatories</Label>
            <textarea
              id="message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs p-2.5 rounded-md border border-border bg-surface focus:outline-none focus:border-pine-600"
            />
          </div>
        </Card>

        {/* Signatory Roles Assignment */}
        <Card className="bg-surface p-6 space-y-6">
          <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-pine-600" />
            Fill Signatory Roles
          </div>

          {/* Role 1 */}
          <div className="p-4 bg-paper rounded-[8px] border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-pine-900">
                Role 1: Disclosing Party Signatory
              </span>
              <Badge variant="draft" className="text-[10px]">
                Pre-placed Signature & Date
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-ink-faint">Full Legal Name</Label>
                <Input
                  required
                  value={party1Name}
                  onChange={(e) => setParty1Name(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-ink-faint">Corporate Email</Label>
                <Input
                  type="email"
                  required
                  value={party1Email}
                  onChange={(e) => setParty1Email(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Role 2 */}
          <div className="p-4 bg-paper rounded-[8px] border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-pine-900">
                Role 2: Receiving Party Signatory
              </span>
              <Badge variant="draft" className="text-[10px]">
                Pre-placed Signature & Date
              </Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] text-ink-faint">Full Legal Name</Label>
                <Input
                  required
                  value={party2Name}
                  onChange={(e) => setParty2Name(e.target.value)}
                  className="text-xs h-9"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] text-ink-faint">Corporate Email</Label>
                <Input
                  type="email"
                  required
                  value={party2Email}
                  onChange={(e) => setParty2Email(e.target.value)}
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/templates">
            <Button type="button" variant="outline" size="default">
              Cancel
            </Button>
          </Link>

          <Button type="submit" variant="primary" size="default" disabled={isSending} className="font-bold">
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Dispatching...' : 'Instantiate & Send Envelope'}
          </Button>
        </div>
      </form>
    </div>
  );
}
