'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Building2,
  Save,
  Check,
  Upload,
  Download,
  ShieldCheck,
  Scale,
  Receipt,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function WorkspaceSettingsPage() {
  return (
    <AuthGuard>
      <WorkspaceSettingsContent />
    </AuthGuard>
  );
}

function WorkspaceSettingsContent() {
  const [workspace, setWorkspace] = useState<any>(null);
  const [entityName, setEntityName] = useState('');
  const [rjscNumber, setRjscNumber] = useState('C-84920/2014 (RJSC Dhaka Sadar)');
  const [etin, setEtin] = useState('8492048192-BD');
  const [binVat, setBinVat] = useState('002918401-0101');
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await apiFetch('/workspaces/current');
        setWorkspace(data);
        if (data.name) setEntityName(data.name);
      } catch (err) {
        console.warn('Could not load current workspace:', err);
      }
    }
    loadWorkspace();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityName.trim()) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiFetch('/workspaces/current', {
        method: 'PATCH',
        body: JSON.stringify({ name: entityName.trim() }),
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err: any) {
      console.error('Failed to update workspace:', err);
      setError(err.message || 'Failed to update workspace');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-pine-900">
              Workspace Settings
            </h1>
            <p className="text-xs text-ink-soft mt-0.5">
              Corporate entity details, tax identification, and corporate embossment.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            RJSC DHAKA VERIFIED
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-serif font-bold text-base text-pine-900">
                  Workspace & Registered Entity
                </h2>
                <p className="text-xs text-ink-soft">
                  Corporate profile legally bound to all dispatched contracts.
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-ink-faint">
                <Scale className="w-3.5 h-3.5 text-brass-dark" />
                <span>Companies Act 1994</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-ink font-medium mb-1">
                  Registered Legal Entity Name
                </label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-semibold focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">
                  RJSC Incorporation Reference
                </label>
                <input
                  type="text"
                  required
                  value={rjscNumber}
                  onChange={(e) => setRjscNumber(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-mono focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">
                  National Board of Revenue (e-TIN)
                </label>
                <input
                  type="text"
                  required
                  value={etin}
                  onChange={(e) => setEtin(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-mono focus:outline-none focus:border-pine-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ink font-medium mb-1">
                  VAT Registration / BIN
                </label>
                <input
                  type="text"
                  required
                  value={binVat}
                  onChange={(e) => setBinVat(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-mono focus:outline-none focus:border-pine-900"
                />
              </div>
            </div>

            {/* Corporate Seal Crest Asset */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-pine-900">
                    Official Corporate Seal Asset
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Circular seal crest automatically overlaid onto executed Annexure and stamp blocks.
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-ink-soft" />
                  <span>Export SVG</span>
                </button>
              </div>

              <div className="p-6 rounded-xl bg-paper border border-border flex items-center justify-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-pine-900 bg-surface flex flex-col items-center justify-center text-center p-2 shadow-sm">
                  <div className="text-[7px] font-mono font-bold text-pine-900 uppercase">
                    Rahim Textiles & Trade
                  </div>
                  <WaxSeal size={28} className="my-0.5" />
                  <div className="text-[6px] font-mono text-ink-faint">
                    REG: DHAKA • 2014
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-pine-900">
                    Vector Seal Crest Active
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Gold and deep pine heraldic ring conforming to DCCI commercial standards.
                  </div>
                  <label className="inline-block mt-1 text-[11px] font-semibold text-pine-800 hover:underline cursor-pointer">
                    Replace Seal Vector (SVG/PNG)
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              {savedNotice && (
                <span className="text-xs font-mono text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Workspace Details Saved!</span>
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-bold shadow-warm transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-brass" />
                <span>Save Workspace</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
