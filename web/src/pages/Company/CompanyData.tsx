import React, { useState, useEffect } from 'react';
import { App, Space, Typography } from 'antd';
import { Layout, Loading, Form, PrefilledForm } from '../../components';
import { useTranslation } from 'react-i18next';
import { Actions, State, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { useNavigate } from 'react-router-dom';
import useStep from '../../utils/useStep';
import { Scopes } from '@shared/types/Scopes';
import CitizenCredentialConfig from '@shared/credentials/CitizenCredential.json';
import { routes } from '../../steps';
import i18n from '../../i18n';
import DIDCard from '../../components/DIDCard';

const { Link } = Typography;

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

const CompanyData: React.FC = () => {
    const [fields, setFields] = useState<object>();
    const [status, setStatus] = useState('');
    const [relevantCredential, setRelevantCredential] = useState<null | any>(null);
    const [prefilledData, setPrefilledData] = useState({});
    const [issuerDomains, setIssuerDomains] = useState<State['validatedDomains'][keyof State['validatedDomains']] | null>(null);
    const [credentialsDomains, setCredentialDomains] = useState<State['validatedDomains'][keyof State['validatedDomains']] | null>(null);
    const { state } = useGlobalState();
    const { nextStep } = useStep();
    const dispatch = useCredentialsDispatch();
    const navigate = useNavigate();

    const issuerDID = process.env[`REACT_APP_ISSUERS_${Scopes.CompanyHouse}_DID`];

    const { t } = useTranslation();

    const { message } = App.useApp();

    const fallbackRoute = routes.find(elem => elem.id === "companyPresentation");

    async function processValues(fields: object) {
        setFields(fields);
    }

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    function onSubmit(values: any) {
        dispatch?.({ type: Actions.SET_ISSUANCE_DATA, issuanceData: values, scope: Scopes.CompanyHouse });
        navigate(nextStep);
    }

    useEffect(() => {

        if(!state[Scopes.CompanyHouse]?.credentials.length) {
            message.open({
                type: 'error',
                content: 'Please present your national ID credential', //TODO: translate
            });
            return navigate(fallbackRoute!.path.replace(":lng?", i18n.language.toString()));
        }
        
        setRelevantCredential(state[Scopes.CompanyHouse].credentials.filter((c: any) => c.credential?.type.includes(CitizenCredentialConfig.template.type.pop()))?.[0]?.credential);
    }, [])

    useEffect(() => {

        if(relevantCredential && !state.parsedDID[relevantCredential.issuer]) {
            dispatch?.({ type: Actions.REQUEST_PARSED_DID, did: relevantCredential.issuer });
        }

    }, [state, relevantCredential, dispatch])

    useEffect(() => {

        if(issuerDID && !state.parsedDID[issuerDID]) {
            dispatch?.({ type: Actions.REQUEST_PARSED_DID, did: issuerDID });
        }
        
    }, [state, issuerDID, dispatch])

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
        setCredentialDomains(state.validatedDomains[relevantCredential.issuer])
    }, [state, relevantCredential])

    useEffect(() => {
        if (!dispatch || !issuerDID || !state) return;

        dispatch?.({ type: Actions.REQUEST_DOMAIN_LINKAGE_VALIDATION, did: issuerDID });
        setIssuerDomains(state.validatedDomains[issuerDID])
    }, [state, issuerDID, dispatch])

    return (
        <Layout>
            <div className='company-data-page-wrapper'>
                <h2>{t("pages.company.companyData.setUpPrivateCompany")}</h2>
                <h3>{t("pages.company.companyData.subTitle")}</h3>
                <section>
                    <h3 className='section-header'>{t("pages.company.companyData.businessOwner")}</h3>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>

                        <p>Issued by:</p>
                        <DIDCard 
                            loading={!relevantCredential?.issuer || !state.parsedDID[relevantCredential.issuer] || state.parsedDID[relevantCredential.issuer] === "in-flight"} 
                            did={relevantCredential?.issuer ?? null}
                            parsedDID={relevantCredential?.issuer ? state.parsedDID[relevantCredential?.issuer] : null}
                            domains={credentialsDomains}
                        />
            
                        <PrefilledForm dataFields={prefilledData} />
                    
                    </Space>
                </section>
                <section>
                    <h3 className='section-header'>{t("pages.company.companyData.companyDetails")}</h3>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>

                        <p>Will be issued by:</p>
                        <DIDCard 
                            loading={!issuerDID || !state.parsedDID[issuerDID] || state.parsedDID[issuerDID] === "in-flight"} 
                            did={issuerDID ?? null}
                            parsedDID={issuerDID ? state.parsedDID[issuerDID] : null}
                            domains={issuerDomains}
                            />
                        <p>to</p>
                        <DIDCard 
                            loading={!state.COMPANY_HOUSE?.connectedDID} 
                            did={state.COMPANY_HOUSE?.connectedDID ?? null}
                            parsedDID={null}
                            domains={null}
                            />
                    
                        <Form dataFields={emptyFields} onSubmit={onSubmit} submitLabel={t("actions.continue")} />
                    </Space>
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

        </Layout >
    );
};

export default CompanyData;
