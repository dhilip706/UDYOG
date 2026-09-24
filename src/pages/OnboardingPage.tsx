import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useVoiceOnboarding } from '../hooks/useVoiceOnboarding';
import { MandatoryPhotoCaptureScreen } from '../components/onboarding/MandatoryPhotoCaptureScreen';
import { VoiceOnboardingScreen } from '../components/onboarding/VoiceOnboardingScreen';
import { ProfileReviewScreen } from '../components/onboarding/ProfileReviewScreen';
import { ProfileSuccessScreen } from '../components/onboarding/ProfileSuccessScreen';
import { LanguageSelectionModal } from '../components/language/LanguageSelectionModal';
import { voiceService } from '../services/voice/voiceService';
import { speechToTextService } from '../services/voice/speechToText';
import { Globe, LogOut, Compass } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { currentLanguage, supportedLanguages, changeLanguage, t } = useLanguage();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const {
    stage,
    profile,
    companion,
    updateProfileSection,
    confirmAndSubmit,
    backToInterview,
    setProfilePhoto,
    isSubmitting,
    submitError,
  } = useVoiceOnboarding();

  const activeLang = supportedLanguages.find((l) => l.code === currentLanguage);

  const handleLogout = () => {
    try {
      speechToTextService.abort();
    } catch {}
    try {
      voiceService.stop();
    } catch {}
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    // 1. Mandatory Profile Photo Gate:
    // Voice interview with Aisha cannot begin until a valid photo is captured and confirmed
    if (!profile.personal.profilePhoto) {
      return (
        <MandatoryPhotoCaptureScreen
          onPhotoConfirmed={(photoDataUrl) => {
            setProfilePhoto(photoDataUrl);
          }}
          initialPhoto={profile.personal.profilePhoto}
        />
      );
    }

    // 2. Profile Confirmed & Submitted -> Success View
    if (stage === 'SUCCESS') {
      return <ProfileSuccessScreen profile={profile} companionName={companion.name} />;
    }

    // 3. Profile Review View
    if (stage === 'REVIEW') {
      return (
        <ProfileReviewScreen
          profile={profile}
          onUpdateProfile={updateProfileSection}
          onConfirmAndSubmit={confirmAndSubmit}
          onBackToInterview={backToInterview}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      );
    }

    // 4. Voice-First Aisha Onboarding Interview
    return <VoiceOnboardingScreen />;
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100vw', overflowX: 'hidden' }}>
      {/* Top Header with Language Change & Logout */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '52px',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(7, 26, 58, 0.88)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #174A91 0%, #12366F 100%)',
              border: '1px solid rgba(139, 174, 219, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Compass size={16} />
          </div>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF' }}>UDYOG</span>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--color-steel-light)',
              padding: '2px 6px',
              background: 'rgba(23, 74, 145, 0.4)',
              borderRadius: '4px',
            }}
          >
            Aisha Onboarding
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Top-Right Language Change */}
          <button
            type="button"
            id="onboarding-lang-btn"
            onClick={() => setIsLangModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.55)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <Globe size={13} color="var(--color-steel-light)" />
            <span>{activeLang?.nativeName || 'Language'}</span>
          </button>

          {/* Top-Right Logout */}
          <button
            type="button"
            id="onboarding-logout-btn"
            onClick={handleLogout}
            title={t.nav?.signOut || 'Sign out'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.55)',
              color: 'var(--color-text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Onboarding Screen Container */}
      <div style={{ paddingTop: '52px' }}>
        {renderContent()}
      </div>

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={currentLanguage}
        supportedLanguages={supportedLanguages}
        onSelectLanguage={(code) => {
          changeLanguage(code);
          setIsLangModalOpen(false);
        }}
      />
    </div>
  );
};
