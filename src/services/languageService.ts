import { SupportedLanguageCode } from '../types/language';

const LANGUAGE_STORAGE_KEY = 'aura_user_language';
const LANGUAGE_SOURCE_KEY = 'aura_language_source';

export type LanguageSource = 'user' | 'location' | 'default';

export const languageService = {
  getStoredLanguage(): SupportedLanguageCode | null {
    try {
      const code = localStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguageCode | null;
      return code || null;
    } catch {
      return null;
    }
  },

  saveStoredLanguage(code: SupportedLanguageCode, source: LanguageSource = 'user'): void {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
      localStorage.setItem(LANGUAGE_SOURCE_KEY, source);
    } catch (e) {
      console.warn('Unable to persist language:', e);
    }
  },

  getLanguageSource(): LanguageSource | null {
    try {
      return (localStorage.getItem(LANGUAGE_SOURCE_KEY) as LanguageSource) || null;
    } catch {
      return null;
    }
  },

  clearStoredLanguage(): void {
    try {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      localStorage.removeItem(LANGUAGE_SOURCE_KEY);
    } catch (e) {
      console.warn('Unable to clear stored language:', e);
    }
  },
};

