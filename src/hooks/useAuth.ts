import { useState, useCallback, useEffect } from 'react';
import { UserSession, AuthError } from '../types/auth';
import { authService } from '../services/authService';

export type AuthFlowStep = 'METHOD_SELECTION' | 'PHONE_INPUT' | 'OTP_INPUT' | 'SUCCESS';

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(() => {
    return authService.getStoredSession();
  });
  const [step, setStep] = useState<AuthFlowStep>('METHOD_SELECTION');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Timer countdown for OTP resend
  useEffect(() => {
    let interval: any = null;
    if (step === 'OTP_INPUT' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendTimer]);

  const selectPhoneMethod = useCallback(() => {
    setStep('PHONE_INPUT');
    setAuthError(null);
  }, []);

  const resetToMethodSelection = useCallback(() => {
    setStep('METHOD_SELECTION');
    setAuthError(null);
    setVerificationId(null);
    setDevOtpHint(null);
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.signInWithGoogle();
      setIsLoading(false);
      if (res.success && res.session) {
        setSession(res.session);
        setStep('SUCCESS');
        return res.session;
      } else if (res.error) {
        setAuthError(res.error);
        throw res.error;
      }
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const handleSendPhoneOtp = useCallback(async (phone: string, code: string = '+91') => {
    setIsLoading(true);
    setAuthError(null);
    setPhoneNumber(phone);
    setCountryCode(code);

    try {
      const res = await authService.sendPhoneOtp(code, phone);
      setIsLoading(false);

      if (res.success && res.verificationId) {
        setVerificationId(res.verificationId);
        setStep('OTP_INPUT');
        setResendTimer(30);
        setCanResend(false);
        // In sandbox dev mode, retrieve the generated test code
        const devOtp = authService.getActiveSandboxOtp();
        setDevOtpHint(devOtp);
        return res.verificationId;
      } else if (res.error) {
        setAuthError(res.error);
        throw res.error;
      }
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const handleResendOtp = useCallback(async () => {
    if (!canResend || !phoneNumber) return;
    return handleSendPhoneOtp(phoneNumber, countryCode);
  }, [canResend, phoneNumber, countryCode, handleSendPhoneOtp]);

  const handleVerifyOtp = useCallback(async (otpCode: string) => {
    if (!verificationId) return;
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await authService.verifyOtp(verificationId, otpCode);
      setIsLoading(false);

      if (res.success && res.session) {
        setSession(res.session);
        setStep('SUCCESS');
        return res.session;
      } else if (res.error) {
        setAuthError(res.error);
        throw res.error;
      }
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }, [verificationId]);

  const logout = useCallback(() => {
    authService.clearSession();
    setSession(null);
    setStep('METHOD_SELECTION');
    setPhoneNumber('');
    setVerificationId(null);
    setDevOtpHint(null);
  }, []);

  const selectRole = useCallback(async (role: 'BENEFICIARY' | 'EMPLOYER' | 'ADMIN' | 'NGO') => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authService.selectRole(role);
      setIsLoading(false);
      if (res.success && res.session) {
        setSession(res.session);
        return res.session;
      } else {
        const err: AuthError = {
          code: 'ROLE_ERROR',
          message: res.error || 'Failed to select role.',
        };
        setAuthError(err);
        throw err;
      }
    } catch (err: any) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    session,
    isAuthenticated: Boolean(session),
    step,
    phoneNumber,
    countryCode,
    isLoading,
    authError,
    devOtpHint,
    resendTimer,
    canResend,
    selectPhoneMethod,
    resetToMethodSelection,
    handleGoogleSignIn,
    handleSendPhoneOtp,
    handleResendOtp,
    handleVerifyOtp,
    selectRole,
    logout,
  };
}
