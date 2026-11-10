'use client';

import React, { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  PenTool,
  Type,
  Upload,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function SignCanvasPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const isRahim = token.includes('rahim');
  const signerName = isRahim ? 'Rahim Chowdhury' : 'Karimul Islam';
  const roleName = isRahim ? 'Receiving Party Signatory' : 'Disclosing Party Signatory';

  // Signature Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState(signerName);
  const [adoptedSignature, setAdoptedSignature] = useState<string | null>(null);
  const [dateSigned, setDateSigned] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drawing Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0C2E29'; // Deep pine ink
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleAdopt = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        setAdoptedSignature(canvas.toDataURL('image/png'));
      }
    } else if (activeTab === 'type') {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 400;
      offCanvas.height = 120;
      const ctx = offCanvas.getContext('2d');
      if (ctx) {
        ctx.font = '52px Caveat, cursive';
        ctx.fillStyle = '#0C2E29';
        ctx.fillText(typedName || signerName, 20, 75);
        setAdoptedSignature(offCanvas.toDataURL('image/png'));
      }
    }
    setModalOpen(false);
  };

  const handleFinishAndSeal = () => {
    if (!adoptedSignature) {
      setModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    // Mark progress in localStorage for demo
    const envelopes = JSON.parse(localStorage.getItem('signdesk_envelopes') || '[]');
    if (envelopes.length > 0) {
      if (isRahim) {
        envelopes[0].status = 'in_progress';
      } else {
        envelopes[0].status = 'completed';
        envelopes[0].completedAt = new Date().toISOString();
      }
      localStorage.setItem('signdesk_envelopes', JSON.stringify(envelopes));
    }

    setTimeout(() => {
      router.push(`/sign/${token}/done`);
    }, 600);
  };

  const remainingFields = adoptedSignature ? 0 : 1;

  return (
    <div className="min-h-screen bg-[#E9E4D8] flex flex-col justify-between select-none">
      {/* Sticky Top Guided Bar */}
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border px-4 py-3 shadow-warm-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-wider text-pine-900 font-bold bg-pine-100 px-2.5 py-1 rounded">
              {remainingFields === 0 ? 'All Fields Filled' : '1 of 2 Fields Remaining'}
            </span>
            <span className="text-xs text-ink-soft hidden sm:inline">
              Signer: <strong>{signerName}</strong> ({roleName})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!adoptedSignature ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(true)}
                className="text-xs font-bold"
              >
                <PenTool className="w-3.5 h-3.5 mr-1" />
                Fill Signature Field
              </Button>
            ) : (
              <Button
                variant="sign"
                size="sm"
                onClick={handleFinishAndSeal}
                disabled={isSubmitting}
                className="text-xs font-bold px-5"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isSubmitting ? 'Sealing...' : 'Sign & Finish'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Center PDF Contract Surface */}
      <div className="p-4 sm:p-8 flex justify-center flex-1 items-center">
        <div className="w-full max-w-2xl bg-white shadow-warm-lg p-8 sm:p-14 text-ink text-xs space-y-6 rounded-[2px] border border-border relative">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div className="font-bold text-sm text-pine-900 uppercase tracking-wider">
              MUTUAL NON-DISCLOSURE AGREEMENT
            </div>
            <span className="text-[10px] font-mono text-ink-faint">Page 1 of 2</span>
          </div>

          <p className="leading-relaxed text-ink-soft">
            This Non-Disclosure Agreement is executed under the Bangladesh ICT Act 2006.
            Each party agrees that all confidential commercial data shall be held in strict confidence.
          </p>

          <div className="space-y-2 pt-2 text-[11px] text-ink-soft">
            <div className="font-bold text-pine-900">1. Scope of Reciprocal Disclosure</div>
            <p>
              The parties acknowledge that confidential discussions regarding logistics distribution networks
              will involve exchange of technical architecture, financial terms, and customer records.
            </p>
            <div className="font-bold text-pine-900 pt-2">2. Term & Injunctive Relief</div>
            <p>
              This Agreement shall remain in effect for two (2) years. The parties acknowledge monetary damages
              alone may be inadequate and consent to equitable injunctive remedies in Bangladesh courts.
            </p>
          </div>

          {/* Placed Interactive Execution Block */}
          <div className="pt-20 border-t border-border grid grid-cols-2 gap-6">
            {/* Signer 1 (Rahim / User) */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-pine-900">Authorized Signature:</div>

              {/* Signature Field Container */}
              <div
                onClick={() => setModalOpen(true)}
                className={`h-20 rounded-[4px] border-2 border-dashed flex flex-col items-center justify-center p-2 cursor-pointer transition-all ${
                  adoptedSignature
                    ? 'border-pine-600 bg-pine-100/20'
                    : 'border-seal-600 bg-seal-100/30 hover:bg-seal-100/60 ring-2 ring-seal-600/30'
                }`}
              >
                {adoptedSignature ? (
                  <img
                    src={adoptedSignature}
                    alt="Adopted signature"
                    className="max-h-14 object-contain"
                  />
                ) : (
                  <div className="text-center space-y-0.5">
                    <PenTool className="w-5 h-5 text-seal-600 mx-auto" />
                    <span className="text-xs font-bold text-seal-600 block">Click to Sign</span>
                    <span className="text-[10px] text-ink-faint">Required field</span>
                  </div>
                )}
              </div>

              {/* Date Field Container */}
              <div className="space-y-1">
                <span className="text-[10px] text-ink-faint block">Date Signed:</span>
                <div className="h-8 px-2 border border-border rounded bg-surface flex items-center gap-1.5 text-xs font-mono text-pine-900">
                  <Calendar className="w-3.5 h-3.5 text-pine-600" />
                  <span>{dateSigned}</span>
                </div>
              </div>
            </div>

            {/* Signer 2 (Karimul / Peer) */}
            <div className="space-y-3 opacity-60">
              <div className="text-[11px] font-bold text-pine-900">Counterpart Signature:</div>
              <div className="h-20 rounded-[4px] border border-dashed border-border bg-surface-raised flex items-center justify-center text-center p-2 text-ink-faint">
                <span className="text-xs">Karimul Islam (Pending Turn)</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-ink-faint block">Date Signed:</span>
                <div className="h-8 px-2 border border-border rounded bg-surface flex items-center text-xs text-ink-faint">
                  Pending execution
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile (§6.3) */}
      <div className="sticky bottom-0 z-40 bg-surface border-t border-border p-3 sm:hidden shadow-warm-md flex items-center justify-between">
        <span className="text-xs font-semibold text-pine-900">
          {adoptedSignature ? 'Ready to Seal' : '1 Field Left'}
        </span>
        <Button
          variant="sign"
          size="sm"
          onClick={handleFinishAndSeal}
          className="font-bold"
        >
          {adoptedSignature ? 'Sign & Finish' : 'Sign Now'}
        </Button>
      </div>

      {/* Signature Adoption Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-pine-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-surface p-6 space-y-4 shadow-warm-lg">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-pine-600" />
                <CardTitle className="text-xl">Adopt Your Signature</CardTitle>
              </div>
              <Badge variant="waiting">
                {signerName}
              </Badge>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border text-sm">
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'draw'
                    ? 'border-pine-900 text-pine-900'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                <PenTool className="w-4 h-4" />
                Draw
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('type')}
                className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'type'
                    ? 'border-pine-900 text-pine-900'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                <Type className="w-4 h-4" />
                Type
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-pine-900 text-pine-900'
                    : 'border-transparent text-ink-soft hover:text-ink'
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>

            {/* Draw Tab */}
            {activeTab === 'draw' && (
              <div className="space-y-2">
                <div className="border border-border rounded-[8px] bg-white relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={450}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 cursor-crosshair touch-none"
                  />
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="absolute top-2 right-2 text-xs font-semibold text-ink-faint hover:text-danger bg-surface/80 p-1.5 rounded flex items-center gap-1 shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
                <p className="text-[11px] text-ink-faint text-center">
                  Draw your signature inside the box using stylus, touch, or mouse.
                </p>
              </div>
            )}

            {/* Type Tab */}
            {activeTab === 'type' && (
              <div className="space-y-3">
                <input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full h-10 px-3 border border-border rounded text-sm bg-surface"
                />
                <div className="p-4 bg-white border border-border rounded-[8px] text-center min-h-[110px] flex items-center justify-center">
                  <span className="font-signature text-5xl text-pine-900">
                    {typedName || signerName}
                  </span>
                </div>
                <p className="text-[11px] text-ink-faint text-center">
                  Rendered in cursive script font (Caveat).
                </p>
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="border-2 border-dashed border-border rounded-[8px] p-6 text-center space-y-2 bg-surface-raised">
                <Upload className="w-6 h-6 text-ink-soft mx-auto" />
                <p className="text-xs text-ink-soft">
                  Upload an image of your signature (PNG or JPG, max 2MB).
                </p>
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (re) => {
                        setAdoptedSignature(re.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-ink-faint"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="sign" size="sm" onClick={handleAdopt} className="font-bold">
                Adopt & Place Signature
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
