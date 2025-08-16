// client/src/contexts/LanguageContext.tsx (Fixed)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const supportedLanguages = [
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸' 
  },
  { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano',
    flag: '🇮🇹' 
  },
  { 
    code: 'al', 
    name: 'Albanian', 
    nativeName: 'Shqip',
    flag: '🇦🇱' 
  },
];

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: typeof supportedLanguages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    // Set initial language
    i18n.changeLanguage(currentLanguage);
    localStorage.setItem('language', currentLanguage);
  }, []);

  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lang: string) => {
    console.log('=== LANGUAGE CHANGE DEBUG ===');
    console.log('Changing language from:', currentLanguage, 'to:', lang);
    
    // Update i18n
    i18n.changeLanguage(lang);
    
    // Update local state
    setCurrentLanguage(lang);
    
    // Store in localStorage
    localStorage.setItem('language', lang);
    
    console.log('Language stored in localStorage:', localStorage.getItem('language'));
    
    // Force re-render and API refetch
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang, timestamp: Date.now() } 
    }));
    
    console.log('languageChanged event dispatched');
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      supportedLanguages,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};