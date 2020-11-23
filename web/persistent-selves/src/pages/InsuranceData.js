import React, { useState, useEffect } from 'react';
import { Button, Collapse, notification } from 'antd';
import { flattenObject } from '../utils/helper';
import { Layout, Loading, AccountType, PrefilledForm, Checkbox, WebSocket } from '../components';
import checkmark from '../assets/bankCheckmark.svg';

const personalDataFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone'
];

const companyFields = [
    'CompanyName',
    'CompanyAddress',
    'CompanyType',
    'CompanyBusiness',
    'CompanyCreationDate',
    'CompanyNumber',
    'CompanyOwner'
];

const bankFields = [
    'BankName',
    'AccountType'
];

const accountTypes = {
    label: 'Choose liability insurance type',
    error: 'Please choose a type of liability insurance',
    accounts: ['General liability', 'Professional liability', 'Employer liability'],
    special: 'Business liability'
};

const messages = {
    waiting: 'Waiting for Selv app...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted'
};

const notify = (type, message, description) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a InsuranceData.
 */
const InsuranceData = ({ history, match }) => {
    const [webSocket, setWebSocket] = useState(false);
    const [fields, setFields] = useState();
    const [accountType, setAccountType] = useState();
    const [status, setStatus] = useState('');
    const [accountStep, setAccountStep] = useState(1);
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({});
    const [prefilledCompanyData, setPrefilledCompanyData] = useState({});
    const [prefilledBankData, setPrefilledBankData] = useState({});

    useEffect(() => {
        async function getData () {
            const credentialsString = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                notify('error', 'Error', messages.connectionError);
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const personalData = personalDataFields.reduce((acc, entry) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledPersonalData({ ...personalData, ...address });

            const companyData = companyFields.reduce((acc, entry) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledCompanyData({ ...companyData });

            const bankData = bankFields.reduce((acc, entry) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledBankData({ ...bankData });
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues (fields) {
        setFields(fields);
        setWebSocket(true);
    }

    function setStatusMessage (message) {
        setStatus(message);
    }

    async function continueNextStep (params) {
        if (accountStep < 5) {
            setAccountStep(accountStep => accountStep + 1);
            if (params.accountType) {
                setAccountType(params.accountType);
            }
        } else {
            const fields = {
                InsuranceType: accountType
            };
            await processValues(fields);
        }
    }

    function onChange (step) {
        accountStep > step && setAccountStep(Number(step));
    }

    const prefilledPersonalFormData = { dataFields: prefilledPersonalData };
    const prefilledCompanyFormData = { dataFields: prefilledCompanyData };
    const prefilledBankFormData = { dataFields: prefilledBankData };
    const formData = { onSubmit: continueNextStep, status, messages, accountTypes, buttonText: 'Get liability insurance' };

    return (
        <Layout match={match}>
            <div className='insurance-data-page-wrapper'>
                <h1>Open an account</h1>
                <Collapse
                    onChange={onChange}
                    bordered={false}
                    defaultActiveKey={[1]}
                    activeKey={accountStep}
                    accordion
                >
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                {
                                    accountStep > 1 ? <img src={checkmark} alt='' /> : <span>1</span>
                                }
                                <h3>Account type</h3>
                            </div>
                        )}
                        showArrow={false}
                        key={1}
                    >
                        <AccountType {...formData} />
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                {
                                    accountStep > 2 ? <img src={checkmark} alt='' /> : <span>2</span>
                                }
                                <h3>Business owner</h3>
                            </div>
                        )}
                        showArrow={false}
                        disabled={accountStep < 2}
                        key={2}
                    >
                        {
                            Object.keys(prefilledPersonalFormData.dataFields).length &&
                            <PrefilledForm {...prefilledPersonalFormData} />
                        }
                        <Button onClick={continueNextStep}>
                            Continue
                        </Button>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                {
                                    accountStep > 3 ? <img src={checkmark} alt='' /> : <span>3</span>
                                }
                                <h3>Company Details</h3>
                            </div>
                        )}
                        showArrow={false}
                        disabled={accountStep < 3}
                        key={3}
                    >
                        {
                            Object.keys(prefilledCompanyFormData.dataFields).length &&
                            <PrefilledForm {...prefilledCompanyFormData} />
                        }
                        <Button onClick={continueNextStep}>
                            Continue
                        </Button>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                {
                                    accountStep > 4 ? <img src={checkmark} alt='' /> : <span>4</span>
                                }
                                <h3>Bank Account Details</h3>
                            </div>
                        )}
                        showArrow={false}
                        disabled={accountStep < 4}
                        key={4}
                    >
                        {
                            Object.keys(prefilledBankFormData.dataFields).length &&
                            <PrefilledForm {...prefilledBankFormData} />
                        }
                        <Button onClick={continueNextStep}>
                            Continue
                        </Button>
                    </Collapse.Panel>

                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <span>5</span>
                                <h3>Confirm</h3>
                            </div>
                        )}
                        showArrow={false}
                        disabled={accountStep < 5}
                        key={5}
                    >
                        <Checkbox {...formData} />
                    </Collapse.Panel>
                </Collapse>
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
                        schemaName='Insurance'
                        setStatus={setStatusMessage}
                        fields={fields}
                    />
                }
            </div>
        </Layout>
    );
};

export default InsuranceData;
