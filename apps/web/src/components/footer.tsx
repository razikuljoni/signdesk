import React from 'react';
import Link from 'next/link';
import { WaxSeal } from './ui/wax-seal';

export function Footer() {
  return (
    <footer className="border-t border-border bg-pine-950 text-dark-text py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <WaxSeal size={32} />
            <span className="font-body font-bold text-xl tracking-tight text-white">
              SignDesk
            </span>
          </div>
          <p className="text-sm text-ink-faint leading-relaxed">
            E-signature & approval workflow platform engineered for Bangladeshi commerce under the ICT Act 2006.
          </p>
          <div className="text-xs text-brass-500 font-mono">
            BST: UTC+06:00 · SHA-256 Merkle Audit
          </div>
        </div>

        {/* Col 2: Product */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-4">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-dark-text/80">
            <li>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Pricing & Plans
              </Link>
            </li>
            <li>
              <Link href="/templates" className="hover:text-white transition-colors">
                Bangladeshi Contract Templates
              </Link>
            </li>
            <li>
              <Link href="/design-system" className="hover:text-white transition-colors">
                Design System Spec
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Legal & Trust */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-4">
            Legal & Compliance
          </h4>
          <ul className="space-y-2 text-sm text-dark-text/80">
            <li>
              <Link href="/legal" className="hover:text-white transition-colors">
                ICT Act 2006 Enforceability
              </Link>
            </li>
            <li>
              <Link href="/security" className="hover:text-white transition-colors">
                Cryptographic Architecture
              </Link>
            </li>
            <li>
              <span className="text-xs text-ink-faint">
                Simple Electronic Signature (SES) • Not government CA certified
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust Notice */}
        <div className="space-y-3 bg-dark-surface p-4 rounded-[8px] border border-dark-border text-xs text-dark-text/90">
          <div className="font-semibold text-brass-500">Legal Notice</div>
          <p className="leading-normal">
            SignDesk produces Simple Electronic Signatures (SES) backed by tamper-evident hash chaining.
            For wills, powers of attorney, or property deeds requiring registration under Registration Act 1908, consult legal counsel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-ink-faint gap-4">
        <div>
          © {new Date().getFullYear()} SignDesk. All rights reserved. Dhaka, Bangladesh.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/legal" className="hover:text-white">Terms of Electronic Business</Link>
          <Link href="/security" className="hover:text-white">Security Disclosures</Link>
        </div>
      </div>
    </footer>
  );
}
