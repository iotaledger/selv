import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';
import legacy from '../assets/legacy.svg';

/**
 * Component which will display a Intro Outcomes.
 */
const IntroLegacy = ({ match }) => {
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
					<img className='outcome' src={legacy} alt='Legacy' />
					<div className='app-content-wrapper legacy'>
						<div className='content-wrap'>
							<span className='heading'>
								<h2>Plan your</h2>&nbsp;&nbsp;<h2 className='highlight'>legacy</h2>
							</span>
							<br />
							<p>
								Using your decentralised digital identity, you will explore the marks you leave into the future, understanding how your legacy might impact future generations.
							</p>
							<br />
							<br />
							<Link to={nextStep}>
								<Button className='cta'>Continue</Button>
							</Link>
						</div>
					</div>
					<img src={dots} alt='' className='dots-top' />
					<img src={dots} alt='' className='dots-bottom legacy' />
					<img src={ellipse} alt='' className='ellipse legacy' />
					<Disclaimer />
				</div>
			</div>
		</RandomGraphicElement>
	);
};

export default IntroLegacy;
