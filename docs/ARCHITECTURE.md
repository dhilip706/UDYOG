# Architecture Specification — Aura Platform

## 1. System Topology

The Aura platform architecture is partitioned into three discrete layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  React 19 • TypeScript • Vite • Persistent Cinema Orchestrator │
│  Responsive Grid (360px - 1920px) • Indic Font Stack Fallbacks │
└─────────────────┬───────────────────────────────┬───────────────┘
                  │ HTTPS / WSS                   │ REST API (/api)
                  ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY & BACKEND                        │
│  Express 5 • TypeScript • Zod Validation • JWT Authentication   │
│  Strict RBAC & Server Allowlist Authorization                   │
│  Structured Request Logger • Rate Limiter                       │
└───────┬────────────────────────┬──────────────────────┬─────────┘
        │                        │                      │
        ▼                        ▼                      ▼
┌───────────────┐        ┌───────────────┐      ┌─────────────────┐
│   DATABASE    │        │  CACHE/QUEUE  │      │   AI PROVIDER   │
│  PostgreSQL   │        │     Redis     │      │   ABSTRACTION   │
│  Prisma ORM   │        │  Background   │      │  LLM, STT, TTS  │
│  25+ Relational│       │  Workers &    │      │  Explainable    │
│  Models &     │        │  Notification │      │  Matching       │
│  Audit Logs   │        │  Queue        │      │  Engine         │
└───────────────┘        └───────────────┘      └─────────────────┘
```

---

## 2. Multi-Ecosystem Architecture

### Ecosystem 1: Beneficiary Journey
1. **Cinematic Entry**: Ambient viewport video loading (`mobile.mp4` / `laptop.mp4`) with smooth fade-in and battery-aware pause.
2. **Language Negotiation**: Dynamic detection via browser geolocation with 22 Indic scheduled language fallbacks.
3. **Conversational Onboarding**: Aisha / Arjun human portrait visual system conducting audio-visual step-by-step interview.
4. **Structured Profile Extraction**: Normalizes spoken input into identity, education, previous occupations, verified tool proficiencies, and mobility preference.
5. **Skill Intelligence Engine**: Categorizes extracted capabilities into evidence-based qualitative tiers:
   - `CONFIRMED`: Verified via formal certification, documented apprenticeships, or demonstrated assessment.
   - `SUPPORTED`: Backed by tool and multi-year employment context.
   - `NEEDS_VERIFICATION`: Self-reported without corroborated tooling.
   - `DEVELOPING`: Active learning pathway in progress.
   - `MISSING`: Prerequisite gap required for target occupational benchmarks.
6. **NCO & NSQF Mapping**: Cross-references verified profiles against National Classification of Occupations (NCO-2015) benchmarks.
7. **Adaptive Assessment**: Triggered selectively when diagnostic verification is essential.
8. **Personalized Learning**: Structured 5 to 7 day modular curriculums adapting difficulty to user quiz performance.
9. **Opportunity Matching & Confirmed Application**: Transparent skill-overlap scoring with user review before one-click confirmed submission.

### Ecosystem 2: Employer Hiring Pipeline
1. **Enterprise Identity**: Verified business profiles with sectoral classification.
2. **AI NLP Job Creator**: Translates conversational prompts into structured vacancies adhering to national standards.
3. **Candidate Matching with Gap Transparency**: Displays matched skills, missing capabilities, and training recommendations for every candidate.
4. **Full Hiring Lifecycle**:
   - `NEW` → `UNDER_REVIEW` → `SHORTLISTED` → `INTERVIEW` → `SELECTED` → `HIRED`
5. **Interview Scheduling & Outcome Recording**: Tracks verified livelihood placements.

### Ecosystem 3: Admin Command Center
1. **Server-Side Allowlist Barrier**: Restricts administrative commands exclusively to authorized identities.
2. **Comprehensive Telemetry**:
   - Regional skill availability heatmaps across districts.
   - Occupational supply-demand equilibrium metrics.
   - Training completion and placement conversion rates.
   - Centralized grievance ticket dispatching and status escalation.
   - Immutable security audit logs recording every privileged administrative action.

---

## 3. Communication Contracts & Error Handling

- **Error Format**: All errors return structured JSON:
  ```json
  {
    "error": "STRING_CODE",
    "message": "Human-friendly explanatory description.",
    "details": {}
  }
  ```
- **Resilience**: Client features fallback mechanisms for offline caching, low-connectivity networks, and device permission denial (camera/microphone/location).
