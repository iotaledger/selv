import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Loading, QRCode, RandomGraphicElement } from '../../components';
import useStep from '../../utils/useStep';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Issuers } from '@shared/types/Issuers';
import { Providers } from '@shared/types/Providers';
import { Scopes } from '@shared/types/Scopes';
import CitizenCredentialConfig  from '@shared/credentials/CitizenCredential.json';
import { routes } from '../../steps';
import i18n from '../../i18n';
import { App } from 'antd';

const ReceiveCredentials: React.FC = () => {
    const { t } = useTranslation();

    const { nextStep } = useStep();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("pages.general.proveIdentity.waitingForLogin");
    const dispatch = useCredentialsDispatch();
    const { state } = useGlobalState();

    const fallbackRoute = routes.find(elem => elem.id === "governmentEntry");

    const goToNextStep = useCallback(() => {
        navigate(nextStep);
    }, [nextStep, navigate]);

    const { message } = App.useApp();

    useEffect(() => {

        if(!state[Scopes.Government]?.connectedDID) {
            message.open({
                type: 'info',
                content: 'Please reconnect your digital identity', //TODO: translate
            });
            return navigate(fallbackRoute!.path.replace(":lng?", i18n.language.toString()));
        }

        dispatch?.({
            type: Actions.REQUEST_ISSUANCE,
            provider: Providers.TangleLabs, 
            scope: Scopes.Government, 
            credentials: [{type: CitizenCredentialConfig.template.type.at(-1) as string}],
            issuer: Issuers.Government
        })
    }, []);

    useEffect(() => {
        if (state[Scopes.Government]?.issuanceComplete) {
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
                    <h2>{t("pages.government.receiveCredentials.title")}</h2>
                    <p>
                        <Trans i18nKey="pages.government.receiveCredentials.subTitle" />
                    </p>
                    <div className='qr-wrapper'>
                        {/* TODO: Handle loading state */}
                        <QRCode text={state[Issuers.Government]?.QRcontent ?? ""} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ReceiveCredentials;
