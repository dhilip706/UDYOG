import React, { useState, useEffect, useMemo } from 'react';
import { useVoiceOnboarding } from '../../hooks/useVoiceOnboarding';
import { useLanguage } from '../../hooks/useLanguage';
import { voiceService } from '../../services/voice/voiceService';
import { VoiceConnectionState } from '../../services/voice/voiceTypes';
import { getLanguageVoiceConfig } from '../../services/voice/languageVoiceMap';
import { ProfileProgressPill } from './ProfileProgressPill';
import { TranscriptDrawer } from './TranscriptDrawer';
import { PhotoCaptureModal } from './PhotoCaptureModal';
import { CinematicVideo } from '../video/CinematicVideo';
import { AtmosphereOverlay } from '../cinematic/AtmosphereOverlay';
import {
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
  Keyboard,
  ArrowRight,
  Camera,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/Button';

export const VoiceOnboardingScreen: React.FC = () => {
  const {
    companion,
    t,
    profile,
    stage,
    currentPrompt,
    lastAck,
    voiceState,
    interimTranscript,
    pendingAnswer,
    autoSubmitCountdown,
    setPendingAnswer,
    submitAnswer,
    cancelPendingAnswer,
    clearAutoSubmit,
    errorMessage,
    transcript,
    startListening,
    stopListening,
    submitTextAnswer,
    replayCurrentQuestion,
    goToReview,
    setProfilePhoto,
  } = useVoiceOnboarding();

  const { currentLanguage } = useLanguage();
  const langConfig = useMemo(() => getLanguageVoiceConfig(currentLanguage), [currentLanguage]);

  const [ttsState, setTtsState] = useState<VoiceConnectionState>(voiceService.getState());
  const [isTranscriptOpen, setIsTranscriptOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isTextFallbackOpen, setIsTextFallbackOpen] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');

  useEffect(() => {
    const unsubscribe = voiceService.onStateChange((state) => {
      setTtsState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    submitTextAnswer(textInput);
    setTextInput('');
    setIsTextFallbackOpen(false);
  };

  const isListening = voiceState === 'listening';
  const isSpeaking = voiceState === 'speaking' || ttsState === 'SYNTHESIZING' || ttsState === 'PLAYING';
  const isProcessing = voiceState === 'processing';
  const portraitUrl = '/images/aisha.jpg';

  const statusText = useMemo(() => {
    if (ttsState === 'CONNECTING') return 'Aisha is connecting...';
    if (ttsState === 'RECONNECTING') return 'Reconnecting to voice...';
    if (isListening) return 'Aisha is listening...';
    if (isProcessing) return 'Aisha is thinking...';
    if (isSpeaking) return 'Aisha is speaking...';
    return 'Tap to speak';
  }, [ttsState, isListening, isProcessing, isSpeaking]);

  const handleMicClick = () => {
    if (isSpeaking) {
      voiceService.stop();
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'var(--color-text-primary)',
        overflowX: 'hidden',
        background: 'linear-gradient(180deg, rgba(7, 26, 58, 0.72) 0%, rgba(11, 36, 82, 0.65) 45%, rgba(7, 26, 58, 0.82) 100%)',
      }}
    >
      <CinematicVideo />
      <AtmosphereOverlay />

      {/* Top Navigation & Status Bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'linear-gradient(180deg, rgba(7, 26, 58, 0.85) 0%, transparent 100%)',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: Companion Presence Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px 5px 6px',
            borderRadius: '20px',
            background: 'rgba(11, 36, 82, 0.85)',
            border: '1px solid rgba(23, 74, 145, 0.5)',
            boxShadow: '0 2px 8px rgba(7, 26, 58, 0.4)',
          }}
        >
          <img
            src={portraitUrl}
            alt="Aisha"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid rgba(139, 174, 219, 0.4)',
            }}
          />
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
            Aisha • {t.companion.guideRole}
          </span>
        </div>

        {/* Center: Live Profile Progress Stepper */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ProfileProgressPill profile={profile} currentStage={stage} />
        </div>

        {/* Right Controls: Transcript & Verified Profile Photo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            title="Verified Profile Photo"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1.5px solid rgba(139, 174, 219, 0.55)',
              color: 'var(--color-steel-light)',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            {profile.personal.profilePhoto ? (
              <img
                src={profile.personal.profilePhoto}
                alt="Profile"
                style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <Camera size={14} color="var(--color-steel-light)" />
            )}
            <span>Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTranscriptOpen(true)}
            title={t.onboarding.viewTranscript}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(11, 36, 82, 0.85)',
              border: '1px solid rgba(23, 74, 145, 0.5)',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            <MessageSquare size={14} color="var(--color-steel-light)" />
            <span>{t.onboarding.viewTranscript}</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 24px',
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {/* Honest TTS Availability Banner */}
        {langConfig && !langConfig.ttsAvailable && (
          <div
            style={{
              marginBottom: '16px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(235, 160, 50, 0.15)',
              border: '1px solid rgba(235, 160, 50, 0.4)',
              color: '#f6ad55',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '520px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              Voice support for {langConfig.name} is currently unavailable. You can continue using text.
            </span>
          </div>
        )}

        {/* Companion Realistic Portrait with Speaking / Listening Indicator */}
        <div style={{ position: 'relative', marginBottom: '22px' }}>
          {/* Subtle pulse ring when AI is speaking */}
          {isSpeaking && (
            <div
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '2px solid rgba(139, 174, 219, 0.5)',
                animation: 'pulse-ring 1.8s infinite ease-out',
                pointerEvents: 'none',
              }}
            />
          )}

          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${
                isSpeaking
                  ? 'var(--color-steel-light)'
                  : isListening
                  ? 'var(--color-royal-highlight)'
                  : 'rgba(23, 74, 145, 0.6)'
              }`,
              boxShadow: '0 8px 24px rgba(7, 26, 58, 0.7)',
              background: 'rgba(11, 36, 82, 0.9)',
              transition: 'border-color 0.3s ease',
            }}
          >
            <img
              src={portraitUrl}
              alt="Aisha"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Primary AI Question Card */}
        <div
          className="classic-navy-surface"
          style={{
            width: '100%',
            padding: '28px 26px',
            marginBottom: '26px',
            position: 'relative',
            boxShadow: '0 16px 40px -10px rgba(7, 26, 58, 0.75)',
            border: '1px solid rgba(23, 74, 145, 0.55)',
          }}
        >
          {lastAck && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                color: '#34D399',
                fontSize: '0.8125rem',
                fontWeight: 500,
                marginBottom: '14px',
                animation: 'classic-fade-in 0.3s ease-out',
              }}
            >
              <span>{lastAck}</span>
            </div>
          )}

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
              fontWeight: 500,
              lineHeight: 1.45,
              color: 'var(--color-text-primary)',
              margin: '0 0 14px',
              letterSpacing: '-0.01em',
            }}
          >
            {currentPrompt}
          </p>

          {/* Replay Audio Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={replayCurrentQuestion}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '20px',
                background: 'rgba(18, 54, 111, 0.6)',
                border: '1px solid rgba(23, 74, 145, 0.4)',
                fontSize: '0.78125rem',
                color: 'var(--color-steel-light)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title={t.onboarding.replayVoice}
            >
              <Volume2 size={14} />
              <span>{t.onboarding.replayVoice}</span>
            </button>
          </div>
        </div>

        {/* Live Speech Feedback / Interim Transcript */}
        {isListening && interimTranscript && (
          <div
            style={{
              marginBottom: '18px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'rgba(18, 54, 111, 0.5)',
              border: '1px solid rgba(139, 174, 219, 0.3)',
              fontSize: '0.875rem',
              color: 'var(--color-steel-light)',
              maxWidth: '90%',
              fontStyle: 'italic',
            }}
          >
            "{interimTranscript}"
          </div>
        )}

        {/* Subtle Waveform Animation when listening */}
        {isListening && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              height: '24px',
              marginBottom: '16px',
            }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                style={{
                  width: '3px',
                  borderRadius: '2px',
                  background: 'var(--color-steel-light)',
                  animation: `audio-wave 0.8s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Primary Interactive Microphone Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={handleMicClick}
            aria-label={isListening ? t.onboarding.tapToStop : isSpeaking ? 'Stop speech' : t.onboarding.tapToSpeak}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: isListening
                ? 'linear-gradient(135deg, #E07363 0%, #B24637 100%)'
                : isSpeaking
                ? 'linear-gradient(135deg, #2D68C4 0%, #174A91 100%)'
                : 'linear-gradient(135deg, #1E5DB7 0%, #174A91 100%)',
              border: '2px solid rgba(139, 174, 219, 0.5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: isListening
                ? '0 0 20px rgba(224, 115, 99, 0.6)'
                : isSpeaking
                ? '0 0 20px rgba(30, 93, 183, 0.6)'
                : '0 8px 24px rgba(7, 26, 58, 0.6)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: isListening ? 'scale(1.08)' : 'scale(1)',
            }}
          >
            {isListening ? <MicOff size={28} /> : isSpeaking ? <Volume2 size={28} /> : <Mic size={28} />}
          </button>

          <span
            style={{
              fontSize: '0.8125rem',
              color: isListening || isSpeaking ? 'var(--color-steel-light)' : 'var(--color-text-muted)',
              fontWeight: 500,
            }}
          >
            {statusText}
          </span>
        </div>

        {/* Live Answer Transcript & Review/Correction Card */}
        {pendingAnswer && (
          <div
            className="classic-navy-surface"
            style={{
              marginTop: '18px',
              width: '100%',
              maxWidth: '520px',
              padding: '16px 18px',
              border: '1px solid rgba(139, 174, 219, 0.45)',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(7, 26, 58, 0.55)',
              animation: 'classic-fade-in 0.2s ease-out',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={14} color="var(--color-steel-light)" />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-steel-light)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                  }}
                >
                  {t.onboarding.transcriptTitle}
                </span>
              </div>
              {autoSubmitCountdown !== null ? (
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-royal-highlight)',
                    fontWeight: 500,
                  }}
                >
                  {`Auto-submitting in ${autoSubmitCountdown}s...`}
                </span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Edit transcript if needed
                </span>
              )}
            </div>

            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <textarea
                value={pendingAnswer}
                onChange={(e) => setPendingAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                  }
                }}
                rows={2}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(7, 26, 58, 0.85)',
                  border: '1px solid rgba(23, 74, 145, 0.6)',
                  color: '#FFFFFF',
                  fontSize: '0.9375rem',
                  lineHeight: 1.45,
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
              {autoSubmitCountdown !== null && (
                <button
                  type="button"
                  onClick={clearAutoSubmit}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-steel-light)',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    marginRight: 'auto',
                  }}
                >
                  Pause Timer
                </button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancelPendingAnswer();
                  startListening();
                }}
                leftIcon={<Mic size={14} />}
              >
                Re-record
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => submitAnswer()}
                rightIcon={<Send size={14} />}
              >
                {t.onboarding.send}
              </Button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              marginTop: '16px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(224, 115, 99, 0.15)',
              border: '1px solid var(--color-error)',
              color: 'var(--color-text-primary)',
              fontSize: '0.8125rem',
              maxWidth: '90%',
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Text Input Fallback Toggle */}
        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => setIsTextFallbackOpen((prev) => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78125rem',
              color: 'var(--color-steel-light)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              cursor: 'pointer',
            }}
          >
            <Keyboard size={13} />
            <span>{t.onboarding.typeAnswerFallback}</span>
          </button>
        </div>

        {/* Text Fallback Input Drawer */}
        {isTextFallbackOpen && (
          <form
            onSubmit={handleTextSubmit}
            style={{
              marginTop: '14px',
              width: '100%',
              maxWidth: '460px',
              display: 'flex',
              gap: '8px',
              animation: 'classic-fade-in 0.2s ease',
            }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.onboarding.typePlaceholder}
              autoFocus
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(11, 36, 82, 0.9)',
                border: '1px solid rgba(23, 74, 145, 0.6)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
              }}
            />
            <Button type="submit" variant="primary" size="md">
              <Send size={15} />
            </Button>
          </form>
        )}
      </main>

      {/* Bottom Actions Bar */}
      <footer
        style={{
          position: 'relative',
          zIndex: 20,
          padding: '14px 24px',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          background: 'linear-gradient(0deg, rgba(7, 26, 58, 0.85) 0%, transparent 100%)',
        }}
      >
        <Button
          variant="secondary"
          size="md"
          onClick={goToReview}
          rightIcon={<ArrowRight size={15} />}
        >
          {t.onboarding.reviewTitle}
        </Button>
      </footer>

      {/* Transcript Drawer Modal */}
      <TranscriptDrawer
        isOpen={isTranscriptOpen}
        onClose={() => setIsTranscriptOpen(false)}
        transcript={transcript}
        companionName={companion.name}
      />

      {/* Optional Photo Capture Modal */}
      <PhotoCaptureModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhoto={profile.personal.profilePhoto}
        onSavePhoto={setProfilePhoto}
      />

      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.96);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.12);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.22);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
