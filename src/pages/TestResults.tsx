import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, TestResultsTable, NextStepDrawer } from '../components';

/**
 * Component which will display a TestResults.
 */
const TestResults: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match);

    function onRowClick (data: any) {
        history.push(`/health/details/1/${data.testId}`);
    }

    return (
        <Layout match={match} customClass='white-background'>
            <React.Fragment>
                <div className='companies-page-wrapper'>
                    <div className='companies-cta-wrapper'>
                        <h2>My Covid-19 test results</h2>
                        <Link to={nextStep}>
                            <Button>
                                Download health credential
                            </Button>
                        </Link>
                    </div>
                    <TestResultsTable onRowClick={onRowClick}/>
                </div>
                <NextStepDrawer link={nextStep} />
            </React.Fragment>
        </Layout>
    );
};

export default TestResults;
