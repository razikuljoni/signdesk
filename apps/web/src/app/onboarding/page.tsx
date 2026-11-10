'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ArrowRight, FileText, Building, Mail, Clock } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, workspace } = useAuth();
  const [step, setStep] = useState(1);

  const starterTemplates = [
    {
      title: 'Mutual Non-Disclosure Agreement (NDA)',
      desc: 'Protect confidential discussions and business plans with BD partners.',
      roles: 'Disclosing Party, Receiving Party',
    },
    {
      title: 'Standard Employment Agreement',
      desc: 'Offer letter & employment contract compliant with Bangladesh Labour Act 2006.',
      roles: 'Employer, Employee',
    },
    {
      title: 'Freelance & Independent Contractor Deed',
      desc: 'Milestones, intellectual property assignment, and BDT payment terms.',
      roles: 'Client, Contractor',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16 space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
            Welcome to SignDesk
          </span>
          <h1 className="font-display text-3xl font-bold text-pine-900 mt-1">
            Setting up your Workspace
          </h1>
        </div>
        <div className="text-xs font-mono bg-pine-100 text-pine-900 px-3 py-1 rounded-full font-bold">
          Step {step} of 3
        </div>
      </div>

      {/* Step 1: Verification */}
      {step === 1 && (
        <Card className="bg-surface">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-[#E2F2E8] flex items-center justify-center text-success mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <CardTitle>Email Verification Confirmed</CardTitle>
            <CardDescription>
              Your email <strong>{user?.email || 'user@company.bd'}</strong> is verified for electronic dispatch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink-soft">
            <div className="p-4 bg-surface-raised rounded-[8px] border border-border space-y-2">
              <div className="font-semibold text-pine-900 text-xs uppercase tracking-wider">
                Statutory Assent Logged:
              </div>
              <p className="text-xs leading-relaxed">
                Your acceptance of the Electronic Record and Signature Disclosure under Bangladesh ICT Act 2006
                has been recorded with timestamp BST (UTC+06:00).
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="primary" onClick={() => setStep(2)}>
              Next: Workspace Configuration
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: Workspace Setup */}
      {step === 2 && (
        <Card className="bg-surface">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-pine-100 flex items-center justify-center text-pine-900 mb-2">
              <Building className="w-6 h-6" />
            </div>
            <CardTitle>Workspace Defaults</CardTitle>
            <CardDescription>
              Configure default contract parameters for <strong>{workspace?.name || 'Your Company'}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-surface-raised rounded-[8px] border border-border space-y-1">
                <span className="text-xs text-ink-faint">Standard Expiration Window</span>
                <p className="font-bold text-pine-900">14 Days</p>
                <span className="text-[11px] text-ink-soft">Signers must execute within 14 days</span>
              </div>
              <div className="p-4 bg-surface-raised rounded-[8px] border border-border space-y-1">
                <span className="text-xs text-ink-faint">Reminder Cadence</span>
                <p className="font-bold text-pine-900">48 Hours</p>
                <span className="text-[11px] text-ink-soft">Auto-reminder sent at T+48h</span>
              </div>
            </div>

            <div className="p-4 bg-surface-raised rounded-[8px] border border-border flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-pine-900">Default Timezone</span>
                <p className="text-xs text-ink-soft">Used for all audit trails & Certificates of Completion</p>
              </div>
              <Badge variant="waiting" icon={<Clock className="w-3.5 h-3.5" />}>
                Asia/Dhaka (BST UTC+06:00)
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
              Next: Starter Templates
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Starter Templates & Checklist */}
      {step === 3 && (
        <Card className="bg-surface">
          <CardHeader>
            <div className="w-10 h-10 rounded-full bg-seal-100 flex items-center justify-center text-seal-600 mb-2">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle>Pick a Contract Template to Start</CardTitle>
            <CardDescription>
              We have pre-configured 6 standard Bangladeshi commercial agreements ready to dispatch.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {starterTemplates.map((t, i) => (
                <div
                  key={i}
                  className="p-4 bg-surface rounded-[8px] border border-border hover:border-pine-600 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-pine-900">{t.title}</h4>
                    <p className="text-xs text-ink-soft">{t.desc}</p>
                    <span className="text-[11px] font-mono text-ink-faint">Roles: {t.roles}</span>
                  </div>
                  <Link href="/templates">
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Link href="/dashboard">
              <Button variant="sign" size="lg">
                Go to Workspace Dashboard
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
