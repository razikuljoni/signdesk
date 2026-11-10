import React from 'react';
import Link from 'next/link';
import { WaxSeal } from './ui/wax-seal';
import { Lock, ShieldCheck, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-pine-950 text-dark-text py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & Mission */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <WaxSeal size={32} />
            <span className="font-body font-bold text-xl tracking-tight text-white">
              SignDesk · BD
            </span>
          </div>
          <p className="text-sm text-dark-text/75 leading-relaxed font-body">
            The national standard for cryptographic document execution, built in strict adherence to the Information and Communication Technology (ICT) Act 2006.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-pine-900/80 border border-pine-800 text-xs text-brass-400 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Vault</span>
          </div>
        </div>

        {/* Col 2: Product */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-4 font-semibold">
            Product &amp; Workflows
          </h4>
          <ul className="space-y-2.5 text-sm text-dark-text/80">
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing &amp; Commercial Tiers
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-white transition-colors">
                Bangladeshi Contract Templates
              </Link>
            </li>
            <li>
              <Link href="/envelopes/new" className="hover:text-white transition-colors">
                New Envelope Preparation
              </Link>
            </li>
            <li>
              <Link href="/design-system" className="hover:text-white transition-colors">
                Design System &amp; Tokens
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Regulatory */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-4 font-semibold">
            Legal &amp; Regulatory
          </h4>
          <ul className="space-y-2.5 text-sm text-dark-text/80">
            <li>
              <Link href="/legal" className="hover:text-white transition-colors">
                ICT Act 2006 Enforceability
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-white transition-colors">
                PKI Vault &amp; Cryptography
              </Link>
            </li>
            <li>
              <Link href="/legal#excluded" className="hover:text-white transition-colors">
                Excluded Documents List
              </Link>
            </li>
            <li>
              <span className="text-xs text-ink-faint block pt-1">
                Simple Electronic Signature (SES) · Court Admissible
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Dhaka Office */}
        <div className="space-y-3 bg-dark-surface p-4 rounded-[8px] border border-dark-border text-xs text-dark-text/90">
          <div className="font-semibold text-brass-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brass-500" />
            <span>Dhaka Operations</span>
          </div>
          <p className="leading-relaxed text-dark-text/75 font-body">
            Level 9, Shanta Western Tower<br />
            Bir Uttam Mir Shawkat Sarak<br />
            Tejgaon I/A, Dhaka-1208
          </p>
          <div className="pt-2 border-t border-dark-border flex items-center gap-1.5 text-dark-text/70 font-mono text-[11px]">
            <Mail className="w-3 h-3 text-pine-400" />
            <span>support@signdesk.com.bd</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-ink-faint gap-4">
        <div>
          © 2025 SignDesk Technologies Ltd. (TIN: 8492048192-BD). All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/legal" className="hover:text-white transition-colors">Terms of Execution</Link>
          <Link href="/security" className="hover:text-white transition-colors">PKI Vault Architecture</Link>
          <Link href="/signin" className="hover:text-white transition-colors">Client Portal</Link>
        </div>
      </div>
    </footer>
  );
}
