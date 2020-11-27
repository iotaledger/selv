import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from 'antd';
import { Layout } from '../components';
import future from '../assets/futureCategory.svg';
import present from '../assets/presentCategory.svg';
import arrow from '../assets/arrow.svg';

/**
 * Component which will display a SelectCommitmentCategory.
 */
const SelectCommitmentCategory = ({ history, match }) => {
    const [disabled, updateDisabled] = useState('disabled');

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
            <div className='select-commitment-category-wrapper'>
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
                            The present commitment let´s you make pledges to get involved and shaping the future yourself.
                        </p>
                        <Link to={{
                            pathname: '/present/select/2',
                            state: { category: 'present' }
                        }}>
                            <Button disabled={disabled} className='category-future'>
                                Visit Now
                                <img className='arrow' src={arrow} alt='' />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default SelectCommitmentCategory;
