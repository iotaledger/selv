import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';
import image from '../assets/greatSuccess/image1.png';

/**
 * Component which will display a Step1.
 */
const Step1: React.FC = ({ match }: any) => {
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
                                    <img className='figure' src={image} alt='Collect your health credential' />
                                </div>
                                <div className='next-step-text-wrapper'>
                                    <span>
                                        <h3>Collect your health certificate</h3>
                                    </span>
                                    <p>You have recently taken a test that shows you do not pose an infection risk to others.</p>
                                    <br />
                                    <p>Your digital health credential is now available from your national health authority’s online portal.</p>
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

export default Step1;
