import React from 'react';
import ReactGA from 'react-ga';
import Disclaimer from './Disclaimer'
import Header from './Header'
import Footer from './Footer'
import Steps from './Steps'
import Sidebar from './Sidebar'
import useStep from "../utils/useStep";

export default ({ children, match, step, customTheme }: {
    children?: JSX.Element | null | undefined;
    match: any;
    step?: number | null;
    customTheme?: string;
}) => {
    const { mainSteps, theme, /* subStep, subSteps */ } = useStep(match);

    ReactGA.pageview(match.path);

    return (
        <div className={`theme-${theme || customTheme}`}>
            <div className="page-wrapper">
                <div className="main-section">
                    <Header theme={theme} />
                    <div className="content">
                        {children}
                    </div>
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