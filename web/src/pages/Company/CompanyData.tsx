import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { flattenObject } from '../../utils/helper';
import { Layout, Loading, Form, PrefilledForm } from '../../components';
import { useTranslation } from 'react-i18next';
import { Actions, State, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Link, useNavigate } from 'react-router-dom';
import useStep from '../../utils/useStep';
import { Scopes } from '@shared/types/Scopes';
import CitizenCredentialConfig from '@shared/credentials/CitizenCredential.json';
import DomainCheck from '../../components/DomainCheck';

const emptyFields = [{
    field: 'CompanyName',
    label: 'pages.company.companyData.companyName',
},
{
    field: 'CompanyAddress',
    label: 'pages.company.companyData.companyAddress',
},
{
    field: 'CompanyType',
    label: 'pages.company.companyData.companyType',
},
{
    field: 'CompanyBusiness',
    label: 'pages.company.companyData.companyBusiness',
}
];

const messages = {
    waiting: 'general.messages.waiting',
    connectionError: 'general.messages.connectionError',
    missing: 'general.messages.missing',
    verifying: 'general.messages.verifying'
};

// const notify = (type: string, message: string, description: string) => {
//     return type === 'error'
//         ? notification.error({ message, description })
//         : notification.warning({ message, description });
// };

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ history, match }: any) => {
    const [fields, setFields] = useState<object>();
    const [status, setStatus] = useState('');
    const [relevantCredential, setRelevantCredential] = useState<null | any>(null);
    const [prefilledData, setPrefilledData] = useState({});
    const [validatedDomains, setValidatedDomains] = useState<State['validatedDomains'][keyof State['validatedDomains']] | null>(null);
    const { state } = useGlobalState();
    const { nextStep } = useStep();
    const dispatch = useCredentialsDispatch();
    const navigate = useNavigate();

    const { t } = useTranslation();

    async function processValues(fields: object) {
        setFields(fields);
    }

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    function onSubmit(values: any) {
        dispatch?.({type: Actions.SET_ISSUANCE_DATA, issuanceData: values, scope: Scopes.CompanyHouse});
        navigate(nextStep);
    }

    useEffect(() => {
        if (!state[Scopes.CompanyHouse]?.credentials.length) return;
        setRelevantCredential(state[Scopes.CompanyHouse].credentials.filter((c: any) => c.credential?.type.includes(CitizenCredentialConfig.template.type.pop()))?.[0]?.credential);
    }, [state, setRelevantCredential])

    useEffect(() => {
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
    }, [state, relevantCredential])

    useEffect(() => {
        if (!relevantCredential) return;
        setValidatedDomains(state.validatedDomains[relevantCredential.issuer])
    }, [state, relevantCredential])

    return (
        <Layout>
            <div className='company-data-page-wrapper'>
                <h2>{t("pages.company.companyData.setUpPrivateCompany")}</h2>
                <section>
                    <h3 className='section-header'>{t("pages.insurance.insuranceData.businessOwner")}</h3>
                    {validatedDomains && (validatedDomains !== 'in-flight') && (
                        <DomainCheck result={validatedDomains} />
                    )}
                    {
                        // Object.keys(prefilledFormData.dataFields).length &&
                        <PrefilledForm dataFields={prefilledData} />
                    }
                </section>
                <section>
                    <h3 className='section-header'>{t("pages.insurance.insuranceData.companyDetails")}</h3>
                    <p>Will be issued by <b>company.selv.iota.org</b></p> {/* TODO */} 
                    <p>to <b>{state.COMPANY_HOUSE?.connectedDID}</b></p> {/* TODO */} 
                    <Form dataFields={emptyFields} onSubmit={onSubmit} submitLabel={t("actions.continue")}/>
                </section>
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
            </div>

        </Layout>
    );
};

export default CompanyData;
