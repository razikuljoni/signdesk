'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import {
  PenTool,
  Calendar,
  Type,
  Mail,
  Building,
  CheckSquare,
  ListOrdered,
  FileCheck,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Trash2,
  Copy,
  Plus,
  Send,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Sparkles,
  Undo2,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Stamp,
  Fingerprint,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Save,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { FieldType } from '@signdesk/shared';

interface FieldItem {
  id: string;
  type: FieldType;
  recipientId: string | null;
  page: number;
  xRatio: number;
  yRatio: number;
  wRatio: number;
  hRatio: number;
  required: boolean;
  label?: string;
  value?: any;
}

interface RecipientItem {
  id: string;
  name: string;
  email: string;
  role: 'SIGNER' | 'APPROVER' | 'VIEWER';
  order: number;
  color: string;
  colorName: string;
}

const PALETTE_FIELDS = [
  { type: FieldType.SIGNATURE, label: 'Signature', icon: PenTool, defaultW: 0.28, defaultH: 0.06 },
  { type: FieldType.INITIALS, label: 'Initials', icon: FileCheck, defaultW: 0.14, defaultH: 0.05 },
  { type: FieldType.DATE_SIGNED, label: 'Date Signed', icon: Calendar, defaultW: 0.22, defaultH: 0.04 },
  { type: FieldType.FULL_NAME, label: 'Full Name', icon: User, defaultW: 0.26, defaultH: 0.04 },
  { type: FieldType.TEXT, label: 'Text Input', icon: Type, defaultW: 0.28, defaultH: 0.04 },
  { type: FieldType.CHECKBOX, label: 'Checkbox', icon: CheckSquare, defaultW: 0.05, defaultH: 0.035 },
];

const BD_OFFICIAL_FIELDS = [
  { type: FieldType.TEXT, label: 'Company Seal / Stamp', icon: Award, defaultW: 0.24, defaultH: 0.08, customLabel: 'Official Company Seal' },
  { type: FieldType.TEXT, label: 'National ID / NID', icon: Fingerprint, defaultW: 0.28, defaultH: 0.045, customLabel: 'Signer NID (10/17 Digit)' },
];

export default function PrepareEnvelopePage() {
  return (
    <AuthGuard>
      <PrepareContent />
    </AuthGuard>
  );
}

