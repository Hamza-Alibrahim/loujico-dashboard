// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from '../public/locales/en/translation.json';
import arTranslation from '../public/locales/ar/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            ar: { translation: arTranslation },
        },
        fallbackLng: 'en',   // الافتراضي إنكليزي لو ما لقى لغة
        lng: 'en',           // نجبر البداية إنكليزي
        debug: false,
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'cookie'], // ما يقرأ من لغة المتصفح
            caches: ['localStorage', 'cookie'], // يخزن اختيار المستخدم
        },
    });

// Set initial direction based on language
const detectedLng = i18n.language || 'en';
document.documentElement.style.direction = detectedLng === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = detectedLng;

// Listen for language changes
i18n.on('languageChanged', (lng) => {
    document.documentElement.style.direction = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

export default i18n;
