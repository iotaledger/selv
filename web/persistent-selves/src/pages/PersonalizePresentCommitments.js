import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Radio, Card } from 'antd';
import useStep from '../utils/useStep';
import { Layout } from '../components';
import commitments from '../assets/commitments';

/**
 * Component which will display a PersonalizeCommitments.
 */

const PersonalizeCommitments = ({ history, match }) => {
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const [storedCommitments, updateStoredCommitments] = useState({});
    const [selected, setSelected] = useState([]);
    const [disabled, updateDisabled] = useState(true);
    const commitmentObject = commitments[category];

    useEffect(() => {
        async function getData() {
			const credentialsString = await localStorage.getItem('credentials');
			const credentials = credentialsString && (await JSON.parse(credentialsString));
			const status = credentials?.status;
			if (!status || Number(status) !== 2) {
				history.goBack();
			}
        }
        
        const selectedCommitments = history?.location?.state?.commitments;
        const selected = commitments[category]?.commitments?.filter(commitment =>
            selectedCommitments.includes(commitment?.commitmentId)
        );

        selected.forEach((commitment) => {
            const object = {
                commitmentId: commitment?.commitmentId,
                title: commitment?.title,
                condition: '',
                percentage: 100,
                support: '',
                walletPercentage: 50
            }
            updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [commitment?.commitmentId]: object }));
        })

		getData();
        setSelected(selected);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    const onChange = (id, event) => {
        const commitment = storedCommitments[id];
        commitment.support = event?.target?.value;
        updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [id]: commitment }));

        const isDisabled = Object.values(storedCommitments)?.find(commitment => !commitment?.support);
        updateDisabled(!!isDisabled);
    }

    const storeCommitments = async () => {
        await localStorage.setItem(category, JSON.stringify(storedCommitments));
        await localStorage.setItem(`${category}Commitment`, 'pending');
    }

    console.log('storedCommitments', storedCommitments);

    return (
        <Layout match={match} noFooter>
            <div className='personalize-commitment-page-wrapper'>
                <div className='personalize-commitment-wrapper'>
                    <div className='text-wrapper select-commitment-text-wrapper personalize'>
                        <h2>Personalise your commitment</h2>
                        <span>{commitmentObject?.personalise}</span>
                    </div>
                    <div className='personalize-commitments-list'>
                        {
                            selected?.map((commitment, index) => (
                                <div 
                                    className='commitment-item' 
                                    key={commitment?.commitmentId}
                                >
                                    <div className='commitment-item-header'>
                                        <h2>{commitment?.title}</h2>
                                    </div> 
                                    <Card 
                                        bordered={false}
                                        hoverable={false}
                                        className='commitment-card'
                                    >
                                        <div className='commitment-content'>
                                            <div className='condition-wrapper'>
                                                <p>
                                                    I commit to
                                                </p>
                                            </div>
                                            <div className='condition-wrapper'>
                                                <Radio.Group onChange={event => onChange(commitment?.commitmentId, event)}>
                                                    {
                                                        commitment?.options?.map(option => (
                                                            <Radio value={option} key={option} className='commitment-option'>
                                                                {option}
                                                            </Radio>
                                                        ))
                                                    }
                                                </Radio.Group>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>
                    <div className='drawer-btn-wrapper'>
                        <Link to={nextStep}>
                            <Button onClick={storeCommitments} disabled={disabled}>
                                <h4>Continue</h4>
                            </Button>
                        </Link>
                    </div> 
                </div>
            </div>
        </Layout>
    );
};

export default PersonalizeCommitments;
