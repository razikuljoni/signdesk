'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Save,
  CheckCircle2,
  ShieldCheck,
  Building2,
  User,
  Mail,
  Gavel,
  ShieldAlert,
  Clock,
  MessageSquare,
  Lock,
  Plus,
  Trash2,
  Settings,
  Languages,
  Fingerprint,
  FileText,
  Key,
  Layers
} from 'lucide-react';

export default function RecipientsPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-mono text-ink-soft">Loading signing protocol...</div>}>
      <AuthGuard>
        <RecipientsPageContent />
      </AuthGuard>
    </Suspense>
  );
}

function RecipientsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const envelopeId = searchParams.get('id') || 'env_default';
  const { user } = useAuth();

  const [sequentialOrder, setSequentialOrder] = useState(true);
  const [bilingual, setBilingual] = useState(true);
  const [emailSubject, setEmailSubject] = useState(
    'Commercial Supply Agreement for immediate electronic execution'
  );
  const [emailMessage, setEmailMessage] = useState(
    'Dear Mr. Tanvir Ahmed, please find the agreed bilateral logistics agreement for combed yarn supply. Please review and affix your digital mark under the Bangladesh ICT Act 2006.'
  );
  const [expiryDays, setExpiryDays] = useState('14');
  const [remind48, setRemind48] = useState(true);
  const [whatsappDispatch, setWhatsappDispatch] = useState(true);
  const [smtpDispatch, setSmtpDispatch] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const [parties, setParties] = useState([
    {
      id: 'p1',
      order: 1,
      name: 'Ayesha Rahman',
      email: 'ayesha.rahman@rahimtraders.com',
      phone: '+880 1712-449102',
      role: 'Needs to Sign',
      color: '#0C2E29',
      gates: 'NID 2FA (Porichoy API) + Corporate Email',
      allocated: '2 Fields: Page 1 Initial • Page 2 Signature',
    },
    {
      id: 'p2',
      order: 2,
      name: 'Tanvir Ahmed',
      email: 'tanvir@meghnadist.com',
      phone: '+880 1711-884920',
      role: 'Needs to Sign',
      color: '#B3402A',
      gates: 'WhatsApp Direct Access + SMS OTP',
      allocated: '2 Fields: Page 2 Signature • Page 3 Attestation',
    },
    {
      id: 'p3',
      order: 3,
      name: 'Kamal Uddin, Advocate',
      email: 'legal@dcibar.org.bd',
      phone: '+880 1819-204192',
      role: 'Receives a Copy (Observer)',
      color: '#71717A',
      gates: 'Corporate Email Delivery',
      allocated: 'Transmitted automatic PKI cryptographic transcript upon final notarization.',
    },
  ]);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      router.push('/envelopes/sent');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Navigation & Stepper Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href={`/envelopes/${envelopeId}/prepare`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-pine-900 hover:text-pine-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Field Editor</span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <span className="font-mono text-xs text-ink-soft hidden sm:inline">
            Rahim Traders — Commercial Supply Agreement • #BD-2024-8849-ICT
          </span>
        </div>

        {/* Workflow Stepper */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Upload</span>
          </div>
          <span className="text-ink-faint">&gt;</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 text-emerald-800 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Prepare Fields</span>
          </div>
          <span className="text-ink-faint">&gt;</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pine-900 text-paper font-bold shadow-sm">
            <span>3.</span>
            <span>Recipients &amp; Send</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
          <span>ICT Act 2006</span>
        </div>
      </div>

      {/* Main Grid: Recipient Form & Config (7 cols) + Pre-Execution Cryptographic Review (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Recipient Protocol & Invitation (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Execution Parties & Signing Protocol */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
                <Gavel className="w-4 h-4 text-pine-600" />
                <span>Execution Parties &amp; Signing Protocol</span>
              </div>
              <p className="text-xs text-ink-soft">
                Define authorized legal signatories, identity authentication gates, and execution routing.
              </p>
            </div>

            {/* Sequential Order Banner */}
            <div className="p-4 bg-surface-raised rounded-xl border border-border flex items-start gap-3">
              <input
                id="sequentialOrder"
                type="checkbox"
                checked={sequentialOrder}
                onChange={(e) => setSequentialOrder(e.target.checked)}
                className="w-4 h-4 rounded border-border text-pine-600 mt-0.5 shrink-0"
              />
              <label htmlFor="sequentialOrder" className="text-xs text-pine-900 cursor-pointer select-none leading-relaxed">
                <strong>Gazette Reg. 2006:</strong> Enforce sequential signing order under Section 7 of the Bangladesh ICT Act (Party 2 cannot access or execute before Party 1 notarizes their allocated marks).
              </label>
            </div>

            {/* Parties List */}
            <div className="space-y-3">
              {parties.map((party) => (
                <div
                  key={party.id}
                  className="p-4 rounded-xl border border-border bg-paper space-y-2.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-paper text-xs font-bold font-mono"
                        style={{ backgroundColor: party.color }}
                      >
                        {party.order}
                      </div>
                      <div>
                        <strong className="text-xs text-pine-900 block font-semibold">{party.name}</strong>
                        <span className="text-[11px] text-ink-soft font-mono">{party.email}</span>
                      </div>
                    </div>
                    <select
                      value={party.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setParties(parties.map(p => p.id === party.id ? { ...p, role: newRole } : p));
                      }}
                      className="text-xs p-1.5 rounded-lg border border-border bg-surface font-semibold text-pine-900 focus:outline-none"
                    >
                      <option value="Needs to Sign">Needs to Sign</option>
                      <option value="Receives a Copy (Observer)">Receives a Copy (Observer)</option>
                      <option value="In-Person Witness">In-Person Witness</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-border/60">
                    <div className="text-ink-soft flex items-center gap-1 font-mono">
                      <Fingerprint className="w-3.5 h-3.5 text-pine-600 shrink-0" />
                      <span>{party.gates}</span>
                    </div>
                    <div className="text-pine-900 font-semibold flex items-center gap-1 text-right sm:justify-end">
                      <span>{party.allocated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                const nextOrder = parties.length + 1;
                setParties([
                  ...parties,
                  {
                    id: `p${nextOrder}`,
                    order: nextOrder,
                    name: `Signatory ${nextOrder}`,
                    email: `signer${nextOrder}@organization.bd`,
                    phone: '+880 1700-000000',
                    role: 'Needs to Sign',
                    color: '#1B5E52',
                    gates: 'Corporate Email Delivery',
                    allocated: '1 Field Assigned',
                  }
                ]);
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-border bg-surface hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 text-pine-600" />
              <span>Add Another Recipient or Witness</span>
            </button>
          </div>

          {/* Invitation Message to Signers */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-pine-900 uppercase tracking-wider">
                  Invitation Message to Signers
                </h3>
                <p className="text-xs text-ink-soft">
                  Constitutes formal delivery notification under statutory digital record provisions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBilingual(!bilingual)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-paper text-xs text-pine-900 font-semibold hover:bg-surface-raised"
              >
                <Languages className="w-3.5 h-3.5 text-pine-600" />
                <span>Bilingual (EN + BN)</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-pine-900 block">Email Subject Line:</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full px-3 py-2 bg-paper rounded-lg border border-border text-xs text-ink focus:outline-none focus:border-pine-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-pine-900">Custom Notification Body:</label>
                <span className="text-[11px] font-mono text-ink-faint">
                  {emailMessage.length} / 500 characters
                </span>
              </div>
              <textarea
                rows={3}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="w-full p-3 bg-paper rounded-lg border border-border text-xs text-ink focus:outline-none focus:border-pine-500 font-sans leading-relaxed"
              />
              <div className="text-[10px] text-ink-faint font-mono">
                Mapped Variables: <code className="text-pine-600 font-semibold">&#123;&#123;Signer_Name&#125;&#125;</code>, <code className="text-pine-600 font-semibold">&#123;&#123;Doc_Title&#125;&#125;</code>
              </div>
            </div>
          </div>

          {/* Validity & Automated Reminders */}
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-pine-600" />
                <span>Validity &amp; Automated Reminders</span>
              </div>
              <p className="text-xs text-ink-soft">
                Default expiry locks document and purges temporary signer tokens from cryptographic relay.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-pine-900 block">Execution Window:</label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-paper font-semibold text-pine-900 focus:outline-none focus:border-pine-500"
                >
                  <option value="7">7 Days (Expires 31 Oct 2024, 23:59 BST)</option>
                  <option value="14">14 Days (Expires 07 Nov 2024, 23:59 BST)</option>
                  <option value="30">30 Days (Expires 23 Nov 2024, 23:59 BST)</option>
                </select>
                <span className="text-[10px] text-ink-faint font-mono block">
                  Based on Asia/Dhaka GMT+6 regulatory timestamp server.
                </span>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remind48}
                    onChange={(e) => setRemind48(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-pine-600"
                  />
                  <span>Remind every 48 hours until executed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappDispatch}
                    onChange={(e) => setWhatsappDispatch(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-pine-600"
                  />
                  <span>WhatsApp Business Deep-Link Dispatch</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smtpDispatch}
                    onChange={(e) => setSmtpDispatch(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-pine-600"
                  />
                  <span>SMTP-TLS Authenticated Corporate Email</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Pre-Execution Cryptographic Review (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-pine-900 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-pine-600" />
                <span>Pre-Execution Cryptographic Review</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pine-100 text-pine-900 font-bold">
                FIPS 140-2
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-ink-soft">
                <span>Document:</span>
                <span className="font-semibold text-pine-900">Commercial Supply Agreement.pdf</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Ream Payload:</span>
                <span className="font-mono text-pine-900 font-semibold">3 Pages (1.8 MB)</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Signatories:</span>
                <span className="font-mono text-pine-900 font-semibold">2 Signers • 1 CC</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Fields Allocated:</span>
                <span className="font-mono text-pine-900 font-semibold">4 Legal Marks Placed</span>
              </div>
              <div className="flex justify-between items-center text-ink-soft">
                <span>Judicial Jurisdiction:</span>
                <span className="font-semibold text-pine-900">Courts of Dhaka, BD</span>
              </div>
            </div>

            {/* SHA-256 Digest Preview */}
            <div className="p-3.5 bg-paper rounded-xl border border-border/80 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-pine-900 font-bold text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-pine-600" />
                  SHA-256 Digest Preview:
                </span>
                <span className="text-emerald-700 font-sans text-[10px] font-semibold">Ready</span>
              </div>
              <div className="text-[11px] text-ink-faint break-all bg-surface p-2 rounded border border-border">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
              <p className="text-[10px] text-ink-soft font-sans pt-1">
                Root state timestamp anchored via Bangladesh Sub-CA Node Motijheel.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={isSending}
                className="w-full py-3.5 px-4 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-warm-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSending ? 'Registering Genesis Block...' : 'Send Envelope for Execution'}</span>
              </button>
              <p className="text-center text-[11px] text-ink-faint leading-tight">
                Generates tamper-evident magic links and registers genesis block in institutional audit ledger.
              </p>
            </div>

            {/* Secondary Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-lg border border-border bg-paper hover:bg-surface text-ink-soft text-xs font-semibold"
                >
                  Save Draft &amp; Exit
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full py-2 px-3 rounded-lg border border-danger/30 bg-danger-bg text-danger text-xs font-semibold hover:bg-danger/20"
                >
                  Discard
                </button>
              </Link>
            </div>
          </div>

          {/* Statutory Non-Repudiation Attestation Box */}
          <div className="p-4 bg-surface-raised rounded-2xl border border-border text-xs space-y-1.5">
            <strong className="text-pine-900 font-bold block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-pine-600" />
              Statutory Non-Repudiation
            </strong>
            <p className="text-ink-soft text-[11px] leading-relaxed">
              Electronic signatures placed through SignDesk conform with the Fourth Schedule evidentiary criteria of the Bankers&apos; Books Evidence Act 2021 and ICT Act 2006.
            </p>
          </div>
        </div>
      </div>

      {/* Global Legal Bottom Bar */}
      <div className="text-center text-[11px] text-ink-faint font-mono pt-4 border-t border-border">
        PKI Vault 256-Bit Cryptographic Sealing • Statutory Electronic Execution under Bangladesh ICT Act 2006
      </div>
    </div>
  );
}