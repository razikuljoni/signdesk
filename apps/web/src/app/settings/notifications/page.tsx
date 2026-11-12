'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { useAuth } from '@/lib/auth-context';
import {
  Bell,
  Mail,
  CheckCircle2,
  FileCheck,
  Ban,
  Clock,
  Calendar,
  Save,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface NotificationPreferences {
  onSigned: boolean;
  onCompleted: boolean;
  onDeclined: boolean;
  onExpired: boolean;
  onReminder: boolean;
  digestFrequency: 'DAILY' | 'WEEKLY' | 'OFF';
  secondaryEmail: string;
}

const DEFAULT_PREFS: NotificationPreferences = {
  onSigned: true,
  onCompleted: true,
  onDeclined: true,
  onExpired: true,
  onReminder: true,
  digestFrequency: 'DAILY',
  secondaryEmail: '',
};

export default function NotificationsSettingsPage() {
  return (
    <AuthGuard>
      <NotificationsSettingsContent />
    </AuthGuard>
  );
}

function NotificationsSettingsContent() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('signdesk_notification_preferences');
      if (stored) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
      }
    } catch {
      // Fallback to default preferences
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('signdesk_notification_preferences', JSON.stringify(prefs));
    } catch {
      // Ignore write errors
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-pine-900">
              Notification Preferences
            </h1>
            <p className="text-xs text-ink-soft mt-0.5">
              Email alerts per Plan §6.6/§8: signed, completed, declined, expired, and reminder digests.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-pine-50 text-pine-900 border border-pine-200">
            SMTP-TLS SECURED
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Primary Email Target Card */}
            <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pine-50 text-pine-900 border border-pine-200">
                  <Mail className="w-5 h-5 text-pine-700" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-pine-900">
                    Dispatch Destination
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Automated transactional emails and digests will be routed to your verified identity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-pine-900 mb-1">
                    Primary SignDesk Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || 'user@example.com'}
                    className="w-full p-2.5 rounded-lg border border-border bg-paper/60 text-ink-soft font-mono text-xs cursor-not-allowed"
                  />
                  <span className="text-[10px] text-ink-faint mt-1 block">
                    Bound to your active authenticated session.
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-pine-900 mb-1">
                    Secondary / Compliance CC (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="legal-audit@company.bd"
                    value={prefs.secondaryEmail}
                    onChange={(e) => setPrefs({ ...prefs, secondaryEmail: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                  />
                  <span className="text-[10px] text-ink-faint mt-1 block">
                    Copy commercial records to your corporate counsel.
                  </span>
                </div>
              </div>
            </div>

            {/* Real-Time Envelope Milestone Alerts */}
            <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="p-2.5 rounded-xl bg-brass/15 text-brass-dark">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-pine-900">
                    Lifecycle Milestone Alerts
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Immediate notification triggers when participants interact with in-flight instruments.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {/* 1. Document Signed */}
                <label className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/80 bg-paper/40 hover:bg-paper cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-pine-900">
                        Signatory Affixed Mark (Signed)
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Triggered whenever any designated party executes their assigned signature or seal fields.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.onSigned}
                    onChange={(e) => setPrefs({ ...prefs, onSigned: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-pine-900 mt-1 cursor-pointer"
                  />
                </label>

                {/* 2. Document Completed */}
                <label className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/80 bg-paper/40 hover:bg-paper cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-pine-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-pine-900">
                        Envelope Execution Completed (Bilateral Seal)
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Triggered when all signatories finish execution. Includes download link to finalized PDF &amp; Certificate of Completion.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.onCompleted}
                    onChange={(e) => setPrefs({ ...prefs, onCompleted: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-pine-900 mt-1 cursor-pointer"
                  />
                </label>

                {/* 3. Document Declined */}
                <label className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/80 bg-paper/40 hover:bg-paper cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <Ban className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-pine-900">
                        Envelope Declined by Signer
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Triggered immediately if a counterparty declines execution, with their specific refusal reasoning attached.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.onDeclined}
                    onChange={(e) => setPrefs({ ...prefs, onDeclined: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-pine-900 mt-1 cursor-pointer"
                  />
                </label>

                {/* 4. Document Expired */}
                <label className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/80 bg-paper/40 hover:bg-paper cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-pine-900">
                        Validity Expiration Notice (Lapsed)
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Triggered when an envelope exceeds its configured validity window (e.g. 14 days) without completion.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.onExpired}
                    onChange={(e) => setPrefs({ ...prefs, onExpired: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-pine-900 mt-1 cursor-pointer"
                  />
                </label>

                {/* 5. Reminder Notifications */}
                <label className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border/80 bg-paper/40 hover:bg-paper cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-pine-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-pine-900">
                        Automated Signer Reminders (48-Hour Cadence)
                      </div>
                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Receive a confirmation notice whenever SignDesk dispatches an automated reminder ping to awaiting counterparties.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.onReminder}
                    onChange={(e) => setPrefs({ ...prefs, onReminder: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-pine-900 mt-1 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Reminder & Status Digest Settings */}
            <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="p-2.5 rounded-xl bg-pine-50 text-pine-900">
                  <Sparkles className="w-5 h-5 text-pine-700" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-pine-900">
                    Summary Digest Cadence
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Periodic executive summary of pending actions, signed deeds, and outstanding turnarounds.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                {[
                  {
                    id: 'DAILY',
                    label: 'Daily Digest',
                    desc: 'Delivered at 09:00 AM BST every morning with outstanding items.',
                  },
                  {
                    id: 'WEEKLY',
                    label: 'Weekly Monday Digest',
                    desc: 'Executive summary sent at 08:30 AM BST every Monday.',
                  },
                  {
                    id: 'OFF',
                    label: 'Milestones Only (No Digest)',
                    desc: 'Only transactional emails per event. No scheduled summaries.',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setPrefs({ ...prefs, digestFrequency: item.id as 'DAILY' | 'WEEKLY' | 'OFF' })
                    }
                    className={`p-3.5 rounded-xl border text-left space-y-1 transition-all ${
                      prefs.digestFrequency === item.id
                        ? 'border-pine-900 bg-pine-50/70 shadow-sm'
                        : 'border-border bg-paper/50 hover:bg-paper'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-pine-900 text-xs">{item.label}</span>
                      {prefs.digestFrequency === item.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-pine-900" />
                      )}
                    </div>
                    <p className="text-[11px] text-ink-soft leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs">
                {saved && (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1.5 animate-fadeIn">
                    <ShieldCheck className="w-4 h-4" />
                    Preferences saved successfully.
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Notification Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
