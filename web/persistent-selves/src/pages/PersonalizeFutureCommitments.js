import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, Card, Slider, Space } from 'antd';
import useStep from '../utils/useStep';
import { Layout, Popover } from '../components';
import commitments from '../assets/commitments';

/**
 * Component which will display a PersonalizeCommitments.
 */

const { Option } = Select;

const PersonalizeCommitments = ({ history, match }) => {
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const [percentage, updatePercentage] = useState([50, 50]);
    const [storedCommitments, updateStoredCommitments] = useState({});
    const [selected, setSelected] = useState([]);
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

        selected.forEach((commitment, index) => {
            const object = {
                commitmentId: commitment?.commitmentId,
                title: commitment?.title,
                condition: commitment?.condition?.if,
                percentage: commitment?.condition?.values?.[1],
                support: commitment?.condition?.support?.[0],
                walletPercentage: 50
            }
            updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [commitment?.commitmentId]: object }));
        })

		getData();
        setSelected(selected);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const marks = {
        0: <span className='mark-0'>{selected[0]?.title}</span>,
        100: <span className='mark-100'>{selected[1]?.title}</span>,
    };

    const onChange = value => {
        updatePercentage([value, 100 - value]);

        selected.forEach((item, index) => {
            const commitment = storedCommitments[item?.commitmentId];
            commitment.walletPercentage = index === 0 ? Number(value) : Number(100 - value);
            updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [commitment?.commitmentId]: commitment }));
        })
    }
    
    const handleConditionChange = (id, value) => {
        const commitment = storedCommitments[id];
        commitment.percentage = value;
        updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [id]: commitment }));
    }

    const handleSupportChange = (id, value) => {
        const commitment = storedCommitments[id];
        commitment.support = value;
        updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [id]: commitment }));
    }

    const storeCommitments = async () => {
        await localStorage.setItem(category, JSON.stringify(storedCommitments));
        await localStorage.setItem(`${category}Commitment`, 'pending');
        console.log(category, storedCommitments);
    }

    console.log('storedCommitments', storedCommitments);

    return (
        <Layout match={match} noFooter>
            <div className='personalize-commitment-page-wrapper'>
                <div className='personalize-commitment-wrapper'>
                    <div className='text-wrapper select-commitment-text-wrapper'>
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
                                        <h4>{index + 1}. {commitment?.title}</h4>
                                        <Popover commitment={commitment} />
                                    </div> 
                                    <Card 
                                        bordered={false}
                                        hoverable={false}
                                        className='commitment-card'
                                    >
                                        <div className='commitment-content'>
                                            <div className='condition-wrapper'>
                                                <p>
                                                    <b>{commitment?.condition?.if.replace(/ .*/,'')} </b> 
                                                    {commitment?.condition?.if.split(' ').slice(1).join(' ')}
                                                </p>
                                                <Select 
                                                    defaultValue={commitment?.condition?.values?.[1]} 
                                                    onChange={value => handleConditionChange(commitment?.commitmentId, value)}
                                                >
                                                    {commitment?.condition?.values?.map(item => (
                                                        <Option key={item}>{item}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className='condition-wrapper'>
                                                <p><strong>THEN</strong>  donate {percentage[index]}% of my wallet balance</p>
                                            </div>
                                            <div className='condition-wrapper'>
                                                <p><strong>TO</strong> support</p>
                                                <Select 
                                                    defaultValue={commitment?.condition?.support?.[0]} 
                                                    onChange={value => handleSupportChange(commitment?.commitmentId, value)}
                                                >
                                                    {commitment?.condition?.support?.map(item => (
                                                        <Option key={item}>{item}</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))
                        }
                    </div>
                    <div className='commitments-drawer'>
                        <h4>Choose how you want to distribute your donation</h4>
                        <p>
                            Your commitment level is based around the ongoing financial support you will give each of your chosen commitments as a gift to future generations past your lifetime.
                        </p>
                        <Slider 
                            marks={marks} 
                            step={5} 
                            defaultValue={50} 
                            tooltipVisible={false}
                            onChange={onChange}
                        />
                        <div className='percentages-wrapper'>
                            <span>{percentage[0]}%</span>
                            <span>{percentage[1]}%</span>
                        </div>
                    </div>
                    <div className='cta-wrapper'>
                        <Space direction="vertical" size="middle" align="center">
                            <Link to={nextStep}>
                                <Button onClick={storeCommitments}>
                                    <h4>Continue</h4>
                                </Button>
                            </Link>
                        </Space>   
                    </div> 
                </div>
            </div>
        </Layout>
    );
};

export default PersonalizeCommitments;
