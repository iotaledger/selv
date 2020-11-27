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
    const [percentage, updatePercentage] = useState([50, 50]);

    const category = history?.location?.state?.category;
    const selectedCommitments = history?.location?.state?.commitments;
    const selected = commitments[category]?.commitments?.filter(commitment =>
        selectedCommitments.includes(commitment?.commitmentId)
    )

    const marks = {
        0: selected[0]?.title,
        100: selected[1]?.title,
    };

    const onChange = value => updatePercentage([value, 100 - value])
    
    const handleConditionChange = (id, value) => {
        console.log('handleConditionChange', id, value)
    }

    const handleSupportChange = (id, value) => {
        console.log('handleSupportChange', id, value)
    }
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
                        <Button>
                            Continue
                        </Button>
                    </Link>
                </div>
            </React.Fragment>
        </Layout>
    );
};

export default PersonalizeCommitments;
