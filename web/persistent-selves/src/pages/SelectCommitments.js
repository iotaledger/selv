import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvBordered.svg';
import image from '../assets/greatSuccess/image1.png';

/**
 * Component which will display a SelectCommitments.
 */
const SelectCommitments = ({ history, match }) => {
    const { nextStep } = useStep(match);

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

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className='sign-in-confirmation'>
                    <div className='sign-in-confirmation-logo-wrapper'>
                        <img src={selv} alt='Selv app logo' />
                        <h2>Access Authorised</h2>
                    </div>
                    <div className='sign-in-confirmation-content-wrapper'>
                        <img className='image' src={image} alt='Access Authorised' />
                        <div className='sign-in-confirmation-content'>
                            <h2>You have now signed in to the registry without ever creating an account.</h2>
                            <p>
                                No more need for endless account and password creations. Verifying your data is nearly instant and completely free.
                            </p>
                            <Link to={nextStep}>
                                <Button>
                                    Continue
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default SelectCommitments;
