'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { updateUserLanguageAction } from '@/app/(login)/actions';
import '../lib/i18n'; // Initialize i18n

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'od', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
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
    
    // For initialization, set the correct state and cookie without reloading
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === initialLang);
    if (language) {
      setCurrentLanguage(language);
      i18n.changeLanguage(initialLang);
      document.documentElement.lang = initialLang;
      
      const googleLangCode = initialLang === 'od' ? 'or' : initialLang;
      document.cookie = `googtrans=/en/${googleLangCode}; path=/`;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Observe changes to html and body inline styles to prevent top frame offsets
    const targetNodes = [document.documentElement, document.body];
    const config = { attributes: true, attributeFilter: ['style'] };

    const callback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target as HTMLElement;
          if (target.style.top && target.style.top !== '0px') {
            target.style.setProperty('top', '0px', 'important');
          }
          if (target.style.marginTop && target.style.marginTop !== '0px') {
            target.style.setProperty('margin-top', '0px', 'important');
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    targetNodes.forEach(node => {
      observer.observe(node, config);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    if (!language) return;

    // Skip if already on this language
    if (langCode === i18n.language) return;

    setCurrentLanguage(language);
    i18n.changeLanguage(langCode);
    localStorage.setItem('arogya-language', langCode);
    document.documentElement.lang = langCode;

    // Sync with server — fire and forget, never block navigation
    // Wrapped in try/catch so a dead backend never affects the UI
    try {
      updateUserLanguageAction(langCode).catch(() => {/* silent */});
    } catch {/* silent */}

    // Set cookie for Google Translate (map od → or)
    const googleLangCode = langCode === 'od' ? 'or' : langCode;
    document.cookie = `googtrans=/en/${googleLangCode}; path=/`;
    document.cookie = `googtrans=/en/${googleLangCode}; path=/; domain=${window.location.hostname}`;

    // Reload the page to let Google Translate and localized assets apply instantly
    window.location.reload();
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