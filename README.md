# Aura Livelihood & Skilling Platform

A unified, multi-ecosystem, AI-driven livelihood and vocational skilling platform engineered for scale, explainability, and multi-lingual accessibility across India.

---

## 1. Executive Summary & Core Principle

Aura connects three foundational ecosystems into a seamless, evidence-based livelihood pipeline:

```
BENEFICIARY ECOSYSTEM
  Cinematic Entry → Indic Language (22 Scheduled Languages) → Aisha / Arjun AI Companion 
  → Voice-First Onboarding → Structured Verified Profile → AI Skill Intelligence Engine
  → NCO-2015 Benchmarking & NSQF Alignment → Adaptive Diagnostic Assessment (When Warranted)
  → Personalized Modular Learning Paths → Opportunity Discovery & Explainable Job Matching
  → Confirmed Review & Apply → Hiring Pipeline → Long-Term Livelihood Outcome

EMPLOYER ECOSYSTEM
  Secure Auth → Verified Enterprise Profile → AI Natural Language Job Vacancy Creator
  → Real-Time Candidate Discovery with Skill-Gap Transparency → Multi-Stage Hiring Pipeline 
  (New → Reviewed → Shortlisted → Interview → Selected → Hired) → Audit History

ADMIN COMMAND CENTER
  Strict Server-Side Allowlist Authentication (Zero Client Elevation) → Platform Overview
  → Beneficiary Directory → Skill Intelligence & NCO Benchmarks → Occupational Pathways
  → Training & Provider Intelligence → Employer Verification → Job Registry → Applications
  → Multi-Channel Grievance Management → Language Resource Management → Regional Heatmaps
  → Immutable Audit Trails → Microservice & Provider Telemetry
```

---

## 2. Technology Architecture

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Routing**: React Router 7 with strictly partitioned layouts:
  - Public & Onboarding flow (`/`, `/location`, `/language`, `/companion`, `/login`, `/role-select`)
  - Beneficiary Journey (`/profile`, `/skills`, `/assessment`, `/learning`, `/career`, `/opportunities`, `/jobs/:id`, `/applications`, `/help`)
  - Employer Dashboard (`/employer`, `/employer/company`, `/employer/jobs`, `/employer/jobs/new`, `/employer/candidates`, `/employer/applications`, `/employer/analytics`)
  - Admin Command Center (`/admin/dashboard`, `/admin/beneficiaries`, `/admin/skills`, `/admin/occupations`, `/admin/training`, `/admin/employers`, `/admin/jobs`, `/admin/applications`, `/admin/complaints`, `/admin/languages`, `/admin/analytics`, `/admin/audit`, `/admin/system`)
- **Visual Design**: Royal Blue cinematic visual system with persistent background video orchestration (`mobile.mp4` / `laptop.mp4`), glassmorphism, responsive grid (360px mobile to 1920px 4K), and high-contrast typography.
- **Icons**: Lucide Icons
- **State Management**: Strongly-typed local application state and centralized REST service clients.

### Backend
- **Runtime**: Node.js & TypeScript (`tsx`)
- **Server Framework**: Express 5 with JSON payload validation, CORS isolation, and centralized error logging.
- **Data Layer**:
  - Relational Schema: PostgreSQL with Prisma ORM (`prisma/schema.prisma`) featuring 25+ relational models, indexes, transactions, foreign keys, and audit fields.
  - High-Speed In-Memory Relational Engine (`server/src/services/store.ts`): Pre-seeded with official NCO-2015 benchmarks, verified employers, published opportunities, and localized training courses.
- **Security & Authorization**:
  - SHA-256 HMAC hashed OTP storage with salt, expiration timers, and brute-force attempt limits.
  - Role-Based Access Control (RBAC) middleware (`requireRole('BENEFICIARY' | 'EMPLOYER' | 'ADMIN')`).
  - Strict server-side Admin verification via `ADMIN_EMAIL_ALLOWLIST` and `ADMIN_PHONE_ALLOWLIST` (zero credentials exposed to frontend bundles).

