import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import npTranslations from './locales/np.json';

function syncDocumentLang(lng: string) {
  document.documentElement.lang = lng.split('-')[0] || 'en';
}

i18n.on('languageChanged', syncDocumentLang);
i18n.on('initialized', () => {
  syncDocumentLang(i18n.resolvedLanguage || i18n.language || 'en');
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      np: { translation: npTranslations },
    },
    fallbackLng: 'en',
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
