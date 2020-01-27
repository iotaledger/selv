import React, { useState } from 'react';
import AppContext from './app-context';
import { routes, mainSteps, subSteps } from '../steps'

const GlobalState = ({ children }: any) => {
  const [language, setLanguage] = useState('en')
  
  function changeLanguage(language: string) {
    setLanguage(language);
  };

  return (
    <AppContext.Provider value={{ changeLanguage, language, mainSteps, subSteps, routes }}>
        {children}
    </AppContext.Provider>
  );
}

export default GlobalState;