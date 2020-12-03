import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import mobile from '../assets/mobile.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';

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
			<div className="theme-demo">
				<Link to={'/'} className="logo demo-page">
					<img src={logo} alt="Selv logo" />
				</Link>
				<div className="demo-intro app" id="app">
					<img className="phone" src={mobile} alt="Mobile phone" />
					<div className="app-content-wrapper">
						<span className="heading">
							<h2>Welcome to</h2>&nbsp;&nbsp;<h2 className="highlight">Persistent Selves</h2>
						</span>
						<br />
						<br />
						<p>
							Your digital testament to a positive environmental inheritance for future
							generations.
						</p>
						<p>
							Persistent Selv is an exploratory demo, empowering people to plan their
							environmental legacy. By using their self-sovereign digital identities (SSIDs),
							individuals are encouraged to improve their ecological footprints and establish
							trusted connections with future generations.
							<br />
							<br /> Your legacy is now...
							<br />
							<br />
						</p>
						{/* prettier-ignore */}
						<Link to={nextStep}>
                            <Button className='cta'>
                                Continue
                            </Button>
                        </Link>
						<p className="note">
							<br />
							This demo can be best experienced using a browser on a PC or Mac in combination
							with the Selv app on your phone. A full phone experience is possible using a
							mobile browser and the Selv app.
							<br />
							<br />
							The demo has been developed by the IOTA Foundation and Dark Matter Labs, as part
							of EIT Climate-KIC’s Deep Demonstration on Long-termism.
						</p>
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

export default IntroWelcome;
