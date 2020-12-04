import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import useStep from '../utils/useStep';
import { Commitments, Credentials, Layout, NextStepDrawer } from '../components';

const { TabPane } = Tabs;

/**
 * Component which will display a SelectCommitmentCategory.
 */
const SelectCommitmentCategory = ({ match }) => {
    const { nextStep } = useStep(match);
    const [disabled, updateDisabled] = useState('disabled');
    const [futureCommitment, setFutureCommitment] = useState();
    const [presentCommitment, setPresentCommitment] = useState();
    const [userName, setUserName] = useState('');

    // useEffect(() => {
    //     async function getData () {
    //         const credentialsString = await localStorage.getItem('credentials');
    //         const credentials = credentialsString && await JSON.parse(credentialsString);
    //         const status = credentials?.status;
    //         if (!status || Number(status) !== 2) {
    //             history.goBack();
    //         }
    //     }
    //     getData();
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        async function getData () {
            const future = await localStorage.getItem('futureCommitment');
            const futureCommitment = await localStorage.getItem('FutureCommitments');
            const presentCommitment = await localStorage.getItem('PresentCommitments');
            const credentials = await localStorage.getItem('credentials');
            
            credentials && setUserName(JSON.parse(credentials)?.data?.UserPersonalData?.UserName?.FirstName);
            futureCommitment && setFutureCommitment(JSON.parse(futureCommitment));
            presentCommitment && setPresentCommitment(JSON.parse(presentCommitment));
            
            if (future === 'completed') {
                updateDisabled(false);
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>
            <React.Fragment>
                <div className='content-header'>
                    {
                        userName && <h3 className='user-name'>{userName}'s Pledge</h3>
                    }
                </div>
                <div className='tabs-wrapper'>
                    <Tabs tabBarGutter={50} defaultActiveKey='1'>
                        <TabPane tab='Overview' key='1'>
                            <Commitments 
                                futureCommitment={futureCommitment} 
                                presentCommitment={presentCommitment} 
                                disabled={disabled}
                                nextStep={nextStep}
                            />
                        </TabPane>
                        <TabPane tab='Identity' key='2'>
                            <Credentials />
                        </TabPane>
                    </Tabs>
                </div>
                {
                    futureCommitment && presentCommitment && <NextStepDrawer nextStep={nextStep} />
                }
            </React.Fragment>
        </Layout>
    );
};

export default SelectCommitmentCategory;
