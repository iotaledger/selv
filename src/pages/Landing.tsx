import React, { useEffect } from 'react';
import {
    App,
    ControlIdentity,
    FAQ,
    Footer,
    Header,
    HowItWorks,
    Main,
    Selv,
    Benefits
} from '../components/landing';

/**
 * Component which will display a Landing page.
 */
const Landing: React.FC = ({ location }: any) => {
    useEffect(() => {
        if (location.hash) {
            const target: Element | null = document.querySelector(location.hash);
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [location.hash]);

    return (
        <div className='theme-demo'>
            <div className='landing-page-wrapper'>
                <Header />
                <Main />
                <ControlIdentity />
                <Selv />
                <HowItWorks />
                <Benefits />
                <App />
                <FAQ />
                <Footer />
            </div>
        </div>
    );
};

export default Landing;
