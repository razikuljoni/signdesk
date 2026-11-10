'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  Shield,
} from 'lucide-react';

export default function NewEnvelopePage() {
  return (
    <AuthGuard>
      <NewEnvelopeContent />
    </AuthGuard>
  );
}

function NewEnvelopeContent() {
  const router = useRouter();
  const { user, workspace } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);

  // Compute SHA-256 hash using native Web Crypto API
  const computeSha256 = async (buffer: BufferSource): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileChange = async (selectedFile: File) => {
    setError(null);

    // Reject non-PDF (§6.1: PDF only)
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file format. Only PDF documents are supported under ICT Act 2006.');
      return;
    }

    // Reject > 25 MB (§6.1: 25 MB cap)
    if (selectedFile.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25 MB MVP cap. Please upload a smaller PDF.');
      return;
    }

    setIsHashing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hash = await computeSha256(arrayBuffer);
      setFileHash(hash);
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.pdf$/i, ''));
      }

      // Read as Data URL for canvas preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);

      setPageCount(1); // Standard default; will render pages on prepare canvas
    } catch (err) {
      setError('Failed to process PDF file. Please try another document.');
    } finally {
      setIsHashing(false);
    }
  };

  const handleSelectPreloaded = async (templateName: string, mockPages: number) => {
    setTitle(templateName);
    setIsHashing(true);
    // Deterministic demo genesis hash
    const demoBuffer = new TextEncoder().encode(templateName + '_sign_desk_v1');
    const hash = await computeSha256(demoBuffer);
    setFileHash(hash);
    setPageCount(mockPages);
    setFile({
      name: `${templateName.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      size: 142000,
    } as any);
    setFileDataUrl('/samples/bd-standard-nda.pdf');
    setIsHashing(false);
  };

  const handleContinue = () => {
    if (!title.trim()) {
      setError('Please provide a title for this agreement.');
      return;
    }

    // Persist draft in storage
    const envelopeId = 'env_' + Date.now();
    const newDraft = {
      id: envelopeId,
      title: title.trim(),
      originalHash: fileHash || '4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c9e830a7b512c4f82d1c',
      originalPdfUrl: fileDataUrl || '/samples/bd-standard-nda.pdf',
      pageCount: pageCount || 1,
      status: 'draft',
      createdAt: new Date().toISOString(),
      recipients: [
        {
          id: 'rec_1',
          name: 'Rahim Chowdhury',
          email: 'rahim@horizon-logistics.bd',
          role: 'SIGNER',
          order: 1,
          status: 'pending',
        },
        {
          id: 'rec_2',
          name: 'Karimul Islam',
          email: 'karim@apex-commerce.bd',
          role: 'SIGNER',
          order: 2,
          status: 'pending',
        },
      ],
      fields: [],
    };

    const existingEnvelopes = JSON.parse(localStorage.getItem('signdesk_envelopes') || '[]');
    existingEnvelopes.unshift(newDraft);
    localStorage.setItem('signdesk_envelopes', JSON.stringify(existingEnvelopes));
    localStorage.setItem(`signdesk_env_${envelopeId}`, JSON.stringify(newDraft));

    router.push(`/envelopes/${envelopeId}/prepare`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Step 1 of 3 — Upload Agreement
          </span>
          <h1 className="font-display text-3xl font-bold text-pine-900 mt-1">
            New Envelope
          </h1>
          <p className="text-sm text-ink-soft">
            Upload your contract in PDF format. We calculate its cryptographic fingerprint at ingestion.
          </p>
        </div>
        <Badge variant="waiting">
          Draft Creation
        </Badge>
      </div>

      {error && (
        <div className="p-4 bg-danger-bg text-danger border border-danger/30 rounded-[8px] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload Zone */}
      {!file ? (
        <div className="space-y-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const dropped = e.dataTransfer.files[0];
              if (dropped) handleFileChange(dropped);
            }}
            className="border-2 border-dashed border-border-strong hover:border-pine-600 rounded-[12px] p-10 md:p-14 text-center bg-surface hover:bg-surface-raised/40 transition-colors cursor-pointer space-y-4 shadow-warm-sm"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-pine-100 flex items-center justify-center mx-auto text-pine-900">
              <UploadCloud className="w-8 h-8 text-pine-600" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold text-pine-900">
                Drag and drop your PDF agreement here
              </h3>
              <p className="text-sm text-ink-soft">
                or click to browse your computer
              </p>
            </div>
            <div className="text-xs text-ink-faint font-mono">
              PDF only • Maximum 25 MB • SHA-256 Verified Ingestion
            </div>
            <input
              id="file-upload-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileChange(f);
              }}
            />
          </div>

          {/* Quick 1-Click Starter Kit for BD SMEs */}
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brass-600" />
              Or pick a pre-formatted Bangladeshi commercial contract:
            </span>
            <div className="grid sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectPreloaded('Mutual Non-Disclosure Agreement (NDA)', 2)}
                className="p-3 bg-surface border border-border hover:border-pine-600 rounded-[8px] text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-pine-900">Mutual NDA</div>
                <div className="text-[11px] text-ink-soft">2 Pages • 2 Signers</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreloaded('Standard Commercial Supply Agreement', 3)}
                className="p-3 bg-surface border border-border hover:border-pine-600 rounded-[8px] text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-pine-900">Supply Agreement</div>
                <div className="text-[11px] text-ink-soft">3 Pages • Delivery Challans</div>
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreloaded('Executive Employment Agreement', 2)}
                className="p-3 bg-surface border border-border hover:border-pine-600 rounded-[8px] text-left space-y-1 transition-colors"
              >
                <div className="font-bold text-xs text-pine-900">Employment Contract</div>
                <div className="text-[11px] text-ink-soft">2 Pages • Labour Act 2006</div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <Card className="bg-surface">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[8px] bg-pine-100 flex items-center justify-center text-pine-900">
                  <FileText className="w-6 h-6 text-pine-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">{file.name}</CardTitle>
                  <CardDescription>
                    {(file.size / 1024).toFixed(1)} KB • {pageCount} page(s)
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setFileHash(null);
                  setFileDataUrl(null);
                }}
                className="text-danger hover:bg-danger/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Replace
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="envelope-title" className="text-sm font-semibold text-ink">
                Envelope / Agreement Title
              </label>
              <input
                id="envelope-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mutual Non-Disclosure Agreement — Horizon Logistics"
                className="flex h-10 w-full rounded-[4px] border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
              />
            </div>

            {/* Cryptographic Hash Ingestion Card */}
            <div className="p-4 bg-surface-raised rounded-[8px] border border-border space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-pine-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-pine-600" />
                  Genesis SHA-256 Fingerprint:
                </span>
                <span className="text-[11px] font-mono bg-pine-100 text-pine-900 px-2 py-0.5 rounded">
                  Calculated In-Memory
                </span>
              </div>
              <div className="font-mono text-xs text-ink-faint break-all bg-white p-2.5 rounded border border-border">
                {fileHash || 'Computing...'}
              </div>
              <p className="text-[11px] text-ink-soft">
                This exact byte hash serves as the genesis block of your audit trail. Any post-ingestion alteration
                will trigger an integrity mismatch under ICT Act 2006.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setFileHash(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" size="lg" onClick={handleContinue}>
              Continue to Field Placement
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
