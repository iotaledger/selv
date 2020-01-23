import React, { useEffect, useState } from 'react';
import AppContext from './app-context';
import { routes, mainSteps, subSteps } from '../steps'

const GlobalState = ({ children }: any) => {
  const [nextStep, setNextStep] = useState(window.location.pathname)
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const pathname = window.location.pathname
    const idx = routes.findIndex(route => route.path === pathname)
    if (idx && routes.length > idx + 1) {
      const next = routes[idx + 1].path
      setNextStep(next)
    }
  }, [])

  function changeLanguage(language: string) {
    setLanguage(language);
  };

  return (
    <AppContext.Provider value={{ changeLanguage, language, nextStep, mainSteps, subSteps }}>
        {children}
    </AppContext.Provider>
  );
}

export default GlobalState;