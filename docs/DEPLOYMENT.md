# Production Deployment Guide — Aura Platform

## 1. Production Architecture Overview

In production, the application is deployed as two synchronized services:
1. **Frontend**: Static production bundle served via Nginx, Cloudflare Pages, or AWS S3 + CloudFront.
2. **Backend**: Express TypeScript Node.js cluster behind an SSL-terminating reverse proxy.
3. **Database**: Managed PostgreSQL (v15+) with read-replicas.
4. **Cache & Queues**: Redis (v7+) for rate-limiting, job dispatching, and notification queues.

---

## 2. Step-by-Step Deployment

### Step 1: Environment Configuration
Create a secure `.env` on your production server:

```bash
NODE_ENV=production
PORT=5000

# Cryptographic Keys (Use high-entropy 64-character strings)
AUTH_SECRET="your-cryptographically-secure-random-key"

# Administrative Allowlists
ADMIN_EMAIL_ALLOWLIST="dhilipanmurugesan705@gmail.com"
ADMIN_PHONE_ALLOWLIST="6369605540,+916369605540"

# Database Connection
DATABASE_URL="postgresql://aura_user:secure_password@postgres-primary.internal:5432/aura_production?sslmode=require"

# AI Provider API Keys
LLM_PROVIDER="anthropic"
LLM_API_KEY="sk-ant-prod-..."
STT_PROVIDER="whisper"
STT_API_KEY="sk-..."
TTS_PROVIDER="elevenlabs"
TTS_API_KEY="sk-..."
```

### Step 2: Database Migration & Seeding
```bash
# Apply Prisma schema migrations to production database
npx prisma migrate deploy

# Seed baseline NCO-2015 benchmarks
npm run db:seed
```

### Step 3: Frontend Production Build
```bash
npm run build
# Outputs optimized static bundle to /dist
```

### Step 4: Backend Process Management
Run the server using PM2 or Docker:

```bash
# Using PM2 Cluster Mode
pm2 start "npx tsx server/src/index.ts" --name "aura-backend" -i max

# Check status
pm2 status
```

---

## 3. Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name aura.gov.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aura.gov.in;

    ssl_certificate /etc/letsencrypt/live/aura.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aura.gov.in/privkey.pem;

    # Static Frontend Assets
    root /var/www/aura/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 4. Health Monitoring & Verification

Automated health probe URL: `GET https://aura.gov.in/api/health`
Expected response:
```json
{
  "status": "healthy",
  "uptime": 1284.52,
  "service": "Aura Livelihood & Skilling Platform Backend",
  "version": "1.0.0"
}
```
