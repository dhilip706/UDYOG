import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { GoogleAuthButton } from './GoogleAuthButton';
import { PhoneAuthForm } from './PhoneAuthForm';
import { OtpVerificationForm } from './OtpVerificationForm';
import { ArrowLeft, Phone, AlertCircle } from 'lucide-react';

interface LoginPanelProps {
  onSuccess: () => void;
  onGuideStateChange: (
    text: string,
    state: 'IDLE' | 'SPEAKING' | 'GUIDING' | 'THINKING' | 'ERROR' | 'SUCCESS',
    targetId?: string
  ) => void;
  highlightTargetId: string | null;
}

export const LoginPanel: React.FC<LoginPanelProps> = ({
  onSuccess,
  onGuideStateChange,
  highlightTargetId,
}) => {
  const { t } = useLanguage();
  const {
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
  } = useAuth();

  const handleGoogleClick = async () => {
    onGuideStateChange(t.common.loading, 'THINKING');
    try {
      await handleGoogleSignIn();
      onGuideStateChange(t.companion.successMessage, 'SUCCESS');
      onSuccess();
    } catch (err: any) {
      onGuideStateChange(err.message || t.companion.googleError, 'ERROR');
    }
  };

  const handlePhoneSelect = () => {
    selectPhoneMethod();
    onGuideStateChange(t.companion.enterPhonePrompt, 'GUIDING', 'phone-input-field');
  };

  const onSendOtpSubmit = async (phone: string, code: string) => {
    onGuideStateChange(t.common.loading, 'THINKING');
    try {
      await handleSendPhoneOtp(phone, code);
      onGuideStateChange(t.companion.enterOtpPrompt, 'GUIDING', 'otp-input-box');
    } catch (err: any) {
      onGuideStateChange(err.message || t.companion.invalidPhoneError, 'ERROR', 'phone-input-field');
    }
  };

  const onVerifyOtpSubmit = async (code: string) => {
    onGuideStateChange(t.common.loading, 'THINKING');
    try {
      await handleVerifyOtp(code);
      onGuideStateChange(t.companion.successMessage, 'SUCCESS');
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err: any) {
      if (err.code === 'OTP_EXPIRED') {
        onGuideStateChange(t.companion.otpExpiredError, 'ERROR', 'otp-input-box');
      } else {
        onGuideStateChange(t.companion.otpError, 'ERROR', 'otp-input-box');
      }
    }
  };

  return (
    <div
      className="royal-login-card"
      style={{
        width: '100%',
        maxWidth: '400px',
        padding: '28px 24px',
        position: 'relative',
        zIndex: 10,
        background: 'rgba(11, 36, 82, 0.90)',
        border: '1px solid rgba(23, 74, 145, 0.55)',
        borderRadius: '14px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 16px 40px -10px rgba(7, 26, 58, 0.8), 0 0 1px rgba(139, 174, 219, 0.25)',
        animation: 'classic-fade-in 0.3s ease-out',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* Back button if in sub-step */}
      {step !== 'METHOD_SELECTION' && (
        <button
          type="button"
          onClick={() => {
            resetToMethodSelection();
            onGuideStateChange(t.companion.chooseMethod, 'SPEAKING');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            marginBottom: '16px',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          <ArrowLeft size={15} />
          <span>{t.common.back}</span>
        </button>
      )}

      {/* Step 1: Authentication Method Selection */}
      {step === 'METHOD_SELECTION' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <h2
              style={{
                fontSize: '1.4rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            >
              {t.login.title}
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {t.login.subtitle}
            </p>
          </div>

          {authError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'var(--color-error-bg)',
                border: '1px solid var(--color-error)',
                fontSize: '0.8125rem',
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              <AlertCircle size={15} color="var(--color-error)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{authError.message}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* 1. Google Button */}
            <GoogleAuthButton
              onClick={handleGoogleClick}
              isLoading={isLoading}
              label={t.login.googleButton}
              isHighlighted={highlightTargetId === 'google-auth-btn'}
            />

            {/* 2. Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '6px 0',
                color: 'var(--color-text-subtle)',
                fontSize: '0.8125rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(23, 74, 145, 0.45)' }} />
              <span style={{ padding: '0 12px', letterSpacing: '0.04em' }}>
                {t.login.orDivider}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(23, 74, 145, 0.45)' }} />
            </div>

            {/* 3. Phone Button (Same height, width, padding, border radius, alignment as Google) */}
            <button
              type="button"
              onClick={handlePhoneSelect}
              id="phone-auth-btn"
              className={`login-auth-btn phone-auth-btn ${
                highlightTargetId === 'phone-auth-btn' ? 'guidance-highlight' : ''
              }`}
              style={{
                width: '100%',
                minHeight: '48px',
                padding: '10px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
                border: '1px solid rgba(139, 174, 219, 0.4)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 14px rgba(7, 26, 58, 0.5)',
              }}
            >
              <Phone size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: 'inherit',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}
              >
                {t.login.phoneButton}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Phone Input */}
      {step === 'PHONE_INPUT' && (
        <PhoneAuthForm
          onSendOtp={onSendOtpSubmit}
          isLoading={isLoading}
          error={authError?.field === 'phone' ? authError.message : undefined}
          isHighlighted={highlightTargetId === 'phone-input-field'}
          labels={{
            phoneLabel: t.login.phoneLabel,
            phonePlaceholder: t.login.phonePlaceholder,
            sendOtpButton: t.login.sendOtpButton,
            secureNotice: t.login.secureNotice,
          }}
        />
      )}

      {/* Step 3: OTP Verification */}
      {step === 'OTP_INPUT' && (
        <OtpVerificationForm
          phoneNumber={phoneNumber}
          countryCode={countryCode}
          devOtpHint={devOtpHint}
          resendTimer={resendTimer}
          canResend={canResend}
          isLoading={isLoading}
          error={authError?.field === 'otp' ? authError.message : undefined}
          isHighlighted={highlightTargetId === 'otp-input-box'}
          onVerify={onVerifyOtpSubmit}
          onResend={handleResendOtp}
          onEditNumber={resetToMethodSelection}
          labels={{
            otpTitle: t.login.otpTitle,
            otpSubtitle: t.login.otpSubtitle,
            verifyButton: t.login.verifyButton,
            resendIn: t.login.resendIn,
            resendButton: t.login.resendButton,
            editNumber: t.login.editNumber,
            sandboxNotice: t.login.sandboxNotice,
          }}
        />
      )}

      <style>{`
        .login-auth-btn:hover:not(:disabled) {
          filter: brightness(1.12);
          transform: translateY(-1px);
        }
        .login-auth-btn:active:not(:disabled) {
          transform: translateY(0);
          filter: brightness(0.96);
        }
      `}</style>
    </div>
  );
};
