import React from 'react';
import ReactGA from 'react-ga';
import Disclaimer from './Disclaimer'
import Header from './Header'
import Footer from './Footer'
import Steps from './Steps'
import Sidebar from './Sidebar'
import useStep from "../utils/useStep";

export default ({ children, match, customTheme, customStep }: {
    children?: JSX.Element | null | undefined;
    match: any;
    customTheme?: string;
    customStep?: number;
}) => {
    const { step, mainSteps, theme, /* subStep, subSteps */ } = useStep(match);

    ReactGA.pageview(match.path);

    return (
        <div className={`theme-${theme || customTheme}`}>
            <div className="page-wrapper">
                <div className="main-section">
                    <Header theme={theme || customTheme} />
                    <div className="content">
                        {children}
                    </div>
                    <Footer theme={theme || customTheme} />
                </div>
                {
                    customStep || step ? (
                        <Sidebar>
                            <Steps 
                                steps={mainSteps} 
                                stepId={customStep || step} 
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