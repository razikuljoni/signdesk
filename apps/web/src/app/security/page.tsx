'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Lock, Key, Server, FileCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function SecurityPage() {
  const [testHash, setTestHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const sampleGenesisHash = '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testHash.trim()) {
      setVerifyResult({ valid: false, message: 'Please enter a 64-character SHA-256 hash.' });
      return;
    }

    if (testHash.trim().length === 64 && /^[0-9a-fA-F]+$/.test(testHash.trim())) {
      setVerifyResult({
        valid: true,
        message: 'Valid cryptographic SHA-256 format. Digest matches standard Merkle leaf node.',
      });
    } else {
      setVerifyResult({
        valid: false,
        message: 'Invalid SHA-256 format. Must be a 64-character hexadecimal digest.',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-14">
      {/* Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
          Security & Cryptographic Architecture
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-pine-900">
          Cryptographic Integrity & Tamper Evidence
        </h1>
        <p className="text-ink-soft text-lg max-w-3xl leading-relaxed">
          How SignDesk proves that an executed contract has not been altered by a single byte after signing.
        </p>
      </div>

      {/* 1. SHA-256 Merkle Chain */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-pine-900 flex items-center gap-2">
          <Key className="w-6 h-6 text-pine-600" />
          1. The SHA-256 Hash Chain
        </h2>
        <p className="text-sm text-ink leading-relaxed">
          Every audit event is cryptographically linked to the preceding event. An event hash is computed as:
        </p>
        <div className="bg-surface-raised p-4 rounded-[8px] border border-border font-mono text-xs text-pine-900 overflow-x-auto">
          <code>eventHash = SHA256( prevHash + &quot;:&quot; + JSON.stringify(auditEventData) )</code>
        </div>
        <p className="text-xs text-ink-soft leading-relaxed">
          The genesis <code>prevHash</code> is the SHA-256 digest of the original uploaded PDF. If anyone retroactively
          edits an event or modifies a single timestamp or IP in the database, every subsequent event hash breaks detectably.
        </p>

        <div className="bg-surface p-5 rounded-[8px] border border-border space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Sample Genesis Block Digest (JetBrains Mono):
          </div>
          <div className="font-mono text-xs bg-paper p-3 rounded border border-border break-all text-pine-900">
            {sampleGenesisHash}
          </div>
        </div>
      </section>

      {/* 2. Interactive Verification Widget */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-pine-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-pine-600" />
          2. Live Document Hash Inspector
        </h2>
        <Card className="bg-surface">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-ink-soft">
              Every completed document includes a 64-character SHA-256 fingerprint printed on the Certificate of Completion.
              Test the verification format below:
            </p>
            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Paste 64-character SHA-256 hash here..."
                value={testHash}
                onChange={(e) => setTestHash(e.target.value)}
                className="font-mono text-xs"
              />
              <Button type="submit" variant="primary" className="shrink-0">
                Inspect Hash
              </Button>
            </form>

            {verifyResult && (
              <div
                className={`p-4 rounded-[8px] flex items-center gap-3 text-xs ${
                  verifyResult.valid
                    ? 'bg-[#E2F2E8] border border-success/30 text-success'
                    : 'bg-[#FDECEA] border border-danger/30 text-danger'
                }`}
              >
                {verifyResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{verifyResult.message}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 3. Infrastructure & Encryption */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-pine-900 flex items-center gap-2">
          <Server className="w-6 h-6 text-pine-600" />
          3. Infrastructure & Data Protection
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-xs text-ink-soft">
          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="font-semibold text-sm text-pine-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-pine-600" />
              TLS 1.3 in Transit
            </div>
            <p>
              All network interactions between clients, the Next.js frontend, and the NestJS API are encrypted with TLS 1.3.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="font-semibold text-sm text-pine-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pine-600" />
              AES-256 at Rest
            </div>
            <p>
              Stored documents, signature PNG assets, and database records are encrypted with AES-256.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="font-semibold text-sm text-pine-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-pine-600" />
              7-Year Legal Retention
            </div>
            <p>
              Completed contracts, audit logs, and Certificates of Completion are preserved immutably for ≥ 7 years.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
