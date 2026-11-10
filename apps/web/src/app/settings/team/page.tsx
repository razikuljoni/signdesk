'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Shield,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';

export default function TeamSettingsPage() {
  return (
    <AuthGuard>
      <TeamSettingsContent />
    </AuthGuard>
  );
}

function TeamSettingsContent() {
  const [members, setMembers] = useState([
    {
      id: 'mem-1',
      name: 'Tanvir Ahmed',
      email: 'tanvir@apex-commerce.bd',
      role: 'ADMIN',
      joinedAt: '10 Nov 2026',
      isCurrentUser: true,
    },
    {
      id: 'mem-2',
      name: 'Farhan Kabir',
      email: 'farhan@apex-commerce.bd',
      role: 'SENDER',
      joinedAt: '10 Nov 2026',
      isCurrentUser: false,
    },
    {
      id: 'mem-3',
      name: 'Nusrat Jahan',
      email: 'nusrat@apex-commerce.bd',
      role: 'VIEWER',
      joinedAt: '10 Nov 2026',
      isCurrentUser: false,
    },
  ]);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'SENDER' | 'VIEWER'>('SENDER');
  const [inviteName, setInviteName] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      id: 'mem-' + Math.random().toString(36).substring(2, 7),
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      joinedAt: 'Just now (Invited)',
      isCurrentUser: false,
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setInviteName('');
    setInviteModalOpen(false);
  };

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: 'ADMIN' | 'SENDER' | 'VIEWER') => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, role: newRole } : m)),
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
            Team & Access Control (RBAC)
          </h1>
          <p className="text-sm text-ink-soft mt-1">
            Manage workspace members, assign role permissions, and control sending rights.
          </p>
        </div>

        <Button variant="primary" size="default" onClick={() => setInviteModalOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Team Member
        </Button>
      </div>

      {/* Role Explanations */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-4 bg-surface rounded-lg border border-border space-y-1">
          <div className="font-bold text-xs text-pine-900 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-pine-700" />
            Admin
          </div>
          <p className="text-[11px] text-ink-soft">
            Full workspace control: invite/remove members, update branding, create API keys, send, and void envelopes.
          </p>
        </div>

        <div className="p-4 bg-surface rounded-lg border border-border space-y-1">
          <div className="font-bold text-xs text-pine-900 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-pine-700" />
            Sender
          </div>
          <p className="text-[11px] text-ink-soft">
            Create, prepare, send, remind, and void own envelopes. Cannot modify team membership or workspace billing.
          </p>
        </div>

        <div className="p-4 bg-surface rounded-lg border border-border space-y-1">
          <div className="font-bold text-xs text-pine-900 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-pine-700" />
            Viewer
          </div>
          <p className="text-[11px] text-ink-soft">
            Strictly read-only access. Can inspect executed documents, audit trails, and download PDFs. Cannot send or void.
          </p>
        </div>
      </div>

      {/* Members Table */}
      <Card className="bg-surface overflow-hidden">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-base font-bold">Workspace Members ({members.length})</CardTitle>
          <CardDescription className="text-xs">
            Members authenticated with their corporate Google or email credentials.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-surface-raised border-b border-border text-ink-faint font-semibold">
                <tr>
                  <th className="px-6 py-3">Member Name & Email</th>
                  <th className="px-6 py-3">Workspace Role</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-paper/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-pine-900">{m.name}</div>
                      <div className="font-mono text-[11px] text-ink-soft">{m.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {m.isCurrentUser ? (
                        <span className="font-mono font-bold bg-pine-100 text-pine-900 px-2.5 py-0.5 rounded text-[11px] border border-pine-500/20">
                          {m.role} (You)
                        </span>
                      ) : (
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.id, e.target.value as any)}
                          className="bg-paper border border-border rounded px-2 py-1 text-xs font-semibold text-pine-900"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="SENDER">SENDER</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-ink-faint">{m.joinedAt}</td>
                    <td className="px-6 py-4 text-right">
                      {!m.isCurrentUser && (
                        <button
                          onClick={() => handleRemove(m.id)}
                          className="text-ink-faint hover:text-danger p-1 rounded transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-pine-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-surface p-6 space-y-4">
            <div className="font-display font-bold text-xl text-pine-900 border-b border-border pb-3">
              Invite New Team Member
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="invName">Full Legal Name</Label>
                <Input
                  id="invName"
                  placeholder="e.g. Farhan Kabir"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="invEmail">Email Address (Required)</Label>
                <Input
                  id="invEmail"
                  type="email"
                  required
                  placeholder="name@company.bd"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="invRole">Assigned Role</Label>
                <select
                  id="invRole"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full p-2 border border-border rounded bg-surface text-xs text-ink"
                >
                  <option value="SENDER">Sender — Can send and manage envelopes</option>
                  <option value="VIEWER">Viewer — Read-only access</option>
                  <option value="ADMIN">Admin — Full workspace administrative access</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