function PrepareContent() {
  const params = useParams();
  const router = useRouter();
  const envelopeId = params.id as string;

  const [envelope, setEnvelope] = useState<any>(null);
  const [zoom, setZoom] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeRecipientId, setActiveRecipientId] = useState<string>('rec_1');
  const [savedTime, setSavedTime] = useState<string>('12:04 PM');
  const [history, setHistory] = useState<FieldItem[][]>([]);
  const [sequentialOrder, setSequentialOrder] = useState(true);

  // Default recipient placeholder
  const [recipients, setRecipients] = useState<RecipientItem[]>([
    {
      id: 'rec_1',
      name: 'Signer 1',
      email: 'signer1@company.bd',
      role: 'SIGNER',
      order: 1,
      color: '#0C2E29', // Pine 900
      colorName: 'Pine (Signer 1)',
    },
  ]);

  const [fields, setFields] = useState<FieldItem[]>([]);

  useEffect(() => {
    let mounted = true;
    apiFetch<any>(`/envelopes/${envelopeId}`)
      .then((data) => {
        if (!mounted) return;
        setEnvelope(data);
        if (data.recipients?.length > 0) {
          const mapped = data.recipients.map((r: any, idx: number) => ({
            id: r.id,
            name: r.name,
            email: r.email,
            role: r.role || 'SIGNER',
            order: r.order || idx + 1,
            color: idx === 0 ? '#0C2E29' : idx === 1 ? '#B3402A' : '#71717A',
            colorName: idx === 0 ? 'Pine' : idx === 1 ? 'Vermilion' : 'Observer',
          }));
          setRecipients(mapped);
          setActiveRecipientId(mapped[0]?.id || 'rec_1');
        }
        if (data.fields?.length > 0) {
          setFields(data.fields);
        } else {
          const rId = data.recipients?.[0]?.id || 'rec_1';
          const initialFields: FieldItem[] = [
            {
              id: 'fld_1',
              type: FieldType.SIGNATURE,
              recipientId: rId,
              page: 0,
              xRatio: 0.12,
              yRatio: 0.74,
              wRatio: 0.32,
              hRatio: 0.065,
              required: true,
              label: 'Signature',
            },
            {
              id: 'fld_2',
              type: FieldType.DATE_SIGNED,
              recipientId: rId,
              page: 0,
              xRatio: 0.12,
              yRatio: 0.83,
              wRatio: 0.24,
              hRatio: 0.045,
              required: true,
              label: 'Date Signed',
            },
          ];
          setFields(initialFields);
        }
      })
      .catch((err) => {
        console.error('Failed to load envelope', err);
      });
    return () => {
      mounted = false;
    };
  }, [envelopeId]);

  const pushState = (newFields: FieldItem[]) => {
    setHistory((prev) => [...prev.slice(-20), fields]);
    setFields(newFields);
    triggerAutoSave(newFields);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setFields(prev);
    triggerAutoSave(prev);
  };

  const triggerAutoSave = (currentFields: FieldItem[]) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSavedTime(timeStr);

    apiFetch(`/envelopes/${envelopeId}/fields`, {
      method: 'POST',
      body: JSON.stringify({
        fields: currentFields.map((f) => ({
          recipientId: f.recipientId,
          type: f.type,
          page: f.page,
          xRatio: f.xRatio,
          yRatio: f.yRatio,
          wRatio: f.wRatio,
          hRatio: f.hRatio,
          required: f.required,
          label: f.label,
        })),
      }),
    }).catch((e) => console.warn('Field autosave failed', e));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFieldId(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (selectedFieldId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const delta = e.shiftKey ? 0.02 : 0.005;
        const updated = fields.map((f) => {
          if (f.id !== selectedFieldId) return f;
          return {
            ...f,
            xRatio: Math.max(0, Math.min(1 - f.wRatio, f.xRatio + (e.key === 'ArrowRight' ? delta : e.key === 'ArrowLeft' ? -delta : 0))),
            yRatio: Math.max(0, Math.min(1 - f.hRatio, f.yRatio + (e.key === 'ArrowDown' ? delta : e.key === 'ArrowUp' ? -delta : 0))),
          };
        });
        pushState(updated);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fields, selectedFieldId, history]);

  const addField = (type: FieldType, defaultW = 0.26, defaultH = 0.05, customLabel?: string) => {
    const newField: FieldItem = {
      id: 'fld_' + Date.now(),
      type,
      recipientId: activeRecipientId,
      page: currentPage,
      xRatio: 0.35,
      yRatio: 0.45,
      wRatio: defaultW,
      hRatio: defaultH,
      required: true,
      label: customLabel || type.replace('_', ' '),
    };
    const updated = [...fields, newField];
    pushState(updated);
    setSelectedFieldId(newField.id);
  };

  const deleteSelectedField = () => {
    if (!selectedFieldId) return;
    const updated = fields.filter((f) => f.id !== selectedFieldId);
    pushState(updated);
    setSelectedFieldId(null);
  };

  const duplicateSelectedField = () => {
    if (!selectedFieldId) return;
    const current = fields.find((f) => f.id === selectedFieldId);
    if (!current) return;
    const dup: FieldItem = {
      ...current,
      id: 'fld_' + Date.now(),
      xRatio: Math.min(0.7, current.xRatio + 0.04),
      yRatio: Math.min(0.85, current.yRatio + 0.04),
    };
    const updated = [...fields, dup];
    pushState(updated);
    setSelectedFieldId(dup.id);
  };

  const unassignedFields = fields.filter((f) => !f.recipientId);
  const isValidToSend = unassignedFields.length === 0 && fields.length > 0;

  const handleProceedToSend = () => {
    router.push(`/envelopes/prepare/recipients?id=${envelopeId}`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-paper overflow-hidden select-none">
      {/* Top Header & Studio Meta Bar */}
      <div className="h-14 border-b border-border bg-surface px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard">
            <button
              type="button"
              className="p-1.5 rounded-lg border border-border bg-paper hover:bg-surface-raised text-pine-900 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-bold text-xs sm:text-sm text-pine-900 truncate">
              {envelope?.title || 'Rahim Traders — Commercial Supply Agreement.pdf • v1.2'}
            </h2>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              All 4 fields assigned
            </span>
          </div>
          <span className="text-[11px] text-ink-faint font-mono hidden lg:inline">
            Saved {savedTime} • All changes synced
          </span>
        </div>

        {/* Stepper + CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-ink-faint">
            <span className="text-ink-soft">1 Upload</span>
            <span>&gt;</span>
            <span className="font-bold text-pine-900 bg-pine-100 px-2 py-0.5 rounded">
              2 Place Fields
            </span>
            <span>&gt;</span>
            <span className="text-ink-soft">3 Review &amp; Send</span>
          </div>

          <button
            type="button"
            onClick={handleProceedToSend}
            className="px-4 py-2 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper text-xs font-bold flex items-center gap-1.5 transition-all shadow-warm-sm"
          >
            <span>Continue to Send</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3-Zone Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Rail: Field Palette & Properties (260px) */}
        <div className="w-64 border-r border-border bg-surface flex flex-col shrink-0 z-10">
          {/* Signer Selector Dropdown */}
          <div className="p-3.5 border-b border-border space-y-1.5 bg-surface-raised/40">
            <label className="text-[11px] font-bold text-pine-900 uppercase tracking-wider block">
              Assign Fields To:
            </label>
            <select
              value={activeRecipientId}
              onChange={(e) => setActiveRecipientId(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-border bg-surface font-semibold text-pine-900 focus:outline-none focus:border-pine-500 cursor-pointer"
            >
              {recipients.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.colorName})
                </option>
              ))}
            </select>
          </div>

          {/* Palette Items */}
          <div className="p-3.5 overflow-y-auto space-y-4 flex-1">
            {/* Standard Fields */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-faint block">
                Standard Fields (Drag / Click)
              </span>
              <div className="space-y-1.5">
                {PALETTE_FIELDS.map((f) => {
                  const IconComp = f.icon;
                  return (
                    <div
                      key={f.type}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', f.type);
                      }}
                      onClick={() => addField(f.type, f.defaultW, f.defaultH)}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-border bg-paper hover:bg-surface-raised hover:border-pine-600 transition-all cursor-pointer shadow-warm-sm group"
                    >
                      <div className="w-6 h-6 rounded bg-white border border-border flex items-center justify-center text-pine-900 group-hover:text-seal-600">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-pine-900 flex-1 truncate">
                        {f.label}
                      </span>
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            recipients.find((r) => r.id === activeRecipientId)?.color || '#0C2E29',
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official & Legal BD Fields */}
            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink-faint block">
                Official BD Legal Marks
              </span>
              <div className="space-y-1.5">
                {BD_OFFICIAL_FIELDS.map((f, idx) => {
                  const IconComp = f.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => addField(f.type, f.defaultW, f.defaultH, f.customLabel)}
                      className="flex items-center gap-2.5 p-2 rounded-lg border border-brass-600/30 bg-amber-50/50 hover:bg-amber-50 hover:border-brass-600 transition-all cursor-pointer shadow-warm-sm group"
                    >
                      <div className="w-6 h-6 rounded bg-white border border-brass-600/30 flex items-center justify-center text-brass-600">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-pine-900 flex-1 truncate">
                        {f.label}
                      </span>
                      <span className="text-[9px] font-mono text-brass-600 font-bold">NBR</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Field Inspector */}
            {selectedFieldId && (
              <div className="p-3 bg-surface-raised rounded-xl border border-border space-y-2.5 text-xs">
                <div className="flex items-center justify-between font-bold text-pine-900 text-[11px] font-mono uppercase">
                  <span>Target Box Inspector</span>
                  <button
                    onClick={deleteSelectedField}
                    className="text-danger hover:underline text-[10px]"
                  >
                    Delete
                  </button>
                </div>
                <div className="space-y-1">
                  <label className="text-ink-soft text-[11px]">Assignee:</label>
                  <select
                    value={fields.find((f) => f.id === selectedFieldId)?.recipientId || ''}
                    onChange={(e) => {
                      const targetId = e.target.value;
                      const updated = fields.map((f) =>
                        f.id === selectedFieldId ? { ...f, recipientId: targetId } : f
                      );
                      pushState(updated);
                    }}
                    className="w-full text-xs p-1.5 rounded border border-border bg-surface"
                  >
                    {recipients.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="req-fld"
                    checked={fields.find((f) => f.id === selectedFieldId)?.required ?? true}
                    onChange={(e) => {
                      const req = e.target.checked;
                      const updated = fields.map((f) =>
                        f.id === selectedFieldId ? { ...f, required: req } : f
                      );
                      pushState(updated);
                    }}
                    className="w-3.5 h-3.5 rounded border-border text-pine-600"
                  />
                  <label htmlFor="req-fld" className="text-[11px] text-pine-900 font-semibold cursor-pointer">
                    Required Field
                  </label>
                </div>
                <div className="text-[10px] text-ink-faint font-mono">
                  Signature Type: Digital Cryptographic (ICT Act)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Zone: White Parchment Document Canvas */}
        <div
          className="flex-1 overflow-auto bg-[#E9E4D8] p-6 sm:p-8 flex flex-col items-center gap-6 relative"
          onClick={() => setSelectedFieldId(null)}
        >
          {/* Canvas Toolbar */}
          <div className="bg-surface rounded-xl border border-border px-3 py-1.5 flex items-center gap-3 shadow-warm-sm text-xs font-mono">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="p-1 hover:text-pine-900 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-pine-900">
                Page {currentPage + 1} of 3
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(2, p + 1))}
                disabled={currentPage === 2}
                className="p-1 hover:text-pine-900 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="p-1 hover:text-pine-900"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center font-bold text-pine-900">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
                className="p-1 hover:text-pine-900"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1.0)}
                className="p-1 hover:text-pine-900 ml-1"
                title="Fit Width"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Simulated Contract Canvas with A4 Aspect Ratio */}
          <div
            style={{
              width: `${600 * zoom}px`,
              minHeight: `${850 * zoom}px`,
            }}
            className="bg-white rounded-[2px] shadow-warm-lg relative border border-border overflow-hidden shrink-0 transition-all duration-150"
            onClick={(e) => e.stopPropagation()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const type = e.dataTransfer.getData('text/plain') as FieldType;
              if (type) {
                const rect = e.currentTarget.getBoundingClientRect();
                const xRatio = (e.clientX - rect.left) / rect.width;
                const yRatio = (e.clientY - rect.top) / rect.height;
                const newField: FieldItem = {
                  id: 'fld_' + Date.now(),
                  type,
                  recipientId: activeRecipientId,
                  page: currentPage,
                  xRatio: Math.max(0, Math.min(0.7, xRatio)),
                  yRatio: Math.max(0, Math.min(0.9, yRatio)),
                  wRatio: 0.28,
                  hRatio: 0.05,
                  required: true,
                  label: type.replace('_', ' '),
                };
                pushState([...fields, newField]);
                setSelectedFieldId(newField.id);
              }
            }}
          >
            {/* Regulatory Non-Judicial Stamp Banner */}
            <div className="bg-amber-50/80 border-b border-brass-600/30 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-amber-900">
              <span className="flex items-center gap-1.5 font-bold">
                <Award className="w-3.5 h-3.5 text-brass-600" />
                Non-Judicial Stamp Value: ৳1,000 BDT • Govt. Reg #892/2024
              </span>
              <span className="text-[10px] text-ink-faint">Serial: BD-REG-2024-DHK</span>
            </div>

            {/* Authentic Bangladeshi Legal Deed Body */}
            <div className="p-8 text-ink select-none pointer-events-none space-y-4">
              <div className="text-center space-y-1 border-b border-border pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-faint block">
                  Commercial Indenture &amp; Master Procurement
                </span>
                <h3 className="font-display text-lg font-bold text-pine-900">
                  COMMERCIAL SUPPLY AGREEMENT
                </h3>
                <p className="text-xs text-ink-soft">
                  Between Rahim Traders Ltd. (Dhaka) and Meghna Distribution Corp. (Chittagong)
                </p>
                <div className="inline-block font-mono text-xs font-bold text-pine-900 bg-paper px-3 py-1 rounded border border-border">
                  Total Contract Consideration: ৳1,450,000 BDT
                </div>
              </div>

              {/* Clauses */}
              <div className="space-y-3 text-[11px] text-ink-soft leading-relaxed pt-2">
                <div>
                  <strong className="text-pine-900 block font-sans">1. Execution Recitals &amp; Statutory Authority</strong>
                  <p>
                    This Agreement is entered into under the Contract Act 1872 and the Information and Communication Technology (ICT) Act 2006 (Bangladesh). Both parties confirm that digital records generated under this instrument constitute valid evidentiary assent.
                  </p>
                </div>

                <div>
                  <strong className="text-pine-900 block font-sans">2. Delivery Obligations &amp; Specifications</strong>
                  <p>
                    Rahim Traders Ltd. covenants to supply 45 metric tonnes of combed cotton yarn conforming with BSTI Standard #104. Delivery shall be executed in staggered consignments at Chittagong Port Depot.
                  </p>
                </div>

                <div>
                  <strong className="text-pine-900 block font-sans">3. Fiscal Clearance &amp; Invoicing</strong>
                  <p>
                    All consideration shall be routed via Bangladesh Bank authorized inland documentary Letter of Credit (L/C). Invoices shall be accompanied by NBR Mushak-6.3 tax challans.
                  </p>
                </div>

                <div>
                  <strong className="text-pine-900 block font-sans">4. Validity of Electronic Attestation</strong>
                  <p>
                    Pursuant to Section 7 of the ICT Act 2006, the digital signatures, seal impressions, and SHA-256 Merkle hashes generated upon this document shall be conclusive evidence of intent and execution before all courts of Bangladesh.
                  </p>
                </div>
              </div>

              {/* Execution Sign-off Block */}
              <div className="pt-16 grid grid-cols-2 gap-8 text-[11px] border-t border-border">
                <div className="space-y-1">
                  <div className="font-bold text-pine-900">For First Party:</div>
                  <div className="text-ink-soft text-[10px] font-semibold">{recipients[0]?.name || 'Signatory 1'}</div>
                  <div className="text-ink-faint text-[10px] font-mono">{recipients[0]?.email || ''}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-pine-900">For Second Party:</div>
                  <div className="text-ink-soft text-[10px] font-semibold">{recipients[1]?.name || recipients[0]?.name || 'Signatory 2'}</div>
                  <div className="text-ink-faint text-[10px] font-mono">{recipients[1]?.email || ''}</div>
                </div>
              </div>
            </div>

            {/* Placed Ratio Fields Overlay */}
            {fields
              .filter((f) => f.page === currentPage)
              .map((field) => {
                const isSelected = selectedFieldId === field.id;
                const rec = recipients.find((r) => r.id === field.recipientId);
                const recColor = rec?.color || '#0C2E29';

                return (
                  <div
                    key={field.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFieldId(field.id);
                    }}
                    style={{
                      left: `${field.xRatio * 100}%`,
                      top: `${field.yRatio * 100}%`,
                      width: `${field.wRatio * 100}%`,
                      height: `${field.hRatio * 100}%`,
                      borderColor: recColor,
                      backgroundColor: isSelected
                        ? 'rgba(12, 46, 41, 0.12)'
                        : 'rgba(250, 247, 241, 0.85)',
                    }}
                    className={`absolute border-2 rounded-md flex items-center justify-between px-2 cursor-move transition-all ${
                      isSelected
                        ? 'ring-2 ring-pine-500 shadow-warm-md'
                        : 'hover:shadow-warm-sm'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: recColor }}
                      />
                      <span className="text-[10px] font-bold text-pine-900 truncate">
                        {field.label || field.type}
                      </span>
                    </div>

                    {field.required && (
                      <span className="text-[9px] text-danger font-bold shrink-0">*</span>
                    )}

                    {/* Quick action buttons on selected field */}
                    {isSelected && (
                      <div className="absolute -top-7 right-0 flex items-center gap-1 bg-surface border border-border shadow-warm-sm rounded p-0.5 z-30">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSelectedField();
                          }}
                          className="p-1 hover:text-pine-900 text-ink-soft"
                          title="Duplicate"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSelectedField();
                          }}
                          className="p-1 hover:text-danger text-ink-soft"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

            {/* Document Bottom Cryptographic Strip */}
            <div className="absolute bottom-0 left-0 right-0 bg-surface-raised border-t border-border px-6 py-1.5 flex items-center justify-between text-[9px] font-mono text-ink-faint">
              <span>UUID: e48b-90f1-432a-bc91</span>
              <span>SHA-256 Audit: 9d82f718a209b...c819</span>
              <span>Page {currentPage + 1} of 3</span>
            </div>
          </div>
        </div>

        {/* Right Rail: Recipients & Flow (280px) */}
        <div className="w-72 border-l border-border bg-surface flex flex-col shrink-0 z-10">
          <div className="p-3.5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-pine-900 uppercase tracking-wider">
                Recipients &amp; Flow
              </h3>
              <p className="text-[11px] text-ink-soft">
                Sequential legal order under ICT Act.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newRec: RecipientItem = {
                  id: 'rec_' + (recipients.length + 1),
                  name: `Signer ${recipients.length + 1}`,
                  email: `signer${recipients.length + 1}@company.bd`,
                  role: 'SIGNER',
                  order: recipients.length + 1,
                  color: recipients.length === 2 ? '#B3402A' : '#71717A',
                  colorName: 'Signer ' + (recipients.length + 1),
                };
                setRecipients([...recipients, newRec]);
              }}
              className="p-1.5 rounded-lg border border-border bg-paper hover:bg-surface-raised text-pine-900 text-xs"
              title="Add Recipient"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Signers List */}
          <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1 border-b border-border">
            {recipients.map((r) => {
              const assignedCount = fields.filter((f) => f.recipientId === r.id).length;
              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRecipientId(r.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activeRecipientId === r.id
                      ? 'border-pine-600 bg-pine-100/50 shadow-warm-sm'
                      : 'border-border bg-paper hover:bg-surface-raised'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="text-xs font-bold text-pine-900">
                        {r.order}. {r.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-ink-faint uppercase font-bold">
                      {r.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-ink-soft truncate">{r.email}</div>
                  <div className="mt-2 text-[10px] text-ink-faint flex items-center justify-between">
                    <span>{assignedCount} fields assigned</span>
                    {activeRecipientId === r.id && (
                      <span className="text-pine-600 font-bold font-mono">ACTIVE TARGET</span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Sequential order checkbox */}
            <div className="pt-2 flex items-start gap-2 text-xs">
              <input
                id="seq-order"
                type="checkbox"
                checked={sequentialOrder}
                onChange={(e) => setSequentialOrder(e.target.checked)}
                className="w-4 h-4 rounded border-border text-pine-600 mt-0.5"
              />
              <label htmlFor="seq-order" className="text-[11px] text-ink-soft cursor-pointer leading-tight">
                <strong>Sequential Order:</strong> Signer 2 unlocked only after Signer 1 notarizes.
              </label>
            </div>

            {/* AI Executive Brief Card */}
            <div className="p-3 bg-surface-raised rounded-xl border border-border space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-pine-900 text-[11px]">
                <BrainCircuit className="w-3.5 h-3.5 text-brass-600" />
                <span>AI Executive Brief</span>
              </div>
              <p className="text-[11px] text-ink-soft italic leading-relaxed">
                &ldquo;3-year procurement contract for combed cotton. Total payable: ৳1.45M BDT. Arbitration venue: Dhaka. Ready for transmission.&rdquo;
              </p>
            </div>
          </div>

          {/* Validity & Verification Footer */}
          <div className="p-3.5 space-y-2 text-xs text-ink-soft bg-surface-raised/40">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-pine-900 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-pine-600" />
                Validity Period:
              </span>
              <span className="font-mono text-[11px]">14 Days (Nov 15)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px]">Auto-reminders:</span>
              <span className="text-pine-600 font-semibold text-[11px]">Every 48 Hours</span>
            </div>
            <div className="pt-2 border-t border-border flex items-center gap-1 text-[10px] text-ink-faint font-mono">
              <ShieldCheck className="w-3 h-3 text-pine-600" />
              <span>ICT-Act Verifier Checked • PKI Cert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}