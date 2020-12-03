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
				<Link to={'/'} className='logo demo-page'>
					<img src={logo} alt='Selv logo' />
				</Link>
				<div className='demo-intro app' id='app'>
					<img className='outcome' src={image} alt='Outcomes' />
					<div className='app-content-wrapper'>
						<span className='heading'>
							<h2>Create your</h2>&nbsp;&nbsp;<h2 className='highlight'>Persistent Selves</h2>
						</span>
						<br />
						<br />
						<p>
							Using your decentralised digital identity, you will create lasting actions and
							explore different lenses of viewing the future. With emerging technology it is
							possible to.
							<br />
							<br />
							In doing so, you create your Persistent Selves.
						</p>
						<br />
						<br />
						<Link to={nextStep}>
							<Button className='cta'>Continue</Button>
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
