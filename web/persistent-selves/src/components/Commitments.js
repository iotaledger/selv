import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Space } from 'antd';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';
import arrow from '../assets/arrow.svg';
import selv from '../assets/selv_black.svg';
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
                            hoverable={false}
                            bordered={false}
                            className='commitment-category-completed'
                        >
                            <div className='commitment-category-completed-image-wrapper'>
                                <Space size={20} align="center">
                                    <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                                    <h3>Far Future Foundation</h3>
                                </Space>
                                <img className='selv-logo-completed' src={selv} alt='Selv app logo' />
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
                                                        <b>{getCondition('future', commitment?.CommitmentId).replace(/ .*/, '')} </b>
                                                        {getCondition('future', commitment?.CommitmentId).split(' ').slice(1).join(' ')}
                                                        <span className='custom-value'> {commitment?.CommitmentPercentage} </span>
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
                            bordered={false}
                            className='commitment-category'
                        >
                            <div className='commitment-category-image-wrapper'>
                                <img className='commitment-category-image' src={future} alt='Far Future Foundation' />
                            </div>
                            <div className='commitment-category-content'>
                                <h3>Future Commitment</h3>
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
                            hoverable={false}
                            bordered={false}
                            className='commitment-category-completed-present'
                        >
                            <div className='commitment-category-completed-image-wrapper'>
                                <Space size={20} align="center">
                                    <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                                </Space>
                                <img className='selv-logo-completed' src={selv} alt='Selv app logo' />
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
                                                        <b>I commit to </b>
                                                        <span className='custom-value'>{commitment?.CommitmentSupport}</span>
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
                            bordered={false}
                            className={`commitment-category-present ${disabled}`}
                        >
                            <div className='commitment-category-image-wrapper'>
                                <img className='commitment-category-image' src={present} alt='Act Right Now Foundation' />
                            </div>
                            <div className='commitment-category-content'>
                                <h3>Present Commitment</h3>
                                <p>
                                Make pledges today to actively shape the present and contribute to your future legacy.
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
