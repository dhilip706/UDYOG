import { UserSession, AuthError } from '../types/auth';

const AUTH_STORAGE_KEY = 'aura_auth_session';

interface SandboxVerificationData {
  verificationId: string;
  phoneNumber: string;
  otpCode: string;
  expiresAt: number;
}

class AuthService {
  private currentSandboxSession: SandboxVerificationData | null = null;
  private isFirebaseConfigured: boolean = false;

  constructor() {
    this.isFirebaseConfigured = Boolean(
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_API_KEY) && 
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FIREBASE_PROJECT_ID)
    );
  }

  public getIsSandbox(): boolean {
    return !this.isFirebaseConfigured;
  }

  public getActiveSandboxOtp(): string | null {
    if (this.currentSandboxSession && Date.now() < this.currentSandboxSession.expiresAt) {
      return this.currentSandboxSession.otpCode;
    }
    return null;
  }

  public getStoredSession(): UserSession | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public saveSession(session: UserSession): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Unable to persist auth session:', e);
    }
  }

  public clearSession(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  public async signInWithGoogle(): Promise<{ success: boolean; session?: UserSession; error?: AuthError }> {
    try {
      // In dev/evaluation mode, call backend /api/auth/google
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'seeker.demo@demo-org.in',
          displayName: 'Demo Seeker',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const session: UserSession = {
          uid: data.user.id,
          email: data.user.email,
          displayName: data.user.displayName,
          provider: 'google',
          role: data.user.role,
          createdAt: Date.now(),
          token: data.token,
        };
        this.saveSession(session);
        return { success: true, session };
      }
    } catch (e) {
      // Backend not running yet or offline, continue to fallback
    }

    if (this.isFirebaseConfigured) {
      return {
        success: false,
        error: {
          code: 'FIREBASE_NOT_INITIALIZED',
          message: 'Connecting to Firebase Authentication provider...',
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'GOOGLE_OAUTH_UNCONFIGURED',
        message: 'Google Sign-In requires VITE_FIREBASE_CLIENT_ID or server connection. Please use Phone OTP verification to test the live authentication lifecycle.',
      },
    };
  }

  public async sendPhoneOtp(
    countryCode: string, 
    phoneNumber: string
  ): Promise<{ success: boolean; verificationId?: string; error?: AuthError }> {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length !== 10 || !/^[6-9]\d{9}$/.test(cleanNumber)) {
      return {
        success: false,
        error: {
          code: 'INVALID_PHONE_NUMBER',
          message: "That number doesn't look complete. Please check it and try again.",
          field: 'phone',
        },
      };
    }

    // Try live server API first
    try {
      const res = await fetch('/api/auth/phone/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryCode, phoneNumber: cleanNumber }),
      });
      if (res.ok) {
        const data = await res.json();
        this.currentSandboxSession = {
          verificationId: data.verificationId,
          phoneNumber: `${countryCode}${cleanNumber}`,
          otpCode: data.devOtpHint || '123456',
          expiresAt: Date.now() + 3 * 60 * 1000,
        };
        return {
          success: true,
          verificationId: data.verificationId,
        };
      }
    } catch {
      // Fallback to local sandbox session
    }

    await new Promise((res) => setTimeout(res, 400));
    const verificationId = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    this.currentSandboxSession = {
      verificationId,
      phoneNumber: `${countryCode}${cleanNumber}`,
      otpCode: generatedOtp,
      expiresAt: Date.now() + 2 * 60 * 1000,
    };

    console.info(`[AuthService] OTP for ${countryCode}${cleanNumber} is: ${generatedOtp}`);

    return {
      success: true,
      verificationId,
    };
  }

  public async verifyOtp(
    verificationId: string, 
    userEnteredCode: string
  ): Promise<{ success: boolean; session?: UserSession; error?: AuthError }> {
    // Try live server API first
    try {
      const res = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, code: userEnteredCode.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        const session: UserSession = {
          uid: data.user.id,
          phoneNumber: data.user.phoneNumber,
          provider: 'phone',
          role: data.user.role,
          createdAt: Date.now(),
          token: data.token,
        };
        this.saveSession(session);
        this.currentSandboxSession = null;
        return { success: true, session };
      } else {
        const errData = await res.json();
        return {
          success: false,
          error: {
            code: errData.error || 'INVALID_CODE',
            message: errData.message || "That code didn't work. Let's try again.",
            field: 'otp',
          },
        };
      }
    } catch {
      // Fallback to local sandbox verification
    }

    await new Promise((res) => setTimeout(res, 500));

    if (!this.currentSandboxSession || this.currentSandboxSession.verificationId !== verificationId) {
      return {
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Verification session not found. Please request a new code.',
          field: 'otp',
        },
      };
    }

    if (Date.now() > this.currentSandboxSession.expiresAt) {
      return {
        success: false,
        error: {
          code: 'OTP_EXPIRED',
          message: "Your code has expired. I'll help you request another one.",
          field: 'otp',
        },
      };
    }

    if (this.currentSandboxSession.otpCode !== userEnteredCode.trim()) {
      return {
        success: false,
        error: {
          code: 'INVALID_CODE',
          message: "That code didn't work. Let's try again.",
          field: 'otp',
        },
      };
    }

    const session: UserSession = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      phoneNumber: this.currentSandboxSession.phoneNumber,
      provider: 'phone',
      role: null,
      createdAt: Date.now(),
      token: `jwt_${btoa(this.currentSandboxSession.phoneNumber + Date.now())}`,
    };

    this.saveSession(session);
    this.currentSandboxSession = null;

    return {
      success: true,
      session,
    };
  }

  /**
   * Set user role with server-side authorization check (Requirement 8 & 11)
   */
  public async selectRole(role: 'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO'): Promise<{ success: boolean; session?: UserSession; error?: string }> {
    const currentSession = this.getStoredSession();
    if (!currentSession) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      const res = await fetch('/api/auth/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.message || 'Unauthorized for this role.' };
      }

      const data = await res.json();
      const updatedSession: UserSession = {
        ...currentSession,
        role: data.role,
        token: data.token || currentSession.token,
      };
      this.saveSession(updatedSession);
      return { success: true, session: updatedSession };
    } catch {
      // Local fallback for offline demo
      // Strict rule: Admin role requires server-side allowlist verification.
      if (role === 'ADMIN') {
        return {
          success: false,
          error: 'Administrative privileges require active server verification. Access denied.',
        };
      }

      const updatedSession: UserSession = {
        ...currentSession,
        role,
      };
      this.saveSession(updatedSession);
      return { success: true, session: updatedSession };
    }
  }
}

export const authService = new AuthService();
