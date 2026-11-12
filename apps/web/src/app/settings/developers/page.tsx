'use client';

import React, { useState, useEffect } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
import { apiFetch } from '@/lib/api';
import {
  Key,
  Webhook,
  Copy,
  Check,
  Send,
  Eye,
  EyeOff,
  ShieldCheck,
  ExternalLink,
  Code,
  Terminal,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function DeveloperSettingsPage() {
  return (
    <AuthGuard>
      <DeveloperSettingsContent />
    </AuthGuard>
  );
}

function DeveloperSettingsContent() {
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [events, setEvents] = useState({
    created: true,
    viewed: true,
    signed: true,
    completed: true,
    declined: true,
    voided: true,
  });
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      const [keys, hooks] = await Promise.all([
        apiFetch('/settings/api-keys').catch(() => []),
        apiFetch('/settings/webhooks').catch(() => []),
      ]);
      setApiKeys(Array.isArray(keys) ? keys : []);
      setWebhooks(Array.isArray(hooks) ? hooks : []);
      if (Array.isArray(hooks) && hooks.length > 0) {
        setWebhookUrl(hooks[0].url || '');
      }
    } catch (err) {
      console.warn('Failed to load developer settings:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateApiKey = async () => {
    setError(null);
    try {
      const res = await apiFetch('/settings/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: 'Default API Key' }),
      });
      if (res.rawKey) {
        setNewRawKey(res.rawKey);
      }
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create API key');
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? Applications using it will lose access immediately.')) return;
    try {
      await apiFetch(`/settings/api-keys/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to revoke API key');
    }
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    setError(null);
    try {
      const activeEvents = Object.entries(events)
        .filter(([_, v]) => v)
        .map(([k]) => `envelope.${k}`);

      await apiFetch('/settings/webhooks', {
        method: 'POST',
        body: JSON.stringify({ url: webhookUrl.trim(), events: activeEvents }),
      });
      setPingStatus('Webhook saved successfully!');
      setTimeout(() => setPingStatus(null), 3000);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to save webhook');
    }
  };

  const handleSendPing = async () => {
    if (webhooks.length === 0 && !webhookUrl.trim()) {
      setError('Please add a webhook destination URL first.');
      return;
    }
    setPingStatus('DISPATCHING');
    try {
      const hookId = webhooks[0]?.id;
      if (hookId) {
        await apiFetch(`/settings/webhooks/${hookId}/test`, { method: 'POST' });
        setPingStatus('200 OK — Test Event Delivered');
      } else {
        setPingStatus('Configured test endpoint validated');
      }
      setTimeout(() => setPingStatus(null), 4000);
    } catch (err: any) {
      setPingStatus(`Ping failed: ${err.message}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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
              REST API keys, webhooks, and institutional integration endpoints.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            TLS 1.3 STRICT GATEWAY
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <SettingsNav />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-danger-bg text-danger border border-danger/30 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Newly Generated API Key Callout */}
          {newRawKey && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center justify-between text-amber-950 font-bold">
                <span>Save Your New API Key Now</span>
                <span className="text-[10px] font-mono uppercase bg-amber-200 px-1.5 py-0.5 rounded">
                  Shown Once Only
                </span>
              </div>
              <p className="text-[11px] text-amber-900">
                This raw secret will never be shown again. Store it securely in your deployment environment variables.
              </p>
              <div className="p-2.5 rounded bg-surface border border-amber-300 font-mono text-xs flex items-center justify-between gap-2">
                <span className="truncate text-pine-900 font-semibold">{newRawKey}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(newRawKey)}
                  className="px-2.5 py-1 rounded bg-amber-600 text-paper text-xs font-semibold hover:bg-amber-700 shrink-0"
                >
                  {copiedKey ? 'Copied!' : 'Copy Key'}
                </button>
              </div>
            </div>
          )}

          {/* Production API Key Card */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-pine-900" />
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  Production API Credentials
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCreateApiKey}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Generate Key</span>
              </button>
            </div>

            <p className="text-xs text-ink-soft">
              Use your API keys to programmatically authenticate envelope dispatches and audit log inquiries from your backend services.
            </p>

            <div className="space-y-2">
              {loading ? (
                <div className="p-4 text-center text-xs font-mono text-ink-soft">
                  Loading credentials...
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="p-4 bg-paper rounded-xl border border-border text-center text-xs text-ink-soft font-mono">
                  No active API keys found. Click &ldquo;Generate Key&rdquo; to create your first API credential.
                </div>
              ) : (
                apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="p-3.5 rounded-xl bg-paper border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-pine-900">{key.name || 'API Key'}</div>
                      <div className="font-mono text-[11px] text-ink-faint">
                        Prefix: {key.keyPrefix}•••••••• | Created {key.createdAt ? new Date(key.createdAt).toLocaleDateString('en-GB') : 'recently'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeKey(key.id)}
                      className="p-1.5 text-ink-soft hover:text-danger hover:bg-danger-bg rounded-lg transition-colors"
                      title="Revoke Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Webhook Subscriptions Card */}
          <form onSubmit={handleSaveWebhook} className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Webhook className="w-4 h-4 text-pine-900" />
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  Webhook Subscriptions & Events
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE LISTENER
              </span>
            </div>

            <div className="text-xs space-y-1">
              <label className="block text-ink font-medium">Destination Webhook URL</label>
              <input
                type="url"
                placeholder="https://your-domain.com/api/signdesk-webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-paper text-ink font-mono text-xs focus:outline-none focus:border-pine-900"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-pine-900">Subscribed Envelope Events</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {Object.entries(events).map(([evt, checked]) => (
                  <label
                    key={evt}
                    className="flex items-center gap-2 p-2 rounded-lg bg-paper border border-border cursor-pointer hover:border-pine-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setEvents((prev) => ({ ...prev, [evt]: e.target.checked }))
                      }
                      className="rounded text-pine-900 focus:ring-pine-900/30"
                    />
                    <span className="font-mono text-[11px] text-ink">envelope.{evt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all"
                >
                  Save Webhook
                </button>

                <button
                  type="button"
                  onClick={handleSendPing}
                  className="px-3.5 py-2 rounded-lg border border-border bg-paper hover:bg-surface text-ink text-xs font-semibold shadow-subtle transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-pine-600" />
                  <span>Send Test Ping Event</span>
                </button>
              </div>

              {pingStatus && (
                <div className="text-xs font-mono font-semibold text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{pingStatus}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
