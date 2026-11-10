'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PenTool, Type, Upload, CheckCircle2, RotateCcw, Shield } from 'lucide-react';

export default function ProfileSettingsPage() {
  return (
    <AuthGuard>
      <ProfileSettingsContent />
    </AuthGuard>
  );
}

function ProfileSettingsContent() {

  const { user, workspace } = useAuth();
  const [name, setName] = useState(user?.name || 'Tanvir Ahmed');
  const [email] = useState(user?.email || 'demo@signdesk.bd');
  const [timezone, setTimezone] = useState('Asia/Dhaka');
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState(name);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
      setTypedName(user.name);
    }
  }, [user]);

  // Canvas drawing handlers
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

  const handleAdoptSignature = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        setSavedSignature(canvas.toDataURL('image/png'));
      }
    } else if (activeTab === 'type') {
      // Create off-screen canvas to render script font as PNG
      const offCanvas = document.createElement('canvas');
      offCanvas.width = 400;
      offCanvas.height = 120;
      const ctx = offCanvas.getContext('2d');
      if (ctx) {
        ctx.font = '48px Caveat, cursive';
        ctx.fillStyle = '#0C2E29';
        ctx.fillText(typedName, 20, 75);
        setSavedSignature(offCanvas.toDataURL('image/png'));
      }
    }
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Workspace Account Settings
          </span>
          <h1 className="font-display text-3xl font-bold text-pine-900 mt-1">
            Sender Profile & Signature
          </h1>
        </div>
        <Badge variant="verified">
          Role: {workspace?.role || 'ADMIN'}
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Info Card */}
        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Your name and email appear on envelope invitations and Certificates of Completion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Legal Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setTypedName(e.target.value);
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={email} disabled className="bg-surface-raised opacity-80" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timezone">Default Legal Timezone</Label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="flex h-10 w-full rounded-[4px] border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine-500"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (BST UTC+06:00) — Standard Bangladesh</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT UTC+08:00)</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary">
              Save Profile Details
            </Button>
          </CardFooter>
        </Card>

        {/* Saved Signature Card */}
        <Card className="bg-surface">
          <CardHeader>
            <CardTitle>Saved Signature Asset</CardTitle>
            <CardDescription>
              Create your default digital signature stamp for quick one-click signing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signature Mode Tabs */}
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

            {/* Tab 1: Draw */}
            {activeTab === 'draw' && (
              <div className="space-y-2">
                <div className="border border-border rounded-[8px] bg-white relative overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={380}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-36 cursor-crosshair touch-none"
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
                  Use mouse, stylus, or touchscreen to draw your signature.
                </p>
              </div>
            )}

            {/* Tab 2: Type */}
            {activeTab === 'type' && (
              <div className="space-y-3">
                <Input
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="Type your name"
                />
                <div className="p-4 bg-white border border-border rounded-[8px] text-center min-h-[100px] flex items-center justify-center">
                  <span className="font-signature text-4xl text-pine-900">
                    {typedName || 'Your Signature'}
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: Upload */}
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
                        setSavedSignature(re.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-ink-faint"
                />
              </div>
            )}

            {savedSignature && (
              <div className="p-3 bg-surface-raised rounded border border-border space-y-1">
                <span className="text-[11px] font-semibold text-pine-900">Current Saved Signature:</span>
                <img
                  src={savedSignature}
                  alt="Saved signature"
                  className="max-h-16 mx-auto object-contain"
                />
              </div>
            )}

            {isSavedMessage && (
              <div className="p-2 bg-[#E2F2E8] text-success rounded text-xs flex items-center justify-center gap-1.5 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Signature adopted & saved to profile!
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="sign" onClick={handleAdoptSignature} className="w-full">
              Adopt & Save Signature
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
