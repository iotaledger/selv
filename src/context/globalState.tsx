import React, { useState } from 'react';
import AppContext from './app-context';
import { routes, mainSteps } from '../steps';

const GlobalState = ({ children }: any) => {
    const [requestPassword, setRequestPassword] = useState(false);

    return (
        <AppContext.Provider value={{
            mainSteps, routes, requestPassword, setRequestPassword 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export default GlobalState;
