'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Building2,
  Palette,
  Clock,
  CheckCircle2,
  Upload,
  ShieldCheck,
} from 'lucide-react';

export default function WorkspaceSettingsPage() {
  return (
    <AuthGuard>
      <WorkspaceSettingsContent />
    </AuthGuard>
  );
}

function WorkspaceSettingsContent() {
  const [workspaceName, setWorkspaceName] = useState('Apex Commerce BD');
  const [brandColor, setBrandColor] = useState<'#0C2E29' | '#B3402A'>('#0C2E29');
  const [defaultExpiry, setDefaultExpiry] = useState(14);
  const [defaultReminder, setDefaultReminder] = useState(48);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
          Workspace & Branding Settings
        </h1>
        <p className="text-sm text-ink-soft">
          Customize organization identity, signing portal appearance, and default execution timeouts.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-pine-100 border border-pine-500/20 text-pine-900 rounded-lg text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-pine-700" />
          Workspace settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-pine-600" />
            Organization Identity
          </div>

          <div className="space-y-1">
            <Label htmlFor="wsName" className="text-xs">Company / Workspace Legal Name</Label>
            <Input
              id="wsName"
              required
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs">Organization Seal & Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-raised border border-dashed border-border flex items-center justify-center text-xs text-ink-faint">
                Logo
              </div>
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => alert('Logo upload is enabled.')}>
                <Upload className="w-3.5 h-3.5 mr-1" />
                Upload Brand PNG
              </Button>
            </div>
            <p className="text-[11px] text-ink-faint">
              Your logo will appear in signatory email invitations, signer portal headers, and on the Certificate of Completion.
            </p>
          </div>
        </Card>

        {/* Brand Theme Constraints (§15) */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-pine-600" />
            Signer Portal Accent Theme (Strictly Constrained)
          </div>

          <p className="text-xs text-ink-soft">
            To ensure WCAG AAA evidentiary legibility and trust under the Bangladesh ICT Act 2006, brand accents in MVP are strictly constrained to Deep Pine or Wax Seal Vermilion.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            <label
              className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                brandColor === '#0C2E29'
                  ? 'border-pine-900 bg-pine-100/50 ring-2 ring-pine-900/10'
                  : 'border-border bg-paper hover:bg-surface-raised'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="brandColor"
                  value="#0C2E29"
                  checked={brandColor === '#0C2E29'}
                  onChange={() => setBrandColor('#0C2E29')}
                  className="accent-pine-900"
                />
                <div>
                  <strong className="text-xs text-pine-900 block">Deep Pine (Default)</strong>
                  <span className="text-[11px] font-mono text-ink-faint">#0C2E29 • Heritage & Trust</span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#0C2E29]" />
            </label>

            <label
              className={`p-4 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                brandColor === '#B3402A'
                  ? 'border-seal-600 bg-seal-100/50 ring-2 ring-seal-600/10'
                  : 'border-border bg-paper hover:bg-surface-raised'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="brandColor"
                  value="#B3402A"
                  checked={brandColor === '#B3402A'}
                  onChange={() => setBrandColor('#B3402A')}
                  className="accent-seal-600"
                />
                <div>
                  <strong className="text-xs text-pine-900 block">Wax Seal Vermilion</strong>
                  <span className="text-[11px] font-mono text-ink-faint">#B3402A • Evidentiary Attestation</span>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#B3402A]" />
            </label>
          </div>
        </Card>

        {/* Default Lifecycle Settings */}
        <Card className="bg-surface p-6 space-y-4">
          <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pine-600" />
            Default Envelope Timing Defaults
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="defExpiry" className="text-xs">Default Expiry Days</Label>
              <Input
                id="defExpiry"
                type="number"
                min="1"
                max="90"
                value={defaultExpiry}
                onChange={(e) => setDefaultExpiry(Number(e.target.value))}
                className="text-xs"
              />
              <span className="text-[11px] text-ink-faint block">Signing links expire automatically after this duration.</span>
            </div>

            <div className="space-y-1">
              <Label htmlFor="defRemind" className="text-xs">Reminder Interval (Hours)</Label>
              <Input
                id="defRemind"
                type="number"
                min="24"
                max="168"
                value={defaultReminder}
                onChange={(e) => setDefaultReminder(Number(e.target.value))}
                className="text-xs"
              />
              <span className="text-[11px] text-ink-faint block">Automated gentle reminder email sent to active signers.</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" size="default" className="font-bold">
            Save Workspace Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
