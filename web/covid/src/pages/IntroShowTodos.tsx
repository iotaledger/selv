import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Disclaimer, RandomGraphicElement } from '../components';
import useStep from '../utils/useStep';
import howItWorks from '../assets/howItWorks.png';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    useEffect(() => {
        const reset = async () => {
            await localStorage.clear();
        };
        reset();
    }, []);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className='demo-intro' id='app'>
                    <div className='todos'>
                        <div className='heading'><h2>Credential management made&nbsp;<span className='highlight'>simple<span className="line" /></span>&nbsp;&&nbsp;<span className='highlight'>private<span className="line" /></span></h2></div>
                        <h3>This demo explores how you can safely own, manage and share personal credentials.</h3>
                        <ul className='todos'>
                            <li>Acquire your health certificate</li>
                            <li>Share your health status with your employer</li>
                            <li>Apply for a visa and prove you are fit for travel</li>
                        </ul>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Start the demo
                            </Button>
                        </Link>
                    </div>
                    <div className='image-wrapper'>
                        <img src={howItWorks} alt='how It Works' className='howItWorks' />
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroShowTodos;
