import React, { useState, useEffect } from 'react';
import { Button, Collapse, notification } from 'antd';
import { flattenObject } from '../utils/helper';
import { Layout, Loading, AccountType, PrefilledForm, Checkbox, WebSocket } from '../components';
import checkmark from '../assets/bankCheckmark.svg';
import { useTranslation } from 'react-i18next';

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

const accountTypes = {
    label: 'pages.bank.bankData.accountTypes.label',
    error: 'pages.bank.bankData.accountTypes.error',
    accounts: [
        'pages.bank.bankData.accountTypes.accounts1',
        'pages.bank.bankData.accountTypes.accounts2',
    ],
    special: 'pages.bank.bankData.accountTypes.special',
}

const messages = {
    waiting: 'general.messages.waiting',
    connectionError: 'general.messages.connectionError',
    missing: 'general.messages.missing',
    verifying: 'general.messages.verifying'
};

const notify = (type: string, message: string, description: string) => {
    return type === 'error'
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a BankData.
 */
const BankData: React.FC = ({ history, match }: any) => {
    const [webSocket, setWebSocket] = useState(false);
    const [fields, setFields] = useState<object>();
    const [accountType, setAccountType] = useState();
    const [status, setStatus] = useState('');
    const [accountStep, setAccountStep] = useState(1);
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({});
    const [prefilledCompanyData, setPrefilledCompanyData] = useState({});

    const { t } = useTranslation();

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                notify('error', 'Error', t(messages.connectionError));
                history.goBack();
            }
            const flattenData = flattenObject(credentials?.data);
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
            const personalData = personalDataFields.reduce((acc: any, entry: string) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledPersonalData({ ...personalData, ...address });

            const companyData = companyFields.reduce((acc: any, entry: string) =>
                ({ ...acc, [entry]: flattenData[entry] }), {});
            setPrefilledCompanyData({ ...companyData });
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues(fields: object) {
        setFields(fields);
        setWebSocket(true);
    }

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    async function continueNextStep(params: any) {
        if (accountStep < 4) {
            setAccountStep(accountStep => accountStep + 1);
            if (params.accountType) {
                setAccountType(params.accountType);
            }
        } else {
            const fields = {
                AccountType: accountType,
                BankName: 'SNS Bank'
            };
            await processValues(fields);
        }
    }

    function onChange(step: any) {
        accountStep > step && setAccountStep(Number(step));
    }

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData };
    const prefilledCompanyFormData: any = { dataFields: prefilledCompanyData };
    const formData: any = { onSubmit: continueNextStep, status, messages, accountTypes, buttonText: t("pages.demo.introShowTodos.getBankAccount") };

    return (
        <Layout>
            <div className='bank-data-page-wrapper'>
                <h1>{t("pages.insurance.insuranceData.openAnAccount")}</h1>
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
                                <h3>{t("pages.insurance.insuranceData.accountType")}</h3>
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
                                <h3>{t("pages.insurance.insuranceData.businessOwner")}</h3>
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
                            {t("actions.continue")}
                        </Button>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                {
                                    accountStep > 3 ? <img src={checkmark} alt='' /> : <span>3</span>
                                }
                                <h3>{t("pages.insurance.insuranceData.companyDetails")}</h3>
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
                            {t("actions.continue")}
                        </Button>
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className='section-header'>
                                <span>4</span>
                                <h3>{t("actions.confirm")}</h3>
                            </div>
                        )}
                        showArrow={false}
                        disabled={accountStep < 4}
                        key={4}
                    >
                        <Checkbox {...formData} />
                    </Collapse.Panel>
                </Collapse>
                {
                    status && (
                        <div className='loading'>
                            <p className='bold'>{t(status)}</p>
                            {
                                status === messages.waiting && <Loading />
                            }
                        </div>
                    )
                }
                {
                    webSocket && <WebSocket
                        history={history}
                        schemaName='BankAccount'
                        setStatus={setStatusMessage}
                        fields={fields}
                        messages={messages}
                    />
                }
            </div>
        </Layout>
    );
};

export default BankData;
