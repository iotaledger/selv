import React, { useState, useEffect } from 'react';
import { Button, Collapse, notification } from 'antd';
import randomstring from 'randomstring';
import { flattenObject } from '../utils/helper';
import { Layout, Loading, PrefilledForm, WebSocket, Certificate } from '../components';
import testResults from '../testResults.json';

const personalDataFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Country',
    'PassportNumber'
];

const messages = {
    waiting: 'Waiting for Selv...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted'
};

const notify = (type: string, message: string, description: string) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a AgencyData.
 */
const AgencyData: React.FC = ({ history, match }: any) => {
    const [webSocket, setWebSocket] = useState(false);
    const [status, setStatus] = useState('');
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({});
    const [prefilledVisaData, setPrefilledVisaData] = useState({});
    const [prefilledData, setPrefilledData] = useState({});

    useEffect(() => {
        async function getData () {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                notify('error', 'Error', messages.connectionError);
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const personalData = personalDataFields.reduce((acc: any, entry: string) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledPersonalData({ ...personalData, ...address });

            const visaNumber = randomstring.generate({ length: 10, charset: 'numeric' });
            setPrefilledVisaData({ VisaApplicationNumber: `ESTA${visaNumber}`, VisaCountry: 'Wakanda' });

            const testData = testResults[0];
            setPrefilledData({ ...flattenData, ...testData });


        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues () {
        setWebSocket(true);
    }

    function setStatusMessage (message: string) {
        setStatus(message);
    }

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData };
    const prefilledVisaFormData: any = { dataFields: prefilledVisaData };

    return (
        <Layout match={match}>
            <div className='insurance-data-page-wrapper'>
                <h2>Your Covid-19 health status</h2>
                <Collapse
                    bordered={false}
                    defaultActiveKey={[1, 2, 3]}
                >
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <h4>Test result</h4>
                                <p className='notice bold small'>Credentials provided by Selv</p>
                            </div>
                        )}
                        showArrow={false}
                        key={1}
                    >
                        <Certificate data={prefilledData} />
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <h4>Personal details</h4>
                                <p className='notice bold small'>Credentials provided by Selv</p>
                            </div>
                        )}
                        showArrow={false}
                        key={2}
                    >
                        {
                            Object.keys(prefilledPersonalFormData.dataFields).length &&
                            <PrefilledForm {...prefilledPersonalFormData} />
                        }
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <h4>Visa Application</h4>
                            </div>
                        )}
                        showArrow={false}
                        key={3}
                    >
                        {
                            Object.keys(prefilledVisaFormData.dataFields).length &&
                            <PrefilledForm {...prefilledVisaFormData} />
                        }
                    </Collapse.Panel>
                </Collapse>
                <div className='cta-wrapper'>
                    <Button className='cta' onClick={processValues}>
                        Continue
                    </Button>
                </div>
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
                        schemaName='VisaApplication'
                        setStatus={setStatusMessage}
                        fields={prefilledVisaData}
                        warningMessage="Please return to the previous page and scan the QR code with your Selv app"
                    />
                }
            </div>
        </Layout>
    );
};

export default AgencyData;
