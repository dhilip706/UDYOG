import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicVideo } from '../components/video/CinematicVideo';
import { AtmosphereOverlay } from '../components/cinematic/AtmosphereOverlay';
import { LoginPanel } from '../components/authentication/LoginPanel';
import { LanguageSelectionModal } from '../components/language/LanguageSelectionModal';
import { useAICompanion } from '../hooks/useAICompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useLocation } from '../hooks/useLocation';
import { SupportedLanguageCode } from '../types/language';
import { authService } from '../services/authService';
import { UserProfileService } from '../services/profile/userProfileService';
import { voiceService } from '../services/voice/voiceService';
import { MapPin, Globe, Volume2, VolumeX } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { currentLanguage, t, changeLanguage, supportedLanguages } = useLanguage();
  const {
    speechText,
    highlightTargetId,
    speak,
    guide,
    setIdle,
  } = useAICompanion();

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);

  // Subtle AI guidance sequence from the selected companion
  useEffect(() => {
    setIdle();

    // 1: Subtle initial greeting
    const timer1 = setTimeout(() => {
      speak(t.companion.greetingAisha, 'SPEAKING');
    }, 700);

    // 2: Gentle prompt to choose method
    const timer2 = setTimeout(() => {
      speak(t.companion.chooseMethod, 'GUIDING');
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [t, speak, setIdle]);

  const handleLoginSuccess = () => {
    setIsTransitioning(true);
    speak(t.companion.successMessage, 'SUCCESS');
    setTimeout(() => {
      const session = authService.getStoredSession();
      if (session?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (session?.role === 'EMPLOYER') {
        navigate('/employer', { replace: true });
      } else if (session?.role === 'BENEFICIARY') {
        if (!UserProfileService.isProfileConfirmed()) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/career', { replace: true });
        }
      } else {
        navigate('/role-select', { replace: true });
      }
    }, 1400);
  };

  const activeLangObj = supportedLanguages.find((l) => l.code === currentLanguage);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        color: 'var(--color-text-primary)',
      }}
    >
      {/* 1. Full-Screen Cinematic Video (100vw x 100vh, loops continuously) */}
      <CinematicVideo />

      {/* 2. Atmosphere Contrast Layer */}
      <AtmosphereOverlay />

      {/* 3. Top Controls: Compact Location (Left) and Language / Audio (Right) */}
      <header
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(7, 26, 58, 0.75) 0%, transparent 100%)',
          pointerEvents: 'auto',
        }}
      >
        {/* Top-Left: Location Indicator */}
        <div
          onClick={() => navigate('/location')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '6px 14px',
            borderRadius: '8px',
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 2px 8px rgba(7, 26, 58, 0.4)',
            transition: 'all 0.2s',
          }}
          title={t.nav.changeRegion}
        >
          <MapPin size={14} color="var(--color-steel-light)" />
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
            }}
          >
            {location ? location.formattedAddress : 'India'}
          </span>
        </div>

        {/* Top-Right: Language Selector & Audio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(7, 26, 58, 0.4)',
            }}
            title={t.location.changeLanguage}
          >
            <Globe size={14} color="var(--color-steel-light)" />
            <span>{activeLangObj?.nativeName || 'Language'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAudioMuted((prev) => {
                const next = !prev;
                voiceService.setMuted(next);
                return next;
              });
            }}
            aria-label={isAudioMuted ? 'Unmute audio' : 'Mute audio'}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-steel-light)',
              boxShadow: '0 2px 8px rgba(7, 26, 58, 0.4)',
            }}
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>
      </header>

      {/* 4. Exact Center Composition: Visually and Compositionally Centered */}
      <main
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'calc(100vw - 32px)',
          maxWidth: '420px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Subtle Companion Presence & Guidance Indicator (Section 11 & 12) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '12px',
            width: '100%',
          }}
        >
          {/* Very small elegant indicator (Aisha • Your guide) */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px 4px 6px',
              borderRadius: '20px',
              background: 'rgba(7, 26, 58, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 4px 14px rgba(7, 26, 58, 0.5)',
            }}
          >
            <img
              src="/images/aisha.jpg"
              alt="Aisha"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1px solid rgba(139, 174, 219, 0.4)',
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-steel-light)',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}
            >
              Aisha • {t.companion.guideRole}
            </span>
          </div>

          {/* Subtle compact guidance message (Section 12) */}
          {speechText && (
            <div
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                background: 'rgba(11, 36, 82, 0.72)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                borderRadius: '8px',
                padding: '4px 14px',
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                maxWidth: '380px',
                lineHeight: 1.4,
                animation: 'classic-fade-in 0.3s ease',
              }}
            >
              {speechText}
            </div>
          )}
        </div>

        {/* Centered Medium-Sized Royal Blue Login Panel */}
        <LoginPanel
          onSuccess={handleLoginSuccess}
          onGuideStateChange={(text, state, targetId) => {
            if (state === 'GUIDING' && targetId) {
              guide(text, targetId);
            } else {
              speak(text, state as any);
            }
          }}
          highlightTargetId={highlightTargetId}
        />
      </main>

      {/* 5. Minimal Discreet Footer */}
      <footer
        style={{
          position: 'absolute',
          bottom: '14px',
          left: 0,
          right: 0,
          zIndex: 10,
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'rgba(155, 176, 205, 0.55)',
          pointerEvents: 'none',
        }}
      >
        <span>UDYOG Platform</span>
      </footer>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage as SupportedLanguageCode}
        supportedLanguages={supportedLanguages}
        onSelectLanguage={(code) => changeLanguage(code)}
      />

      {/* Post-Login Transition Dimming */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(7, 26, 58, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            transition: 'opacity 0.6s ease',
          }}
        />
      )}
    </div>
  );
};
