import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, FAQ, PledgeCards } from '../components';
import pledgeRegistry from '../assets/pledgeRegistry.svg';

/**
 * Component which will display a PledgeRegistry.
 */
const PledgeRegistry = ({ history, match, ...props }) => {
	const { nextStep } = useStep(match);

	const drawer = props?.location?.state?.nextStep ? 'drawer' : '';

	return (
		<Layout match={match} noFooter>
			<div className={`registry-page-wrapper ${drawer}`}>
				<div className='create-pledge-header-cta-wrapper'>
					<div className='create-pledge-header-cta'>
						<div className='figure-wrapper'>
							<img className='figure' src={pledgeRegistry} alt='You signed in with DID' />
						</div>
						<div className='text-wrapper'>
							<h1>
								Your legacy is now
							</h1>
							<br />
							<p>
								Throughout our lives, we generate environmental footprints that become the legacies we pass down to future generations. Good Ancestor Registry supports individuals in building a positive environmental inheritance for our descendants.
							</p>
							<br />
							<Link to={nextStep}>
								<Button>Create a commitment</Button>
							</Link>
						</div>
					</div>
				</div>
				<div className='registry-content-wrapper'>
					<h2>Learn about the Earth’s Boundaries</h2>
					<p>
						The actions of past generations have created a fragile environment. We are experiencing the negative effects of those legacies. Our future and the next generations’ future depends on the health of the Earth System and its boundaries. By learning and committing to support our planet’s system today, we can start shaping a positive legacy for the future.
					</p>
				</div>
				<PledgeCards />
				<FAQ />
				<div className='create-pledge-footer-cta'>
					<h3>
						Your legacy is now – Create a commitment
					</h3>
					<Link to={nextStep}>
						<Button>Create a commitment</Button>
					</Link>
				</div>
			</div>
		</Layout>
	);
};

export default PledgeRegistry;
