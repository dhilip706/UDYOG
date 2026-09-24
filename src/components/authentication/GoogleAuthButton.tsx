import React from 'react';

interface GoogleAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  label?: string;
  isHighlighted?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onClick,
  isLoading = false,
  label = 'Continue with Google',
  isHighlighted = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      id="google-auth-btn"
      className={`login-auth-btn google-auth-btn ${isHighlighted ? 'guidance-highlight' : ''}`}
      style={{
        width: '100%',
        minHeight: '48px',
        padding: '10px 16px',
        borderRadius: '8px',
        background: 'rgba(11, 36, 82, 0.85)',
        border: '1px solid rgba(23, 74, 145, 0.55)',
        color: '#F5F7FA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(7, 26, 58, 0.4)',
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? (
        <span
          style={{
            width: '18px',
            height: '18px',
            border: '2px solid rgba(245, 247, 250, 0.3)',
            borderTopColor: '#F5F7FA',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }}
        />
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          style={{ flexShrink: 0, display: 'inline-block' }}
          aria-hidden="true"
        >
          <path
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            fill="#EA4335"
          />
        </svg>
      )}
      <span
        style={{
          fontFamily: 'inherit',
          fontSize: '0.9375rem',
          fontWeight: 500,
          lineHeight: 1.35,
          color: '#F5F7FA',
          textAlign: 'center',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {label}
      </span>
    </button>
  );
};
