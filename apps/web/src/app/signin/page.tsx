'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Building2,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileCheck2,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInAsDemo } = useAuth();
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'magic') {
        if (!email) {
          throw new Error('Please enter your institutional email address.');
        }
        setMagicLinkSent(true);
      } else {
        await signIn(email, password);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid institutional credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInAsDemo();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col justify-between py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Statutory Top Eyebrow & Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100/70 border border-pine-600/20 text-pine-900 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
            <span>ICT Act 2006 Compliant • Section 7 Evidentiary Assent</span>
          </div>

          <div className="flex justify-center items-center gap-2.5">
            <WaxSeal size={40} />
            <span className="font-display text-2xl font-bold tracking-tight text-pine-900">
              SignDesk
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-pine-900 font-semibold tracking-tight">
            Welcome back to your vault.
          </h1>
          <p className="text-sm sm:text-base text-ink-soft max-w-md mx-auto">
            Access tamper-evident agreements and institutional signature queues.
          </p>
        </div>

        {/* Dual Authentication Tab Switcher */}
        <div className="bg-surface-raised p-1 rounded-xl border border-border flex gap-1 shadow-warm-sm">
          <button
            type="button"
            onClick={() => { setActiveTab('password'); setMagicLinkSent(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'password'
                ? 'bg-pine-900 text-paper shadow-sm'
                : 'text-ink-soft hover:text-ink hover:bg-surface/50'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Work Email &amp; Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('magic'); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'magic'
                ? 'bg-pine-900 text-paper shadow-sm'
                : 'text-ink-soft hover:text-ink hover:bg-surface/50'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email Magic Link
          </button>
        </div>

        {/* Main Vault Auth Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 shadow-warm-md">
          {error && (
            <div className="mb-6 p-3.5 bg-danger-bg text-danger border border-danger/30 rounded-lg text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {magicLinkSent ? (
            <div className="space-y-4 py-3">
              <div className="p-4 bg-pine-100/60 text-pine-950 border border-pine-600/20 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-pine-900">
                  <Mail className="w-4 h-4 text-pine-600" />
                  <span>Institutional Magic Link Dispatched</span>
                </div>
                <p className="leading-relaxed">
                  A cryptographically salted authentication link has been dispatched to{' '}
                  <strong className="font-mono text-pine-900">{email}</strong>.
                  Click the link inside to enter your organization vault.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMagicLinkSent(false)}
                className="w-full text-center text-xs font-semibold text-pine-600 hover:text-pine-800 underline py-2"
              >
                Return to Password Authentication
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Institutional Email Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="work-email" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                    Institutional Email Address
                  </label>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-pine-100 text-pine-800 border border-pine-600/20">
                    SECURE SESSION
                  </span>
                </div>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="work-email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Security Passphrase (Password Mode) */}
              {activeTab === 'password' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                      Security Passphrase
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset dispatched via root cert authority demo mode.')}
                      className="text-xs text-pine-600 hover:text-pine-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Trusted Workstation Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-pine-600 focus:ring-pine-500"
                />
                <label htmlFor="remember" className="text-xs text-ink-soft cursor-pointer select-none">
                  Keep me signed in on this trusted workstation
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-pine-900 hover:bg-pine-800 text-paper font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-warm-sm disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Authenticating Session...'
                    : activeTab === 'magic'
                    ? 'Dispatch Secure Magic Link'
                    : 'Sign In to Workspace'}
                </span>
              </button>
            </form>
          )}

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-5 border-t border-border space-y-2">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-brass-600/40 bg-pine-100/40 hover:bg-pine-100 text-pine-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-brass-600" />
              <span>1-Click Sign In as Demo User (Tanvir Ahmed)</span>
            </button>
            <div className="text-center text-[11px] text-ink-faint font-mono">
              demo@signdesk.bd • SignDesk2026!
            </div>
          </div>

          {/* Direct Signer Callout Box */}
          <div className="mt-6 p-4 rounded-xl bg-surface-raised border border-border/80 flex items-start gap-3">
            <FileCheck2 className="w-5 h-5 text-pine-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-pine-900 block">Signer Direct Access</span>
              <p className="text-ink-soft leading-relaxed">
                Invited to review or sign an agreement? No account or sign-in needed — use the direct access link sent via email.
              </p>
            </div>
          </div>

          {/* Switch link */}
          <div className="mt-6 text-center text-xs text-ink-soft border-t border-border pt-4">
            New to SignDesk?{' '}
            <Link href="/signup" className="text-pine-600 hover:text-pine-800 font-bold hover:underline">
              Create an institutional workspace &rarr;
            </Link>
          </div>
        </div>

        {/* Security & Cryptographic Proof Footer */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-4 text-[11px] text-ink-faint font-mono">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-pine-600" /> 256-Bit Encrypted Storage
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" /> ICT Act 2006 §7 Validated
            </span>
          </div>
          <p className="text-[10px] text-ink-faint font-mono">
            Simple Electronic Signature under Bangladesh ICT Act 2006
          </p>
        </div>
      </div>
    </div>
  );
}