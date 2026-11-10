'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { WaxSeal } from '@/components/ui/wax-seal';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  AlertCircle,
  Key,
  ShieldAlert,
  Server,
  Fingerprint,
  Award,
  CreditCard
} from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [legalName, setLegalName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [entityName, setEntityName] = useState('');
  const [orgType, setOrgType] = useState('Private Limited Company (RJSC Registered)');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statutoryConsent, setStatutoryConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registeredFolio, setRegisteredFolio] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!statutoryConsent) {
      setError('You must consent to electronic records assent under Section 7 of the Bangladesh ICT Act 2006.');
      return;
    }

    if (password.length < 8) {
      setError('Digital vault password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signUp(legalName, workEmail, password, entityName);
      setRegisteredFolio(`REG-BD-${Date.now().toString(36).toUpperCase()}`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Workspace initialization failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statutory Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <WaxSeal size={36} />
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-pine-900">
                SignDesk
              </span>
              <span className="block text-[11px] text-ink-soft">
                Institutional Sovereign Workspace Provisioning
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-100 text-pine-900 border border-pine-600/20 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5 text-pine-600" />
            <span>ICT Act 2006 Compliant • Section 6 &amp; 7 Evidentiary Enclave</span>
          </div>
        </div>

        {/* Desktop Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Authority & Evidentiary Proof (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Authority Header Card */}
            <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-warm-sm space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-pine-600 tracking-wider uppercase">
                <Landmark className="w-4 h-4" />
                <span>Statutory Authority</span>
              </div>
              <h3 className="font-display text-2xl text-pine-900 font-semibold leading-tight">
                Recognized by the Laws of Bangladesh
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Signatures affixed via SignDesk bear full evidentiary status pursuant to Section 6 and Section 7 of the ICT Act 2006, admitted without objection across civil and commercial tribunals.
              </p>

              {/* Cryptographic Enclave Card */}
              <div className="bg-paper rounded-xl p-4 border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-pine-950 uppercase tracking-wider text-[11px]">
                    PKI Vault Enclave
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-ink-soft">
                    SHA-256
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-ink-soft">
                    RSA-4096
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-ink-soft">
                    ECDSA Seal
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Testimonial Card */}
            <div className="bg-surface-raised rounded-2xl border border-border p-6 shadow-warm-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pine-900 text-paper font-display font-bold flex items-center justify-center text-sm shadow-sm">
                  AR
                </div>
                <div>
                  <h4 className="font-bold text-sm text-pine-900">Ayesha Rahman</h4>
                  <p className="text-xs text-ink-soft">Managing Director, Rahim Textiles Ltd.</p>
                </div>
              </div>
              <p className="font-display italic text-sm text-pine-900 leading-relaxed">
                &ldquo;Transitioned 450+ cross-border buying house master supply contracts into immutable digital deeds within days.&rdquo;
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-pine-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Commercial Account • Dhaka EPZ</span>
              </div>
            </div>

            {/* Institutional Infrastructure Specifications */}
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-warm-sm space-y-3">
              <h4 className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                Institutional Infrastructure
              </h4>
              <ul className="space-y-2.5 text-xs text-ink-soft">
                <li className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-pine-600 shrink-0" />
                  <span>256-Bit HSM Hardware Token Signing</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-pine-600 shrink-0" />
                  <span>Data Residency: Tier-III Dhaka Data Center</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Fingerprint className="w-4 h-4 text-pine-600 shrink-0" />
                  <span>Porichoy / NID Instant API Verification Ready</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-pine-600 shrink-0" />
                  <span>ISO/IEC 27001 Certified Security Protocol</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-border flex items-center gap-2 text-xs font-bold text-brass-600">
                <Sparkles className="w-4 h-4" />
                <span>Complimentary Tier • 5 Envelopes / Month Included</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Workspace Creation Form (7 cols) */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 sm:p-8 lg:p-9 shadow-warm-md space-y-6">
            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-pine-900 tracking-tight">
                Establish Your Sovereign Workspace.
              </h1>
              <p className="text-sm text-ink-soft">
                Start executing legally binding digital agreements under Bangladesh ICT Act 2006. Tailored for corporate, export, and legal chambers.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-danger-bg text-danger border border-danger/30 rounded-lg text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {registeredFolio ? (
              <div className="p-6 bg-pine-100/60 border border-pine-600/30 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-pine-900 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-pine-600" />
                  <span>Sovereign Folio Issued</span>
                </div>
                <p className="text-xs text-pine-950 leading-relaxed">
                  Workspace created successfully. Your institutional workspace folio has been generated:
                </p>
                <div className="p-3 bg-surface rounded-lg border border-border font-mono text-sm font-bold text-pine-900 flex justify-between items-center">
                  <span>{registeredFolio}</span>
                  <span className="text-[10px] text-pine-600 uppercase font-sans font-semibold">Dhaka Enclave</span>
                </div>
                <p className="text-[11px] text-ink-soft font-mono">
                  Redirecting to sovereign dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Full Name & Official Work Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="legalName" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                        Full Legal Name
                      </label>
                      <span className="text-[10px] text-ink-faint font-mono">Matches NID</span>
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="legalName"
                        type="text"
                        required
                        placeholder="e.g., Ayesha Rahman"
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="workEmail" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                        Official Work Email
                      </label>
                      <span className="text-[10px] text-ink-faint font-mono">Corporate Enclave</span>
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="workEmail"
                        type="email"
                        required
                        placeholder="ayesha@rahimtraders.com"
                        value={workEmail}
                        onChange={(e) => setWorkEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Organization Name & Entity Classification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="entityName" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                      Legal Entity / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="entityName"
                        type="text"
                        required
                        placeholder="e.g., Rahim Textiles &amp; Trade Ltd."
                        value={entityName}
                        onChange={(e) => setEntityName(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink placeholder:text-ink-faint focus:border-pine-500 focus:bg-surface focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="orgType" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                      Entity Classification
                    </label>
                    <div className="relative">
                      <select
                        id="orgType"
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value)}
                        className="w-full pl-3.5 pr-8 py-2.5 bg-paper rounded-lg border border-border text-sm text-ink focus:border-pine-500 focus:bg-surface focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Private Limited Company (RJSC Registered)">Private Limited Company (RJSC Registered)</option>
                        <option value="Sole Proprietorship / Trade License">Sole Proprietorship / Trade License</option>
                        <option value="Buying House / RMG Exporter (BGMEA/BKMEA)">Buying House / RMG Exporter (BGMEA/BKMEA)</option>
                        <option value="Law Practice / Supreme Court Chamber">Law Practice / Supreme Court Chamber</option>
                        <option value="Financial Institution / Other Enterprise">Financial Institution / Other Enterprise</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-ink-faint absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Digital Vault Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold text-pine-900 uppercase tracking-wider">
                      Digital Vault Password
                    </label>
                    <span className="text-[10px] text-ink-faint font-mono">Minimum 8 Characters</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-ink-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Institutional password phrase..."
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
                  <div className="flex items-center justify-between text-[11px] text-ink-faint pt-1">
                    <span>Compliant with PKI Vault Entropy Standards</span>
                    <span className="font-mono text-[10px] text-pine-600 font-semibold">FIPS 140-2 Level 3 Ready</span>
                  </div>
                </div>

                {/* Row 4: Statutory Assent & Terms Checkbox */}
                <div className="pt-2 flex items-start gap-2.5">
                  <input
                    id="statutoryConsent"
                    type="checkbox"
                    checked={statutoryConsent}
                    onChange={(e) => setStatutoryConsent(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-pine-600 focus:ring-pine-500 mt-0.5 shrink-0"
                  />
                  <label htmlFor="statutoryConsent" className="text-xs text-ink-soft leading-relaxed select-none cursor-pointer">
                    I agree to the <Link href="/legal" className="text-pine-600 hover:underline font-semibold">Terms of Service</Link>,{' '}
                    <Link href="/security" className="text-pine-600 hover:underline font-semibold">Privacy Policy</Link>, and explicitly consent to the valid evidentiary status of electronic execution pursuant to{' '}
                    <strong className="text-pine-900 font-semibold">Section 7 of the Bangladesh ICT Act 2006</strong>.
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-seal-600 hover:bg-seal-700 text-paper font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-warm-md disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Issuing Vault Credentials...' : 'Create Sovereign Workspace'}</span>
                </button>

                {/* Frictionless Guarantees */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-center text-[11px] text-ink-faint pt-1 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> No credit card required.
                  </span>
                  <span>•</span>
                  <span>Instant 5 free envelopes / month included.</span>
                </div>
              </form>
            )}

            {/* Bottom Switch to Sign In */}
            <div className="pt-4 border-t border-border text-center text-xs text-ink-soft">
              Already have an authenticated SignDesk workspace?{' '}
              <Link href="/signin" className="text-pine-600 hover:text-pine-800 font-bold hover:underline">
                Sign In &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Global Footer Security Strip */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-ink-faint font-mono">
          <div className="inline-flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-pine-600" />
            <span>Cryptographically Secured under Bangladesh ICT Act 2006 • 256-Bit PKI Vault Architecture</span>
          </div>
          <div>Dhaka Enclave • Timestamp: UTC+6 Bangladesh Standard Time • FIPS 186-4 Compliant</div>
        </div>
      </div>
    </div>
  );
}