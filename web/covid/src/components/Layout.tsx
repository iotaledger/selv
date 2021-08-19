import React from 'react';
import Disclaimer from './Disclaimer';
import Header from './Header';
import Steps from './Steps';
import Sidebar from './Sidebar';
import useStep from '../utils/useStep';

export default ({ children, match, customTheme, customClass, customStep, noHeader }: {
    children?: JSX.Element | null | undefined;
    match: any;
    customTheme?: string;
    customClass?: string;
    customStep?: number;
    noHeader?: boolean;
}) => {
    const { step, mainSteps, theme } = useStep(match);

    return (
        <div className={`theme-${theme || customTheme}`}>
            <div className='page-wrapper'>
                <div className={`main-section ${customClass}`}>
                    {
                        !noHeader && <Header theme={theme || customTheme} />
                    }
                    <div className='content'>
                        {children}
                    </div>
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
                <Disclaimer />
            </div>
        </div>
    );
};
