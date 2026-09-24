import { SupportedLanguageCode } from '../../types/language';
import { CompanionId } from '../../types/companion';
import { voiceService } from './voiceService';
import { TTSCallbacks } from './voiceTypes';

export type { TTSCallbacks };

export interface ITextToSpeechService {
  isSupported(): boolean;
  speak(text: string, langCode: SupportedLanguageCode, companionId?: CompanionId | string, callbacks?: TTSCallbacks): void;
  stop(): void;
  isSpeaking(): boolean;
}

class UnifiedTextToSpeechAdapter implements ITextToSpeechService {
  isSupported(): boolean {
    return voiceService.isSupported();
  }

  speak(text: string, langCode: SupportedLanguageCode, _companionId?: CompanionId | string, callbacks?: TTSCallbacks): void {
    voiceService.speak(text, langCode, undefined, callbacks);
  }

  stop(): void {
    voiceService.stop();
  }

  isSpeaking(): boolean {
    return voiceService.isSpeaking();
  }
}

export const textToSpeechService: ITextToSpeechService = new UnifiedTextToSpeechAdapter();
