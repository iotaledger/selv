import React from 'react';
import Disclaimer from './Disclaimer';
import Header from './Header';
import Footer from './Footer';
import Steps from './Steps';
import Sidebar from './Sidebar';
import useStep from '../utils/useStep';

export default ({ children, customTheme, customStep, noHeader, noFooter }: {
    children?: JSX.Element | null | undefined;
    customTheme?: string;
    customStep?: number;
    noHeader?: boolean;
    noFooter?: boolean;
}) => {
    const { step, mainSteps, theme, currentRoute } = useStep();

    return (
        <div className={`theme-${theme || customTheme}`}>
            <div className='page-wrapper'>
                <div className='main-section'>
                    {
                        !noHeader && <Header theme={theme || customTheme} />
                    }
                    <div className='content'>
                        {children}
                    </div>
                    {
                        !noFooter && <Footer theme={theme || customTheme} />
                    }
                </div>
                {
                    customStep || step >= 0 ? (
                        <Sidebar
                            poweredBy={currentRoute?.poweredBy}
                            processes={mainSteps[step].processes}
                            mainSteps={mainSteps}
                        />
                    ) : null
                }
                <Disclaimer />
            </div>
        </div>
    );
};
