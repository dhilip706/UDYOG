import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ArrowRight, Lock } from 'lucide-react';

interface PhoneAuthFormProps {
  onSendOtp: (phoneNumber: string, countryCode: string) => Promise<any>;
  isLoading: boolean;
  error?: string;
  isHighlighted?: boolean;
  labels: {
    phoneLabel: string;
    phonePlaceholder: string;
    sendOtpButton: string;
    secureNotice: string;
  };
}

export const PhoneAuthForm: React.FC<PhoneAuthFormProps> = ({
  onSendOtp,
  isLoading,
  error,
  isHighlighted = false,
  labels,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.length !== 10) {
      setLocalError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLocalError(null);
    try {
      await onSendOtp(cleanNumber, countryCode);
    } catch {
      // Handled by parent
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(val);
    if (localError) setLocalError(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div style={{ marginBottom: '18px' }}>
        <Input
          id="phone-input-field"
          label={labels.phoneLabel}
          type="tel"
          placeholder={labels.phonePlaceholder}
          value={phoneNumber}
          onChange={handlePhoneChange}
          error={error || localError || undefined}
          isHighlighted={isHighlighted}
          autoFocus
          prefixElement={
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-primary)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value="+91" style={{ background: '#0B1628', color: '#FFF' }}>
                  +91 (IN)
                </option>
                <option value="+1" style={{ background: '#0B1628', color: '#FFF' }}>
                  +1 (US)
                </option>
                <option value="+44" style={{ background: '#0B1628', color: '#FFF' }}>
                  +44 (UK)
                </option>
                <option value="+971" style={{ background: '#0B1628', color: '#FFF' }}>
                  +971 (UAE)
                </option>
              </select>
              <div
                style={{
                  width: '1px',
                  height: '16px',
                  background: 'var(--color-navy-border)',
                  margin: '0 4px',
                }}
              />
            </div>
          }
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        style={{ width: '100%', marginBottom: '16px' }}
        rightIcon={<ArrowRight size={16} />}
      >
        {labels.sendOtpButton}
      </Button>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: 'var(--color-text-subtle)',
          fontSize: '0.75rem',
          textAlign: 'center',
        }}
      >
        <Lock size={12} color="var(--color-accent-steel)" />
        <span>{labels.secureNotice}</span>
      </div>
    </form>
  );
};
