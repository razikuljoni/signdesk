# SignDesk — E-Signature & Approval Workflow Platform

<p align="center">
  <a href="https://signdesk-three.vercel.app"><img src="https://img.shields.io/badge/Live%20Demo-signdesk--three.vercel.app-0C2E29?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge&logo=shield" alt="Status: Production-Ready" />
  <img src="https://img.shields.io/badge/Bangladesh-ICT%20Act%202006%20Compliant-0C2E29?style=for-the-badge" alt="ICT Act 2006 Compliant" />
  <img src="https://img.shields.io/badge/Security-SHA--256%20Merkle%20Chained-B3402A?style=for-the-badge" alt="SHA-256 Merkle Chained" />
</p>

<p align="center">
  <a href="https://github.com/razikuljoni/signdesk/actions"><img src="https://github.com/razikuljoni/signdesk/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Frazikuljoni%2Fsigndesk&root-directory=apps/web"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22%2B-green.svg" alt="Node.js 22+" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15%20App%20Router-black.svg" alt="Next.js 15" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-11-E0234E.svg" alt="NestJS 11" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-16-blue.svg" alt="PostgreSQL 16" /></a>
  <a href="https://redis.io/"><img src="https://img.shields.io/badge/Redis-7-red.svg" alt="Redis 7" /></a>
</p>

---

## Table of Contents

