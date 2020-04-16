import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, NextStepDrawer, TestDetailsTable } from '../components';
import back from '../assets/back.svg';
import testResults from '../testResults.json';

interface TestDetails {
    'timestamp': number;
    'testId': string;
    'testResult': string;
    'testedBy': string;
    'testKit': string;
    'values': {
        test: string;
        result: number;
        reference: string;
    }[];
}

/**
 * Component which will display a TestDetails.
 */
const TestDetails: React.FC = ({ match }: any) => {
    const testId = match?.params?.testId;
    const data = testResults.find(test => test.testId === testId);

    return (
        <Layout match={match} customClass='white-background'>
            <React.Fragment>
                <div className='company-details-wrapper'>
                    <React.Fragment>
                        <Link
                            to={{
                                pathname: `${match.url.replace(testId, '').replace('details', 'list')}`,
                            }}
                            className='company-details-back bold'
                        >
                            <img src={back} alt='' />&nbsp;&nbsp;&nbsp;Back
                        </Link>
                        <h2>Test result</h2>
                        <p className='company-number-wrapper'>
                            Test ID #<span className='company-number'>{data?.testId}</span>
                        </p>
                        <div className='company-details'>
                            <TestData details={data} />
                        </div>
                        { data?.values && <TestDetailsTable data={data.values} /> }
                    </React.Fragment>
                </div>
                <NextStepDrawer link={'/health/data/1'} />
            </React.Fragment>
        </Layout>
    );
};

const TestData = ({ details }: { details: TestDetails | undefined }) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return (
        <React.Fragment>
            <div className='company-details-item'>
                <p>Tested by</p>
                <p className='bold'>{details?.testedBy}</p>
            </div>
            <div className='company-details-item'>
                <p>Taken on</p>
                <p className='bold'>
                    {(new Date(details?.timestamp || Date.now())).toLocaleDateString('en-GB', dateOptions)}
                </p>
            </div>
            <div className='company-details-item'>
                <p>Test result</p>
                <p className={`status ${details?.testResult.toLowerCase()}`}>{details?.testResult}</p>
            </div>
        </React.Fragment>
    );
};

export default TestDetails;
