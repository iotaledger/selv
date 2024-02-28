import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from '../../components';
import useStep from '../../utils/useStep';
import config from '../../config.json';
import { useTranslation, Trans } from 'react-i18next';
import { Router, useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Issuers } from '@sharedTypes/Issuers';
import { Providers } from '@sharedTypes/Providers';
import { Scopes } from '@sharedTypes/Scopes';

const ReceiveCredentials: React.FC = () => {
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
        dispatch?.({type: Actions.REQUEST_ISSUANCE, provider: Providers.WaltId, scope: Scopes.CompanyHouse, credential:JSON.stringify({
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
            ],
            type: ['VerifiableCredential', 'UniversityDegreeCredential'],
            issuanceDate: '2017-10-22T12:23:48Z',
            // issuer:
            // 'did:iota:snd:0x1d78531b739a3aef0e90523213f28e869423a6d6253ea0fcbd7db2714e9606bf',
            credentialSubject: {
                id: 'did:iota:snd:0xce05da2c7e3fd32e89b4fcaf77bb3101d89be60ba6276cba80bd3ec2bd0603f6',
                degree: {
                    type: 'BachelorDegree',
                    name: 'Bachelor of Science and Arts',
                },
            },
        }),
        issuer: Issuers.CompanyHouse
    })
    }, [dispatch]);

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
                    <h2>{t("pages.general.proveIdentity.provideCredentials")}</h2>
                    <p>
                        <Trans i18nKey="pages.general.proveIdentity.scanToContinue">
                            Scan this QR code with <strong>Selv App</strong> to continue
                        </Trans>
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
