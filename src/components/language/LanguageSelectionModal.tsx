import React from 'react';
import { SupportedLanguageCode, LanguageOption } from '../../types/language';
import { Button } from '../ui/Button';
import { Globe, Check, X } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: SupportedLanguageCode;
  supportedLanguages: LanguageOption[];
  onSelectLanguage: (code: SupportedLanguageCode) => void;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  supportedLanguages,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'classic-fade-in 0.25s ease-out',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '28px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--color-navy-elevated)',
                border: '1px solid var(--color-navy-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={18} color="var(--color-accent-steel)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
                Select Language
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Choose your preferred interface language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              padding: '6px',
              borderRadius: '6px',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Grid of languages */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '24px',
            maxHeight: '340px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {supportedLanguages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--color-navy-elevated)' : 'rgba(7, 17, 31, 0.6)',
                  border: `1px solid ${
                    isSelected ? 'var(--color-accent-steel)' : 'var(--color-navy-border)'
                  }`,
                  textAlign: 'left',
                  transition: 'all 0.18s ease',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                      lineHeight: '1.4',
                    }}
                  >
                    {lang.nativeName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {lang.name}
                  </div>
                </div>
                {isSelected && <Check size={16} color="var(--color-accent-steel)" />}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
