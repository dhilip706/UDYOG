/**
 * Unified Voice Service for Aisha AI Assistant
 * 
 * Primary Engine: Local / Remote VEXYL-TTS WebSocket Server (ws://127.0.0.1:8080)
 * Female Voice Model: ai4bharat/indic-parler-tts (e.g. Tamil "Jaya", Hindi "Divya", etc.)
 * Fallback Engine: In-browser Web Speech API (only used as an offline emergency fallback)
 * 
 * Strict Rules:
 * - Centralized voice entrypoint: UI components exclusively call voiceService.speak(...)
 * - Truthful language support: Kashmiri (ks) is honestly flagged as unsupported for TTS
 * - Instant cancellation on user speech or stop action
 */

import { vexylTTSProvider } from './vexylTTSProvider';
import {
  TTSCallbacks,
  VoiceOptions,
  VoiceConnectionState,
  IVoiceProvider,
} from './voiceTypes';
import { getLanguageVoiceConfig, LanguageVoiceConfig } from './languageVoiceMap';

class WebSpeechFallbackProvider implements IVoiceProvider {
  public readonly name = 'WebSpeechFallback';
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  private selectFemaleVoice(langCode: string, locale: string): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) return null;

    const maleFilter = (name: string) => {
      const lower = name.toLowerCase();
      return (
        (lower.includes('male') && !lower.includes('female')) ||
        lower.includes('david') ||
        lower.includes('ravi') ||
        lower.includes('mark') ||
        lower.includes('george') ||
        lower.includes('richard') ||
        lower.includes('james') ||
        lower.includes('sean') ||
        lower.includes('guy') ||
        lower.includes('stefan') ||
        lower.includes('arjun') ||
        lower.includes('madhav')
      );
    };

    const femaleKeywords = [
      'female', 'heera', 'zira', 'aisha', 'jenny', 'samantha', 'victoria',
      'kavya', 'swara', 'priya', 'geeta', 'neha', 'sunita', 'jaya', 'divya', 'leima'
    ];

    const eligible = this.voices.filter((v) => !maleFilter(v.name));

    // 1. Exact locale match with female keyword
    const matchLocaleFemale = eligible.find(
      (v) => (v.lang === locale || v.lang.startsWith(langCode)) &&
        femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (matchLocaleFemale) return matchLocaleFemale;

    // 2. Exact locale match that is not male
    const matchLocale = eligible.find(
      (v) => v.lang === locale || v.lang.startsWith(langCode)
    );
    if (matchLocale) return matchLocale;

    // 3. Indian English female voice (e.g. Heera, Kavya)
    const matchIndianFemale = eligible.find(
      (v) => v.lang.includes('IN') && femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (matchIndianFemale) return matchIndianFemale;

    // 4. Any English female voice (Zira, Jenny, Samantha, Google UK English Female, etc.)
    const matchAnyEnglishFemale = eligible.find(
      (v) => v.lang.startsWith('en') && femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (matchAnyEnglishFemale) return matchAnyEnglishFemale;

    // 5. Fallback to any non-male voice in eligible list
    return eligible[0] || null;
  }

  public isAvailable(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    langCode: string,
    options?: VoiceOptions,
    callbacks?: TTSCallbacks
  ): void {
    if (!this.synth) {
      callbacks?.onEnd?.();
      return;
    }

    this.synth.cancel();

    if (!text.trim()) {
      callbacks?.onEnd?.();
      return;
    }

    const config = getLanguageVoiceConfig(langCode);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = config.locale || 'en-IN';
    utterance.pitch = options?.pitch || 1.05;
    utterance.rate = options?.rate || 0.95;

    const femaleVoice = this.selectFemaleVoice(config.code, config.locale || 'en-IN');
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = (err) => {
      console.warn('[WebSpeechFallback] synthesis error:', err);
      callbacks?.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch {
      callbacks?.onEnd?.();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth?.speaking);
  }
}

export class VoiceService {
  private vexylProvider = vexylTTSProvider;
  private webSpeechProvider = new WebSpeechFallbackProvider();
  private activeProvider: IVoiceProvider = this.vexylProvider;
  private isMuted: boolean = false;

  constructor() {
    // Keep VEXYL connection warm immediately
    if (typeof window !== 'undefined') {
      this.vexylProvider.warmUp().catch(() => {});
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Listen to real-time VEXYL connection state changes
   */
  public onStateChange(listener: (state: VoiceConnectionState) => void): () => void {
    return this.vexylProvider.onStateChange(listener);
  }

  public getConnectionState(): VoiceConnectionState {
    return this.vexylProvider.getConnectionState();
  }

  public getState(): VoiceConnectionState {
    return this.getConnectionState();
  }

  /**
   * Inspect language voice parameters and support status
   */
  public getLanguageConfig(langCode: string): LanguageVoiceConfig {
    return getLanguageVoiceConfig(langCode);
  }

  /**
   * Main speech method called across the UDYOG application
   */
  public async speak(
    text: string,
    langCode: string = 'ta',
    options?: VoiceOptions,
    callbacks?: TTSCallbacks
  ): Promise<void> {
    this.stop();

    if (this.isMuted) {
      callbacks?.onEnd?.();
      return;
    }

    if (!text.trim()) {
      callbacks?.onEnd?.();
      return;
    }

    const config = getLanguageVoiceConfig(langCode);

    // Honest check: If the language is not supported by the Indic Parler-TTS model
    if (!config.ttsAvailable || !config.vexylLangCode) {
      console.info(
        `[VoiceService] Notice: ${config.name} (${config.code}) has no TTS model support. Text fallback only.`
      );
      callbacks?.onError?.(new Error(config.fallbackNotice || 'Voice currently unavailable for this language.'));
      callbacks?.onEnd?.();
      return;
    }

    // Attempt VEXYL-TTS WebSocket server first
    try {
      const vexylAvailable = await this.vexylProvider.isAvailable();
      if (vexylAvailable) {
        this.activeProvider = this.vexylProvider;
        await this.vexylProvider.speak(text, langCode, options, callbacks);
        return;
      }
    } catch (err) {
      console.warn('[VoiceService] VEXYL server unavailable, falling back to WebSpeech:', err);
    }

    // Emergency fallback to browser speech synthesis only if VEXYL is unavailable
    if (this.webSpeechProvider.isAvailable()) {
      this.activeProvider = this.webSpeechProvider;
      this.webSpeechProvider.speak(text, langCode, options, callbacks);
    } else {
      callbacks?.onEnd?.();
    }
  }

  /**
   * Instantly stops any active playback across all providers
   */
  public stop(): void {
    this.vexylProvider.stop();
    this.webSpeechProvider.stop();
  }

  public isSpeaking(): boolean {
    return this.vexylProvider.isSpeaking() || this.webSpeechProvider.isSpeaking();
  }

  public isSupported(): boolean {
    return true;
  }

  public unlockAudioContext(): Promise<void> {
    return this.vexylProvider.unlockAudioContext();
  }

  public preWarmPrompt(text: string, langCode: string): Promise<void> {
    return this.vexylProvider.preWarmPrompt(text, langCode);
  }

  public getActiveProviderName(): string {
    return this.activeProvider.name;
  }

  public getVexylEndpoint(): string {
    return this.vexylProvider.getEndpoint();
  }

  public setVexylEndpoint(url: string | null): void {
    this.vexylProvider.setEndpoint(url);
  }

  public isVexylConfigured(): boolean {
    return this.vexylProvider.isConfigured();
  }
}

export const voiceService = new VoiceService();
