import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Disclaimer, RandomGraphicElement } from '../components';
import useStep from '../utils/useStep';
import howItWorks from '../assets/landing/howItWorks1.png';
import dots from '../assets/backgrounds/dots.png';
import { serverAPI } from '../config.json';

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    useEffect(() => {
        const reset = async () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            await localStorage.clear();
            axios.get(`${serverAPI}/remove`); 
        };
        reset();
    }, []);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <div className='demo-intro' id='app'>
                    <div className='todos'>
                        <span className='heading'><h2>Welcome to the</h2>&nbsp;&nbsp;&nbsp;<h2 className='highlight'>Selv demo</h2></span>
                        <h3>Here is <strong>your to-do list</strong> for today:</h3>
                        <ul className='todos'>
                            <li>Set up a company</li>
                            <li>Get a bank account</li>
                            <li>Get liability insurance</li>
                        </ul>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Continue
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
