import React from 'react';
import AppContext from './app-context';
import { routes, mainSteps } from '../steps';

const GlobalState = ({ children }: any) => {
    return (
        <AppContext.Provider value={{
            mainSteps,
            routes
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default GlobalState;
