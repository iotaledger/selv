import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Disclaimer, RandomGraphicElement } from '../components';
import useStep from '../utils/useStep';
import howItWorks from '../assets/landing/howItWorks1.png';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a Intro Todos.
 */
const IntroTodos = ({ match }) => {
	const { mainSteps, nextStep } = useStep(match);

	useEffect(() => {
		const reset = async () => {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'smooth'
			});
			await localStorage.clear();
		};
		reset();
	}, []);

	return (
		<RandomGraphicElement elements={7}>
			<div className='theme-demo'>
                <Link to={'/'} className="logo demo-page">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className='demo-intro' id='app'>
                <div className='todos-wrapper'>
                    <div className='todos'>
                        <div className='heading-wrapper'>
                            <span className='heading'><h2>Becoming a</h2>&nbsp;&nbsp;<h2 className='highlight'>good ancestor</h2></span>
                            <br/>
                        </div>
                        <p>Explore this demo to discover how you can create an  environmental legacy for future generations.</p>
                        <ul className='todos'>
                            {
                                mainSteps.map(({ title }) => <li key={title}>{title}</li>)
                            }
                        </ul>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                Start the demo
                            </Button>
                        </Link>
                    </div>
                    <div className='image-wrapper'>
                        <img src={howItWorks} alt='how It Works' />
                    </div>
                </div>
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <Disclaimer />
                </div>
            </div>
		</RandomGraphicElement>
	);
};

export default IntroTodos;
