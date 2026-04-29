'use client';

import { create } from 'zustand';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  language: (typeof window !== 'undefined' && localStorage.getItem('lang') === 'ar') ? 'ar' : 'en',
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
    set({ language: lang, isRTL: lang === 'ar' });
  },
  t: (key: TranslationKey, params?: Record<string, string | number>) => {
    const lang = get().language;
    let text = translations[lang][key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  },
  isRTL: (typeof window !== 'undefined' && localStorage.getItem('lang') === 'ar'),
}));
