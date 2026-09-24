# Authentication & Authorization Architecture — Aura Platform

## 1. Authentication Modalities

Aura provides dual authentication pathways engineered for low-barrier accessibility and enterprise security:

### A. Phone Number + One-Time Password (OTP)
- **Initiation (`POST /api/auth/phone/start`)**:
  - Validates 10-digit mobile number format against Indian telecommunication standards.
  - Generates a cryptographically random 6-digit verification code.
  - Generates a unique `verificationId` session identifier.
  - Computes a SHA-256 HMAC hash of the OTP salted with `verificationId`.
  - Stores only the hash, timestamp, and attempt counter. Plaintext OTP is NEVER persisted.
- **Verification (`POST /api/auth/phone/verify`)**:
  - Compares HMAC hash of client-submitted code against stored hash.
  - Enforces a strict 3-minute expiration window.
  - Limits validation attempts to 5 before automatic session revocation.
  - Upon success, deletes OTP session and issues a cryptographically signed JWT.

### B. Google OAuth
- Authenticates identity token, verifies email validity, and retrieves verified name and avatar.

---

## 2. Multi-Role Access Control (RBAC)

Following authentication, users select their operating role:
1. **JOB SEEKER (`BENEFICIARY`)**
2. **HIRING / EMPLOYER (`EMPLOYER`)**
3. **ADMIN COMMAND CENTER (`ADMIN`)**

Role selection is executed via `POST /api/auth/select-role` and validated server-side.

---

## 3. Strict Server-Side Admin Authorization Boundary

Admin command center privileges are governed by an inviolable server-side allowlist.

### Configuration
```env
ADMIN_EMAIL_ALLOWLIST=dhilipanmurugesan705@gmail.com
ADMIN_PHONE_ALLOWLIST=6369605540,+916369605540
```

### Security Enforcement Rules
1. **Zero Client-Side Credentials**: Authorized emails or phone numbers MUST NEVER exist in frontend code bundles.
2. **Server-Side Allowlist Verification**:
   ```typescript
   export function isAuthorizedAdmin(email?: string, phoneNumber?: string): boolean {
     const emailList = env.ADMIN_EMAIL_ALLOWLIST.split(',').map((e) => e.trim().toLowerCase());
     const phoneList = env.ADMIN_PHONE_ALLOWLIST.split(',').map((p) => p.replace(/\D/g, ''));

     if (email && emailList.includes(email.trim().toLowerCase())) return true;
     if (phoneNumber) {
       const clean = phoneNumber.replace(/\D/g, '');
       return phoneList.some((p) => clean.endsWith(p));
     }
     return false;
   }
   ```
3. **Automatic 403 Forbidden Rejection**:
   - If an unauthorized identity attempts `POST /api/auth/select-role` with `role: "ADMIN"`, the server returns `403 Forbidden`.
   - If an unauthorized identity attempts to query `/api/admin/*`, the `requireAdmin` middleware logs an immediate security alert and rejects the request with `403 Forbidden`.
   - Client-side tampering of `localStorage`, cookies, or URL routes is completely neutralized by this server boundary.
