import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
const Landing: React.FC = () => {
    let location = useLocation();
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
