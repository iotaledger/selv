import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement } from '../../components';
import useStep from '../../utils/useStep';
import { useTranslation, Trans } from 'react-i18next';
import { Router, useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Providers } from '@shared/types/Providers';
import { Issuers } from '@shared/types/Issuers';
import { Scopes } from '@shared/types/Scopes';
import { copyFile } from 'fs';

const ProveIdentity: React.FC = () => {
    const { t } = useTranslation();

    const { nextStep } = useStep();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("pages.general.proveIdentity.waitingForLogin");
    const dispatch = useCredentialsDispatch();
    const { state } = useGlobalState();

    const goToNextStep = useCallback(() => {
        navigate(nextStep);
    }, [nextStep, navigate]);

    useEffect(() => {
        dispatch?.({type: Actions.REQUEST_INVITE, provider: Providers.Impierce, scope: Scopes.Insurance});
    }, [dispatch]);

    useEffect(() => {
        if(state[Scopes.Insurance]?.connectedDID) {
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
                    <h2>{t("pages.general.proveIdentity.provideCredentials")}</h2>
                    <p>
                        <Trans i18nKey="pages.general.proveIdentity.scanToContinue">
                            Scan this QR code with <strong>Selv App</strong> to continue
                        </Trans>
                    </p>
                    <div className='qr-wrapper'>
                        {/* TODO: Handle loading state */}
                        <QRCode text={state[Scopes.Insurance]?.QRcontent ?? ""} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProveIdentity;
