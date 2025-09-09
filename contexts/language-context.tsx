'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../lib/i18n'; // Initialize i18n

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
];

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (langCode: string) => void;
  supportedLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);

  useEffect(() => {
    // Initialize from localStorage or browser language
    const savedLang = localStorage.getItem('arogya-language');
    const browserLang = navigator.language.split('-')[0];
    
    let initialLang = 'en';
    if (savedLang && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLang)) {
      initialLang = savedLang;
    } else if (SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang)) {
      initialLang = browserLang;
    }
    
    changeLanguage(initialLang);
  }, []);

  const changeLanguage = (langCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    if (language) {
      setCurrentLanguage(language);
      i18n.changeLanguage(langCode);
      localStorage.setItem('arogya-language', langCode);
      document.documentElement.lang = langCode;
    }
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}