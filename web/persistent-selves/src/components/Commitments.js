import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';
import arrow from '../assets/arrow.svg';
import selv from '../assets/selv.svg';
import commitments from '../assets/commitments';

const Commitments = ({ futureCommitment, presentCommitment, disabled, nextStep }) => {
    const getCondition = (category, commitmentId) => {
        const commitment = commitments[category]?.commitments?.find(item => 
            item?.commitmentId === commitmentId
        );
        return commitment?.condition?.if;
    }
    
    return (
        <div className='select-commitment-category-wrapper'>
            {
                futureCommitment 
                    ? (
                        <Card
                            hoverable 
                            className='commitment-category-completed'
                        >
                            <div className='commitment-category-completed-image-wrapper'>
                                <div className='commitment-category-image-container'>
                                    <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                                    <h3>Far Future <br/> Foundation</h3>
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
                            hoverable 
                            className='commitment-category'
                        >
                            <div className='commitment-category-image-wrapper'>
                                <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                                <h3>Far Future <br/> Foundation</h3> 
                            </div>
                            <div className='commitment-category-content'>
                                <h2>Future Commitment</h2>
                                <p>
                                    The far future commitment allows you to make conditional choices about a far-away future based on oracles and smart contracts.
                                </p>
                                <Link to={{
                                    pathname: nextStep,
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
                            hoverable 
                            className='commitment-category-completed'
                        >
                            <div className='commitment-category-completed-image-wrapper'>
                                <div className='commitment-category-image-container'>
                                    <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                                    <h3>Act Right Now Foundation</h3>
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
                            hoverable={!disabled} 
                            className={`commitment-category-present ${disabled}`}
                        >
                            <div className='commitment-category-image-wrapper'>
                                <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                                <h3>Act Right Now Foundation</h3>
                            </div>
                            <div className='commitment-category-content'>
                                <h2>Present Commitment</h2>
                                <p>
                                    The present commitment let's you make pledges to get involved and shaping the present yourself.
                                </p>
                                <Link to={{
                                    pathname: nextStep,
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
        </div>
    );
};

export default Commitments;
