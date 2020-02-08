import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';
import Disclaimer from './Disclaimer'
import Header from './Header'
import Footer from './Footer'
import Steps from './Steps'
import Sidebar from './Sidebar'
import useStep from "../utils/useStep";

export default ({ children, match, step, theme }: {
    children?: JSX.Element | null | undefined;
    match: any;
    step?: number | null;
    theme: string;
}) => {
    const { mainSteps, /* subStep, subSteps */ } = useStep(match);

    ReactGA.pageview(match.path);

    return (
        <div className={`theme-${theme}`}>
            <div className="page-wrapper">
                <div className="main-section">
                    <Header theme={theme} />
                    {children}
                    <Footer theme={theme} />
                </div>
                {
                    step ? (
                        <Sidebar>
                            <Steps 
                                steps={mainSteps} 
                                stepId={step} 
                                // subSteps={<Steps steps={subSteps} stepId={subStep} />}
                            />
                        </Sidebar>
                    ) : null
                }
            </div>
            <Disclaimer />
        </div>
    )
}