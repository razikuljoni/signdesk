# SignDesk Production Deployment Guide

This guide details the steps required to deploy and maintain SignDesk in production.

---

## 1. Architecture Options

### Option A: Single-Node Docker Compose (Recommended for SMEs)
Runs Web, API, PostgreSQL 16, Redis 7, and a Caddy reverse proxy on a single Linux VPS (Ubuntu 22.04 LTS or 24.04 LTS with 2–4 GB RAM):

```text
Internet ---> [ Caddy (Auto HTTPS/TLS) ]
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    [ Web (Next.js) ]   [ API (NestJS) ]
         │                   │
         └─────────┬─────────┘
                   ▼
         [ PostgreSQL 16 + Redis 7 ]
```

### Option B: Decoupled Cloud Architecture
- **Frontend (`apps/web`):** Vercel (Next.js 15 App Router Edge/Node).
- **Backend (`apps/api`):** Railway, Render, or DigitalOcean App Platform (Node.js 22+).
- **Database:** Supabase, Neon, or Managed PostgreSQL 16.
- **Cache / Queues:** Upstash Redis or Managed Redis 7.

---

## 2. Docker Compose Production Deployment

### 2.1 Server Provisioning
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker & Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2.2 Clone & Configure
```bash
git clone https://github.com/razikuljoni/signdesk.git /opt/signdesk
cd /opt/signdesk

# Copy configuration
cp .env.example .env
nano .env
```

Set the following production environment values in `.env`:
```env
NODE_ENV=production
PORT=4000
APP_URL=https://signdesk.yourdomain.bd
NEXT_PUBLIC_API_URL=https://api.signdesk.yourdomain.bd

DATABASE_URL="postgresql://signdesk:YOUR_SECURE_PASSWORD@postgres:5432/signdesk?schema=public"
REDIS_URL="redis://redis:6379"

JWT_SECRET="YOUR_GENERATED_RANDOM_32_CHAR_SECRET"

SMTP_HOST="smtp.resend.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="resend"
SMTP_PASS="re_your_resend_api_key"
MAIL_FROM_EMAIL="signatures@yourdomain.bd"
```

### 2.3 Database Migration & Seeding
```bash
# Build and run containers
docker compose -f docker-compose.prod.yml up -d

# Execute database migration inside container
docker compose exec api pnpm --filter @signdesk/api prisma:migrate:deploy

# Seed initial workspace and starter contract templates
docker compose exec api pnpm --filter @signdesk/api db:seed
```

---

## 3. Email Deliverability (Crucial for Bangladesh)

Bangladeshi corporate users on Gmail or Google Workspace frequently flag untrusted SMTP hosts. To guarantee your invitation magic links reach inboxes, configure your domain DNS records:

### 3.1 SPF Record (TXT)
Add or include Resend's sending servers:
```text
v=spf1 include:resend.com ~all
```

### 3.2 DKIM Record (CNAME)
Add the two CNAME records supplied by Resend inside your DNS management console (e.g., Cloudflare):
```text
Host: resend._domainkey.yourdomain.bd
Value: dkim.resend.com
```

### 3.3 DMARC Record (TXT)
```text
Host: _dmarc.yourdomain.bd
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@yourdomain.bd
```

---

## 4. Automated Database Backups

Create a daily backup cron job on your host server to preserve signed document metadata and audit logs:

```bash
sudo mkdir -p /opt/signdesk/backups
sudo nano /etc/cron.daily/signdesk-backup
```

Add the script:
```bash
#!/bin/bash
BACKUP_DIR="/opt/signdesk/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/signdesk_db_$TIMESTAMP.sql.gz"

docker compose -f /opt/signdesk/docker-compose.yml exec -T postgres pg_dump -U signdesk signdesk | gzip > "$FILENAME"

# Keep last 30 days of backups
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -exec rm {} \;
```

```bash
sudo chmod +x /etc/cron.daily/signdesk-backup
```

---

## 5. Health Checks & Verification

Verify that all services are operational:

```bash
# Check container status
docker compose ps

# Inspect API health
curl -f http://localhost:4000/

# Test envelope cryptographic verification endpoint
curl -f http://localhost:4000/envelopes/{id}/verify
```
