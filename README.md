# SignDesk — E-Signature & Approval Workflow SaaS

> **Legally-recognisable electronic signatures & approval workflows for Bangladeshi SMEs under the ICT Act 2006.**

[![CI](https://github.com/razikuljoni/signdesk/actions/workflows/ci.yml/badge.svg)](https://github.com/razikuljoni/signdesk/actions)

---

## 1. Product Overview

Upload a PDF, place signature and data fields on it, send it by email magic link — signers sign without an account — and get back a tamper-evident signed PDF with a Certificate of Completion and a SHA-256 hash chain audit trail.

- **Design System:** "Paper, Ink & Wax Seal" (warm paper `#FAF7F1`, deep pine `#0C2E29`, wax-seal vermilion `#B3402A`, brass `#C9A227`).
- **Legal Foundation:** Bangladesh Information and Communication Technology (ICT) Act 2006 (Sections 5–7). Simple Electronic Signature (SES) with cryptographic attribution and integrity proof.
- **AI Clause Summary:** Gemini API generates plain-language contract summaries before signing.

---

## 2. Tech Stack

- **Monorepo:** pnpm workspaces
- **Frontend (`apps/web`):** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui (Radix), pdfjs-dist, signature_pad
- **Backend (`apps/api`):** NestJS, Prisma ORM, BullMQ, ioredis, pdf-lib, nodemailer
- **Database & Cache:** PostgreSQL 16, Redis 7
- **Dev Services:** MailHog (SMTP testing), MinIO (S3-compatible object storage)
- **CI / Testing:** GitHub Actions, Jest (unit), Supertest (API), Playwright (browser e2e)

---

## 3. Quick Start with Docker

```bash
docker compose up -d
```

This starts:
- Web frontend at `http://localhost:3000`
- API backend at `http://localhost:4000`
- MailHog web UI at `http://localhost:8025`
- MinIO console at `http://localhost:9001`
- PostgreSQL on port `5432`
- Redis on port `6379`

---

## 4. Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Build shared packages
pnpm --filter @signdesk/shared build

# 3. Generate Prisma client & run migrations
pnpm --filter @signdesk/api prisma:generate
pnpm --filter @signdesk/api prisma:migrate:dev

# 4. Seed demo data
pnpm --filter @signdesk/api db:seed

# 5. Start dev servers
pnpm dev
```

---

## 5. Running Tests

```bash
# Run all unit tests
pnpm test

# Run API integration tests
pnpm test:api
```
