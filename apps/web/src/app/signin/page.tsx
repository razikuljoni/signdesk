'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WaxSeal } from '@/components/ui/wax-seal';
import { AlertCircle, Sparkles, Mail } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isMagicLink) {
        setMagicLinkSent(true);
      } else {
        await signIn(email, password);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
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
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-surface border-border shadow-warm-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <WaxSeal size={48} />
          </div>
          <CardTitle className="text-2xl font-bold text-pine-900">
            Sign In to SignDesk
          </CardTitle>
          <CardDescription>
            Access your agreements, audit logs, and templates.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-danger-bg text-danger border border-danger/30 rounded-[4px] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {magicLinkSent ? (
              <div className="p-4 bg-pine-100 text-pine-900 border border-pine-500/20 rounded-[8px] text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-pine-600" />
                  Magic Link Dispatched
                </div>
                <p>
                  A sign-in link has been sent to <strong>{email}</strong>. Click the link in your email to authenticate.
                </p>
                <button
                  type="button"
                  onClick={() => setMagicLinkSent(false)}
                  className="text-pine-600 font-semibold underline pt-2 block"
                >
                  Back to password sign in
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {!isMagicLink && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => setIsMagicLink(true)}
                        className="text-xs text-pine-600 hover:underline"
                      >
                        Use magic link instead
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

            {!magicLinkSent && (
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full h-11 text-base font-semibold"
              >
                {loading
                  ? 'Signing In...'
                  : isMagicLink
                  ? 'Send Magic Link'
                  : 'Sign In'}
              </Button>
            )}

            {/* 1-Click Demo Login Box */}
            <div className="pt-2 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full h-11 border-dashed border-pine-600/40 text-pine-900 bg-pine-100/50 hover:bg-pine-100 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brass-600" />
                1-Click Sign In as Demo User (Tanvir Ahmed)
              </Button>
              <div className="text-center text-[11px] text-ink-faint mt-1 font-mono">
                demo@signdesk.bd · SignDesk2026!
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-border pt-4">
            <div className="text-xs text-ink-soft">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-pine-600 font-semibold hover:underline">
                Create Free Account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
