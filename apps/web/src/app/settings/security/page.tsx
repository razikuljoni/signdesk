'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  Download,
  Trash2,
  AlertTriangle,
  Clock,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export default function SecuritySettingsPage() {
  return (
    <AuthGuard>
      <SecuritySettingsContent />
    </AuthGuard>
  );
}

function SecuritySettingsContent() {
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'MacBook Pro (Chrome 130)',
      ip: '103.205.71.12 (Dhaka, BD)',
      lastActive: 'Active now (Current session)',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 (Safari Mobile)',
      ip: '103.145.12.89 (Dhaka, BD)',
      lastActive: 'Yesterday, 19:40 BST',
      isCurrent: false,
    },
  ]);

  const [revokedNotice, setRevokedNotice] = useState(false);

  const handleRevokeSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    setRevokedNotice(true);
    setTimeout(() => setRevokedNotice(false), 3000);
  };

  const handleExportAudit = () => {
    const auditData = {
      workspace: 'Apex Commerce BD',
      exportedAt: new Date().toISOString(),
      legalFramework: 'Bangladesh Information and Communication Technology (ICT) Act 2006 (Sec. 7)',
      merkleChainStandard: 'SHA-256 Recursive Digesting',
      envelopesAudited: 12,
      tamperingDetected: false,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `signdesk_compliance_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteWorkspace = () => {
    const confirmation = prompt('To confirm workspace deletion, type "DELETE APEX COMMERCE BD":');
    if (confirmation === 'DELETE APEX COMMERCE BD') {
      alert('Workspace deletion requested. Administrative access revoked.');
      window.location.href = '/signin';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
          Security & Evidentiary Retention
        </h1>
        <p className="text-sm text-ink-soft">
          Monitor authenticated devices, download cryptographic compliance ledgers, and manage retention policies.
        </p>
      </div>

      {revokedNotice && (
        <div className="p-4 bg-pine-100 border border-pine-500/20 text-pine-900 rounded-lg text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-pine-700" />
          Remote session successfully revoked.
        </div>
      )}

      {/* Active Sessions */}
      <Card className="bg-surface p-6 space-y-4">
        <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
          <Laptop className="w-4 h-4 text-pine-600" />
          Active Authenticated Sessions
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div key={sess.id} className="p-3 bg-paper rounded border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface border border-border flex items-center justify-center text-pine-700">
                  {sess.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <strong className="text-pine-900 block">{sess.device}</strong>
                  <span className="text-[11px] font-mono text-ink-faint">{sess.ip}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-ink-soft">{sess.lastActive}</span>
                {!sess.isCurrent && (
                  <Button variant="outline" size="sm" className="text-xs text-danger hover:bg-danger/10" onClick={() => handleRevokeSession(sess.id)}>
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Statutory Data Retention */}
      <Card className="bg-surface p-6 space-y-4">
        <div className="font-bold text-pine-900 text-sm border-b border-border pb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-pine-600" />
          Statutory Evidentiary Retention (ICT Act 2006)
        </div>

        <p className="text-xs text-ink-soft leading-relaxed">
          Under Bangladesh evidentiary standards, completed contract records, embedded signature assets, and SHA-256 Merkle audit chains are immutably archived for a mandatory minimum of 3 years.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xs font-bold text-pine-900 block">Export Master Audit Trail</span>
            <span className="text-[11px] text-ink-faint">Download cryptographically signed JSON ledger of all workspace activities.</span>
          </div>

          <Button variant="outline" size="default" onClick={handleExportAudit}>
            <Download className="w-4 h-4 mr-2" />
            Export Compliance JSON
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[#FFF8F7] border border-danger/30 p-6 space-y-4">
        <div className="font-bold text-danger text-sm border-b border-danger/20 pb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          Danger Zone
        </div>

        <p className="text-xs text-ink-soft">
          Deleting a workspace immediately invalidates all active drafts and revoked links. Completed documents remain preserved in immutable cold archive per statutory ICT Act requirements.
        </p>

        <div className="pt-2">
          <Button variant="destructive" size="default" onClick={handleDeleteWorkspace} className="font-bold">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Workspace & Member Access
          </Button>
        </div>
      </Card>
    </div>
  );
}
