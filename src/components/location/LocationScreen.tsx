import React, { useState } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { useLanguage } from '../../hooks/useLanguage';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import { Button } from '../ui/Button';
import { ManualLocationModal } from './ManualLocationModal';
import { LanguageSelectionModal } from '../language/LanguageSelectionModal';
import { SupportedLanguageCode } from '../../types/language';
import { MapPin, Globe, ArrowRight, Check } from 'lucide-react';

interface LocationScreenProps {
  onComplete: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({ onComplete }) => {
  const {
    location,
    isLoading,
    error,
    requestBrowserLocation,
    setManualLocation,
    getSuggestedLanguage,
  } = useLocation();

  const {
    currentLanguage,
    t,
    changeLanguage,
    supportedLanguages,
  } = useLanguage();

  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);

  const handleAllowLocation = async () => {
    try {
      const loc = await requestBrowserLocation();
      const suggested = getSuggestedLanguage(loc.state);
      changeLanguage(suggested, 'location');
    } catch {
      // If permission is denied or an error occurs, user is presented with the manual choice fallback
      setIsManualModalOpen(true);
    }
  };

  const handleManualSelect = (stateName: string, districtName: string) => {
    setManualLocation(stateName, districtName);
    const suggested = getSuggestedLanguage(stateName);
    changeLanguage(suggested, 'location');
  };

  const activeLangObj = supportedLanguages.find((l) => l.code === currentLanguage);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {/* 100vw x 100vh Full-screen Cinematic Video Background */}
      <CinematicVideo />

      {/* Subtle Royal Blue Atmosphere Overlay */}
      <AtmosphereOverlay />

      {/* Floating Centered Card */}
      <div
        className="classic-navy-surface"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '520px',
          padding: '42px 34px',
          textAlign: 'center',
          animation: 'classic-fade-in 0.35s ease-out',
        }}
      >
        {/* Minimal Icon */}
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 20px',
            borderRadius: '12px',
            background: 'var(--glass-royal-elevated)',
            border: '1px solid var(--glass-royal-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MapPin size={22} color="var(--color-steel-light)" />
        </div>

        {/* Heading & Explanation */}
        <h1
          style={{
            fontSize: 'clamp(1.65rem, 3.8vw, 2.15rem)',
            fontWeight: 600,
            marginBottom: '12px',
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
          }}
        >
          {t.location.heroTitle}
        </h1>

        <p
          style={{
            fontSize: '0.9375rem',
            lineHeight: '1.65',
            color: 'var(--color-text-muted)',
            marginBottom: '28px',
            maxWidth: '430px',
            margin: '0 auto 28px',
          }}
        >
          {t.location.heroSubtitle}
        </p>

        {/* Error / Permission Denied Recovery Banner */}
        {error && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              background: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              color: 'var(--color-text-primary)',
              fontSize: '0.8125rem',
              marginBottom: '20px',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <span>{t.location.permissionDenied}</span>
            <button
              onClick={() => setIsManualModalOpen(true)}
              style={{
                color: '#FFFFFF',
                textDecoration: 'underline',
                fontWeight: 600,
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
            >
              {t.location.manualButton}
            </button>
          </div>
        )}

        {/* State 2: Location Result & Automatically Highlighted Language */}
        {location ? (
          <div
            style={{
              padding: '18px 20px',
              borderRadius: '12px',
              background: 'rgba(6, 21, 47, 0.75)',
              border: '1px solid var(--glass-royal-border)',
              marginBottom: '26px',
              textAlign: 'left',
            }}
          >
            {/* Header: Label + Subordinate Change Region Link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-steel-light)',
                  fontWeight: 600,
                }}
              >
                {t.location.detectedBadge}
              </span>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(true)}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                {t.nav.changeRegion}
              </button>
            </div>

            {/* Formatted Region Text */}
            <div
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '16px',
                fontFamily: 'var(--font-display)',
              }}
            >
              {location.formattedAddress}
            </div>

            {/* Suggested Language (Automatically Pre-selected & Highlighted) */}
            <div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-steel-light)',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                {t.location.suggestionTitle}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--color-royal-mid)',
                  border: '1px solid var(--color-steel-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe size={16} color="var(--color-steel-light)" />
                  <span
                    style={{
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    {activeLangObj?.nativeName} ({activeLangObj?.name})
                  </span>
                  <Check size={16} color="var(--color-steel-light)" />
                </div>

                <button
                  type="button"
                  onClick={() => setIsLangModalOpen(true)}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-steel-light)',
                    fontWeight: 500,
                    textDecoration: 'underline',
                  }}
                >
                  {t.location.changeLanguage}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Primary Action Buttons */}
        <div>
          {location ? (
            /* Proper Primary CTA Button: [ Continue → ] */
            <Button
              variant="primary"
              size="lg"
              onClick={onComplete}
              rightIcon={<ArrowRight size={18} />}
              style={{ width: '100%' }}
            >
              {t.common.continue}
            </Button>
          ) : (
            /* First Location State: ONLY "Allow Location Access" button! */
            <Button
              variant="primary"
              size="lg"
              onClick={handleAllowLocation}
              isLoading={isLoading}
              style={{ width: '100%' }}
            >
              {t.location.allowButton}
            </Button>
          )}
        </div>
      </div>

      {/* Region Selector Modal (for secondary Change Region action or recovery) */}
      <ManualLocationModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSelect={handleManualSelect}
        title={t.location.manualTitle}
      />

      {/* Language Selector Modal */}
      <LanguageSelectionModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage as SupportedLanguageCode}
        supportedLanguages={supportedLanguages}
        onSelectLanguage={(code) => changeLanguage(code)}
      />
    </div>
  );
};
