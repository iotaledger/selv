import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Loading, QRCode, RandomGraphicElement } from '../../components';
import useStep from '../../utils/useStep';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Issuers } from '@shared/types/Issuers';
import { Providers } from '@shared/types/Providers';
import { Scopes } from '@shared/types/Scopes';
import CompanyCredentialConfig  from '@shared/credentials/CompanyCredential.json';
import { App } from 'antd';
import i18n from '../../i18n';
import { routes } from '../../steps';

const ReceiveCredentials: React.FC = () => {
    const { t } = useTranslation();

    const { nextStep } = useStep();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("pages.general.proveIdentity.waitingForLogin");
    const dispatch = useCredentialsDispatch();
    const { state } = useGlobalState();

    const { message } = App.useApp();

    const goToNextStep = useCallback(() => {
        navigate(nextStep);
    }, [nextStep, navigate]);

    const fallbackRoute = routes.find(elem => elem.id === "companyData");

    useEffect(() => {

        if(!state[Scopes.CompanyHouse]?.connectedDID) {
            message.open({
                type: 'error',
                content: 'Please fill out the company data', //TODO: translate
            });
            return navigate(fallbackRoute!.path.replace(":lng?", i18n.language.toString()));
        }

        dispatch?.({
            type: Actions.REQUEST_ISSUANCE,
            provider: Providers.Impierce,
            scope: Scopes.CompanyHouse,
            credentials: [{type: CompanyCredentialConfig.template.type.at(-1) as string, data: state.COMPANY_HOUSE?.issuanceData}],
            issuer: Issuers.Bank //TODO: should be COMPANY_HOUSE?
        })
    }, []);

    useEffect(() => {
        if(state[Scopes.CompanyHouse]?.issuanceComplete) {
            goToNextStep();
        }
    }, [state, goToNextStep])

    const messages = {
        waiting: 'general.messages.waiting',
        connectionError: 'general.messages.connectionError',
        missing: 'general.messages.missing',
        verifying: 'general.messages.verifying'
    };

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    return (
        <Layout>
            <RandomGraphicElement elements={5}>
                <div className='scan-qr-page-wrapper'>
                    <h2>{t("pages.company.receiveCredentials.title")}</h2>
                    <p>
                        <Trans i18nKey="pages.company.receiveCredentials.subTitle" />
                    </p>
                    <div className='qr-wrapper'>
                        {/* TODO: Handle loading state */}
                        <QRCode text={state[Issuers.CompanyHouse]?.QRcontent ?? ""} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ReceiveCredentials;
