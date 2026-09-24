import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface AnalysisTransitionViewProps {
  companionName: string;
  onComplete: () => void;
}

export const AnalysisTransitionView: React.FC<AnalysisTransitionViewProps> = ({
  companionName,
  onComplete,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Step 1: 800ms
    const t1 = setTimeout(() => {
      setStep(1);
    }, 800);

    // Step 2: 1800ms -> complete
    const t2 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#071A3A',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Radial Gradient */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(23, 74, 145, 0.22) 0%, rgba(7, 26, 58, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="classic-navy-surface"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '44px 32px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          animation: 'classic-fade-in 0.5s ease-out',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Subtle Classic Progress Indicator (No giant orb, no futuristic scanning) */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(18, 54, 111, 0.8)',
            border: '1.5px solid var(--color-steel-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(42, 105, 186, 0.35)',
            transition: 'all 0.4s ease',
          }}
        >
          {step === 0 ? (
            <Sparkles size={26} color="var(--color-steel-light)" style={{ animation: 'pulse 1.8s infinite' }} />
          ) : (
            <ShieldCheck size={28} color="#FFFFFF" />
          )}
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)',
            fontWeight: 500,
            color: '#FFFFFF',
            marginBottom: '12px',
            lineHeight: 1.3,
          }}
        >
          {step === 0
            ? t.skillIntelligence.analyzingSubtitle
            : t.skillIntelligence.analyzingTitle}
        </h2>

        {/* Informative Subtext */}
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          {t.skillIntelligence.transitionNote}
        </p>

        {/* Subtle Minimalist Loading Bar */}
        <div
          style={{
            width: '100%',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: step === 0 ? '55%' : '100%',
              background: 'linear-gradient(90deg, #174A91, #8BAEDB)',
              borderRadius: '2px',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>

        {/* Companion Attestation Footer */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>Guided by {companionName}</span>
          <span>•</span>
          <span>Explainable Skill Engine</span>
        </div>
      </div>
    </div>
  );
};
