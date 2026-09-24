import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Edit3, KeyRound, RefreshCw, AlertCircle } from 'lucide-react';

interface OtpVerificationFormProps {
  phoneNumber: string;
  countryCode: string;
  devOtpHint: string | null;
  resendTimer: number;
  canResend: boolean;
  isLoading: boolean;
  error?: string;
  isHighlighted?: boolean;
  onVerify: (otpCode: string) => Promise<any>;
  onResend: () => Promise<any>;
  onEditNumber: () => void;
  labels: {
    otpTitle: string;
    otpSubtitle: string;
    verifyButton: string;
    resendIn: string;
    resendButton: string;
    editNumber: string;
    sandboxNotice: string;
  };
}

export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  phoneNumber,
  countryCode,
  devOtpHint,
  resendTimer,
  canResend,
  isLoading,
  error,
  isHighlighted = false,
  onVerify,
  onResend,
  onEditNumber,
  labels,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const char = cleanValue.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const fillTestOtp = () => {
    if (!devOtpHint) return;
    const split = devOtpHint.split('').slice(0, 6);
    setDigits(split);
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
            marginBottom: '4px',
          }}
        >
          {labels.otpTitle}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          {labels.otpSubtitle}{' '}
          <strong style={{ color: 'var(--color-text-primary)' }}>
            {countryCode} {phoneNumber}
          </strong>
        </p>

        <button
          type="button"
          onClick={onEditNumber}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            marginTop: '6px',
            fontSize: '0.75rem',
            color: 'var(--color-accent-steel)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          <Edit3 size={12} />
          {labels.editNumber}
        </button>
      </div>

      {/* Development / Sandbox Code Indicator */}
      {devOtpHint && (
        <div
          onClick={fillTestOtp}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'var(--color-navy-elevated)',
            border: '1px solid var(--color-navy-border)',
            marginBottom: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          title="Click to auto-fill verification code"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <KeyRound size={14} color="var(--color-accent-steel)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Verification Code:
            </span>
          </div>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: 'var(--color-text-primary)',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(5, 10, 20, 0.8)',
            }}
          >
            {devOtpHint}
          </span>
        </div>
      )}

      {/* 6 Segmented OTP Inputs */}
      <div
        id="otp-input-box"
        className={isHighlighted ? 'guidance-highlight' : ''}
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '18px',
          padding: '2px',
          borderRadius: '10px',
        }}
      >
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            style={{
              width: '42px',
              height: '48px',
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: 600,
              fontFamily: 'var(--font-display)',
              borderRadius: '8px',
              background: 'rgba(7, 17, 31, 0.8)',
              border: `1px solid ${
                error
                  ? 'var(--color-error)'
                  : digit
                  ? 'var(--color-accent-steel)'
                  : 'var(--color-navy-border)'
              }`,
              color: 'var(--color-text-primary)',
              transition: 'border-color 0.2s',
            }}
            className="otp-digit-input"
          />
        ))}
      </div>

      {error && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            textAlign: 'center',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!isComplete || isLoading}
        isLoading={isLoading}
        style={{ width: '100%', marginBottom: '14px' }}
        rightIcon={<ArrowRight size={16} />}
      >
        {labels.verifyButton}
      </Button>

      {/* Resend timer & button */}
      <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>
        {canResend ? (
          <button
            type="button"
            onClick={onResend}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-accent-steel)',
              fontWeight: 500,
            }}
          >
            <RefreshCw size={12} />
            {labels.resendButton}
          </button>
        ) : (
          <span style={{ color: 'var(--color-text-subtle)' }}>
            {labels.resendIn} <strong style={{ color: 'var(--color-text-primary)' }}>{resendTimer}s</strong>
          </span>
        )}
      </div>

      <style>{`
        .otp-digit-input:focus {
          border-color: var(--color-accent-steel) !important;
          box-shadow: 0 0 10px var(--color-accent-glow) !important;
          background: rgba(11, 22, 40, 0.95) !important;
        }
      `}</style>
    </form>
  );
};
