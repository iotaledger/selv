import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
import Backend from 'i18next-http-backend';

i18n
    .use(detector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        whitelist: ['nl', 'en'],
        debug: false,
        detection: {
            order: ['path', 'localStorage'] //optionally: 'navigator', if we want to use browser-language
          },
        
        fallbackLng: 'nl',
        keySeparator: '.',
        interpolation: {
            //escapeValue: false // react already safes from xss
        },
        react: {
            useSuspense: true,
        }
    });

export default i18n;