import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox, Card } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvBordered.svg';
import image from '../assets/greatSuccess/image1.png';
import commitments from '../assets/commitments';

/**
 * Component which will display a SelectCommitments.
 */
const SelectCommitments = ({ history, match }) => {
    
    const { nextStep } = useStep(match);
    const category = history?.location?.state?.category;
    const commitmentObject = commitments[category];
    console.log(222, category, commitmentObject);

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
            <div className='select-commitment-wrapper'>
                <div className='text-wrapper'>
                    <h2>{commitmentObject?.title}</h2>
                    <p>{commitmentObject?.description}</p>
                </div>
                <div className='commitments-list'>
                    {
                        commitmentObject?.commitments?.map(commitment => (
                            <Card 
                                bordered
                                hoverable 
                                className='commitment-item'
                                key={commitment?.commitmentId}
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
                                   
                                    <Checkbox className='category-future'>
                                        Visit Now
                                    </Checkbox>
                                </div>
                            </Card>
                        ))
                    }
                </div>
            </div>
        </Layout>
    );
};

export default SelectCommitments;
