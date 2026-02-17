import i18n from 'i18next';
import { initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import des traductions
import enTranslations from './lang-data/eng.json';
import frTranslations from './lang-data/fr.json';
import espTranslations from './lang-data/esp.json';

i18n
  // Détection de la langue (navigateur, localStorage, etc.)
  .use(LanguageDetector)
  // Intégration avec React
  .use(initReactI18next)
  // Initialisation
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
      esp: { translation: espTranslations},
    },
    fallbackLng: 'en', // Langue par défaut si la détection échoue
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement
    },
    detection: {
      order: ['localStorage', 'navigator'], // Priorité de détection
      caches: ['localStorage'], // Sauvegarde la langue choisie
    },
  });

export default i18n;
