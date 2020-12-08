import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout } from '../components';

/**
 * Component which will display a Stats.
 */
const Stats = ({ match }) => {
    const { nextStep } = useStep(match);

    return (
        <Layout match={match}>
            <div className='statistics'>
                <h2>Your legacy for the future</h2>
                <Link to={nextStep}>
                    <Button>
                        Continue
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Stats;
