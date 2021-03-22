import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
import Backend from 'i18next-http-backend';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
i18n
    .use(detector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        debug: false,
        lng: timeZone === 'Europe/Amsterdam'? 'nl':'en',
        fallbackLng: 'nl',
        keySeparator: '.',
        interpolation: {
            //escapeValue: false // react already safes from xss
        },
        // load: 'all',
        // preload: ['en', 'nl'],
        react: {
            useSuspense: true,
        }
    });

export default i18n;