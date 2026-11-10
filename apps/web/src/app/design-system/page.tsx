'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  PenTool,
} from 'lucide-react';

const COLORS = [
  { name: 'Paper (bg)', hex: '#FAF7F1', bg: 'bg-[#FAF7F1]', text: 'text-ink' },
  { name: 'Surface', hex: '#FFFFFF', bg: 'bg-[#FFFFFF]', text: 'text-ink', border: true },
  { name: 'Surface Raised', hex: '#F3EEE5', bg: 'bg-[#F3EEE5]', text: 'text-ink' },
  { name: 'Border', hex: '#E4DCCB', bg: 'bg-[#E4DCCB]', text: 'text-ink' },
  { name: 'Border Strong', hex: '#CFC3AC', bg: 'bg-[#CFC3AC]', text: 'text-ink' },
  { name: 'Ink (primary)', hex: '#1B1A17', bg: 'bg-[#1B1A17]', text: 'text-paper' },
  { name: 'Ink Soft', hex: '#57534A', bg: 'bg-[#57534A]', text: 'text-paper' },
  { name: 'Ink Faint', hex: '#8A8375', bg: 'bg-[#8A8375]', text: 'text-paper' },
  { name: 'Pine 900 (PRIMARY)', hex: '#0C2E29', bg: 'bg-[#0C2E29]', text: 'text-paper' },
  { name: 'Pine 800', hex: '#123E37', bg: 'bg-[#123E37]', text: 'text-paper' },
  { name: 'Pine 600', hex: '#1B5E52', bg: 'bg-[#1B5E52]', text: 'text-paper' },
  { name: 'Pine 500', hex: '#227A6A', bg: 'bg-[#227A6A]', text: 'text-paper' },
  { name: 'Pine 100', hex: '#DCEBE6', bg: 'bg-[#DCEBE6]', text: 'text-pine-900' },
  { name: 'Seal 600 (ACCENT)', hex: '#B3402A', bg: 'bg-[#B3402A]', text: 'text-white' },
  { name: 'Seal 700', hex: '#9A2E1E', bg: 'bg-[#9A2E1E]', text: 'text-white' },
  { name: 'Seal 100', hex: '#F6E3DC', bg: 'bg-[#F6E3DC]', text: 'text-seal-700' },
  { name: 'Brass 600', hex: '#9A7B2D', bg: 'bg-[#9A7B2D]', text: 'text-white' },
  { name: 'Brass 500 (Gold)', hex: '#C9A227', bg: 'bg-[#C9A227]', text: 'text-ink' },
  { name: 'Success', hex: '#177245', bg: 'bg-[#177245]', text: 'text-white' },
  { name: 'Warning', hex: '#9A6A0A', bg: 'bg-[#9A6A0A]', text: 'text-white' },
  { name: 'Danger', hex: '#B42318', bg: 'bg-[#B42318]', text: 'text-white' },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-paper p-8 lg:p-16 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            SignDesk Design System
          </span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-pine-900 mt-1">
            Paper, Ink & Wax Seal
          </h1>
          <p className="text-ink-soft mt-2 text-base max-w-2xl">
            A tactile, dignified design system designed for legally binding Bangladeshi commerce.
            Warm paper surfaces, deep pine stability, and singular vermilion wax seal accents.
          </p>
        </div>
        <WaxSeal size={64} />
      </div>

      {/* 1. Palette */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-2xl font-bold text-pine-900">
            1. Colour Tokens (§3.1)
          </h2>
          <span className="text-xs font-mono bg-pine-100 text-pine-800 px-2 py-0.5 rounded">
            21 Verified Tokens
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {COLORS.map((c) => (
            <div
              key={c.hex}
              className={`rounded-[8px] p-3 ${c.bg} ${c.text} ${
                c.border ? 'border border-border' : ''
              } shadow-warm-sm flex flex-col justify-between h-24`}
            >
              <span className="text-xs font-semibold leading-tight">{c.name}</span>
              <span className="text-[11px] font-mono tracking-wider opacity-90">{c.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-pine-900">
          2. Typography Tokens (§3.2)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Display / Headlines — Newsreader</CardTitle>
              <CardDescription>Variable optical serif reserved for H1/H2, hero & Certificate of Completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-display text-3xl font-bold text-pine-900">
                Signatures, sealed with authenticity.
              </p>
              <p className="font-display text-2xl italic text-ink-soft">
                Certificate of Completion — ICT Act 2006
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Body & UI — Hanken Grotesk</CardTitle>
              <CardDescription>Clean, accessible sans-serif for reading copy and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 font-body">
              <p className="text-base text-ink">
                Upload a PDF, place signature fields, send via email magic link. Signers sign without an account.
              </p>
              <p className="text-sm text-ink-soft">
                Audit trail recorded with SHA-256 hash chaining and BST timestamps.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monospace — JetBrains Mono</CardTitle>
              <CardDescription>Hashes, IDs, e-Challan numbers, timestamps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-sm bg-surface-raised p-4 rounded-[4px] border border-border">
              <p className="text-pine-900">
                SHA-256: 4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c
              </p>
              <p className="text-ink-soft">
                ENV-ID: env_9945996419550316910 · BST: 2026-11-10 20:25:00 UTC+06:00
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typed Signature Script — Caveat</CardTitle>
              <CardDescription>Cursive preview for type-to-sign mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-4 bg-surface rounded-[4px] border border-border">
              <p className="font-signature text-3xl text-pine-900">
                Tanvir Ahmed Chowdhury
              </p>
              <p className="font-signature text-2xl text-seal-700">
                MD Razikul Islam Joni
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 3. Component System */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-pine-900">
          3. Core Components (§3.4)
        </h2>

        {/* Buttons */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Buttons</h3>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">
              Primary Action (Pine 900)
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="sign">
              <PenTool className="w-4 h-4 mr-1" />
              Sign & Finish (Seal 600 CTA)
            </Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Action</Button>
          </div>
        </div>

        {/* Badges (WCAG icon + text rule) */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
            Status Badges (Icon + Text Mandatory)
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="draft" icon={<FileText className="w-3.5 h-3.5" />}>
              Draft
            </Badge>
            <Badge variant="waiting" icon={<Clock className="w-3.5 h-3.5" />}>
              Waiting for Rahim
            </Badge>
            <Badge variant="inProgress" icon={<Clock className="w-3.5 h-3.5" />}>
              In Progress (1/2)
            </Badge>
            <Badge variant="completed" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
              Completed & Sealed
            </Badge>
            <Badge variant="verified" icon={<ShieldCheck className="w-3.5 h-3.5 text-brass-600" />}>
              Hash Verified (SHA-256)
            </Badge>
            <Badge variant="declined" icon={<XCircle className="w-3.5 h-3.5" />}>
              Declined
            </Badge>
            <Badge variant="expired" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
              Expired
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <div className="pt-8 border-t border-border flex items-center justify-between text-xs text-ink-faint">
        <span>SignDesk MVP — Phase 0 Foundation Verified</span>
        <span className="font-mono">Next.js 15 App Router · React 19 · Tailwind v4</span>
      </div>
    </div>
  );
}
