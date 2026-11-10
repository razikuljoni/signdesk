import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ShieldAlert, CheckCircle2, AlertOctagon, Scale, FileText } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-ink-faint">
          Legal & Regulatory Guidance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-pine-900">
          Electronic Signatures under Bangladesh Law
        </h1>
        <p className="text-ink-soft text-lg max-w-3xl leading-relaxed">
          Comprehensive review of electronic signature enforceability, court admissibility,
          and statutory limitations under the Bangladesh Information and Communication Technology (ICT) Act 2006.
        </p>
      </div>

      {/* 1. Legal Recognition */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="w-6 h-6 text-pine-600" />
          <h2 className="font-display text-2xl font-bold text-pine-900">
            1. Recognition under ICT Act 2006 (Sections 5–7)
          </h2>
        </div>
        <p className="text-ink leading-relaxed text-sm">
          Under Section 6 and Section 7 of the Bangladesh Information and Communication Technology Act 2006,
          contracts and documents cannot be denied legal effect, validity, or enforceability solely on the grounds
          that they are in electronic format or contain an electronic signature.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Section 6: Legal Recognition of Electronic Records</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-ink-soft leading-relaxed">
              Where any law provides that information shall be in writing, typewritten, or printed, such requirement
              shall be deemed to have been satisfied if rendered in an accessible electronic record for subsequent reference.
            </CardContent>
          </Card>

          <Card className="bg-surface">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Section 7: Legal Recognition of Electronic Signatures</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-ink-soft leading-relaxed">
              Where any law requires a person&apos;s signature, an electronic signature satisfies such law provided the method
              identifies the signatory and indicates their approval of the information contained in the record.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Four Pillars of Validity */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold text-pine-900">
          2. The Four Pillars of Electronic Signature Validity
        </h2>
        <p className="text-sm text-ink-soft">
          SignDesk aligns with international best practices (ESIGN, UETA, eIDAS) and Bangladesh statutory criteria:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-pine-900">
              <CheckCircle2 className="w-4 h-4 text-pine-600" />
              1. Intent to Sign
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              The signer performs an affirmative execution act by clicking &quot;Sign & Finish&quot;.
              The button label, UTC/BST timestamp, IP address, and browser agent are permanently logged.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-pine-900">
              <CheckCircle2 className="w-4 h-4 text-pine-600" />
              2. Consent to Do Business Electronically
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              The signer must review the statutory Electronic Record & Signature Disclosure and record affirmative
              assent prior to signing. The disclosure version is recorded in the audit event.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-pine-900">
              <CheckCircle2 className="w-4 h-4 text-pine-600" />
              3. Attribution & Audit Chain
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Signatures are bound to a verified email delivery token, IP address, device fingerprints, and chronological
              signing order position, chained via SHA-256 hashes.
            </p>
          </div>

          <div className="p-4 bg-surface rounded-[8px] border border-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-pine-900">
              <CheckCircle2 className="w-4 h-4 text-pine-600" />
              4. Document Integrity & Tamper Evidence
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              When all parties sign, the fields are flattened into the PDF and appended with a Certificate of Completion.
              The final file&apos;s SHA-256 hash is locked. Any alteration invalidates verification.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Excluded Documents Warning */}
      <section className="space-y-4 bg-[#FDECEA] p-6 rounded-[12px] border border-danger/30 text-ink">
        <div className="flex items-center gap-2 text-danger font-bold text-lg">
          <AlertOctagon className="w-5 h-5" />
          Statutory Excluded Documents (Cannot be E-Signed in Bangladesh)
        </div>
        <p className="text-xs leading-relaxed">
          Under the ICT Act 2006 and related statutory instruments, the following categories of documents
          <strong> CANNOT</strong> be executed via simple electronic signatures and must be executed in physical paper format:
        </p>
        <ul className="grid sm:grid-cols-2 gap-2 text-xs font-medium pt-2">
          <li className="flex items-center gap-1.5 text-danger">
            • Wills, codicils, and testamentary dispositions
          </li>
          <li className="flex items-center gap-1.5 text-danger">
            • Powers of Attorney (under Powers of Attorney Act 2012)
          </li>
          <li className="flex items-center gap-1.5 text-danger">
            • Conveyance deeds of immovable property (Registration Act 1908)
          </li>
          <li className="flex items-center gap-1.5 text-danger">
            • Negotiable instruments (cheques, promissory notes, bills of exchange)
          </li>
          <li className="flex items-center gap-1.5 text-danger">
            • Trust deeds and documents requiring notarisation / swearing
          </li>
          <li className="flex items-center gap-1.5 text-danger">
            • Documents requiring physical non-judicial stamp duty under Stamp Act 1899
          </li>
        </ul>
      </section>

      {/* 4. Simple vs Secure Digital Signatures */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-pine-900">
          3. Simple Electronic Signatures (SES) vs. Licensed CA Certificates
        </h2>
        <div className="p-5 bg-surface rounded-[8px] border border-border text-sm text-ink-soft leading-relaxed space-y-3">
          <p>
            Under Bangladesh law, a <em>&quot;Secure Digital Signature&quot;</em> is a specific statutory classification requiring
            a PKI digital certificate issued by a licensed Certifying Authority (CA) accredited by the Controller of
            Certifying Authorities (CCA Bangladesh).
          </p>
          <p>
            <strong>SignDesk MVP provides Simple Electronic Signatures (SES)</strong> with rigorous cryptographic
            audit trails and SHA-256 integrity proofs. SignDesk does not issue government CCA certificates.
            For commercial contracts, non-disclosure agreements, procurement purchase orders, and employment agreements,
            SES provides enforceable and legally effective consent under ICT Act 2006 Section 7.
          </p>
        </div>
      </section>
    </div>
  );
}
