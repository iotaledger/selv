import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, FAQ, PledgeCards } from '../components';
import image1 from '../assets/greatSuccess/image1.png';

/**
 * Component which will display a PledgeRegistry.
 */
const PledgeRegistry = ({ history, match, ...props }) => {
	const { nextStep } = useStep(match);

	const drawer = props?.location?.state?.nextStep ? 'drawer' : '';

	return (
		<Layout match={match} noFooter>
			<div className={`registry-page-wrapper ${drawer}`}>
				<div className='create-pledge-header-cta'>
					<div className='figure-wrapper'>
						<img className='figure' src={image1} alt='You signed in with DID' />
					</div>
					<div className='text-wrapper'>
						<h2>
							Creating the future for <br /> generations... today
						</h2>
						<Link to={nextStep}>
							<Button>Create a pledge</Button>
						</Link>
					</div>
				</div>
				<div className='registry-cta-wrapper'>
					<h4>Future outcomes that you can impact today</h4>
					<div className='content-wrapper'>
						<h4>Environmental Ceiling</h4>
						<br />
						<br />
					</div>
					<PledgeCards />
				</div>
				<FAQ />
				<div className='create-pledge-footer-cta'>
					<Link to={nextStep}>
						<Button>Create a pledge</Button>
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default PledgeRegistry;
