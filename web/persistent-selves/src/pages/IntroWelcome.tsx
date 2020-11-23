import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import mobile from '../assets/mobile.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a Intro Welcome.
 */
const IntroWelcome: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo demo-page">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className='demo-intro app' id='app'>
                    <img className='phone' src={mobile} alt='Mobile phone' />
                    <div className='app-content-wrapper'>
                        <h2>Welcome to Persistent Selves</h2>
                        <p>This Selv demo helps you plan your legacy today, to improve the generations of the future<br /><br /> Your legacy is now...</p>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Continue
                            </Button>
                        </Link>
                        <p className='note'>This demo can be best experienced using the browser on a PC or Mac in combination with the Selv app on your phone. A full phone experience is possible using the mobile browser and the Selv app.</p>
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <img src={ellipse} alt='' className='ellipse' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroWelcome;
