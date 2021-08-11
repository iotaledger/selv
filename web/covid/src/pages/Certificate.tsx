import React, { useState, useEffect } from 'react';
import { notification, Button } from 'antd';
import { flattenObject } from '../utils/helper';
import { Layout, Loading, WebSocket } from '../components';
import testResults from '../testResults.json';
import background from '../assets/certificateCheck.svg';

interface IData {
    FirstName?: string;
    LastName?: string;
    Date?: string;
    IdentityCardNumber?: string;
    timestamp?: number;
    testId?: string;
    testResult?: string;
    testedBy?: string;
    testKit?: string;
}

const messages = {
    waiting: 'Waiting for Selv app...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted'
};

const notify = (type: string, message: string, description: string) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a Certificate.
 */
const Certificate: React.FC = ({ history, match }: any) => {
    const [webSocket, setWebSocket] = useState(false);
    const [fields, setFields] = useState({});
    const [status, setStatus] = useState('');
    const [prefilledData, setPrefilledData] = useState<any>();

    useEffect(() => {
        async function getData () {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!credentialsString || !credentials || !status || Number(status) !== 2) {
                notify('error', 'Error', messages.connectionError);
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const testData = testResults[0];

            setPrefilledData({ ...flattenData, ...testData });
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues () {
        const fields = {
            TestID: prefilledData?.testId,
            TestBy: prefilledData?.testedBy,
            TestTimestamp: prefilledData?.timestamp.toString(),
            TestKit: prefilledData?.testKit,
            TestResult: prefilledData?.testResult
        }
        setFields(fields);
        setWebSocket(true);
    }

    function setStatusMessage (message: string) {
        setStatus(message);
    }

    return (
        <Layout match={match} customClass='white-background'>
            <div className='certificate-data-page-wrapper'>
                <h2>Your Covid-19 health certificate</h2>
                <p className="subheader">Share this certificate with your employer or relevant authorities via your Selv App.</p>
                <div className="certificate-wrapper">
                    <h3 className='certificate-section-header'>Test {prefilledData?.testId}</h3>
                    <TestData details={prefilledData}/>
                    <h3 className='certificate-section-header'>Patient details</h3>
                    <PersonalData details={prefilledData}/>
                    <img src={background} alt='' />
                </div>
                <Button onClick={processValues}>
                    Add credential to Selv App
                </Button>
                {
                    status && (
                        <div className='loading'>
                            <p className='bold'>{status}</p>
                            {
                                status === messages.waiting && <Loading />
                            }
                        </div>
                    )
                }
                {
                    webSocket && <WebSocket
                        history={history}
                        match={match}
                        schemaName='TestResult'
                        setStatus={setStatusMessage}
                        fields={fields}
                        warningMessage="Please return 3 pages back and scan the QR code with your Selv app"
                    />
                }
            </div>
        </Layout>
    );
};

const TestData = ({ details }: { details: IData | undefined }) => {
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className="details-section">
            <div className='details-item'>
                <p>Tested by</p>
                <p className='bold'>{details?.testedBy}</p>
            </div>
            <div className='details-item'>
                <p>Test kit</p>
                <p className='bold'>{details?.testKit}</p>
            </div>
            <div className='details-item'>
                <p>Taken on</p>
                <p className='bold'>
                    {(new Date(details?.timestamp || Date.now())).toLocaleDateString('en-GB', dateOptions)}
                </p>
            </div>
            <div className='details-item'>
                <p>Test result</p>
                <p className='bold'>{details?.testResult}</p>
            </div>
        </div>
    );
};

const PersonalData = ({ details }: { details: IData | undefined }) => {
    return (
        <div className="details-section">
            <div className='details-item'>
                <p>First name</p>
                <p className='bold'>{details?.FirstName}</p>
            </div>
            <div className='details-item'>
                <p>Last name</p>
                <p className='bold'>{details?.LastName}</p>
            </div>
            <div className='details-item'>
                <p>Date of birth</p>
                <p className='bold'>{details?.Date}</p>
            </div>
            <div className='details-item'>
                <p>ID number</p>
                <p className='bold'>{details?.IdentityCardNumber}</p>
            </div>
        </div>
    );
};

export default Certificate;
