export type AuthProviderType = 'google' | 'phone';

export interface UserSession {
  uid: string;
  phoneNumber?: string;
  email?: string;
  displayName?: string;
  provider: AuthProviderType;
  role?: 'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO' | null;
  createdAt: number;
  token: string;
}

export interface OtpVerificationPayload {
  phoneNumber: string;
  code: string;
  verificationId: string;
}

export interface AuthError {
  code: string;
  message: string;
  field?: 'phone' | 'otp' | 'general';
}
