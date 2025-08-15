// client/src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import itCommon from '../locales/it/common.json';
import alCommon from '../locales/al/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  it: {
    common: itCommon,
  },
  al: {
    common: alCommon,
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Connect with React
  .init({
    resources,
    
    // Default language
    fallbackLng: 'en',
    
    // Default namespace
    defaultNS: 'common',
    
    // Debug mode (set to false in production)
    debug: import.meta.env.MODE === 'development',
    
    // Language detection options
    detection: {
      // Storage options
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;