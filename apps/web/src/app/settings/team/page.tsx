'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { apiFetch } from '@/lib/api';
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
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Sender' | 'Viewer'>('Sender');
  const [mandate2fa, setMandate2fa] = useState(true);
  const [inviteNotice, setInviteNotice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  async function loadMembers() {
    try {
      const data = await apiFetch('/workspaces/current/members');
      if (Array.isArray(data)) {
        setMembers(data);
      }
    } catch (err) {
      console.warn('Could not fetch members:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    setError(null);

    try {
      await apiFetch('/workspaces/current/members', {
        method: 'POST',
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || undefined,
          role: inviteRole.toUpperCase(),
        }),
      });

      setInviteNotice(true);
      setInviteEmail('');
      setInviteName('');
      setTimeout(() => setInviteNotice(false), 3000);
      loadMembers();
    } catch (err: any) {
      console.error('Failed to invite member:', err);
      setError(err.message || 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the workspace?')) return;
    try {
      await apiFetch(`/workspaces/current/members/${memberId}`, { method: 'DELETE' });
      loadMembers();
    } catch (err: any) {
      alert(err.message || 'Failed to remove member');
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

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-danger-bg text-danger border border-danger/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Seat Usage Meter Card */}
          <div className="bg-surface rounded-xl border border-border p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-pine-900">
                  Seat Usage: {members.length} seats occupied
                </span>
                <span className="font-mono text-ink-faint text-[11px]">
                  Corporate Starter Plan
                </span>
              </div>
              <div className="w-full bg-paper border border-border rounded-full h-2 overflow-hidden">
                <div className="bg-pine-900 h-full rounded-full" style={{ width: `${Math.min(100, (members.length / 5) * 100)}%` }} />
              </div>
            </div>

            <a
              href="/pricing"
              className="px-3.5 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold whitespace-nowrap shadow-subtle transition-all"
            >
              Manage Subscription Plan
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
                    Require Email 2FA Verification for Signatures
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isInviting}
                  className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-brass" />
                  <span>{isInviting ? 'Sending Invite...' : 'Send Institutional Invite'}</span>
                </button>
              </div>
            </div>

            {inviteNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Invitation token successfully dispatched via TLS SMTP!</span>
              </div>
            )}
          </form>

          {/* Active Authorized Signatories Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-pine-900">
                Active Authorized Signatories
              </h3>
              <span className="font-mono text-xs text-ink-faint">{members.length} Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-paper/70 text-ink-soft border-b border-border font-medium">
                  <tr>
                    <th className="py-2.5 px-4">Signatory & Identity</th>
                    <th className="py-2.5 px-4">Assigned Role</th>
                    <th className="py-2.5 px-4">Member Since</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs font-mono text-ink-soft">
                        Loading workspace signatories...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs font-mono text-ink-soft">
                        No team members registered yet.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="hover:bg-paper/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-pine-900">{m.user?.name || 'Workspace Member'}</div>
                          <div className="text-[11px] font-mono text-ink-faint">
                            {m.user?.email || ''}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            m.role === 'OWNER' || m.role === 'ADMIN'
                              ? 'bg-pine-100 text-pine-900 border-pine-200'
                              : 'bg-paper text-ink-soft border-border'
                          }`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-ink-soft">
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-GB') : 'Active'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {m.role !== 'OWNER' && (
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className="text-xs text-danger font-semibold hover:underline"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
