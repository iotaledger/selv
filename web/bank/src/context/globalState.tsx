import React, { useState } from 'react';
import AppContext from './app-context';
import { routes, mainSteps } from '../steps';

const GlobalState = ({ children }: any) => {
    const [language, setLanguage] = useState("en");
    const languages: string[] = ['en, nl']

    return (
        <AppContext.Provider value={{
            mainSteps,
            routes,
            language: language,
            languages: languages,
            setLanguage: setLanguage
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default GlobalState;
