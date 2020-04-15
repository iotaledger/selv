import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';
import image from '../assets/greatSuccess/image3.png';

/**
 * Component which will display a Step3.
 */
const Step3: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    return (
        <div className='next-step theme-demo' id='app'>
            <RandomGraphicElement elements={7}>
                <div>
                    <Link to={'/'} className="logo">
                        <img src={logo} alt="Selv logo" />
                    </Link>
                    <div className='next-step-wrapper'>
                        <h2>Final Step</h2>
                        <div className='next-step-content-wrapper'>
                            <div className='next-step-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image} alt='Finalise your Visa application by sharing your immunity status with border authorities' />
                                </div>
                                <div className='next-step-text-wrapper'>
                                    <span>
                                        <h3>Finalise your Visa application by sharing your immunity status with border authorities</h3>
                                    </span>
                                    <p>Your aid agency needs to send you to a foreign state in order to support overseas relief efforts.</p>
                                    <br />
                                    <p>In order to gain a valid travel Visa, you must share your most recent immunity credential with the foreign immigation office to prove you pose a minimum risk of spreading the virus.</p>
                                </div>
                            </div>
                        </div>
                        <img src={dots} alt='' className='dots-top' />
                        <Disclaimer />
                    </div>
                </div>
            </RandomGraphicElement>
            <div className="cta-section cta-wrapper">
                <Link to={nextStep} className='cta'>
                    <Button>
                        Continue
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Step3;
