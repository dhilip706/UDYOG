import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StructuredUserProfile } from '../../types/onboarding';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProfileSuccessScreenProps {
  profile: StructuredUserProfile;
  companionName: string;
}

export const ProfileSuccessScreen: React.FC<ProfileSuccessScreenProps> = ({
  profile,
  companionName,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        padding: '32px 20px',
        background: 'linear-gradient(180deg, rgba(7, 26, 58, 0.82) 0%, rgba(11, 36, 82, 0.75) 45%, rgba(7, 26, 58, 0.88) 100%)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      <div
        className="classic-navy-surface"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '580px',
          padding: '42px 32px',
          textAlign: 'center',
          animation: 'classic-fade-in 0.4s ease-out',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Success Icon */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(18, 54, 111, 0.75)',
            border: '2px solid var(--color-steel-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 24px rgba(42, 105, 186, 0.35)',
          }}
        >
          <CheckCircle2 size={34} color="var(--color-steel-light)" />
        </div>

        {/* Title & Subtitle */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 1.95rem)',
            fontWeight: 500,
            color: '#FFFFFF',
            marginBottom: '10px',
          }}
        >
          {t.onboarding.profileReadyTitle}
        </h1>

        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-muted)',
            marginBottom: '26px',
            lineHeight: 1.5,
          }}
        >
          {t.onboarding.profileReadySubtitle}
        </p>

        {/* Profile Snapshot Summary */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '10px',
            background: 'rgba(7, 26, 58, 0.8)',
            border: '1px solid rgba(23, 74, 145, 0.4)',
            marginBottom: '32px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Verified Profile:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-steel-light)', fontSize: '0.75rem' }}>
              <ShieldCheck size={14} />
              <span>Ready for Intelligence Engine</span>
            </div>
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
            {profile.personal.name}
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-steel-light)' }}>
            {profile.livelihood.currentOccupation || 'Career Explorer'} •{' '}
            {profile.skills.length} skills recorded • Guided by {companionName}
          </div>
        </div>

        {/* Phase 2 Transition Card */}
        <div
          style={{
            padding: '20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(18, 54, 111, 0.6) 0%, rgba(11, 36, 82, 0.8) 100%)',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            marginBottom: '28px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-steel-light)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px',
            }}
          >
            <Sparkles size={14} />
            <span>{t.onboarding.phase2Title}</span>
          </div>

          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.45,
              margin: '0 0 16px',
            }}
          >
            {t.onboarding.phase2Subtitle}
          </p>

          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => {
              navigate('/career');
            }}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {t.onboarding.phase2Action || 'View My Personalized Livelihood Plan'}
          </Button>
        </div>
      </div>
    </div>
  );
};
