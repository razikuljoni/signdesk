# Contributing to SignDesk

Thank you for your interest in contributing to SignDesk! This guide explains our development workflow, coding standards, and pull request process.

---

## 1. Principles & Build Discipline

1. **Think Before Coding:** Explicit assumptions, surface trade-offs, state the plan before implementing.
2. **Simplicity First:** Write the minimum code that solves the problem. No speculative abstractions, no unrequested features.
3. **Surgical Changes:** Touch only what you must. Match existing style and do not refactor unrelated code.
4. **Goal-Driven Execution:** Every change must have verifiable success criteria and tests.
5. **Zero Paid Dependencies:** SignDesk operates strictly on permanent free tiers (Resend 100/day, Gemini free tier, PostgreSQL/Redis). Never introduce features that mandate a paid subscription.

---

## 2. Monorepo Structure

SignDesk uses `pnpm` workspaces:

```text
├── apps/
│   ├── web/               # Next.js 15 App Router frontend (Tailwind v4, Radix, pdfjs-dist)
│   └── api/               # NestJS enterprise backend (Prisma, BullMQ, @cantoo/pdf-lib)
├── packages/
│   └── shared/            # Shared types, Zod schemas, status enums, geometry utilities
├── docs/                  # Architecture, API, deployment, and legal compliance guides
└── docker-compose.yml     # Local orchestration (Postgres, Redis, MailHog, MinIO)
```

---

## 3. Development Setup

### Prerequisites
- Node.js 22.0.0+ (Tested on Node.js 24)
- pnpm 10.0.0+
- Docker & Docker Compose (optional, for services)

### First-Time Setup
```bash
# 1. Clone repository
git clone https://github.com/razikuljoni/signdesk.git
cd signdesk

# 2. Install workspace dependencies
pnpm install

# 3. Configure environment
cp .env.example .env

# 4. Build shared package
pnpm --filter @signdesk/shared build

# 5. Start infrastructure (PostgreSQL & Redis)
docker compose up -d postgres redis mailhog

# 6. Run database migrations & seed starter templates
pnpm --filter @signdesk/api prisma:migrate:dev
pnpm --filter @signdesk/api db:seed

# 7. Start development servers
pnpm dev
```

Dev endpoints:
- Web App: `http://localhost:3000`
- API Backend: `http://localhost:4000`
- MailHog Inbox: `http://localhost:8025`

---

## 4. Testing Guidelines

Before committing or opening a PR, ensure all tests pass and CI remains green:

```bash
# Run all unit tests across all workspace packages
pnpm test

# Run API unit and integration tests
pnpm --filter @signdesk/api test

# Run shared geometry tests
pnpm --filter @signdesk/shared test

# Verify production Next.js compilation
pnpm --filter @signdesk/web build
```

---

## 5. Branching & Commit Conventions

We follow Conventional Commits:

- `feat(scope): ...` for new features
- `fix(scope): ...` for bug fixes
- `test(scope): ...` for test additions
- `docs(scope): ...` for documentation
- `refactor(scope): ...` for refactoring

Example:
```bash
git commit -m "feat(envelopes): add PDF flattening and Certificate of Completion"
```

Never push directly to `main` without testing locally.
