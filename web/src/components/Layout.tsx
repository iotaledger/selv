import React from 'react';
import ReactGA from 'react-ga';
import Disclaimer from './Disclaimer'
import Header from './Header'
import Footer from './Footer'
import Steps from './Steps'
import Sidebar from './Sidebar'
import useStep from "../utils/useStep";

export default ({ children, match, customTheme, customStep, noHeader, noFooter }: {
    children?: JSX.Element | null | undefined;
    match: any;
    customTheme?: string;
    customStep?: number;
    noHeader?: boolean;
    noFooter?: boolean;
}) => {
    const { step, mainSteps, theme } = useStep(match);

    ReactGA.pageview(match.url);

    return (
        <div className={`theme-${theme || customTheme}`}>
            <div className="page-wrapper">
                <div className="main-section">
                    {
                        !noHeader &&  <Header theme={theme || customTheme} />
                    }
                    <div className="content">
                        {children}
                    </div>
                    {
                        !noFooter && <Footer theme={theme || customTheme} />
                    }
                </div>
                {
                    customStep || step >= 0 ? (
                        <Sidebar>
                            <Steps 
                                steps={mainSteps} 
                                stepId={customStep || step} 
                            />
                        </Sidebar>
                    ) : null
                }
            </div>
            <Disclaimer />
        </div>
    )
}