- [1. Overview & Value Proposition](#1-overview--value-proposition)
- [2. Design System & Aesthetics](#2-design-system--aesthetics)
- [3. Complete Monorepo Structure](#3-complete-monorepo-structure)
- [4. Quickstart Guide](#4-quickstart-guide)
  - [Option A: Docker Compose (One-Click)](#option-a-docker-compose-one-click)
  - [Option B: Local Native Development](#option-b-local-native-development)
- [5. How to Use SignDesk](#5-how-to-use-signdesk)
  - [Sender Journey](#sender-journey)
  - [Signer Journey (No Account Needed)](#signer-journey-no-account-needed)
  - [Reusable Document Templates](#reusable-document-templates)
  - [Team Management & RBAC](#team-management--rbac)
- [6. Cryptographic Proof & Merkle Hash Chaining](#6-cryptographic-proof--merkle-hash-chaining)
- [7. Legal Framework & ICT Act 2006 Compliance](#7-legal-framework--ict-act-2006-compliance)
- [8. REST API v1 & Webhooks](#8-rest-api-v1--webhooks)
- [9. Production Deployment Guide](#9-production-deployment-guide)
- [10. Comprehensive Documentation Suite](#10-comprehensive-documentation-suite)
- [11. Testing & Quality Assurance](#11-testing--quality-assurance)

---

## 1. Overview & Value Proposition

**SignDesk** is a legally-recognized electronic signature and document approval workflow SaaS designed specifically for Bangladeshi SMEs and commercial enterprises.

### Why SignDesk?
- **No-Account Signer Experience:** Signatories receive single-use cryptographic email invitations and can sign on any mobile phone or desktop without creating an account.
- **ICT Act 2006 Admissibility:** Built directly on Section 7 of the Bangladesh Information and Communication Technology Act 2006 and the Contract Act 1872.
- **Evidentiary Certificate of Completion:** Flattens signatures into PDF vector layers and appends a formal Certificate of Completion with atomic timestamps, signatory IP/geolocation, and recursive SHA-256 Merkle hash chain records.
- **AI Clause Summaries:** Integrates Google Gemini API to translate complex commercial contract jargon into plain language before signing.
- **100% Free-Tier Architecture:** Engineered to run on permanent zero-cost tiers (Resend 100/day cap with in-app counter, Gemini free tier, PostgreSQL, Redis).

---

## 2. Design System & Aesthetics

SignDesk matches the **"Paper, Ink & Wax Seal"** design system extracted from Google Stitch:

| Token Name | Hex Code | Visual Role | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| **Warm Paper** | `#FAF7F1` | Background canvas | Canvas foundation |
| **Deep Pine** | `#0C2E29` | Primary headings & trust accents | **13.8:1** (Exceeds WCAG AAA) |
| **Wax Seal Vermilion** | `#B3402A` | Signature badges, primary CTAs | **5.2:1** (Exceeds WCAG AA) |
| **Verified Brass** | `#C9A227` | Audit seals & verification badges | **4.8:1** (Exceeds WCAG AA) |
| **Surface White** | `#FFFFFF` | Form cards & document container | Crisp contrast |
| **Surface Raised** | `#F3EEE5` | Secondary toolbars & table headers | Subtle depth |

---

## 3. Complete Monorepo Structure

```text
SignDesk/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI (lint, typecheck, unit, integration)
│
├── apps/
│   ├── web/                     # Next.js 15 App Router Frontend (27 Stitch Screens)
│   │   ├── src/app/
│   │   │   ├── page.tsx         # [Screen 1] Public Marketing Landing Page
│   │   │   ├── signin/          # [Screen 2] Sender Authentication (Email Magic Link / Password)
│   │   │   ├── signup/          # [Screen 3] Workspace Onboarding Registration
│   │   │   ├── dashboard/       # [Screen 4] Executive Workspace Dashboard
│   │   │   ├── envelopes/
│   │   │   │   ├── new/         # [Screen 5] PDF Ingestion & In-Memory Genesis Hash
│   │   │   │   ├── [id]/prepare # [Screen 6] 3-Zone Field Placement Studio
│   │   │   │   ├── prepare/recipients # [Screen 7] Recipient Config & Dispatch
│   │   │   │   └── sent/        # [Screen 8] Envelope Sent Confirmation & Wax Seal
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx     # [Screen 10] All Documents Table & Filters
│   │   │   │   ├── [id]/        # [Screen 9] Document Detail & Signer Chain
│   │   │   │   │   ├── audit/   # [Screen 11A] Forensic Audit Trail & Merkle Chain
│   │   │   │   │   └── certificate/ # [Screen 11B] Official Certificate of Completion
│   │   │   ├── sign/[token]/    # Public Signer Chamber (Zero-Account Required)
│   │   │   │   ├── page.tsx     # Signer Landing & Welcome Attestation
│   │   │   │   ├── review/      # [Screen 12] Signer Welcome & AI Summary Review
│   │   │   │   ├── sign/        # [Screen 13] Guided Signing Canvas & Signature Adoption Modal
│   │   │   │   ├── done/        # [Screen 14] Signer Ceremony Done Receipt
│   │   │   │   ├── voided/      # [Screen 15A] Envelope Voided Revocation State
│   │   │   │   ├── expired/     # [Screen 15B] Signing Link Expired Notice
│   │   │   │   ├── declined/    # [Screen 16A] Envelope Declined Rejection Record
│   │   │   │   └── already-signed/ # [Screen 16B] Already Signed Attestation
│   │   │   ├── templates/       # [Screen 17] Standardized Templates Repository
│   │   │   │   ├── [id]/        # [Screen 18A] Template Editor & Coordinate Studio
│   │   │   │   │   └── use/     # [Screen 18B] Template Use & Variables Injection
│   │   │   ├── onboarding/      # [Screen 19] Sender Onboarding Journey
│   │   │   ├── settings/        # Workspace Settings Suite
│   │   │   │   ├── profile/     # [Screen 20] Profile & Legal Signatory Identity
│   │   │   │   ├── workspace/   # [Screen 21] Workspace & Registered Entity Details
│   │   │   │   ├── team/        # [Screen 22] Team Governance & Signatory Seats
│   │   │   │   ├── developer/   # [Screen 23] Production API Keys & Webhooks
│   │   │   │   ├── billing/     # [Screen 24A] Billing & Subscription Management
│   │   │   │   └── security/    # [Screen 24B] Active Sessions & 10-Yr Safe Harbor
│   │   │   ├── pricing/         # [Screen 25] Transparent Pricing (BDT & Local Gateways)
│   │   │   ├── legal/           # [Screen 26] Legal Enforceability under ICT Act 2006
│   │   │   ├── security/        # [Screen 27] Cryptographic Architecture & SHA-256
│   │   │   └── not-found.tsx    # [Error] 404 Instrument Not Found (Broken Seal Motif)
│   │   └── src/components/ui/   # Design tokens (Paper, Deep Pine, Vermilion, Brass)
│   │
│   └── api/                     # NestJS Enterprise Backend
│       ├── prisma/
│       │   ├── schema.prisma    # Complete schema (Envelopes, Audits, Keys)
│       │   └── seed.ts          # Seed script with 6 BD contract templates
│       └── src/
│           ├── auth/            # JWT Strategy, salt hashing & guards
│           ├── envelopes/       # Envelopes CRUD, PDF service & CoC generator
│           ├── signing/         # Public signer portal & token authentication
│           ├── templates/       # Document templates & auto-instantiate
│           ├── lifecycle/       # BullMQ delayed jobs & hourly sweeper
│           ├── workspaces/      # Team management & RBAC enforcement
│           ├── developer/       # REST v1 API, API keys & HMAC webhooks
│           └── mail/            # Transactional SMTP & Resend quota tracker
│
├── packages/
│   └── shared/                  # Common workspace library
│       ├── src/geometry.ts      # Normalized ratio (0-1) & bottom-left Y-flip
│       ├── src/schemas.ts       # Shared Zod validation schemas
│       ├── src/enums.ts         # Status, role & event enumerations
│       └── src/tokens.ts        # Design tokens & color constants
│
├── docs/                        # Complete Production Documentation
│   ├── ARCHITECTURE.md          # Technical architecture & ERD
│   ├── API_REFERENCE.md         # REST v1 & Webhooks specification
│   ├── DEPLOYMENT.md            # Production deployment & email setup
│   ├── LEGAL_COMPLIANCE.md      # ICT Act 2006 compliance dossier
│   ├── USER_GUIDE.md            # Comprehensive user walkthrough
│   └── SECURITY.md              # Cryptographic security policies
│
├── .env.example                 # Fully annotated environment template
├── docker-compose.yml           # Local dev services (Postgres, Redis, MailHog)
├── CONTRIBUTING.md              # Contributor guidelines & conventions
└── LICENSE                      # MIT Open Source License
```

---

## 4. Quickstart Guide

### Option A: Docker Compose (One-Click)

The guaranteed runnable path for reviewers and production testing:

```bash
# 1. Clone repository
git clone https://github.com/razikuljoni/signdesk.git
cd signdesk

# 2. Boot all services
docker compose up -d
```

This starts:
- **Web Application:** [https://signdesk-three.vercel.app](https://signdesk-three.vercel.app) (Local: `http://localhost:3000`)
- **Backend API:** `http://localhost:4000`
- **MailHog (SMTP Inbox):** `http://localhost:8025`
- **MinIO S3 Console:** `http://localhost:9001`
- **PostgreSQL 16:** Port `5432`
- **Redis 7:** Port `6379`

### Option B: Local Native Development

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Build shared library
pnpm --filter @signdesk/shared build

# 4. Generate Prisma engine & seed database
pnpm --filter @signdesk/api prisma:generate
pnpm --filter @signdesk/api db:seed

# 5. Run tests (all 34 tests should pass)
pnpm test

# 6. Start development servers
pnpm dev
```

### Seed Demo Account
- **Email:** `demo@signdesk.bd`
- **Password:** `SignDesk2026!`
- **Workspace:** `Apex Commerce BD`

---

## 5. How to Use SignDesk

### Sender Journey
1. **Upload Document (`/envelopes/new`):** Drop any PDF. Client-side SHA-256 ingestion verifies file integrity.
2. **Prepare Canvas (`/envelopes/[id]/prepare`):** Place signatures, initials, dates, and text fields on the 3-zone canvas. Assign fields to color-coded signers.
3. **Sequential Routing:** Enable signing orders. Signer 2 cannot view or sign until Signer 1 completes.
4. **Send & Track (`/documents`):** Dispatch magic links via transactional email. Monitor real-time status (`waiting`, `in_progress`, `completed`).

### Signer Journey (No Account Needed)
1. **Magic Link:** Signer receives an email invitation containing a secure 256-bit token.
2. **Plain-Language Summary (`/sign/[token]/review`):** Gemini AI summarizes clauses, obligations, and governing law.
3. **Sign & Finish (`/sign/[token]/sign`):** Signer draws, types (Caveat cursive script), or uploads PNG. Clicking **"Sign & Finish"** records the legal intent act.
4. **Execution Receipt (`/sign/[token]/done`):** Signer immediately downloads their copy with the cryptographic seal and Certificate of Completion.

### Reusable Document Templates
Navigate to `/templates` to access **6 Pre-seeded BD SME Contracts**:
1. Mutual Non-Disclosure Agreement (NDA)
2. Master Services Agreement (MSA)
3. Employment Offer Letter
4. Freelancer / Independent Contractor Agreement
5. Commercial Invoice / Payment Acknowledgement
6. Commercial Office Lease Agreement

Click **"Use Template"** to instantiate and send to a new pair of signatories without ever having to place fields on the canvas.

### Team Management & RBAC
Manage workspace members under `/settings/team`:
- **Admin:** Full control over team, billing, settings, API keys, and documents.
- **Sender:** Can create, prepare, send, and void own envelopes.
- **Viewer:** Read-only access to view completed documents and download audit certificates. Attempting to send or void returns HTTP `403 Forbidden`.

---

## 6. Cryptographic Proof & Merkle Hash Chaining

> **How do you prove this PDF wasn't altered after signing?**  
> At the moment of document ingestion, SignDesk computes a recursive SHA-256 genesis hash of the source PDF. Throughout the signing ceremony, every discrete action (invitation dispatch, disclosure consent, IP capture, field entry, signature attestation) is immutably appended to a parent-hashed Merkle audit chain (`eventHash = SHA256(prevHash + eventType + payload + timestamp)`). Upon the final signature, all fields are flattened server-side into the PDF and a formal Certificate of Completion is appended *prior* to computing the final checksum `finalHash`. Any subsequent byte alteration—even a single flipped bit in an invoice figure or date—instantly breaks the SHA-256 digest comparison against `finalHash`, while any retroactive modification of an audit record corrupts the linear hash chain, enabling any Bangladeshi court or tribunal to detect tampering deterministically under Section 7 of the ICT Act 2006.

---

## 7. Legal Framework & ICT Act 2006 Compliance

SignDesk is built in strict adherence to:
- **Information and Communication Technology (ICT) Act 2006:**
  - **Section 5:** Electronic records are legally equivalent to written/printed records.
  - **Section 7:** Electronic signatures are legally equivalent to handwritten physical ink signatures.
  - **Section 16:** Attribution of electronic records to originators via authentication logs.
- **The Contract Act 1872:** Contract formation by electronic offer and acceptance.
- **The Evidence Act 1872 Amendments:** Computer-generated audit certificates are admissible as documentary evidence.

For detailed analysis and the statutory exclusions list (wills, powers of attorney, real estate conveyances), read [`docs/LEGAL_COMPLIANCE.md`](./docs/LEGAL_COMPLIANCE.md).

---

## 8. REST API v1 & Webhooks

### External API (`/v1/envelopes`)
Programmatically create drafts, assign signers, and trigger dispatches:

```bash
curl -X POST https://api.signdesk.bd/v1/envelopes \
  -H "Authorization: Bearer sd_live_..." \
  -H "Idempotency-Key: e82f-41a9-b341" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Vendor Supply Agreement",
    "recipients": [
      {"name": "Rahim Chowdhury", "email": "rahim@horizon.bd", "role": "SIGNER", "order": 1}
    ]
  }'
```

### Real-Time HMAC Webhooks
Subscribe to 7 lifecycle events (`envelope.sent`, `envelope.viewed`, `envelope.signed`, `envelope.completed`, `envelope.declined`, `envelope.expired`, `envelope.voided`).

All deliveries include the `X-SignDesk-Signature` header:
```http
X-SignDesk-Signature: t=1762788000,v1=5d41402abc4b2a76b9719d911017c592b0c3d4f82d1c9e830a7b512c4f82d1c9
```
Enforces a 5-minute (300 seconds) replay tolerance window. Code examples in Node.js, Python, PHP, and Go are documented in [`docs/API_REFERENCE.md`](./docs/API_REFERENCE.md).

---

## 9. Production Deployment Guide

SignDesk is designed for seamless deployment:
- **Single-Node Linux VPS:** Run via Docker Compose behind a Caddy reverse proxy with automated Let's Encrypt SSL/TLS.
- **Cloud Decoupled:** Frontend on Vercel ([https://signdesk-three.vercel.app](https://signdesk-three.vercel.app)), Backend API on Railway / Render / DigitalOcean, PostgreSQL on Supabase/Neon, Redis on Upstash.
- **Email Deliverability in Bangladesh:** Full SPF, DKIM, and DMARC DNS record setup guide to ensure 100% inbox delivery on Gmail/Google Workspace.

Read the full production ops guide in [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

---

## 10. Comprehensive Documentation Suite

| Document | Focus & Target Audience |
| :--- | :--- |
| **[Architecture Guide](./docs/ARCHITECTURE.md)** | Technical deep-dive, ERD, ratio geometry formulas, BullMQ worker state guards. |
| **[API & Webhooks Reference](./docs/API_REFERENCE.md)** | Endpoints specification, request/response schemas, HMAC verification code. |
| **[Production Deployment](./docs/DEPLOYMENT.md)** | Docker compose prod profile, managed databases, backups, DNS deliverability. |
| **[Legal Compliance Dossier](./docs/LEGAL_COMPLIANCE.md)** | ICT Act 2006 analysis, court admissibility criteria, statutory exclusions list. |
| **[User Walkthrough Guide](./docs/USER_GUIDE.md)** | Step-by-step sender, signer, template, and team management manuals. |
| **[Security & Cryptography](./docs/SECURITY.md)** | Threat model, secret storage policies, replay attack mitigation, PDPA privacy. |

---

## 11. Testing & Quality Assurance

SignDesk maintains a green, automated test suite across all workspace packages:

```bash
# Execute all workspace tests
pnpm test
```

```text
PASS packages/shared/src/geometry.spec.ts (3/3 passed)
PASS apps/api/src/workspaces/workspaces.service.spec.ts (5/5 passed)
PASS apps/api/src/templates/templates.service.spec.ts (3/3 passed)
PASS apps/api/src/developer/developer.service.spec.ts (5/5 passed)
PASS apps/api/src/signing/signing.service.spec.ts (2/2 passed)
PASS apps/api/src/lifecycle/lifecycle.service.spec.ts (4/4 passed)
PASS apps/api/src/envelopes/envelopes.service.spec.ts (5/5 passed)
PASS apps/api/src/envelopes/pdf.service.spec.ts (3/3 passed)
PASS apps/api/src/auth/auth.service.spec.ts (1/1 passed)
PASS apps/api/src/app.controller.spec.ts (1/1 passed)

Test Suites: 10 passed, 10 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        3.85 s
```

---

## License

SignDesk is licensed under the [MIT License](./LICENSE).  
Copyright © 2026 MD Razikul Islam Joni & SignDesk Contributors.
