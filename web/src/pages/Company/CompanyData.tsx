import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { flattenObject } from '../../utils/helper';
import { Layout, Loading, Form, PrefilledForm } from '../../components';
import { useTranslation } from 'react-i18next';
import { useGlobalState } from '../../context/globalState';
import { Link } from 'react-router-dom';
import useStep from '../../utils/useStep';
import { Scopes } from '@shared/types/Scopes';
import CitizenCredentialConfig  from '@shared/credentials/CitizenCredential.json';

const prefilledFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone'
];

const emptyFields = [
    'CompanyName',
    'CompanyAddress',
    'CompanyType',
    'CompanyBusiness'
];

const labels = {
    CompanyName: 'pages.company.companyData.companyName',
    CompanyAddress: 'pages.company.companyData.companyAddress',
    CompanyType: 'pages.company.companyData.companyType',
    CompanyBusiness: 'pages.company.companyData.companyBusiness'
};

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
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ history, match }: any) => {
    const [fields, setFields] = useState<object>();
    const [status, setStatus] = useState('');
    const [prefilledData, setPrefilledData] = useState({});
    const { state } = useGlobalState();
    const { nextStep } = useStep();

    const { t } = useTranslation();

    // useEffect(() => {
    //     async function getData() {
    //         const credentialsString: string | null = await localStorage.getItem('credentials');
    //         const credentials = credentialsString && await JSON.parse(credentialsString);
    //         const status = credentials?.status;
    //         if (!status || Number(status) !== 2) {
    //             notify('error', 'Error', t(messages.connectionError));
    //             history.goBack();
    //         }
    //         const flattenData = flattenObject(credentials?.data);
    //         const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` };
    //         const result = prefilledFields.reduce((acc: any, entry: string) =>
    //             ({ ...acc, [entry]: flattenData[entry] }), {});

    //         setPrefilledData({ ...result, ...address });
    //     }
    //     getData();
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function processValues(fields: object) {
        setFields(fields);
    }

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    const emptyFormData: any = { dataFields: emptyFields, labels, processValues, status, messages };

    useEffect(() => {
        if(!state[Scopes.CompanyHouse]?.credentials.length) return;
        const relevantCredential = state[Scopes.CompanyHouse].credentials.filter((c: any) => c.credential?.type.includes(CitizenCredentialConfig.template.type.pop()))?.[0]?.credential;
        console.log(relevantCredential)
        if (!relevantCredential) return;
        setPrefilledData({
            'FirstName': relevantCredential.credentialSubject.firstName,
            'LastName': relevantCredential.credentialSubject.lastName,
            'Date': new Date(relevantCredential.credentialSubject.date).toLocaleString(),
            'Nationality': relevantCredential.credentialSubject.nationality,
            'Birthplace': relevantCredential.credentialSubject.birthplace,
            'Country': relevantCredential.credentialSubject.country,
            'Phone': relevantCredential.credentialSubject.phone,
        })
    }, [state, setPrefilledData]) 

    return (
        <Layout>
            <div className='company-data-page-wrapper'>
                <h2>{t("pages.company.companyData.setUpPrivateCompany")}</h2>
                <h3 className='section-header'>{t("pages.insurance.insuranceData.businessOwner")}</h3>
                {
                    // Object.keys(prefilledFormData.dataFields).length &&
                    <PrefilledForm dataFields={prefilledData} />
                }

                <h3 className='section-header'>{t("pages.insurance.insuranceData.companyDetails")}</h3>
                {/* <Form {...emptyFormData} /> */}
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
            <Link to={nextStep}>
                        <Button>
                            {
                                t("actions.continue") 
                            }
                        </Button>
                    </Link>
            </div>

        </Layout>
    );
};

export default CompanyData;
