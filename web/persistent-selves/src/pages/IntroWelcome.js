import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Space } from 'antd';
import useStep from '../utils/useStep';
import welcome from '../assets/welcome.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';
import climateKIC from '../assets/climateKIC.png';
import dm from '../assets/dm.png';
import foundation from '../assets/foundation.svg';

/**
 * Component which will display a Intro Welcome.
 */
const IntroWelcome = ({ match }) => {
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
					<div className='app-content-wrapper'>
						<div className='content-row'>
							<div className='content-wrap-image'>
								<img className='phone' src={welcome} alt='Welcome' />
							</div>
							<div className='content-wrap'>
								<span className='heading'>
									<h2>Welcome to</h2>&nbsp;&nbsp;<h2 className='highlight'>Persistent Selv</h2>
								</span>
								<br />
								<br />
								<p>
									Your digital testament to a positive environmental inheritance for future generations.
								</p>
								<br />
								<p>
									Persistent Selv is an exploratory demo, empowering people to plan their environmental legacy. By using their self-sovereign digital identities (SSIDs), individuals are encouraged to improve their ecological footprints and establish trusted connections with future generations.
								</p>
								<br /><br />
								<Link to={nextStep}>
									<Button className='cta'>Explore</Button>
								</Link>
							</div>
						</div>
						<div className='content-row'>
							<div />
							<div className='content-wrap'>
								<div className='partners'>
									<img src={climateKIC} alt='' className='climateKIC' />
									<img src={foundation} alt='' className='foundation' />
									<img src={dm} alt='' className='dm' />
								</div>
								<p className='note'>
									<br />
									This demo can be best experienced using a browser on a PC or Mac in combination with the Selv app on your phone. A full phone experience is possible using a mobile browser and the Selv app.
									<br />
									<br />
									This demo has been developed by the IOTA Foundation and Dark Matter Labs, with significant conceptual contributions from Futures Literacy experts at UNESCO and Finland Futures Research Centre at University of Turku. It was produced with co-funding from EIT Climate KIC as part of its Deep Demonstration on Long-termism.
								</p>
							</div>
						</div>
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

export default IntroWelcome;
