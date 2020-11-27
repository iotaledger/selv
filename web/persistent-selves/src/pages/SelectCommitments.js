import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Card } from 'antd';
import useStep from '../utils/useStep';
import { Layout } from '../components';
import commitments from '../assets/commitments';

/**
 * Component which will display a SelectCommitments.
 */
const SelectCommitments = ({ history, match }) => {
    const [selected, updateSelected] = useState([]);
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const commitmentObject = commitments[category];

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

    const onSelect = commitmentId => {
        if (selected.includes(commitmentId)) {
            updateSelected(selected => [...selected].filter(id => id !== commitmentId));
        } else {
            updateSelected(selected => [...selected, commitmentId]);
        }
    }

    return (
        <Layout match={match}>
            <React.Fragment>
                <div className='select-commitment-wrapper'>
                    <div className='text-wrapper'>
                        <h2>{commitmentObject?.title}</h2>
                        <p>{commitmentObject?.description}</p>
                    </div>
                    <div className='commitments-list'>
                        {
                            commitmentObject?.commitments?.map(commitment => {
                                const isChecked = selected.includes(commitment?.commitmentId);
                                const isDisabled = !isChecked && selected.length === 2;
                                return (
                                    <Card 
                                        bordered
                                        hoverable 
                                        className='commitment-item'
                                        key={commitment?.commitmentId}
                                        onClick={() => onSelect(commitment?.commitmentId)}
                                    >
                                        <div className='commitment-image-wrapper'>
                                            <img 
                                                className='commitment-image' 
                                                src={commitment?.image} 
                                                alt={commitment?.title}
                                            />
                                        </div>
                                        <div className='commitment-content'>
                                            <h2>{commitment?.title}</h2>
                                            <p>{commitment?.description}</p>
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
                                    </Card>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='commitments-drawer'>
                    <h2>Choose two {category} commitments</h2>
                    {
                        selected.length === 1
                        ? <p>You have 1 remaining commitment left to choose</p>
                        : <p>You have {2 - selected.length} remaining commitments left to choose</p>
                    }
                    <Link to={{
                        pathname: nextStep,
                        state: { commitments: selected, category }
                    }}>
                        <Button disabled={selected.length < 2}>
                            Continue
                        </Button>
                    </Link>
                </div>
            </React.Fragment>
        </Layout>
    );
};

export default SelectCommitments;
