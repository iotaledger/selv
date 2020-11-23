import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import image from '../assets/greatSuccess/image2.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a Intro Outcomes.
 */
const IntroOutcomes = ({ match }) => {
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
                    <img className='image' src={image} alt='Outcomes' />
                    <div className='app-content-wrapper'>
                        <h2>Create your outcomes</h2>
                        <p>
                            Using your decentralised digital identity, you will create lasting actions.<br /><br />
                            With emerging technology on IOTA, it is possible to carry out your wishes + desires beyond your lifetime.<br /><br />
                            In doing so, you create your Persistent Selves.
                        </p>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Continue
                            </Button>
                        </Link>
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

export default IntroOutcomes;
