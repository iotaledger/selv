import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import banner from '../assets/signInBanner.png';

/**
 * Component which will display a AccessYourTests.
 */
const AccessYourTests: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={10}>
                <div className='signin-wrapper'>
                    <img src={banner} alt='Sign in' />
                    <div className='signin-content'>
                        <p>Covid-19</p>
                        <h2>Access your Covid-19 immunity certificate</h2>
                        <p>Log in with your identity credentials to view and download your immunity certificate.</p>
                        <Link to={nextStep}>
                            <Button>
                                Sign in
                            </Button>
                        </Link>
                    </div>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default AccessYourTests;
