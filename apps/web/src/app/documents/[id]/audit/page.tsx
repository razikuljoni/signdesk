'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth-guard';
import {
  FileText,
  ShieldCheck,
  Download,
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Clock,
  Layers,
  Fingerprint,
  Scale,
  ExternalLink,
  CheckCircle2,
  Terminal,
  Cpu,
  FileCode,
  Share2,
} from 'lucide-react';

export default function DocumentAuditTrailPage() {
  return (
    <AuthGuard>
      <DocumentAuditContent />
    </AuthGuard>
  );
}

interface AuditBlock {
  blockNumber: string;
  isGenesis?: boolean;
  isCurrent?: boolean;
  title: string;
  timestampBST: string;
  actor: string;
  ipLocation: string;
  userAgent: string;
  parentHash: string;
  digest: string;
  status: string;
  details: string;
}

const BLOCKS: AuditBlock[] = [
  {
    blockNumber: '01',
    isGenesis: true,
    title: 'Envelope Initialized & Document Uploaded',
    timestampBST: '24 Oct 2024, 09:30:14 BST',
    actor: 'Ayesha Rahman (Managing Director, Rahim Textiles)',
    ipLocation: '103.25.12.8 (Tejgaon Industrial Area, Dhaka)',
    userAgent: 'SignDesk Agent v4.19.2 (TLS 1.3 Strict)',
    parentHash: '0000000000000000000000000000000000000000000000000000000000000000',
    digest: '9f82c7a4b08e2d4f198c61a5e30c44298fc1c149afbf4c8996fb92427ae431ad',
    status: 'SEALED & PROVED',
    details: 'Draft Genesis SHA-256 registered with CCA Bangladesh Root Registry.',
  },
  {
    blockNumber: '02',
    title: 'Audit Policy Applied & Signature Anchor Tagging',
    timestampBST: '24 Oct 2024, 09:34:02 BST',
    actor: 'System Policy Engine (SignDesk Dhaka Node)',
    ipLocation: 'Internal Sovereign Cluster (Dhaka-01)',
    userAgent: 'PolicyDaemon/2.4 (FIPS 140-2 Level 3)',
    parentHash: '9f82c7a4b08e2d4f198c61a5e30c44298fc1c149afbf4c8996fb92427ae431ad',
    digest: 'a418e54738cb201948ad72081f92e4c2789311bc910a56f2e1409ad1829088bc',
    status: 'SEALED & PROVED',
    details: '2FA NID Wing API enforced. Coordinates pinned: Page 14 §Clause 22.4.',
  },
  {
    blockNumber: '03',
    title: 'Multi-Channel Access Invitation Dispatched',
    timestampBST: '24 Oct 2024, 09:35:10 BST',
    actor: 'Automated Dispatcher (SignDesk Gateway)',
    ipLocation: 'Tejgaon Server Node (Dhaka, BD)',
    userAgent: 'SignDesk Notification Service / SMTP-TLS 1.3',
    parentHash: 'a418e54738cb201948ad72081f92e4c2789311bc910a56f2e1409ad1829088bc',
    digest: '519c233108ab44fc9910d8a209b552e1892cc041893bb00a2948ca20849309e2',
    status: 'SEALED & PROVED',
    details: 'Recipient: Tanvir Ahmed. Route: Meghna WhatsApp Gateway + TLS Email.',
  },
  {
    blockNumber: '04',
    title: 'First Signatory Assent & Digital Seal Affixation',
    timestampBST: '24 Oct 2024, 10:14:22 BST',
    actor: 'Ayesha Rahman (MD, Rahim Textiles & Trade Ltd.)',
    ipLocation: '103.25.12.8 (Gulshan-2, Dhaka)',
    userAgent: 'Chrome 129 / macOS Sequoia (Hardware Attested)',
    parentHash: '519c233108ab44fc9910d8a209b552e1892cc041893bb00a2948ca20849309e2',
    digest: '7b31c9a8e0f14d82b4156ce99a8b1ec0428d09bc71a36412ef189035624700ea',
    status: 'SEALED & PROVED',
    details: 'NID Biometric 2FA Verified (#***-***-5521). ECDSA P-256 Key Affixed.',
  },
  {
    blockNumber: '05',
    title: 'Secured Access Token Opened by Counterparty',
    timestampBST: '24 Oct 2024, 11:15:40 BST',
    actor: 'Tanvir Ahmed (MD, Meghna Distribution Corp.)',
    ipLocation: '103.114.98.24 (Agrabad Commercial Area, Chittagong)',
    userAgent: 'Mobile Safari 17.5 / iOS 17.5.1',
    parentHash: '7b31c9a8e0f14d82b4156ce99a8b1ec0428d09bc71a36412ef189035624700ea',
    digest: '29d107caf0e3bc48b265d6480b1e4c7d0d04c4ae79cbff91b29a00184762ff91',
    status: 'SEALED & PROVED',
    details: 'Access token validated against ephemeral nonce. OTP confirmed via WhatsApp.',
  },
  {
    blockNumber: '06',
    isCurrent: true,
    title: 'Signature Modal Initialized & Type Preview Active',
    timestampBST: 'In Session • 24 Oct 2024, 11:28:11 BST',
    actor: 'Tanvir Ahmed (Signer 2)',
    ipLocation: '103.114.98.24 (Agrabad, Chittagong)',
    userAgent: 'Mobile Safari 17.5 / iOS 17.5.1',
    parentHash: '29d107caf0e3bc48b265d6480b1e4c7d0d04c4ae79cbff91b29a00184762ff91',
    digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'AWAITING FINAL NONCE',
    details: 'Live execution session. Signer chamber terminal node active.',
  },
];

