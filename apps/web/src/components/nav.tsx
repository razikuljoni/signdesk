'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Menu, X, Shield, FileText, LayoutDashboard, Settings, LogOut, User } from 'lucide-react';

export function Nav() {
  const pathname = usePathname();
  const { user, workspace, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in pure signing ceremony flow (/sign/...), don't render marketing nav
  if (pathname.startsWith('/sign/')) {
    return null;
  }

  const isMarketing = !pathname.startsWith('/dashboard') &&
    !pathname.startsWith('/documents') &&
    !pathname.startsWith('/settings') &&
    !pathname.startsWith('/envelopes') &&
    !pathname.startsWith('/templates') &&
    !pathname.startsWith('/onboarding');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-paper/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-full bg-seal-600 flex items-center justify-center text-white text-xs font-bold shadow-warm-sm group-hover:bg-seal-700 transition-colors">
            •
          </div>
          <span className="font-body font-bold text-xl tracking-tight text-pine-900">
            SignDesk
          </span>
          <span className="text-[10px] font-mono tracking-wider bg-pine-100 text-pine-800 px-1.5 py-0.5 rounded border border-pine-500/20 hidden sm:inline-block">
            BD ICT ACT 2006
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-soft">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`hover:text-pine-900 transition-colors ${
                  pathname === '/dashboard' ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/documents"
                className={`hover:text-pine-900 transition-colors ${
                  pathname.startsWith('/documents') ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Documents
              </Link>
              <Link
                href="/templates"
                className={`hover:text-pine-900 transition-colors ${
                  pathname.startsWith('/templates') ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Templates
              </Link>
              <Link
                href="/settings/profile"
                className={`hover:text-pine-900 transition-colors ${
                  pathname.startsWith('/settings') ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className={`hover:text-pine-900 transition-colors ${
                  pathname === '/pricing' ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Pricing
              </Link>
              <Link
                href="/legal"
                className={`hover:text-pine-900 transition-colors ${
                  pathname === '/legal' ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Legal Enforceability
              </Link>
              <Link
                href="/security"
                className={`hover:text-pine-900 transition-colors ${
                  pathname === '/security' ? 'text-pine-900 font-semibold' : ''
                }`}
              >
                Security & Merkle Audit
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/envelopes/new">
                <Button variant="primary" size="sm">
                  + New Envelope
                </Button>
              </Link>
              <div className="h-4 w-px bg-border mx-1" />
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <span className="font-semibold text-pine-900">{user.name}</span>
                {workspace && (
                  <span className="bg-surface-raised px-2 py-0.5 rounded border border-border">
                    {workspace.name}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                title="Sign Out"
                className="text-ink-soft hover:text-danger"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="sign" size="sm">
                  Start Free (5/mo)
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link href="/envelopes/new">
              <Button variant="primary" size="sm">
                + Send
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink rounded-md hover:bg-surface-raised"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-2 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Dashboard
                </Link>
                <Link
                  href="/documents"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Documents
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Templates
                </Link>
                <Link
                  href="/settings/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-sm font-medium text-danger text-left hover:bg-danger/10 rounded flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Pricing
                </Link>
                <Link
                  href="/legal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Legal Enforceability
                </Link>
                <Link
                  href="/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-ink hover:bg-surface-raised rounded"
                >
                  Security & Merkle Audit
                </Link>
                <div className="pt-2 border-t border-border flex flex-col gap-2">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="sign" className="w-full">
                      Start Free (5/mo)
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
