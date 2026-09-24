import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isHighlighted?: boolean;
  prefixElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  isHighlighted = false,
  prefixElement,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            textAlign: 'left',
          }}
        >
          {label}
        </label>
      )}

      <div
        className={`input-container ${isHighlighted ? 'guidance-highlight' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(7, 17, 31, 0.75)',
          border: `1px solid ${
            error ? 'var(--color-error)' : isHighlighted ? 'var(--color-accent-steel)' : 'var(--color-navy-border)'
          }`,
          borderRadius: '10px',
          padding: '0 14px',
          transition: 'all 0.2s ease',
        }}
      >
        {prefixElement && (
          <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
            {prefixElement}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          style={{
            width: '100%',
            height: '46px',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-body)',
          }}
          className={`classic-input ${className}`}
          {...props}
        />
      </div>

      {error && (
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-error)',
            marginTop: '2px',
            textAlign: 'left',
          }}
        >
          {error}
        </span>
      )}

      <style>{`
        .input-container:focus-within {
          border-color: var(--color-accent-steel) !important;
          box-shadow: 0 0 12px var(--color-accent-glow) !important;
          background: rgba(11, 22, 40, 0.9) !important;
        }
        .classic-input::placeholder {
          color: rgba(174, 184, 198, 0.45);
        }
      `}</style>
    </div>
  );
});

Input.displayName = 'Input';
