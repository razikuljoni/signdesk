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
import { AlertCircle, Check } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError('You must agree to electronic records assent under ICT Act 2006.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      await signUp(name, email, password, workspaceName);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
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
            Create your SignDesk Account
          </CardTitle>
          <CardDescription>
            Start sending legally binding agreements in Bangladesh. 5 free envelopes/month included.
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

            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                placeholder="e.g. Tanvir Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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

            <div className="space-y-1.5">
              <Label htmlFor="company">Company / Workspace Name</Label>
              <Input
                id="company"
                required
                placeholder="e.g. Apex Commerce BD"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password (min 8 chars)</Label>
              <Input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-2 flex items-start gap-2">
              <input
                id="consent"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-pine-600 focus:ring-pine-500"
              />
              <label htmlFor="consent" className="text-xs text-ink-soft leading-tight cursor-pointer">
                I agree to execute agreements and receive records electronically under Bangladesh ICT Act 2006 (Section 7).
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full h-11 text-base font-semibold"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            <div className="text-center text-xs text-ink-soft">
              Already have an account?{' '}
              <Link href="/signin" className="text-pine-600 font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
