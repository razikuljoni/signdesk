'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Key,
  Webhook,
  Plus,
  Copy,
  Check,
  Trash2,
  Send,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileCode,
} from 'lucide-react';

export default function DeveloperSettingsPage() {
  return (
    <AuthGuard>
      <DeveloperSettingsContent />
    </AuthGuard>
  );
}

function DeveloperSettingsContent() {
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'docs'>('keys');

  // API Keys state
  const [keys, setKeys] = useState([
    {
      id: 'key-1',
      name: 'Production ERP Connector',
      prefix: 'sd_live_8f3a...',
      scopes: ['envelopes:read', 'envelopes:write'],
      lastUsed: '10 mins ago',
      createdAt: '10 Nov 2026',
    },
    {
      id: 'key-2',
      name: 'Staging Integration Key',
      prefix: 'sd_test_4b1c...',
      scopes: ['envelopes:read'],
      lastUsed: 'Never',
      createdAt: '10 Nov 2026',
    },
  ]);

  const [createKeyModal, setCreateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyIsTest, setNewKeyIsTest] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Webhooks state
  const [endpoints, setEndpoints] = useState([
    {
      id: 'wh-1',
      url: 'https://api.apex-commerce.bd/webhooks/signdesk',
      events: ['envelope.completed', 'envelope.declined'],
      status: 'active',
      secret: 'whsec_a8b9c0d1e2f3a4b5c6d7e8f9',
      deliveriesCount: 48,
    },
  ]);

  const [addWebhookModal, setAddWebhookModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'envelope.completed',
    'envelope.signed',
  ]);
  const [testSent, setTestSent] = useState(false);

  const ALL_EVENTS = [
    'envelope.sent',
    'envelope.viewed',
    'envelope.signed',
    'envelope.completed',
    'envelope.declined',
    'envelope.expired',
    'envelope.voided',
  ];

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const secretPart = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const prefix = newKeyIsTest ? 'sd_test_' : 'sd_live_';
    const fullKey = `${prefix}${secretPart}`;

    setGeneratedKey(fullKey);
    setKeys([
      {
        id: 'key-' + Date.now(),
        name: newKeyName,
        prefix: `${prefix}${secretPart.slice(0, 4)}...`,
        scopes: ['envelopes:read', 'envelopes:write'],
        lastUsed: 'Just now',
        createdAt: 'Just now',
      },
      ...keys,
    ]);
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Are you sure you want to revoke this API Key? Any external applications using this key will immediately lose access.')) {
      setKeys(keys.filter((k) => k.id !== id));
    }
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl) return;

    const newEndpoint = {
      id: 'wh-' + Date.now(),
      url: webhookUrl,
      events: selectedEvents,
      status: 'active',
      secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
      deliveriesCount: 0,
    };

    setEndpoints([...endpoints, newEndpoint]);
    setWebhookUrl('');
    setAddWebhookModal(false);
  };

  const handleTestPing = (url: string) => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="border-b border-border pb-6 space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-pine-900">
            Developer APIs & Webhooks
          </h1>
          <span className="text-xs font-mono font-bold bg-pine-100 text-pine-900 px-2.5 py-0.5 rounded border border-pine-500/20">
            REST v1
          </span>
        </div>
        <p className="text-sm text-ink-soft">
          Integrate SignDesk electronic signing into your ERP, CRM, or custom application with HMAC-signed webhooks.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border text-sm font-semibold">
        <button
          onClick={() => setActiveTab('keys')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'keys'
              ? 'border-pine-900 text-pine-900'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          <Key className="w-4 h-4" />
          API Keys
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'webhooks'
              ? 'border-pine-900 text-pine-900'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          <Webhook className="w-4 h-4" />
          Webhooks & Events
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'docs'
              ? 'border-pine-900 text-pine-900'
              : 'border-transparent text-ink-soft hover:text-ink'
          }`}
        >
          <FileCode className="w-4 h-4" />
          API Reference
        </button>
      </div>

      {/* Tab 1: API Keys */}
      {activeTab === 'keys' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-pine-900">Secret API Keys</h2>
              <p className="text-xs text-ink-soft">
                Authenticate server-side requests using Bearer authentication. Rate-limited to 100 requests/minute.
              </p>
            </div>
            <Button
              variant="primary"
              size="default"
              onClick={() => {
                setGeneratedKey(null);
                setNewKeyName('');
                setCreateKeyModal(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Secret Key
            </Button>
          </div>

          <Card className="bg-surface overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-raised border-b border-border text-ink-faint font-semibold">
                  <tr>
                    <th className="px-6 py-3">Key Name</th>
                    <th className="px-6 py-3">Key Prefix</th>
                    <th className="px-6 py-3">Scopes</th>
                    <th className="px-6 py-3">Last Used</th>
                    <th className="px-6 py-3 text-right">Revoke</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {keys.map((k) => (
                    <tr key={k.id} className="hover:bg-paper/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-pine-900">{k.name}</td>
                      <td className="px-6 py-4 font-mono text-[11px] text-ink-soft">{k.prefix}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {k.scopes.map((s) => (
                            <span key={s} className="bg-paper px-2 py-0.5 rounded border border-border text-[10px] font-mono text-ink-soft">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-ink-faint">{k.lastUsed}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="text-ink-faint hover:text-danger p-1 rounded transition-colors"
                          title="Revoke Key"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Webhooks */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-pine-900">Configured Webhook Endpoints</h2>
              <p className="text-xs text-ink-soft">
                Receive real-time notifications when documents are viewed, signed, completed, or declined.
              </p>
            </div>
            <Button variant="primary" size="default" onClick={() => setAddWebhookModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Endpoint
            </Button>
          </div>

          {testSent && (
            <div className="p-3 bg-[#E2F2E8] border border-success/30 text-success rounded-lg text-xs flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4" />
              Test webhook event (envelope.completed) dispatched with valid HMAC-SHA256 signature.
            </div>
          )}

          <div className="space-y-4">
            {endpoints.map((ep) => (
              <Card key={ep.id} className="bg-surface p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-pine-900 break-all">
                    <Webhook className="w-4 h-4 text-pine-600 shrink-0" />
                    {ep.url}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => handleTestPing(ep.url)}>
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Test Ping
                    </Button>
                    <button
                      onClick={() => setEndpoints(endpoints.filter((e) => e.id !== ep.id))}
                      className="text-ink-faint hover:text-danger p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-ink-faint font-semibold">Subscribed Events:</span>
                    {ep.events.map((ev) => (
                      <span key={ev} className="bg-paper border border-border px-2 py-0.5 rounded font-mono text-[10px] text-pine-900">
                        {ev}
                      </span>
                    ))}
                  </div>
                  <div className="font-mono text-[11px] text-ink-faint">
                    Secret: <code className="bg-paper px-1.5 py-0.5 rounded border border-border">{ep.secret.slice(0, 10)}...</code>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Webhook Security Spec Card */}
          <Card className="bg-surface-raised border border-border p-5 space-y-2 text-xs text-ink-soft">
            <div className="font-bold text-pine-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pine-600" />
              Cryptographic Signature Specification
            </div>
            <p className="leading-relaxed">
              Every webhook delivery includes the <code>X-SignDesk-Signature</code> header containing timestamp and HMAC-SHA256 signature.
              Tolerance is enforced at 5 minutes (300 seconds) to guarantee replay prevention.
            </p>
            <div className="font-mono text-[11px] bg-paper p-2.5 rounded border border-border">
              X-SignDesk-Signature: t=1762788000,v1=9f82d1c9e830a7b512c4...
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: API Docs */}
      {activeTab === 'docs' && (
        <Card className="bg-surface p-6 space-y-6">
          <div className="space-y-1">
            <CardTitle className="text-lg">REST API v1 Documentation</CardTitle>
            <CardDescription className="text-xs">
              Programmatically create drafts, assign fields, send envelopes, and download completed PDFs.
            </CardDescription>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-paper rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-pine-900">
                <span className="bg-pine-900 text-paper px-2 py-0.5 rounded text-xs font-mono">POST</span>
                /v1/envelopes
              </div>
              <p className="text-ink-soft">Creates a draft envelope or instantiates from an existing template.</p>
              <div className="font-mono text-[11px] bg-surface p-3 rounded border border-border text-ink">
                {`curl -X POST https://api.signdesk.bd/v1/envelopes \\
  -H "Authorization: Bearer sd_live_..." \\
  -H "Idempotency-Key: e82f-41a9-b341" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Commercial NDA", "recipients": [{"name": "Rahim", "email": "rahim@bd.com"}]}'`}
              </div>
            </div>

            <div className="p-4 bg-paper rounded-lg border border-border space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-pine-900">
                <span className="bg-pine-700 text-paper px-2 py-0.5 rounded text-xs font-mono">GET</span>
                /v1/envelopes/{`{id}`}/verify
              </div>
              <p className="text-ink-soft">Verifies cryptographic SHA-256 Merkle chain integrity of the stored document.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Create Key Modal */}
      {createKeyModal && (
        <div className="fixed inset-0 z-50 bg-pine-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-surface p-6 space-y-4">
            {!generatedKey ? (
              <>
                <div className="font-display font-bold text-xl text-pine-900 border-b border-border pb-3">
                  Generate Secret API Key
                </div>
                <form onSubmit={handleCreateKey} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="keyName">Key Description / Name</Label>
                    <Input
                      id="keyName"
                      required
                      placeholder="e.g. ERP Invoicing Service"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isTest"
                      checked={newKeyIsTest}
                      onChange={(e) => setNewKeyIsTest(e.target.checked)}
                      className="accent-pine-900"
                    />
                    <label htmlFor="isTest" className="text-ink-soft cursor-pointer">
                      Create as Sandbox / Test Key (<code>sd_test_...</code>)
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <Button type="button" variant="outline" size="sm" onClick={() => setCreateKeyModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm">
                      Generate Key
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-2 text-pine-900 font-bold text-base border-b border-border pb-3">
                  <ShieldCheck className="w-5 h-5 text-pine-700" />
                  API Key Created
                </div>

                <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded space-y-1 text-xs">
                  <strong>Save this key immediately!</strong>
                  <p>For security, we will never display this secret again.</p>
                </div>

                <div className="space-y-1">
                  <Label>Secret API Key:</Label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={generatedKey}
                      className="w-full p-2 font-mono text-[11px] bg-paper border border-border rounded text-ink select-all"
                    />
                    <Button variant="outline" size="sm" onClick={handleCopyKey} className="shrink-0">
                      {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="sm" onClick={() => setCreateKeyModal(false)}>
                    Done
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Add Webhook Modal */}
      {addWebhookModal && (
        <div className="fixed inset-0 z-50 bg-pine-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-surface p-6 space-y-4">
            <div className="font-display font-bold text-xl text-pine-900 border-b border-border pb-3">
              Register Webhook Endpoint
            </div>

            <form onSubmit={handleAddWebhook} className="space-y-4 text-xs">
              <div className="space-y-1">
                <Label htmlFor="endpointUrl">Endpoint Destination URL</Label>
                <Input
                  id="endpointUrl"
                  type="url"
                  required
                  placeholder="https://api.yourdomain.com/webhooks"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Events to Subscribe ({selectedEvents.length}):</Label>
                <div className="space-y-1 max-h-40 overflow-y-auto p-2 bg-paper rounded border border-border">
                  {ALL_EVENTS.map((ev) => (
                    <label key={ev} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-surface rounded">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(ev)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, ev]);
                          } else {
                            setSelectedEvents(selectedEvents.filter((x) => x !== ev));
                          }
                        }}
                        className="accent-pine-900"
                      />
                      <span className="font-mono text-[11px] text-ink">{ev}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setAddWebhookModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Register Webhook
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
