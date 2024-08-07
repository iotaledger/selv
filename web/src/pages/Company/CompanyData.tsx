import React, { useState, useEffect } from 'react';
import { App, Button, notification, Popover, Tooltip, Typography } from 'antd';
import { flattenObject } from '../../utils/helper';
import { Layout, Loading, Form, PrefilledForm } from '../../components';
import { useTranslation } from 'react-i18next';
import { Actions, State, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { useNavigate } from 'react-router-dom';
import useStep from '../../utils/useStep';
import { Scopes } from '@shared/types/Scopes';
import CitizenCredentialConfig from '@shared/credentials/CitizenCredential.json';
import DomainCheck from '../../components/DomainCheck';
import { ExportOutlined } from '@ant-design/icons';
import { routes } from '../../steps';
import i18n from '../../i18n';
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
                content: 'Please present your national ID crendential', //TODO: translate
            });
            return navigate(fallbackRoute!.path.replace(":lng?", i18n.language.toString()));
        }


        if (!state[Scopes.CompanyHouse]?.credentials.length) return;
        setRelevantCredential(state[Scopes.CompanyHouse].credentials.filter((c: any) => c.credential?.type.includes(CitizenCredentialConfig.template.type.pop()))?.[0]?.credential);
    }, [])

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
                <h3>{t("pages.company.companyData.subTitle")}</h3>
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
                    <p>Will be issued by <Popover content={
                        <Link 
                            href="https://explorer.iota.org/shimmer-testnet/addr/rms1ppyx34shww5l3e28gynp5r5zljyru2vuyc2vjjeyqr3yy02vtwlx52sh4rj?tab=DID"
                            target="_blank"
                        >
                            did:iota:rms:0x4868d61773a9f8e54741261a0e82fc883e299c2614c94b2400e2423d4c5bbe6a <ExportOutlined />
                        </Link>
                    }><b>company.selv.iota.org</b></Popover></p> {/* TODO */}
                <p>to <b style={{wordBreak: "break-all"}}>{state.COMPANY_HOUSE?.connectedDID}</b></p> {/* TODO */}
                <Form dataFields={emptyFields} onSubmit={onSubmit} submitLabel={t("actions.continue")} />
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
