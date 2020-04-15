import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';
import image from '../assets/greatSuccess/image2.png';

/**
 * Component which will display a Step2.
 */
const Step2: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    return (
        <div className='next-step theme-demo' id='app'>
            <RandomGraphicElement elements={7}>
                <div>
                    <Link to={'/'} className="logo">
                        <img src={logo} alt="Selv logo" />
                    </Link>
                    <div className='next-step-wrapper'>
                        <h2>Next Step</h2>
                        <div className='next-step-content-wrapper'>
                            <div className='next-step-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image} alt='Share your immunity status with your employer' />
                                </div>
                                <div className='next-step-text-wrapper'>
                                    <span>
                                        <h3>Share your immunity status with your employer</h3>
                                    </span>
                                    <p>As an Aid Agency worker you will be working in close proximity with many office-based colleagues and off-site with vulnerable individuals.</p>
                                    <br />
                                    <p>Your employer has requested that all employees returning to the workplace upload the latest immunity credential to their HR portal in order to return to work with minimal risk to yourself and others.</p>
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

export default Step2;