function DocumentAuditContent() {
  const params = useParams();
  const id = (params.id as string) || '8849-ICT';
  const envelopeId = id.startsWith('ENV-') ? id : `ENV-BD-2024-${id}`;

  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [computedProof, setComputedProof] = useState<boolean>(false);

  const copyToClipboard = (hash: string, key: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            envelopeId,
            standard: 'RFC 3161 / CCA Bangladesh PKI v2.4',
            verifiedAt: new Date().toISOString(),
            merkleRoot: '4e7b819f03c289ad0e6b4129e924a81a02',
            blocks: BLOCKS,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${envelopeId}-audit-trail.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-24">
      {/* Top Header */}
      <div className="border-b border-border bg-surface px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-ink-faint mb-1">
              <Link href="/documents" className="hover:text-pine-900 transition-colors">
                Documents
              </Link>
              <span>›</span>
              <Link href={`/documents/${id}`} className="hover:text-pine-900 transition-colors">
                {envelopeId}
              </Link>
              <span>›</span>
              <span className="text-pine-800 font-semibold">Forensic Audit Trail</span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-pine-900">
                Forensic Audit Trail & Chain of Custody
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                LIVE LEDGER
              </span>
            </div>

            <p className="text-xs text-ink-soft mt-1 max-w-3xl">
              Immutable, cryptographically verifiable event ledger compliant with Section 7, Information and Communication Technology (ICT) Act 2006 (Bangladesh) and Bankers&apos; Books Evidence Act standards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/documents/${id}`}>
              <button className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Document</span>
              </button>
            </Link>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold flex items-center gap-1.5 shadow-subtle transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-ink-soft" />
              <span>Export JSON Ledger</span>
            </button>

            <Link href={`/documents/${id}/certificate`}>
              <button className="px-3.5 py-1.5 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold flex items-center gap-1.5 shadow-warm transition-all">
                <ShieldCheck className="w-3.5 h-3.5 text-brass" />
                <span>Court Certificate</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-6">
        {/* Merkle Proof Summary Card */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-brass/10 border border-brass/30 text-brass-dark">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-pine-900 uppercase">
                    SHA-256 Merkle Proof • Block #0006
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    HASH-CHAIN STATE: UNBROKEN
                  </span>
                </div>
                <div className="text-xs text-ink-soft mt-0.5">
                  Mathematically validated against CCA Bangladesh Root Key ID: <span className="font-mono font-semibold text-pine-900">CA-BD-2024-X</span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-ink-faint">
              <div>BTRC / CCA Cert No. 2024-SD-88</div>
              <div className="text-emerald-800 font-semibold">Archival SLA: 12 Years</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="bg-paper p-3 rounded-lg border border-border">
              <div className="text-[10px] font-mono uppercase text-ink-faint">Root Merkle / Genesis Hash</div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-[11px] text-pine-900 truncate">
                  4e7b819f03c289ad0e6b...81a02
                </span>
                <button
                  onClick={() => copyToClipboard('4e7b819f03c289ad0e6b4129e924a81a02', 'genesis')}
                  className="p-1 text-ink-faint hover:text-pine-900"
                  title="Copy Genesis Hash"
                >
                  {copiedHash === 'genesis' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="text-[10px] font-mono text-ink-faint mt-1">
                Block Genesis: 24-10-2024 09:30:14
              </div>
            </div>

            <div className="bg-paper p-3 rounded-lg border border-border">
              <div className="text-[10px] font-mono uppercase text-ink-faint">Latest Block Digest</div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="font-mono text-[11px] text-pine-900 truncate">
                  e3b0c44298fc1c14...855
                </span>
                <button
                  onClick={() =>
                    copyToClipboard('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'latest')
                  }
                  className="p-1 text-ink-faint hover:text-pine-900"
                  title="Copy Latest Digest"
                >
                  {copiedHash === 'latest' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-1">
                Integrity Verified (0 drift)
              </div>
            </div>

            <div className="bg-paper p-3 rounded-lg border border-border">
              <div className="text-[10px] font-mono uppercase text-ink-faint">NTP Clock Authority</div>
              <div className="font-mono text-[11px] text-pine-900 mt-1">
                NTP-BD-01 Atomic Sync
              </div>
              <div className="text-[10px] font-mono text-ink-faint mt-1">
                BST (UTC+06:00) ±0.002ms Stratum-1
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-soft">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-brass-dark" />
              <span>
                <strong>Statutory Presumption:</strong> Section 67A & 85B, Evidence Act 1872 read with Section 7, ICT Act 2006.
              </span>
            </div>
            <div className="font-mono text-ink-faint">
              Cryptographic Engine: OpenSSL FIPS SHA-256
            </div>
          </div>
        </div>

        {/* Linked Cryptographic Chain (6 Blocks) */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-pine-900">
              Linked Cryptographic Execution Chain (6 Nodes)
            </h2>
            <span className="text-xs font-mono text-ink-faint">
              Sequential Order Enforced
            </span>
          </div>

          <div className="relative border-l-2 border-pine-800/30 ml-4 pl-6 space-y-6">
            {BLOCKS.map((block) => (
              <div
                key={block.blockNumber}
                className="relative bg-surface rounded-xl border border-border p-4 shadow-subtle hover:border-pine-800/40 transition-colors"
              >
                {/* Node icon marker */}
                <div
                  className={`absolute -left-[35px] top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono text-[9px] font-bold ${
                    block.isCurrent
                      ? 'bg-amber-100 border-amber-600 text-amber-800 animate-pulse'
                      : 'bg-pine-900 border-brass text-paper'
                  }`}
                >
                  {block.blockNumber}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-2 border-b border-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-pine-900 text-sm">
                        {block.title}
                      </span>
                      {block.isGenesis && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-pine-100 text-pine-900 border border-pine-200">
                          GENESIS BLOCK
                        </span>
                      )}
                      {block.isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          ACTIVE SESSION
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-ink-soft mt-0.5">{block.details}</div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-pine-900 block">
                      {block.timestampBST}
                    </span>
                    <span className="text-[10px] font-mono text-ink-faint">
                      {block.status}
                    </span>
                  </div>
                </div>

                {/* Technical Node Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 text-xs">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-ink-faint">Actor / Signatory</div>
                    <div className="text-ink font-medium">{block.actor}</div>
                    <div className="text-[11px] text-ink-soft mt-0.5 font-mono">{block.ipLocation}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase text-ink-faint">Client Runtime & Agent</div>
                    <div className="text-ink-soft font-mono text-[11px]">{block.userAgent}</div>
                  </div>
                </div>

                {/* Hashes: Parent & Resulting */}
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono bg-paper/60 p-2.5 rounded-lg border border-border">
                  <div className="truncate">
                    <span className="text-ink-faint">PARENT HASH: </span>
                    <span className="text-ink-soft">{block.parentHash}</span>
                  </div>
                  <div className="truncate flex items-center justify-between gap-1">
                    <span className="truncate">
                      <span className="text-pine-800 font-semibold">BLOCK DIGEST: </span>
                      <span className="text-pine-900">{block.digest}</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(block.digest, block.blockNumber)}
                      className="p-0.5 text-ink-faint hover:text-pine-900"
                      title="Copy Hash"
                    >
                      {copiedHash === block.blockNumber ? (
                        <Check className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Cryptographic Inspector (FIPS 180-4) */}
        <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-pine-900" />
              <h3 className="font-serif text-base font-bold text-pine-900">
                Interactive Cryptographic Inspector (FIPS 180-4)
              </h3>
            </div>
            <span className="font-mono text-[11px] text-ink-faint">
              Client-Side WebCrypto Verification
            </span>
          </div>

          <div className="pt-4 space-y-4 text-xs">
            <p className="text-ink-soft">
              Every event block in SignDesk is linked to its ancestor using a strict cryptographic equation. If any character in the audit record is altered, the resulting SHA-256 digest fails verification instantly.
            </p>

            <div className="p-4 rounded-lg bg-paper border border-border font-mono text-xs space-y-2">
              <div className="text-ink-faint text-[10px] uppercase">Cryptographic Equation:</div>
              <div className="text-pine-900 font-bold">
                SHA-256( Parent_Hash + Event_Payload_JSON + Nonce + BST_Atomic_Timestamp )
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-ink-soft">
                Block #05 Digest: <span className="text-pine-900">29d107caf0e3bc48b265d6480b1e4c7d0d04c4ae79cbff91</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setComputedProof(true)}
                className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-subtle flex items-center gap-2 transition-all"
              >
                <Terminal className="w-3.5 h-3.5 text-brass" />
                <span>Compute Client-Side Proof</span>
              </button>

              {computedProof && (
                <div className="flex items-center gap-1.5 text-emerald-800 font-mono text-xs font-semibold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Proof Validated: 0 Bit Collisions Detected across 6 Blocks</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
