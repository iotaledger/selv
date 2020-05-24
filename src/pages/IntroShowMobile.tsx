import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import mobile from '../assets/mobile.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className='demo-intro app' id='app'>
                    <div className='app-content-wrapper'>
                        <div className='heading'><h2>Welcome to&nbsp;<span className='highlight'>Selv<span className="line" /></span></h2></div>
                        <h3>Share your health status and other personal credentials securely and privately. Powered by IOTA.</h3>
                        <p className='note'>This demo website is best experienced on a desktop computer.</p>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Continue
                            </Button>
                        </Link>
                    </div>
                    <img className='phone' src={mobile} alt='Mobile phone' />
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <img src={ellipse} alt='' className='ellipse' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroShowTodos;
