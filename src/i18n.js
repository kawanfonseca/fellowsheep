import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationPT from './locales/pt/translation.json';
import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json';
import translationDE from './locales/de/translation.json';
import translationFR from './locales/fr/translation.json';
import translationZH from './locales/zh/translation.json';

const resources = {
  pt: { translation: translationPT },
  en: { translation: translationEN },
  es: { translation: translationES },
  de: { translation: translationDE },
  fr: { translation: translationFR },
  zh: { translation: translationZH },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferred-language') || 'pt', // carregar idioma preferido ou usar português como padrão
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 