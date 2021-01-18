import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
// set instance on hooks stuff
// import { setI18n } from '../../src/context';
//
// setI18n(i18n);


i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        debug:false,
        lng: 'nl',
        fallbackLng: 'nl',
        // resources: resources,
        //keySeparator: false, // we do not use keys in form messages.welcome
        keySeparator: '.',

        interpolation: {
            //escapeValue: false // react already safes from xss
        },
        react: {
            useSuspense: false
        }


        // interpolation: {
        //     formatSeparator: ',',
        //     format(value, format) {
        //         if (format === 'uppercase') return value.toUpperCase();
        //         return value;
        //     },
        // },

        // react: {
        //     defaultTransParent: 'div',
        //     transSupportBasicHtmlNodes: true,
        //     transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
        // },
    });

export default i18n;