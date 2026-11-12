'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  User,
  Mail,
  Clock,
  ShieldCheck,
  PenTool,
  Save,
  Check,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function ProfileSettingsPage() {
  return (
    <AuthGuard>
      <ProfileSettingsContent />
    </AuthGuard>
  );
}

function ProfileSettingsContent() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [roleTitle, setRoleTitle] = useState('Administrator / Signatory');
  const [email, setEmail] = useState(user?.email || '');
  const [timezone, setTimezone] = useState('Asia/Dhaka (BST UTC+06:00)');
  const [savedNotice, setSavedNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await apiFetch('/auth/profile');
        if (profile) {
          if (profile.name) setFullName(profile.name);
          if (profile.email) setEmail(profile.email);
        }
      } catch (err) {
        console.warn('Could not fetch profile from API:', err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await apiFetch('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: fullName }),
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile');
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
              Manage your legal signatory identity, team governance, and statutory vault.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-ink-faint">
            <Lock className="w-3.5 h-3.5 text-brass-dark" />
            <span>FIPS 140-2 Level 3 Enclave</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Navigation Rail */}
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="font-serif font-bold text-base text-pine-900">
                  Profile & Legal Identity
                </h2>
                <p className="text-xs text-ink-soft">
                  Authoritative credentials bound to your electronic signature marks.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                IDENTITY VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-ink font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-semibold focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Designated Title / Role</label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ink font-medium mb-1">Primary Corporate Email</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper/60 text-ink-soft text-xs font-mono cursor-not-allowed"
                />
                <div className="text-[10px] text-ink-faint mt-1">
                  Corporate domain identity verified by SignDesk DNS validation.
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-ink font-medium mb-1">Operational Timezone</label>
                <input
                  type="text"
                  disabled
                  value={timezone}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper/60 text-ink-soft text-xs font-mono cursor-not-allowed"
                />
                <div className="text-[10px] text-ink-faint mt-1">
                  Enforces atomic BST (UTC+06:00) NTP timestamping on all execution logs.
                </div>
              </div>
            </div>

            {/* Saved Signature Specimen */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-pine-900">
                    Saved Signature Specimen
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    Archival signature specimen permanently recorded in your workspace.
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg border border-border bg-paper hover:bg-surface text-pine-900 text-xs font-semibold"
                >
                  Update Glyph
                </button>
              </div>

              <div className="p-6 rounded-xl bg-paper border border-border text-center space-y-2">
                <div className="font-caveat text-4xl text-pine-900 py-2">
                  {fullName}
                </div>
                <div className="font-mono text-[10px] text-ink-faint">
                  Audit Hash: 99a8b1e4c7d0d04c4ae79cbff91b29a00184762ec04 • Issued: Oct 2024
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              {savedNotice && (
                <span className="text-xs font-mono text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Profile Changes Saved!</span>
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-bold shadow-warm transition-all flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-brass" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
