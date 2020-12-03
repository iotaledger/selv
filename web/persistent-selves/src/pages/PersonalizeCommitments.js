import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Select, Card, Slider } from 'antd';
import useStep from '../utils/useStep';
import { Layout } from '../components';
import commitments from '../assets/commitments';

/**
 * Component which will display a PersonalizeCommitments.
 */

const { Option } = Select;
const percentages = Array.from({ length: 11 }, (x, i) => i * 10);

const PersonalizeCommitments = ({ history, match }) => {
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const [percentage, updatePercentage] = useState([50, 50]);
    const [storedCommitments, updateStoredCommitments] = useState({});
    const [selected, setSelected] = useState([]);


    useEffect(() => {
        const selectedCommitments = history?.location?.state?.commitments;
        const selected = commitments[category]?.commitments?.filter(commitment =>
            selectedCommitments.includes(commitment?.commitmentId)
        );

        selected.forEach((commitment, index) => {
            const object = {
                commitmentId: commitment?.commitmentId,
                title: commitment?.title,
                condition: commitment?.condition?.if,
                percentage: index === 0 ? percentages[3] : percentages[1],
                support: commitment?.condition?.support?.[0],
                walletPercentage: 50
            }
            updateStoredCommitments(storedCommitments => ({ ...storedCommitments, [commitment?.commitmentId]: object }));
        })

        setSelected(selected);

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const marks = {
        0: selected[0]?.title,
        100: selected[1]?.title,
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
        commitment.percentage = Number(value);
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
        <Layout match={match}>
            <React.Fragment>
                <div className='personalize-commitment-wrapper'>
                    <div className='text-wrapper'>
                        <h2>Personalise your commitment</h2>
                        <p>
                            Choose from a number of future commitments you wish to support. Future generations will have to deal with a number of environmental issues if we continue 'business as usual'. 
                            <br /><br /><br />
                            You can choose two pledges to help the future as part of your legacy.
                        </p>
                    </div>
                    <div className='commitments-list'>
                        {
                            selected?.map((commitment, index) => (
                                <div 
                                    className='commitment-item' 
                                    key={commitment?.commitmentId}
                                >
                                    <h4>{commitment?.title}</h4>
                                    <Card 
                                        bordered
                                        hoverable={false}
                                        className='commitment-card'
                                    >
                                        <div className='commitment-content'>
                                            <div>
                                                <p>{commitment?.condition?.if}</p>
                                                <Select 
                                                    defaultValue={`${index === 0 ? percentages[3] : percentages[1]}%`} 
                                                    onChange={value => handleConditionChange(commitment?.commitmentId, value)}
                                                >
                                                    {percentages?.map(item => (
                                                        <Option key={item}>{item}%</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div><p>THEN donate {percentage[index]}% of my wallet balance</p></div>
                                            <div>
                                                <p>TO support</p>
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
                </div>
                <div className='commitments-drawer'>
                    <h2>Choose your commitment level</h2>
                    <Slider 
                        marks={marks} 
                        step={5} 
                        defaultValue={50} 
                        tooltipVisible={false}
                        onChange={onChange}
                    />
                    <p>{percentage[0]}%</p>
                    <br/>
                    <p>{percentage[1]}%</p>
                    <Link to={nextStep}>
                        <Button onClick={storeCommitments}>
                            Continue
                        </Button>
                    </Link>
                </div>
            </React.Fragment>
        </Layout>
    );
};

export default PersonalizeCommitments;
