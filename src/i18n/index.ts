import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from '../locales/en/common.json';
import enAppointments from '../locales/en/appointments.json';
import esCommon from '../locales/es/common.json';
import esAppointments from '../locales/es/appointments.json';

const resources = {
  en: {
    common: enCommon,
    appointments: enAppointments,
  },
  es: {
    common: esCommon,
    appointments: esAppointments,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'appointments'],
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
