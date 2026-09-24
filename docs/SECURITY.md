# Security & Privacy Protocols — Aura Platform

## 1. Threat Model & Security Posture

Aura adheres to Zero Trust principles across client and server boundaries:

1. **Client Code is Untrusted**:
   - Route guards (`ProtectedRoute`, `RoleRoute`, `AdminRoute`) serve solely as navigation and UX helpers.
   - All authorization decisions are strictly enforced on the server-side via JWT inspection and allowlist queries.
   - Client manipulation of `localStorage`, cookies, or route parameters yields an immediate `403 Forbidden` response.

2. **Server-Side Administrative Isolation**:
   - Administrative credentials (`dhilipanmurugesan705@gmail.com` and `6369605540`) are defined exclusively in server-side environment variables (`ADMIN_EMAIL_ALLOWLIST`, `ADMIN_PHONE_ALLOWLIST`).
   - Zero administrative emails, phone numbers, or tokens exist in frontend code or client bundles.

3. **Cryptographic OTP Protection**:
   - OTP codes are never stored in plaintext.
   - Codes are stored as SHA-256 HMAC digests keyed with the session's random `verificationId`.
   - Strict brute-force limits: Maximum 5 attempts per session, with a 3-minute hard expiration.

4. **Rate Limiting & Abuse Prevention**:
   - Phone verification requests are throttled per IP and phone number to prevent SMS bombing or spamming.
   - AI endpoints enforce request quotas to protect underlying LLM provider budgets.

5. **Input Validation & SQL Injection Immunity**:
   - All request bodies are strictly sanitized and parsed with Zod schemas.
   - Database operations use Prisma ORM with parameterized queries, eliminating SQL injection vectors.

6. **Immutable Audit Trails**:
   - Every sensitive administrative, application, or profile modification generates an immutable audit record:
     `{ id, action, resource, userId, targetId, ipAddress, timestamp, details }`
   - Logs are retained in an append-only collection viewable exclusively from the Admin Command Center.

---

## 2. Privacy & Data Minimization

- **Minimal Collection**: Beneficiary onboarding collects only vocational and career-relevant data (experience, education, tools, mobility).
- **Zero Demographic Profiling**: Sensitive caste, religion, or community information is NEVER collected or used as job matching signals.
- **Privacy Controls**: Contact information is masked until the beneficiary explicitly confirms their application for a specific opportunity.
