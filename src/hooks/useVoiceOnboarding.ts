import { useState, useEffect, useCallback, useRef } from 'react';
import {
  StructuredUserProfile,
  InterviewStage,
  VoiceState,
  ConversationTurn,
} from '../types/onboarding';
import { useLanguage } from './useLanguage';
import { useLocation } from './useLocation';
import { speechToTextService } from '../services/voice/speechToText';
import { voiceService } from '../services/voice/voiceService';
import { OnboardingIntelligence } from '../services/ai/onboardingIntelligence';
import { UserProfileService } from '../services/profile/userProfileService';
import { authService } from '../services/authService';

export function useVoiceOnboarding() {
  const { currentLanguage, t } = useLanguage();
  const { location } = useLocation();

  // Aisha is the sole, dedicated AI Guide
  const companion = {
    id: 'aisha' as const,
    name: 'Aisha',
    role: t.companion?.guideRole || 'Career & Skill Guide',
    avatar: '/images/aisha.jpg',
  };

  // 1. Structured Profile State with localStorage restoration
  const [profile, setProfile] = useState<StructuredUserProfile>(() => {
    const saved = UserProfileService.getProfile();
    if (saved) return saved;
    return OnboardingIntelligence.createInitialProfile(
      currentLanguage,
      location?.formattedAddress || 'India'
    );
  });

  // 2. Stage State Machine:
  // Must begin with PHOTO_CAPTURE if no photo captured yet
  const [stage, setStage] = useState<InterviewStage>(() => {
    const saved = UserProfileService.getProfile();
    if (!saved?.personal?.profilePhoto) {
      return 'PERSONAL'; // Managed in OnboardingPage as Photo Capture phase
    }
    const savedStage = UserProfileService.getSavedStage() as InterviewStage;
    if (savedStage && (savedStage === 'REVIEW' || savedStage === 'SUCCESS')) {
      return savedStage;
    }
    return 'PERSONAL';
  });

  const [currentPrompt, setCurrentPrompt] = useState<string>(() => t.onboarding.welcomeVoiceGreeting);
  const [lastAck, setLastAck] = useState<string | null>(null);

  // 3. Voice Interaction State
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [pendingAnswer, setPendingAnswer] = useState<string>('');
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 4. Conversation History (Transcript)
  const [transcript, setTranscript] = useState<ConversationTurn[]>([]);

  // Prevent duplicate submissions / race conditions
  const isProcessingRef = useRef(false);
  const hasSpokenWelcomeRef = useRef(false);
  const autoSubmitTimerRef = useRef<any>(null);

  const clearAutoSubmit = useCallback(() => {
    if (autoSubmitTimerRef.current) {
      clearInterval(autoSubmitTimerRef.current);
      autoSubmitTimerRef.current = null;
    }
    setAutoSubmitCountdown(null);
  }, []);

  // Sync profile metadata with language & location
  useEffect(() => {
    setProfile((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        companionId: 'aisha',
        languageCode: currentLanguage,
        locationName: location?.formattedAddress || prev.metadata.locationName,
      },
    }));
  }, [currentLanguage, location]);

  // Initial Welcome Greeting upon mounting voice interview
  const playWelcomeGreeting = useCallback(() => {
    if (!profile.personal.profilePhoto) return; // Do not speak if still in photo capture
    if (hasSpokenWelcomeRef.current) return;
    hasSpokenWelcomeRef.current = true;

    // Check if user has already made progress before speaking generic welcome
    const nextQ = OnboardingIntelligence.getNextQuestion(profile, stage, t);
    let promptToSpeak = t.onboarding.welcomeVoiceGreeting;
    if (nextQ.isReadyForReview) {
      setStage('REVIEW');
      return;
    } else if (profile.personal.name) {
      promptToSpeak = nextQ.nextQuestionPrompt;
      setStage(nextQ.nextStage);
    }

    setCurrentPrompt(promptToSpeak);
    setTranscript([
      {
        id: 'init-1',
        speaker: 'companion',
        text: promptToSpeak,
        timestamp: Date.now(),
        stage: nextQ.nextStage || 'PERSONAL',
      },
    ]);

    setVoiceState('speaking');
    voiceService.speak(promptToSpeak, currentLanguage, undefined, {
      onStart: () => setVoiceState('speaking'),
      onEnd: () => setVoiceState('idle'),
      onError: () => setVoiceState('idle'),
    });
  }, [profile, stage, t, currentLanguage]);

  useEffect(() => {
    if (profile.personal.profilePhoto) {
      playWelcomeGreeting();
    }
    return () => {
      clearAutoSubmit();
      voiceService.stop();
      speechToTextService.abort();
    };
  }, [playWelcomeGreeting, profile.personal.profilePhoto, clearAutoSubmit]);

  // Process user answer and immediately progress application state
  const handleUserAnswer = useCallback(
    (answerText: string) => {
      const textToProcess = answerText.trim();
      if (!textToProcess || isProcessingRef.current) return;

      isProcessingRef.current = true;
      clearAutoSubmit();
      setVoiceState('processing');
      setInterimTranscript('');
      setPendingAnswer('');
      setErrorMessage(null);

      const startTime = Date.now();
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[VOICE_ONBOARDING_DIAG] STT_FINALIZED & ANSWER_PROCESSING_START:', textToProcess);
      }

      // Record User Turn in Transcript
      const userTurnId = `user-${Date.now()}`;
      setTranscript((prev) => [
        ...prev,
        {
          id: userTurnId,
          speaker: 'user',
          text: textToProcess,
          timestamp: Date.now(),
          stage,
        },
      ]);

      // Process answer deterministically using local intelligence
      const result = OnboardingIntelligence.processUserInput(
        textToProcess,
        profile,
        stage,
        t
      );

      if (process.env.NODE_ENV !== 'production') {
        console.debug('[VOICE_ONBOARDING_DIAG] ANSWER_PROCESSING_END in', Date.now() - startTime, 'ms');
      }

      // 1. Immediately update profile & stage state
      setProfile(result.updatedProfile);
      UserProfileService.saveProfile(result.updatedProfile);
      UserProfileService.saveStage(result.nextStage);

      // Decouple State Transition:
      // Transition logical UI state immediately without waiting for TTS
      setStage(result.nextStage);
      setCurrentPrompt(result.nextQuestionPrompt);
      if (result.acknowledgmentText) {
        setLastAck(result.acknowledgmentText);
      } else {
        setLastAck(null);
      }

      // If all questions are answered, transition to review screen immediately
      if (result.isReadyForReview) {
        setStage('REVIEW');
        UserProfileService.saveStage('REVIEW');
      }

      // Record AI Turn in Transcript
      setTranscript((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          speaker: 'companion',
          text: result.nextQuestionPrompt,
          timestamp: Date.now(),
          stage: result.nextStage,
        },
      ]);

      isProcessingRef.current = false;

      // 2. Asynchronously request voice synthesis (Never blocks UI/State Machine)
      // Keep synthesized prompt focused on the question prompt to hit VEXYL cache & ensure near-instant audio
      const speechPrompt = result.nextQuestionPrompt;

      setVoiceState('speaking');
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[VOICE_ONBOARDING_DIAG] TTS_REQUEST_START:', speechPrompt);
      }

      voiceService.speak(speechPrompt, currentLanguage, undefined, {
        onStart: () => {
          if (process.env.NODE_ENV !== 'production') {
            console.debug('[VOICE_ONBOARDING_DIAG] TTS_PLAYBACK_START');
          }
          setVoiceState('speaking');
        },
        onEnd: () => {
          setVoiceState('idle');
        },
        onError: (err) => {
          console.warn('[VoiceOnboarding] Audio playback notice:', err);
          setVoiceState('idle');
          // UI is already on the next question, so user is never frozen!
        },
      });
    },
    [profile, stage, t, currentLanguage, clearAutoSubmit]
  );

  // Fast auto-submit timer (1.5 seconds) after final speech detection
  const triggerAutoSubmit = useCallback(
    (textToSubmit: string) => {
      clearAutoSubmit();
      let timeLeft = 2;
      setAutoSubmitCountdown(timeLeft);

      autoSubmitTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
          clearAutoSubmit();
          handleUserAnswer(textToSubmit);
        } else {
          setAutoSubmitCountdown(timeLeft);
        }
      }, 750);
    },
    [clearAutoSubmit, handleUserAnswer]
  );

  // Start Voice Listening
  const startListening = useCallback(() => {
    clearAutoSubmit();
    voiceService.stop();
    setErrorMessage(null);
    setInterimTranscript('');
    setPendingAnswer('');

    speechToTextService.startListening(currentLanguage, {
      onStart: () => {
        setVoiceState('listening');
      },
      onResult: (text: string, isFinal: boolean) => {
        setInterimTranscript(text);
        setPendingAnswer(text);
        if (isFinal) {
          speechToTextService.stopListening();
          setVoiceState('idle');
          setInterimTranscript('');
          setPendingAnswer(text);
          triggerAutoSubmit(text);
        }
      },
      onError: (errType, msg) => {
        setVoiceState('idle');
        if (errType === 'permission_denied') {
          setErrorMessage(t.onboarding.micPermissionDenied);
        } else if (errType === 'no_speech') {
          setErrorMessage(t.onboarding.speechUnclear);
        } else {
          setErrorMessage(msg);
        }
      },
      onEnd: () => {
        setVoiceState((current) => (current === 'listening' ? 'idle' : current));
      },
    });
  }, [clearAutoSubmit, currentLanguage, t, triggerAutoSubmit]);

  // Stop Voice Listening
  const stopListening = useCallback(() => {
    speechToTextService.stopListening();
    setVoiceState('idle');
    const finalAnswer = interimTranscript || pendingAnswer;
    if (finalAnswer) {
      setPendingAnswer(finalAnswer);
      setInterimTranscript('');
      triggerAutoSubmit(finalAnswer);
    }
  }, [interimTranscript, pendingAnswer, triggerAutoSubmit]);

  // Submit Answer explicitly (or from edit field)
  const submitAnswer = useCallback(
    (customText?: string) => {
      clearAutoSubmit();
      const textToSubmit = (customText !== undefined ? customText : pendingAnswer).trim();
      if (!textToSubmit) return;
      handleUserAnswer(textToSubmit);
    },
    [clearAutoSubmit, pendingAnswer, handleUserAnswer]
  );

  // Manual Profile Update (used in Review screen)
  const updateProfileSection = useCallback(
    (updater: (prev: StructuredUserProfile) => StructuredUserProfile) => {
      setProfile((prev) => {
        const next = updater(prev);
        UserProfileService.saveProfile(next);
        return next;
      });
    },
    []
  );

  // Replay Current Question Speech
  const replayCurrentQuestion = useCallback(() => {
    if (!currentPrompt) return;
    setVoiceState('speaking');
    voiceService.speak(currentPrompt, currentLanguage, undefined, {
      onStart: () => setVoiceState('speaking'),
      onEnd: () => setVoiceState('idle'),
      onError: () => setVoiceState('idle'),
    });
  }, [currentPrompt, currentLanguage]);

  // Confirm Profile and Persist to Real Backend
  const confirmAndSubmit = useCallback(async () => {
    clearAutoSubmit();
    voiceService.stop();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Finalize locally
      const finalized = UserProfileService.submitProfile(profile);
      setProfile(finalized);

      // 2. Persist to real backend API with session token
      const session = authService.getStoredSession();
      if (session?.token) {
        await UserProfileService.syncProfileToBackend(finalized, session.token);
      }

      // 3. Immediately transition to SUCCESS
      setStage('SUCCESS');
      UserProfileService.saveStage('SUCCESS');
    } catch (err: any) {
      console.warn('[useVoiceOnboarding] Confirm profile error:', err);
      // Still advance to success with local data preserved
      setStage('SUCCESS');
      UserProfileService.saveStage('SUCCESS');
    } finally {
      setIsSubmitting(false);
    }
  }, [clearAutoSubmit, profile]);

  return {
    companion,
    activeCompanionId: 'aisha' as const,
    currentLanguage,
    t,
    profile,
    stage,
    currentPrompt,
    lastAck,
    voiceState,
    interimTranscript,
    pendingAnswer,
    autoSubmitCountdown,
    isSubmitting,
    submitError,
    setPendingAnswer,
    submitAnswer,
    cancelPendingAnswer: () => {
      clearAutoSubmit();
      setPendingAnswer('');
      setInterimTranscript('');
    },
    clearAutoSubmit,
    errorMessage,
    transcript,
    startListening,
    stopListening,
    submitTextAnswer: handleUserAnswer,
    replayCurrentQuestion,
    goToReview: () => {
      clearAutoSubmit();
      voiceService.stop();
      setStage('REVIEW');
      UserProfileService.saveStage('REVIEW');
    },
    backToInterview: () => {
      clearAutoSubmit();
      setStage('PERSONAL');
      UserProfileService.saveStage('PERSONAL');
    },
    updateProfileSection,
    confirmAndSubmit,
    setProfilePhoto: (photoDataUrl?: string) => {
      updateProfileSection((p) => ({
        ...p,
        personal: { ...p.personal, profilePhoto: photoDataUrl },
      }));
    },
  };
}
