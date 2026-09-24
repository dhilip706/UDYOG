import React from 'react';

interface CinematicTransitionProps {
  isActive: boolean;
  companionName?: string;
  companionSpeech?: string;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        pointerEvents: 'all',
        background: 'rgba(5, 6, 5, 0.82)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'cinematic-bloom 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
      aria-hidden="true"
    >
      {/* Expanding luminous ring */}
      <div
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '2px solid rgba(200, 169, 107, 0.6)',
          boxShadow: '0 0 80px rgba(200, 169, 107, 0.45)',
          animation: 'breathing 2s infinite ease-in-out',
        }}
      />

      <style>{`
        @keyframes cinematic-bloom {
          0% {
            opacity: 0;
            transform: scale(0.96);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
