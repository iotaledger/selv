import React, { useState, useEffect } from 'react';
import { Button, Collapse } from 'antd';
import { Link } from 'react-router-dom';
import { flattenObject } from '../utils/helper';
import useStep from '../utils/useStep';
import { Layout, PrefilledForm, Certificate } from '../components';
import checkmark from '../assets/bankCheckmark.svg';
import testResults from '../testResults.json';

const personalDataFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Country',
];

/**
 * Component which will display a HRData.
 */
const HRData: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match);
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({});
    const [prefilledData, setPrefilledData] = useState({});

    useEffect(() => {
        async function getData () {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const testData = testResults[0];
            const personalData = personalDataFields.reduce((acc: any, entry: string) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledPersonalData({ ...personalData, ...address });
            setPrefilledData({ ...flattenData, ...testData });
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData };

    return (
        <Layout match={match}>
            <div className='bank-data-page-wrapper'>
                <h1>You are able to return to work</h1>
                <Collapse
                    bordered={false}
                    defaultActiveKey={[1, 2]}
                >
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <div className="section-header-title">
                                    <img src={checkmark} alt='' />
                                    <h3>Test result</h3>
                                </div>
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
                                <div className="section-header-title">
                                    <img src={checkmark} alt='' />
                                    <h3>Personal details</h3>
                                </div>
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
                </Collapse>
                <div className='cta-wrapper'>
                    <Link to={nextStep}>
                        <Button
                            className='cta'
                            onClick={async () => await localStorage.setItem('employer', 'completed')}
                        >
                            Continue
                        </Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default HRData;
