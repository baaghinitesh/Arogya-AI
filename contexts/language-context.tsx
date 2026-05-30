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

    // Highly responsive checker to clean dynamic google layouts
    const interval = setInterval(() => {
      // Clean banner frames
      const banners = document.querySelectorAll('.goog-te-banner-frame, iframe.goog-te-banner-frame');
      banners.forEach(banner => {
        const el = banner as HTMLElement;
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('height', '0', 'important');
        el.style.setProperty('width', '0', 'important');
        el.style.setProperty('opacity', '0', 'important');
      });

      // Hide general skip translates
      const skipTranslates = document.querySelectorAll('.skiptranslate');
      skipTranslates.forEach(skip => {
        const el = skip as HTMLElement;
        if (el.tagName.toLowerCase() !== 'body' && el.tagName.toLowerCase() !== 'html') {
          el.style.setProperty('display', 'none', 'important');
        }
      });

      // Keep positions cleanly reset
      if (document.documentElement.style.top && document.documentElement.style.top !== '0px') {
        document.documentElement.style.setProperty('top', '0px', 'important');
      }
      if (document.body.style.top && document.body.style.top !== '0px') {
        document.body.style.setProperty('top', '0px', 'important');
      }
    }, 150);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
    if (language) {
      setCurrentLanguage(language);
      i18n.changeLanguage(langCode);
      localStorage.setItem('arogya-language', langCode);
      document.documentElement.lang = langCode;

      // Sync with server if user is logged in
      updateUserLanguageAction(langCode).catch(err => {
        console.error('Failed to sync language to server:', err);
      });

      // Set cookie for Google Translate (map od to or)
      const googleLangCode = langCode === 'od' ? 'or' : langCode;
      document.cookie = `googtrans=/en/${googleLangCode}; path=/`;
      document.cookie = `googtrans=/en/${googleLangCode}; path=/; domain=${window.location.hostname}`;

      // Force a reload to apply global translation instantly
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
      };

      const currentCookie = getCookie('googtrans');
      const expectedCookieValue = `/en/${googleLangCode}`;
      if (currentCookie !== expectedCookieValue) {
        window.location.reload();
      } else {
        // Fallback reload if it was already set but needs a refresh
        window.location.reload();
      }
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