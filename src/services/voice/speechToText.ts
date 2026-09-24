import { SupportedLanguageCode } from '../../types/language';

// Maps platform language codes to BCP 47 Speech Recognition language tags
const SPEECH_LANG_MAP: Record<SupportedLanguageCode, string> = {
  en: 'en-IN',
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  as: 'as-IN',
  ur: 'ur-IN',
  sa: 'hi-IN',
  ks: 'ur-IN',
  ne: 'ne-NP',
  kok: 'mr-IN',
  mai: 'hi-IN',
  mni: 'bn-IN',
  brx: 'as-IN',
  doi: 'hi-IN',
  sat: 'hi-IN',
  sd: 'sd-IN',
};

export interface STTCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (errorType: 'permission_denied' | 'no_speech' | 'network' | 'unsupported' | 'unknown', message: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface ISpeechToTextService {
  isSupported(): boolean;
  startListening(langCode: SupportedLanguageCode, callbacks: STTCallbacks): void;
  stopListening(): void;
  abort(): void;
}

class WebSpeechToTextService implements ISpeechToTextService {
  private recognition: any | null = null;
  private isListening = false;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false; // Capture discrete sentences naturally
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  startListening(langCode: SupportedLanguageCode, callbacks: STTCallbacks): void {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      callbacks.onError('unsupported', 'Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.abort();
      } catch {
        // Ignore abort error
      }
    }

    const bcp47Lang = SPEECH_LANG_MAP[langCode] || 'en-IN';
    this.recognition.lang = bcp47Lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (finalTranscript) {
        callbacks.onResult(finalTranscript.trim(), true);
      } else if (interimTranscript) {
        callbacks.onResult(interimTranscript.trim(), false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const err = event.error;

      if (err === 'not-allowed' || err === 'service-not-allowed') {
        callbacks.onError('permission_denied', 'Microphone permission was denied.');
      } else if (err === 'no-speech') {
        callbacks.onError('no_speech', 'No speech detected.');
      } else if (err === 'network') {
        callbacks.onError('network', 'Network error during speech recognition.');
      } else {
        callbacks.onError('unknown', `Speech error: ${err}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      callbacks.onError('unknown', e.message || 'Failed to start speech recognition');
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
    this.isListening = false;
  }

  abort(): void {
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // Ignore
      }
    }
    this.isListening = false;
  }
}

export const speechToTextService: ISpeechToTextService = new WebSpeechToTextService();
