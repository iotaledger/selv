import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Card, Space } from 'antd';
import useStep from '../utils/useStep';
import { Layout, Popover } from '../components';
import commitments from '../assets/commitments';

/**
 * Component which will display a SelectCommitments.
 */
const SelectCommitments = ({ history, match }) => {
    const [selected, updateSelected] = useState([]);
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const commitmentObject = commitments[category];

    useEffect(() => {
        async function getData () {
            const credentialsString = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                history.goBack();
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onSelect = commitmentId => {
        if (selected.includes(commitmentId)) {
            updateSelected(selected => [...selected].filter(id => id !== commitmentId));
        } else {
            updateSelected(selected => [...selected, commitmentId]);
        }
    }

    return (
        <Layout match={match} noFooter>
            <div className='select-commitment-page-wrapper'>
                <div className='select-commitment-wrapper'>
                    <div className='text-wrapper select-commitment-text-wrapper'>
                        <h2>{commitmentObject?.title}</h2>
                        <span>{commitmentObject?.description}</span>
                    </div>
                    <div className='commitments-list'>
                        {
                            commitmentObject?.commitments?.map(commitment => {
                                const isChecked = selected.includes(commitment?.commitmentId);
                                const isDisabled = !isChecked && selected.length === 2;
                                return (
                                    <div className='commitment-card-wrap' key={commitment?.commitmentId}>
                                        <Card 
                                            bordered={false}
                                            hoverable 
                                            className='commitment-item'
                                            onClick={() => !isDisabled && onSelect(commitment?.commitmentId)}
                                        >
                                            <div className='commitment-image-wrapper'>
                                                <img 
                                                    className='commitment-image' 
                                                    src={commitment?.image} 
                                                    alt=''
                                                />
                                                <Popover commitment={commitment} />
                                            </div>
                                            <div className='commitment-content'>
                                                <h4>{commitment?.title}</h4>
                                                <p>{commitment?.description}</p>
                                            </div>

                                        </Card>
                                        <Checkbox
                                            checked={isChecked}
                                            disabled={isDisabled}
                                            onChange={() => onSelect(commitment?.commitmentId)}
                                        >
                                            {
                                                isChecked ? 'Selected' : 'Select'
                                            }
                                        </Checkbox>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='commitments-drawer drawer fixed'>
                    <Space direction="vertical" size="middle" align="center">
                        <h4>{selected.length} out of 2 {category} commitments selected</h4>
                        <Link to={{
                            pathname: nextStep,
                            state: { commitments: selected, category }
                        }}>
                            <Button disabled={selected.length < 2}>
                                <h4>Continue</h4>
                            </Button>
                        </Link>
                    </Space>   
                </div>
            </div>
        </Layout>
    );
};

export default SelectCommitments;
