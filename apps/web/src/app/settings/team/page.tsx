'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Scale,
  Send,
  RefreshCw,
  Lock,
  Check,
} from 'lucide-react';

export default function TeamSettingsPage() {
  return (
    <AuthGuard>
      <TeamSettingsContent />
    </AuthGuard>
  );
}

function TeamSettingsContent() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Sender' | 'Viewer'>('Sender');
  const [mandate2fa, setMandate2fa] = useState(true);
  const [inviteNotice, setInviteNotice] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteNotice(true);
    setInviteEmail('');
    setInviteName('');
    setTimeout(() => setInviteNotice(false), 3000);
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
              Manage authorized corporate signatories, roles, and institutional seat quotas.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            RBAC PROTOCOL ACTIVE
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Seat Usage Meter Card */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-pine-900">
                  Seat Usage: 3 of 5 seats occupied (60%)
                </span>
                <span className="font-mono text-ink-faint text-[11px]">
                  Corporate Starter Plan
                </span>
              </div>
              <div className="w-full bg-paper border border-border rounded-full h-2 overflow-hidden">
                <div className="bg-pine-900 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <a
              href="/pricing"
              className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold whitespace-nowrap shadow-subtle transition-all"
            >
              Upgrade to Enterprise Pro for Unlimited Seats
            </a>
          </div>

          {/* Invite New Signatory Card */}
          <form onSubmit={handleSendInvite} className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-pine-900" />
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  Invite Authorized Signatory
                </h3>
              </div>
              <span className="text-[11px] font-mono text-ink-faint">
                Enterprise Delegated Authority
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-ink font-medium mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mehedi Hasan"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs focus:outline-none focus:border-pine-900"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Assigned Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink text-xs font-medium focus:outline-none focus:border-pine-900"
                >
                  <option value="Admin">Admin (Full fiscal & vault control)</option>
                  <option value="Sender">Sender (Create, prepare & dispatch)</option>
                  <option value="Viewer">Viewer (Audit & cert read-only)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mandate2fa}
                    onChange={(e) => setMandate2fa(e.target.checked)}
                    className="rounded text-pine-900 focus:ring-pine-900/30"
                  />
                  <span className="text-xs font-medium text-pine-900">
                    Mandate Bangladesh Porichoy National ID 2FA Verification
                  </span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-brass" />
                  <span>Send Institutional Invite</span>
                </button>
              </div>
            </div>

            {inviteNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Invitation token successfully dispatched via TLS SMTP and WhatsApp Gateway!</span>
              </div>
            )}
          </form>

          {/* Active Authorized Signatories Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-pine-900">
                Active Authorized Signatories
              </h3>
              <span className="font-mono text-xs text-ink-faint">3 Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper/70 text-ink-soft border-b border-border font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Signatory & Identity</th>
                    <th className="py-2.5 px-4">Assigned Role</th>
                    <th className="py-2.5 px-4">Authentication Method</th>
                    <th className="py-2.5 px-4">Last Active (BST)</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Row 1 */}
                  <tr className="hover:bg-paper/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-pine-900">Ayesha Rahman</div>
                      <div className="text-[11px] font-mono text-ink-faint">
                        ayesha.rahman@rahimtrade.com.bd
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pine-100 text-pine-900 border border-pine-200">
                        Owner / Admin
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-soft text-[11px]">
                      FIPS HSM Token + WhatsApp OTP
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">
                      Today, 11:28 BST
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-pine-900 font-semibold hover:underline">
                        Manage
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-paper/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-pine-900">Tanvir Ahmed</div>
                      <div className="text-[11px] font-mono text-ink-faint">
                        t.ahmed@meghnadist.com
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-paper text-ink-soft border border-border">
                        Sender (Commercial Officer)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-soft text-[11px]">
                      SMS 2FA + NID Verified
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">
                      Yesterday, 17:15 BST
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-pine-900 font-semibold hover:underline">
                        Edit Role
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-paper/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-pine-900">Kamal Uddin, Advocate</div>
                      <div className="text-[11px] font-mono text-ink-faint">
                        kamal.legal@dhkchambers.com
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-paper text-ink-soft border border-border">
                        Viewer (Legal Counsel)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-ink-soft text-[11px]">
                      Supreme Court Bar Reg #DAC-4491
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">
                      24 Oct, 09:30 BST
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-xs text-pine-900 font-semibold hover:underline">
                        Permissions
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Invitations Card */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle space-y-3">
            <div className="font-serif font-bold text-sm text-pine-900 pb-2 border-b border-border">
              Pending Delegated Invitations (1)
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-paper border border-border text-xs">
              <div>
                <div className="font-medium text-pine-900">mehedi@rahimtraders.com</div>
                <div className="text-[11px] text-ink-faint font-mono">
                  Invited as Sender on 24 Oct 2024 • Awaiting NID verification
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 rounded border border-border bg-surface text-ink text-xs font-semibold hover:bg-paper">
                  Resend Invite
                </button>
                <button className="px-2.5 py-1 rounded text-vermilion text-xs hover:underline">
                  Revoke Token
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
