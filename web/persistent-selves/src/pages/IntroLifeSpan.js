import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import image from '../assets/legacy.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
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
		<RandomGraphicElement elements={7}>
			<div className="theme-demo">
				<Link to={'/'} className="logo demo-page">
					<img src={logo} alt="Selv logo" />
				</Link>
				<div className="demo-intro-vertical app" id="app">
					<div className="vertical-content-wrapper">
						<span className="heading">
							<h2>Your Legacy,</h2>&nbsp;&nbsp;<h2 className="highlight">In Perspective</h2>
						</span>
						<img className="life-span" src={image} alt="Life span" />
						<Link to={nextStep}>
							<Button className="cta">Continue</Button>
						</Link>
					</div>
					<img src={dots} alt="" className="dots-top" />
					<img src={dots} alt="" className="dots-bottom" />
					<img src={ellipse} alt="" className="ellipse" />
					<Disclaimer />
				</div>
			</div>
		</RandomGraphicElement>
	);
};

export default IntroLifeSpan;
