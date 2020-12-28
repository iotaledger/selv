import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import useStep from '../utils/useStep';
import { Commitments, Credentials, Layout, NextStepDrawer } from '../components';

const { TabPane } = Tabs;

/**
 * Component which will display a SelectCommitmentCategory.
 */
const SelectCommitmentCategory = ({ history, match }) => {
	const { nextStep } = useStep(match);
	const [disabled, updateDisabled] = useState('disabled');
	const [futureCommitment, setFutureCommitment] = useState();
	const [presentCommitment, setPresentCommitment] = useState();
	const [userName, setUserName] = useState('');

	useEffect(() => {
		async function getData() {
			const future = await localStorage.getItem('futureCommitment');
			const futureCommitment = await localStorage.getItem('FutureCommitments');
			const presentCommitment = await localStorage.getItem('PresentCommitments');
			const credentialsString = await localStorage.getItem('credentials');
	        const credentials = credentialsString && await JSON.parse(credentialsString);

			credentials && setUserName(credentials?.data?.UserPersonalData?.UserName?.FirstName);
			futureCommitment && setFutureCommitment(JSON.parse(futureCommitment));
			presentCommitment && setPresentCommitment(JSON.parse(presentCommitment));

			if (future === 'completed') {
				updateDisabled(false);
			}

			const status = credentials?.status;
	        if (!status || Number(status) !== 2) {
	            history.goBack();
	        }
		}
		getData();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<Layout match={match} noFooter>
			<div className='category-page-wrapper'>
				{userName && (
					<dir className='content-header'>
						<h2 className='user-name'>{userName}'s Commitments</h2>
					</dir>
				)}
				<div className='tabs-wrapper'>
					<Tabs centered tabBarGutter={0} defaultActiveKey='1'>
						<TabPane tab='OVERVIEW' key='1'>
							<Commitments
								futureCommitment={futureCommitment}
								presentCommitment={presentCommitment}
								disabled={disabled}
								nextStep={nextStep}
							/>
						</TabPane>
						<TabPane tab='IDENTITY' key='2'>
							<Credentials />
						</TabPane>
					</Tabs>
				</div>
				{futureCommitment && presentCommitment && <NextStepDrawer nextStep={nextStep} />}
			</div>
		</Layout>
	);
};

export default SelectCommitmentCategory;
