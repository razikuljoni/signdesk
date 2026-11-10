'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  ChevronDown,
  Clock,
  Sparkles,
  Undo2,
  Shield,
  Move,
} from 'lucide-react';
import { FieldType, DESIGN_TOKENS } from '@signdesk/shared';

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
  { type: FieldType.EMAIL, label: 'Email', icon: Mail, defaultW: 0.26, defaultH: 0.04 },
  { type: FieldType.COMPANY, label: 'Company', icon: Building, defaultW: 0.26, defaultH: 0.04 },
  { type: FieldType.TEXT, label: 'Text Field', icon: Type, defaultW: 0.28, defaultH: 0.04 },
  { type: FieldType.CHECKBOX, label: 'Checkbox', icon: CheckSquare, defaultW: 0.05, defaultH: 0.035 },
  { type: FieldType.DROPDOWN, label: 'Dropdown', icon: ListOrdered, defaultW: 0.24, defaultH: 0.04 },
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
  const [zoom, setZoom] = useState(1.0); // 100%
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activeRecipientId, setActiveRecipientId] = useState<string>('rec_1');
  const [savedTime, setSavedTime] = useState<string>('Just now');
  const [history, setHistory] = useState<FieldItem[][]>([]);

  // Default recipients with §3.1 colors
  const [recipients, setRecipients] = useState<RecipientItem[]>([
    {
      id: 'rec_1',
      name: 'Rahim Chowdhury',
      email: 'rahim@horizon-logistics.bd',
      role: 'SIGNER',
      order: 1,
      color: '#1B5E52', // Pine 600
      colorName: 'Pine (Signer 1)',
    },
    {
      id: 'rec_2',
      name: 'Karimul Islam',
      email: 'karim@apex-commerce.bd',
      role: 'SIGNER',
      order: 2,
      color: '#B3402A', // Wax-Seal Vermilion
      colorName: 'Vermilion (Signer 2)',
    },
  ]);

  const [fields, setFields] = useState<FieldItem[]>([]);

  // Load envelope
  useEffect(() => {
    const raw = localStorage.getItem(`signdesk_env_${envelopeId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setEnvelope(parsed);
        if (parsed.recipients?.length > 0) {
          setRecipients(
            parsed.recipients.map((r: any, idx: number) => ({
              ...r,
              color: idx === 0 ? '#1B5E52' : idx === 1 ? '#B3402A' : '#9A7B2D',
              colorName: idx === 0 ? 'Pine' : idx === 1 ? 'Vermilion' : 'Brass',
            }))
          );
        }
        if (parsed.fields?.length > 0) {
          setFields(parsed.fields);
        } else {
          // Pre-populate with starter fields
          const initialFields: FieldItem[] = [
            {
              id: 'fld_1',
              type: FieldType.SIGNATURE,
              recipientId: 'rec_1',
              page: 0,
              xRatio: 0.15,
              yRatio: 0.76,
              wRatio: 0.30,
              hRatio: 0.06,
              required: true,
              label: 'Signature — Rahim',
            },
            {
              id: 'fld_2',
              type: FieldType.DATE_SIGNED,
              recipientId: 'rec_1',
              page: 0,
              xRatio: 0.15,
              yRatio: 0.84,
              wRatio: 0.22,
              hRatio: 0.04,
              required: true,
              label: 'Date Signed',
            },
            {
              id: 'fld_3',
              type: FieldType.SIGNATURE,
              recipientId: 'rec_2',
              page: 0,
              xRatio: 0.55,
              yRatio: 0.76,
              wRatio: 0.30,
              hRatio: 0.06,
              required: true,
              label: 'Signature — Karimul',
            },
            {
              id: 'fld_4',
              type: FieldType.DATE_SIGNED,
              recipientId: 'rec_2',
              page: 0,
              xRatio: 0.55,
              yRatio: 0.84,
              wRatio: 0.22,
              hRatio: 0.04,
              required: true,
              label: 'Date Signed',
            },
          ];
          setFields(initialFields);
        }
      } catch (e) {}
    } else {
      setEnvelope({
        id: envelopeId,
        title: 'Commercial Agreement',
        pageCount: 2,
      });
    }
  }, [envelopeId]);

  // Push to history for Undo (Cmd+Z)
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

    if (envelope) {
      const updated = {
        ...envelope,
        fields: currentFields,
        recipients,
      };
      localStorage.setItem(`signdesk_env_${envelopeId}`, JSON.stringify(updated));
    }
  };

  // Keyboard support: Esc deselects, Cmd+Z undo, Arrows nudge
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

  // Drop or click to add field on visible page center
  const addField = (type: FieldType, defaultW = 0.26, defaultH = 0.05) => {
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
      label: type.replace('_', ' '),
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
      xRatio: Math.min(0.8, current.xRatio + 0.04),
      yRatio: Math.min(0.85, current.yRatio + 0.04),
    };
    const updated = [...fields, dup];
    pushState(updated);
    setSelectedFieldId(dup.id);
  };

  // Validation
  const unassignedFields = fields.filter((f) => !f.recipientId);
  const isValidToSend = unassignedFields.length === 0 && fields.length > 0;

  const handleProceedToSend = () => {
    if (!isValidToSend) return;
    router.push(`/envelopes/sent`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-paper overflow-hidden select-none">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-pine-900 truncate max-w-xs">
              {envelope?.title || 'Contract Draft'}
            </h2>
            <Badge variant="waiting">
              Prepare Mode
            </Badge>
          </div>
          <span className="text-xs text-ink-faint hidden sm:inline font-mono">
            Auto-saved {savedTime}
          </span>
        </div>

        {/* Zoom & Canvas Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-[8px] bg-paper px-1 py-0.5 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
              className="p-1 hover:text-pine-900 text-ink-soft"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-semibold text-pine-900">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.25))}
              className="p-1 hover:text-pine-900 text-ink-soft"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1.0)}
              className="p-1 hover:text-pine-900 text-ink-soft border-l border-border ml-1"
              title="Fit to Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo (Ctrl+Z)"
            className="text-xs"
          >
            <Undo2 className="w-4 h-4 mr-1" />
            Undo
          </Button>

          <Button
            variant={isValidToSend ? 'sign' : 'primary'}
            size="sm"
            disabled={!isValidToSend}
            onClick={handleProceedToSend}
            className="font-bold"
          >
            <Send className="w-4 h-4 mr-1.5" />
            Send for Signature
          </Button>
        </div>
      </div>

      {/* 3-Zone Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Rail: Field Palette (240px) */}
        <div className="w-60 border-r border-border bg-surface flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-border">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint">
              Standard Fields (§6.2)
            </span>
            <p className="text-xs text-ink-soft mt-0.5">
              Click or drag to place on page:
            </p>
          </div>

          <div className="p-3 overflow-y-auto space-y-2 flex-1">
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
                  className="flex items-center gap-2.5 p-2.5 rounded-[6px] border border-border bg-paper hover:bg-surface-raised/80 hover:border-pine-600 transition-all cursor-pointer shadow-warm-sm group"
                >
                  <div className="w-7 h-7 rounded-[4px] bg-white border border-border flex items-center justify-center text-pine-900 group-hover:text-seal-600">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-pine-900 truncate">
                      {f.label}
                    </div>
                  </div>
                  {/* Recipient dot */}
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        recipients.find((r) => r.id === activeRecipientId)?.color || '#1B5E52',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Validation Notice Banner */}
          {unassignedFields.length > 0 && (
            <div className="p-3 bg-danger-bg text-danger border-t border-danger/30 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{unassignedFields.length} unassigned field(s)</span>
            </div>
          )}
        </div>

        {/* Center Zone: Multi-Page Canvas */}
        <div
          className="flex-1 overflow-auto bg-[#E9E4D8] p-8 flex flex-col items-center gap-8 relative"
          onClick={() => setSelectedFieldId(null)}
        >
          {/* Page 1 (Simulated Contract Canvas with A4 Aspect Ratio) */}
          <div
            style={{
              width: `${595 * zoom}px`,
              height: `${842 * zoom}px`,
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
                  page: 0,
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
            {/* Page Header / Content Watermark */}
            <div className="p-8 text-ink select-none pointer-events-none space-y-4 opacity-75">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="font-bold text-xs uppercase tracking-wider text-pine-900">
                  MUTUAL NON-DISCLOSURE AGREEMENT
                </span>
                <span className="text-[10px] font-mono text-ink-faint">Page 1 of 2</span>
              </div>
              <p className="text-[11px] leading-relaxed text-ink-soft">
                This Agreement is entered into under the Laws of the People&apos;s Republic of Bangladesh
                including the Information and Communication Technology (ICT) Act 2006.
              </p>
              <div className="space-y-2 pt-2 text-[10px] text-ink-soft">
                <div className="font-bold text-pine-900">1. Definition of Confidential Information</div>
                <p>
                  &quot;Confidential Information&quot; means all tangible and intangible information whether
                  written, electronic, oral or visual, disclosed by either party...
                </p>
                <div className="font-bold text-pine-900 pt-2">2. Obligations of Non-Disclosure</div>
                <p>
                  The Receiving Party agrees that it will exercise at least the same degree of care as it uses with
                  its own proprietary confidential materials...
                </p>
                <div className="font-bold text-pine-900 pt-2">3. Dispute Resolution & Governing Law</div>
                <p>
                  This agreement shall be governed and construed in accordance with the laws of Bangladesh.
                  Disputes shall be referred to arbitration in Dhaka under the Arbitration Act 2001.
                </p>
              </div>

              {/* Execution Block Area on Document */}
              <div className="pt-24 grid grid-cols-2 gap-8 text-[11px]">
                <div className="space-y-1">
                  <div className="font-bold text-pine-900">For Disclosing Party:</div>
                  <div className="text-ink-faint">Authorized Signatory</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-pine-900">For Receiving Party:</div>
                  <div className="text-ink-faint">Authorized Signatory</div>
                </div>
              </div>
            </div>

            {/* Placed Ratio Fields Overlay */}
            {fields
              .filter((f) => f.page === 0)
              .map((field) => {
                const isSelected = selectedFieldId === field.id;
                const rec = recipients.find((r) => r.id === field.recipientId);
                const recColor = rec?.color || '#B42318';

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
                        ? 'rgba(27, 94, 82, 0.16)'
                        : 'rgba(243, 238, 229, 0.75)',
                    }}
                    className={`absolute border-2 rounded-[4px] flex items-center justify-between px-2 cursor-move transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-pine-500 shadow-warm-md'
                        : 'hover:shadow-warm-sm'
                    } ${!field.recipientId ? 'border-dashed border-danger bg-danger/10' : ''}`}
                  >
                    {/* Field Label & Tag */}
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: recColor }}
                      />
                      <span className="text-[11px] font-bold text-pine-900 truncate">
                        {field.label || field.type}
                      </span>
                    </div>

                    {field.required && (
                      <span className="text-[10px] text-danger font-bold shrink-0">*</span>
                    )}

                    {/* Action pill on selected field */}
                    {isSelected && (
                      <div className="absolute -top-7 right-0 flex items-center gap-1 bg-surface border border-border shadow-warm-sm rounded-[4px] p-0.5 z-30">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateSelectedField();
                          }}
                          className="p-1 hover:text-pine-900 text-ink-soft"
                          title="Duplicate field"
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
                          title="Delete field"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          <div className="text-xs font-mono text-ink-faint pb-4">
            Page 1 of 2 · Standard A4 (595 × 842 pt)
          </div>
        </div>

        {/* Right Rail: Recipients & Settings (300px) */}
        <div className="w-72 border-l border-border bg-surface flex flex-col shrink-0 z-10">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-ink-faint">
              Recipients & Roles (§6.2)
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newRec: RecipientItem = {
                  id: 'rec_' + (recipients.length + 1),
                  name: `Signer ${recipients.length + 1}`,
                  email: `signer${recipients.length + 1}@company.bd`,
                  role: 'SIGNER',
                  order: recipients.length + 1,
                  color: recipients.length === 2 ? '#9A7B2D' : '#1B5E52',
                  colorName: 'Signer ' + (recipients.length + 1),
                };
                setRecipients([...recipients, newRec]);
              }}
              className="text-xs h-7 text-pine-600 hover:text-pine-900"
            >
              <Plus className="w-3.5 h-3.5 mr-0.5" />
              Add
            </Button>
          </div>

          {/* Recipient Cards */}
          <div className="p-3 space-y-2.5 overflow-y-auto flex-1 border-b border-border">
            {recipients.map((r, i) => (
              <div
                key={r.id}
                onClick={() => setActiveRecipientId(r.id)}
                className={`p-3 rounded-[8px] border transition-all cursor-pointer ${
                  activeRecipientId === r.id
                    ? 'border-pine-600 bg-pine-100/40 shadow-warm-sm ring-1 ring-pine-500'
                    : 'border-border bg-paper hover:bg-surface-raised'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="text-xs font-bold text-pine-900">
                      #{r.order} {r.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-ink-faint uppercase">
                    {r.role}
                  </span>
                </div>
                <div className="text-[11px] text-ink-soft truncate">{r.email}</div>
                <div className="mt-2 text-[10px] text-ink-faint flex items-center justify-between">
                  <span>
                    {fields.filter((f) => f.recipientId === r.id).length} field(s) assigned
                  </span>
                  {activeRecipientId === r.id && (
                    <span className="text-pine-600 font-semibold">Active Signer</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Selected Field Inspector */}
          {selectedFieldId && (
            <div className="p-3 border-b border-border bg-surface-raised/40 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-pine-900 font-bold">
                Field Properties
              </span>
              <div className="space-y-1.5 text-xs">
                <label className="text-ink-soft">Assignee:</label>
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
                      {r.name} ({r.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Expiry & Cadence Controls */}
          <div className="p-3 space-y-2 text-xs text-ink-soft">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-pine-900">
                <Clock className="w-3.5 h-3.5 text-pine-600" />
                Expiry:
              </span>
              <span className="font-mono text-xs">14 Days</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Auto-reminders:</span>
              <span className="text-pine-600 font-semibold">T+48h & 24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
