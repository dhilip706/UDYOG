import { useState, useCallback } from 'react';
import { CompanionId, CompanionState, CompanionProfile } from '../types/companion';
import { voiceService } from '../services/voice/voiceService';
import { useLanguage } from './useLanguage';

export const AISHA_PROFILE: CompanionProfile = {
  id: 'aisha',
  name: 'Aisha',
  avatarTone: 'warm-amber',
  persona: 'Empathetic, patient, calm, and welcoming.',
  archetype: 'Personal Guide',
  accentColor: '#5A82B8',
};

export const COMPANION_PROFILES: Record<CompanionId, CompanionProfile> = {
  aisha: AISHA_PROFILE,
};

export function useAICompanion() {
  const activeCompanionId: CompanionId = 'aisha';
  const { currentLanguage } = useLanguage();
  const [companionState, setCompanionState] = useState<CompanionState>('IDLE');
  const [speechText, setSpeechText] = useState<string>('');
  const [highlightTargetId, setHighlightTargetId] = useState<string | null>(null);

  const setCompanion = useCallback((_id: CompanionId) => {
    // Aisha is the permanent fixed assistant
  }, []);

  const speak = useCallback((text: string, state: CompanionState = 'SPEAKING') => {
    setSpeechText(text);
    setCompanionState(state);
    voiceService.speak(text, currentLanguage, undefined, {
      onStart: () => setCompanionState('SPEAKING'),
      onEnd: () => setCompanionState('IDLE'),
      onError: () => setCompanionState('IDLE'),
    });
  }, [currentLanguage]);

  const guide = useCallback((text: string, targetId: string) => {
    setSpeechText(text);
    setCompanionState('GUIDING');
    setHighlightTargetId(targetId);
    voiceService.speak(text, currentLanguage, undefined, {
      onStart: () => setCompanionState('GUIDING'),
      onEnd: () => setCompanionState('IDLE'),
      onError: () => setCompanionState('IDLE'),
    });
  }, [currentLanguage]);

  const setThinking = useCallback((text?: string) => {
    voiceService.stop();
    if (text) setSpeechText(text);
    setCompanionState('THINKING');
    setHighlightTargetId(null);
  }, []);

  const setListening = useCallback((text?: string) => {
    voiceService.stop();
    if (text) setSpeechText(text);
    setCompanionState('LISTENING');
  }, []);

  const setIdle = useCallback(() => {
    voiceService.stop();
    setCompanionState('IDLE');
    setHighlightTargetId(null);
  }, []);

  const setError = useCallback((errorText: string, targetId?: string) => {
    voiceService.stop();
    setSpeechText(errorText);
    setCompanionState('ERROR');
    if (targetId) setHighlightTargetId(targetId);
  }, []);

  const setSuccess = useCallback((successText: string) => {
    setSpeechText(successText);
    setCompanionState('SUCCESS');
    setHighlightTargetId(null);
    voiceService.speak(successText, currentLanguage, undefined, {
      onStart: () => setCompanionState('SUCCESS'),
      onEnd: () => setCompanionState('IDLE'),
      onError: () => setCompanionState('IDLE'),
    });
  }, [currentLanguage]);

  return {
    companion: AISHA_PROFILE,
    activeCompanionId,
    setCompanion,
    companionState,
    speechText,
    highlightTargetId,
    speak,
    guide,
    setThinking,
    setListening,
    setIdle,
    setError,
    setSuccess,
  };
}
