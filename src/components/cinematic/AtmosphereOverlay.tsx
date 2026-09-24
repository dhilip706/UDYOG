import React from 'react';

export const AtmosphereOverlay: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 3,
      }}
      aria-hidden="true"
    >
      {/* Subtle Royal Navy Gradient to ensure text readability without hiding video */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(5, 10, 20, 0.45) 0%, rgba(5, 10, 20, 0.2) 40%, rgba(5, 10, 20, 0.65) 100%)',
        }}
      />

      {/* Very subtle edge vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 100px rgba(5, 10, 20, 0.8)',
        }}
      />
    </div>
  );
};
