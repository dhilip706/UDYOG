import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'white' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    borderRadius: '8px',
    fontWeight: 500,
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    lineHeight: 1.35,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    position: 'relative',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.6 : 1,
    minHeight: size === 'sm' ? '36px' : size === 'lg' ? '48px' : '44px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '10px 16px' : '8px 16px',
    fontSize: size === 'sm' ? '0.8125rem' : size === 'lg' ? '0.9375rem' : '0.875rem',
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(139, 174, 219, 0.4)',
          boxShadow: '0 4px 14px rgba(7, 26, 58, 0.5)',
        };
      case 'white':
        return {
          background: '#F5F7FA',
          color: '#071A3A',
          border: '1px solid #FFFFFF',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
        };
      case 'secondary':
        return {
          background: 'rgba(11, 36, 82, 0.85)',
          color: '#F5F7FA',
          border: '1px solid rgba(23, 74, 145, 0.55)',
          backdropFilter: 'blur(8px)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--color-text-muted)',
          border: '1px solid transparent',
        };
      case 'danger':
        return {
          background: 'var(--color-error-bg)',
          color: 'var(--color-error)',
          border: '1px solid var(--color-error)',
        };
    }
  };

  return (
    <button
      style={{ ...baseStyles, ...getVariantStyles(), ...style }}
      className={`royal-btn ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            display: 'inline-block',
          }}
        />
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .royal-btn:hover:not(:disabled) {
          filter: brightness(1.12);
          transform: translateY(-1px);
        }
        .royal-btn:active:not(:disabled) {
          transform: translateY(0);
          filter: brightness(0.96);
        }
      `}</style>
    </button>
  );
};
