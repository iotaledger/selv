import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStep from '../utils/useStep';
import { Disclaimer } from '../components';
import SketchInitial from '../animation/LifeSpanAnimationInitial';
import SketchFinal from '../animation/LifeSpanAnimationFinal';
import logo from '../assets/landing/logoHeader.svg';

/**
 * Component which will display a Intro LifeSpan.
 */
const IntroLifeSpan = ({ match }) => {
	const { nextStep } = useStep(match);

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	}, []);

	return (
		<div className="theme-demo lifespan">
			<div className='demo-logo-wrapper'>
				<Link to={'/'} className='logo demo-page'>
					<img src={logo} alt='Selv logo' />
				</Link>
			</div>

			{
				nextStep === '/demo/thankyou' ? <SketchFinal /> : <SketchInitial />
			}
			<Disclaimer />
		</div>
	);
};

export default IntroLifeSpan;
