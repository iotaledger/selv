import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from '../../components';
import useStep from '../../utils/useStep';
import config from '../../config.json';
import { useTranslation, Trans } from 'react-i18next';
import { Router, useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Providers } from '@sharedTypes/Providers';
import { Issuers } from '@sharedTypes/Issuers';
import { Scopes } from '@sharedTypes/Scopes';


const ProvideData: React.FC = () => {
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

        dispatch?.({
            type: Actions.REQUEST_PRESENTATION,
            provider: Providers.WaltId,
            presentationDefinition: {
                id: '32f54163-7166-48f1-93d8-ff217bdb0653',
                input_descriptors: [
                    {
                        id: 'wa_driver_license',
                        name: 'Washington State Business License',
                        purpose:
                            'We can only allow licensed Washington State business representatives into the WA Business Conference',
                        constraints: {
                            fields: [
                                {
                                    path: [
                                        '$.credentialSubject.dateOfBirth',
                                        '$.credentialSubject.dob',
                                        '$.vc.credentialSubject.dateOfBirth',
                                        '$.vc.credentialSubject.dob',
                                    ],
                                },
                            ],
                        },
                    },
                ],
            },
            scope: Scopes.CompanyHouse,

        })

    }, [dispatch]);

    useEffect(() => {
        if (state[Scopes.CompanyHouse]?.credentials?.length) {
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
                        <QRCode text={state[Scopes.CompanyHouse]?.QRcontent ?? ""} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProvideData;
