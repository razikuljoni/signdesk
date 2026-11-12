'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ShieldCheck,
  Laptop,
  Smartphone,
  Download,
  Trash2,
  Lock,
  Scale,
  CheckCircle2,
  Clock,
  HardDrive,
  Check,
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
      device: 'MacBook Pro 16" (Chrome 129 / macOS Sequoia)',
      ip: '103.25.12.8 (Tejgaon Industrial Area, Dhaka)',
      lastActive: 'Active now (Current session)',
      isCurrent: true,
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro (Mobile Safari 17.5 / iOS 17.5.1)',
      ip: '103.114.98.24 (Agrabad Commercial Area, Chittagong)',
      lastActive: '24 Oct 2024, 11:28 BST',
      isCurrent: false,
    },
  ]);

  const [revokedNotice, setRevokedNotice] = useState(false);

  const handleRevokeOthers = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
    setRevokedNotice(true);
    setTimeout(() => setRevokedNotice(false), 3000);
  };

  const handleExportVault = () => {
    const vaultData = {
      workspace: 'Rahim Textiles & Trade Ltd.',
      exportDateBST: '24 Oct 2024, 18:00 BST',
      statutoryStandard: 'Section 7 & 14, Bangladesh ICT Act 2006',
      totalEnvelopesVaulted: 42,
      safeHarborExpiry: 'October 2034',
      rootMerkleDigest: '4e7b819f03c289ad0e6b4129e924a81a02',
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(vaultData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'SignDesk_Sovereign_Vault_Ledger.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
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
              Device sessions, SHA-256 cryptographic audit trail, and 10-year statutory safe harbor lock.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            SHA-256 AUDIT LOCK
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* 10-Year Safe Harbor Lock Card */}
          <div className="bg-surface rounded-xl border-2 border-brass/50 p-6 shadow-warm space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-brass/15 text-brass-dark shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base text-pine-900">
                      10-Year Statutory Safe Harbor Lock
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ACTIVE & SEALED
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    All sealed deeds and associated Merkle block ledgers are mirrored to sovereign cold storage in Dhaka, compliant with Bangladesh Sub-Registry and NBR corporate filing guidelines.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-paper border border-border">
                <div className="text-[10px] uppercase text-ink-faint">Retention Period</div>
                <div className="text-pine-900 font-bold mt-0.5">Until October 2034</div>
              </div>
              <div className="p-3 rounded-lg bg-paper border border-border">
                <div className="text-[10px] uppercase text-ink-faint">Storage Node</div>
                <div className="text-pine-900 font-bold mt-0.5">Tejgaon Sovereign Cold Vault</div>
              </div>
              <div className="p-3 rounded-lg bg-paper border border-border">
                <div className="text-[10px] uppercase text-ink-faint">Immutability Engine</div>
                <div className="text-emerald-800 font-bold mt-0.5">WORM (Write Once, Read Many)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <button
                onClick={handleExportVault}
                className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5 text-brass" />
                <span>Export Complete Cryptographic JSON Ledger</span>
              </button>
            </div>
          </div>

          {/* Active Sessions Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-subtle">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  Active Cryptographic Device Sessions
                </h3>
                <p className="text-[11px] text-ink-soft">
                  Terminals currently holding authenticated tokens for this workspace.
                </p>
              </div>

              <button
                onClick={handleRevokeOthers}
                className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-vermilion text-xs font-semibold shadow-subtle transition-all"
              >
                Revoke Other Sessions
              </button>
            </div>

            {revokedNotice && (
              <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>All secondary sessions have been securely terminated.</span>
              </div>
            )}

            <div className="divide-y divide-border">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-paper border border-border text-pine-900">
                      {sess.device.includes('iPhone') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-pine-900 flex items-center gap-2">
                        <span>{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-ink-faint mt-0.5">
                        IP: {sess.ip}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px] text-ink-soft">
                    {sess.lastActive}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
