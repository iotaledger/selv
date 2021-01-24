import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import detector from "i18next-browser-languagedetector";
import Backend from 'i18next-http-backend';
// set instance on hooks stuff
// import { setI18n } from '../../src/context';
//
// setI18n(i18n);


i18n
    .use(detector)
    .use(Backend)
    .use(initReactI18next)
    .init({
        debug: false,
        lng: 'en',
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