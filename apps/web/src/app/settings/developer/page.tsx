'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/auth-guard';
import { SettingsNav } from '@/components/settings/settings-nav';
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
} from 'lucide-react';

export default function DeveloperSettingsPage() {
  return (
    <AuthGuard>
      <DeveloperSettingsContent />
    </AuthGuard>
  );
}

function DeveloperSettingsContent() {
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.rahimtraders.com/v1/sign-events');
  const [events, setEvents] = useState({
    created: true,
    viewed: true,
    signed: true,
    completed: true,
    declined: true,
    voided: true,
  });
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const fullApiKey = 'sd_live_89f2a0391cb48924bd90123910c2849bc';
  const maskedKey = 'sd_live_89f2a0••••••••••••••••••••49bc';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(fullApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSendPing = () => {
    setPingStatus('SENDING');
    setTimeout(() => {
      setPingStatus('200 OK - HMAC SHA-256 Validated');
    }, 600);
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
              REST API keys, webhooks, and ERP integration endpoints.
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
          {/* Production API Key Card */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-pine-900" />
                <h3 className="font-serif font-bold text-sm text-pine-900">
                  Production API Credentials
                </h3>
              </div>
              <span className="text-[11px] font-mono text-ink-faint">
                Environment: Production (Dhaka Gateway Node)
              </span>
            </div>

            <p className="text-xs text-ink-soft">
              Use this bearer secret key to authenticate programmatic envelope dispatch and audit ledger downloads from your backend ERP.
            </p>

            <div className="p-3.5 rounded-xl bg-paper border border-border flex items-center justify-between gap-3 text-xs">
              <div className="font-mono text-xs text-pine-900 truncate">
                {apiKeyRevealed ? fullApiKey : maskedKey}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
                  className="p-1.5 rounded-lg border border-border bg-surface text-ink-soft hover:text-pine-900"
                  title="Toggle Reveal"
                >
                  {apiKeyRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-paper text-pine-900 font-semibold text-xs flex items-center gap-1 shadow-subtle"
                >
                  {copiedKey ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Webhook Subscriptions Card */}
          <div className="bg-surface rounded-xl border border-border p-6 shadow-subtle space-y-4">
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

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleSendPing}
                className="px-4 py-2 rounded-lg bg-pine-900 hover:bg-pine-800 text-paper text-xs font-semibold shadow-warm transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-brass" />
                <span>Send Test Ping Event</span>
              </button>

              {pingStatus && (
                <div className="text-xs font-mono font-semibold text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{pingStatus}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
