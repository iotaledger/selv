import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import useStep from '../utils/useStep';
import { Layout, NextStepDrawer } from '../components';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';
import arrow from '../assets/arrow.svg';
import selv from '../assets/selv.svg';
import commitments from '../assets/commitments';

/**
 * Component which will display a SelectCommitmentCategory.
 */
const SelectCommitmentCategory = ({ match }) => {
    const { nextStep } = useStep(match);
    const [disabled, updateDisabled] = useState('disabled');
    const [futureCommitment, setFutureCommitment] = useState();
    const [presentCommitment, setPresentCommitment] = useState();

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

            futureCommitment && setFutureCommitment(JSON.parse(futureCommitment));
            presentCommitment && setPresentCommitment(JSON.parse(presentCommitment));
            
            if (future === 'completed') {
                updateDisabled(false);
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const getCondition = (category, commitmentId) => {
        const commitment = commitments[category]?.commitments?.find(item => 
            item?.commitmentId === commitmentId
        );

        return commitment?.condition?.if;
    }

    return (
        <Layout match={match}>
            <div className='select-commitment-category-wrapper'>
                {
                    futureCommitment 
                        ? (
                            <Card 
                                bordered
                                hoverable 
                                className='commitment-category-completed'
                            >
                                <div className='commitment-category-completed-image-wrapper'>
                                    <div className='commitment-category-image-container'>
                                        <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                                        <h2>Far Future Foundation</h2>
                                    </div>
                                    <img src={selv} alt='Selv app logo' />
                                </div>
                                <div className='commitment-category-completed-content'>
                                    {
                                        futureCommitment?.Commitments?.map(commitment => (
                                            <div 
                                                className='completed-commitment-wrapper' 
                                                key={commitment?.CommitmentId}
                                            >
                                                <div className='completed-commitment-card'>
                                                    <div className='completed-commitment-content'>
                                                        <p>
                                                            {getCondition('future', commitment?.CommitmentId)} <span className='custom-value'>{commitment?.CommitmentPercentage}% </span>
                                                            THEN donate <span className='custom-value'>{commitment?.CommitmentWalletPercentage}%</span> of my wallet balance
                                                            TO support <span className='custom-value'>{commitment?.CommitmentSupport}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Card>
                        ) : (
                            <Card 
                                bordered
                                hoverable 
                                className='commitment-category'
                            >
                                <div className='commitment-category-image-wrapper'>
                                    <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                                    <h2>Far Future Foundation</h2>
                                </div>
                                <div className='commitment-category-content'>
                                    <h2>Future Commitment</h2>
                                    <p>
                                        The far future commitment allows you to make conditional choices about a far-away future based on oracles and smart contracts.
                                    </p>
                                    <Link to={{
                                        pathname: '/future/select/1',
                                        state: { category: 'future' }
                                    }}>
                                        <Button className='category-future'>
                                            Visit Now
                                            <img className='arrow' src={arrow} alt='' />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )
                }
                {
                    presentCommitment 
                        ? (
                            <Card 
                                bordered
                                hoverable 
                                className='commitment-category-completed'
                            >
                                <div className='commitment-category-completed-image-wrapper'>
                                    <div className='commitment-category-image-container'>
                                        <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                                        <h2>Act Right Now Foundation</h2>
                                    </div>
                                    <img src={selv} alt='Selv app logo' />
                                </div>
                                <div className='commitment-category-completed-content'>
                                    {
                                        presentCommitment?.Commitments?.map(commitment => (
                                            <div 
                                                className='completed-commitment-wrapper' 
                                                key={commitment?.CommitmentId}
                                            >
                                                <div className='completed-commitment-card'>
                                                    <div className='completed-commitment-content'>
                                                        <p>
                                                            {getCondition(('present'), commitment?.CommitmentId)} <span className='custom-value'>{commitment?.CommitmentPercentage}% </span>
                                                            THEN donate <span className='custom-value'>{commitment?.CommitmentWalletPercentage}%</span> of my wallet balance
                                                            TO support <span className='custom-value'>{commitment?.CommitmentSupport}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Card>
                        ) : (
                            <Card 
                                bordered
                                hoverable={!disabled} 
                                className={`commitment-category ${disabled}`}
                            >
                                <div className='commitment-category-image-wrapper'>
                                    <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                                    <h2>Act Right Now Foundation</h2>
                                </div>
                                <div className='commitment-category-content'>
                                    <h2>Present Commitment</h2>
                                    <p>
                                        The present commitment let´s you make pledges to get involved and shaping the present yourself.
                                    </p>
                                    <Link to={{
                                        pathname: '/present/select/2',
                                        state: { category: 'present' }
                                    }}>
                                        <Button disabled={disabled} className='category-present'>
                                            Visit Now
                                            <img className='arrow' src={arrow} alt='' />
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )
                }
                {
                    futureCommitment && presentCommitment && <NextStepDrawer nextStep={nextStep} />
                }
            </div>
        </Layout>
    );
};

export default SelectCommitmentCategory;
