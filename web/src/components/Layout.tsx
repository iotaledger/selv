import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Steps from './Steps';
import Sidebar from './Sidebar';
import useStep from '../utils/useStep';

const Layout = ({ children, customTheme, customStep, noHeader, noFooter }: {
    children?: JSX.Element | null | undefined;
    customTheme?: string;
    customStep?: number;
    noHeader?: boolean;
    noFooter?: boolean;
}) => {
    const { mainSteps, theme, currentRoute } = useStep();

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
                    customStep || currentRoute?.step ? (
                        <Sidebar
                            poweredBy={currentRoute?.poweredBy}
                        >
                            <Steps
                                steps={mainSteps}
                                stepId={customStep || mainSteps.findIndex((elem) => elem.id === currentRoute.step)}
                            />
                        </Sidebar>
                    ) : null
                }
            </div>
        </div>
    );
};

export default Layout;