### AI & Voice Layer
- **Provider Abstraction Architecture**: Pluggable `LLMProvider`, `STTProvider`, `TTSProvider`, and `EmbeddingProvider` interfaces.
- **Explainable Matching Engine**: Computes exact skill overlaps, skill gaps, location proximity, and training recommendations without discriminatory attributes or arbitrary scores.
- **NLP Job Creator**: Transforms natural language employer prompts (e.g., *"Need two senior mechanics in Salem for engine diagnostics"*) into validated, structured vacancies.
- **Grievance Structuring**: Classifies beneficiary grievances into actionable priority tiers with human-review triggers.

---

## 3. Directory Layout

```
.
├── .env.example                  # Environment variable contract
├── package.json                  # Scripts & dependencies
├── prisma/
│   ├── schema.prisma             # PostgreSQL schema (25+ production models)
│   └── seed.ts                   # Database seeder
├── server/
│   └── src/
│       ├── config/env.ts         # Zod validated env & admin allowlist logic
│       ├── middleware/auth.ts    # JWT authentication & requireAdmin middleware
│       ├── routes/               # Modular Express API routes
│       │   ├── admin.routes.ts
│       │   ├── ai.routes.ts
│       │   ├── assessments.routes.ts
│       │   ├── auth.routes.ts
│       │   ├── complaints.routes.ts
│       │   ├── employer.routes.ts
│       │   ├── jobs.routes.ts
│       │   ├── learning.routes.ts
│       │   ├── profile.routes.ts
│       │   └── skills.routes.ts
│       ├── services/store.ts     # In-memory relational store with NCO benchmarks
│       └── index.ts              # Express application entrypoint
├── src/
│   ├── components/               # Modular UI components across ecosystems
│   │   ├── ai-companion/         # Human portrait companion visual & speech UI
│   │   ├── auth/                 # Route guards (ProtectedRoute, AdminRoute)
│   │   ├── layout/               # Ecosystem layouts (Beneficiary, Employer, Admin)
│   │   └── intelligence/         # Skill cards, NCO maps, and gap visualizers
│   ├── locales/                  # 22 Scheduled Indian languages localization
│   ├── pages/                    # Multi-role route pages
│   └── services/                 # Frontend AI providers, auth, and API clients
├── scratch/
│   └── test-full-platform.ts     # Comprehensive 28-test integration test suite
└── docs/                         # In-depth architectural & deployment guides
```

---

## 4. Environment Variables

Create `.env` based on `.env.example`:

```env
NODE_ENV=development
PORT=5000

# Security & Sessions
AUTH_SECRET=aura_production_jwt_secret_key_2026_super_secure_entropy

# Server-Side Admin Allowlists (NEVER exposed to frontend bundle)
ADMIN_EMAIL_ALLOWLIST=dhilipanmurugesan705@gmail.com
ADMIN_PHONE_ALLOWLIST=6369605540,+916369605540

# AI Provider Configuration
LLM_PROVIDER=anthropic
LLM_API_KEY=
STT_PROVIDER=whisper
STT_API_KEY=
TTS_PROVIDER=elevenlabs
TTS_API_KEY=

# Storage & Infrastructure
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aura_db?schema=public
REDIS_URL=redis://localhost:6379
```

---

## 5. Development & Running

### Installation
```bash
npm install
```

### Typecheck & Quality Audit
```bash
# Validates both frontend and backend TypeScript definitions with 0 errors
npm run typecheck
```

### Running the End-to-End Test Suite
```bash
# Runs all 28 automated integration tests verifying security, auth, AI, and APIs
npm run test
```

### Running Locally
```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Dev Server (Port 5173 with /api proxy to 5000)
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 6. Verification & Security Guarantees

1. **Zero Competition Identifiers**: The public user interface displays zero competition labels, phase identifiers, or internal hackathon codes.
2. **Server-Side Admin Boundary**: Admin elevation is granted exclusively when the authenticated identity matches the server allowlist. Any frontend spoofing attempt returns `403 Forbidden` and logs a security alert.
3. **No Arbitrary AI Percentages**: Skill evaluation reports qualitative evidence states (`CONFIRMED`, `SUPPORTED`, `NEEDS_VERIFICATION`, `DEVELOPING`) backed by verified tools and tasks.
4. **Adaptive Assessment**: Quizzes are triggered only when diagnostic evidence requires practical verification.
5. **No Discriminatory Matching**: Matching utilizes transparent qualification overlaps and proximity without caste-based or demographic bias.
