import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { SupportedLanguageCode, LocaleTranslations, LanguageOption } from '../types/language';
import { languageService, LanguageSource } from '../services/languageService';
import { getTranslation, getLanguageDirection, SUPPORTED_LANGUAGES } from '../locales';

export interface LanguageContextType {
  currentLanguage: SupportedLanguageCode;
  direction: 'ltr' | 'rtl';
  t: LocaleTranslations;
  changeLanguage: (code: SupportedLanguageCode, source?: LanguageSource) => void;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function applyDocumentLanguage(code: SupportedLanguageCode, dir: 'ltr' | 'rtl') {
  if (typeof document !== 'undefined') {
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    document.documentElement.setAttribute('data-language', code);
  }
}

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguageCode>(() => {
    const stored = languageService.getStoredLanguage();
    return stored || 'en';
  });

  const direction = useMemo(() => getLanguageDirection(currentLanguage), [currentLanguage]);
  const t = useMemo(() => getTranslation(currentLanguage), [currentLanguage]);

  // Synchronize DOM attributes on language state change
  useEffect(() => {
    applyDocumentLanguage(currentLanguage, direction);
  }, [currentLanguage, direction]);

  const changeLanguage = useCallback((code: SupportedLanguageCode, source: LanguageSource = 'user') => {
    // If setting via location suggestion, do not override an explicit user manual choice
    if (source === 'location') {
      const currentSource = languageService.getLanguageSource();
      if (currentSource === 'user') {
        return;
      }
    }

    const newDir = getLanguageDirection(code);
    applyDocumentLanguage(code, newDir);
    languageService.saveStoredLanguage(code, source);
    setCurrentLanguage(code);
  }, []);

  const value = useMemo<LanguageContextType>(() => ({
    currentLanguage,
    direction,
    t,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  }), [currentLanguage, direction, t, changeLanguage]);

  return React.createElement(LanguageContext.Provider, { value }, children);
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if called outside provider (e.g. isolated testing)
    const fallbackLang = languageService.getStoredLanguage() || 'en';
    return {
      currentLanguage: fallbackLang,
      direction: getLanguageDirection(fallbackLang),
      t: getTranslation(fallbackLang),
      changeLanguage: (code: SupportedLanguageCode, source: LanguageSource = 'user') => {
        languageService.saveStoredLanguage(code, source);
        applyDocumentLanguage(code, getLanguageDirection(code));
      },
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
}

