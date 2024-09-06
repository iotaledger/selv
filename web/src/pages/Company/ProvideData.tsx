import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Layout, Loading, QRCode, RandomGraphicElement } from '../../components';
import useStep from '../../utils/useStep';
import { useTranslation, Trans } from 'react-i18next';
import { Router, useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Providers } from '@shared/types/Providers';
import { Issuers } from '@shared/types/Issuers';
import { Scopes } from '@shared/types/Scopes';

import { v4 as uuidv4 } from 'uuid';
import CitizenCredentialConfig  from '@shared/credentials/CitizenCredential.json';
import { routes } from '../../steps';
import { App } from 'antd';
import i18n from '../../i18n';


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

    const fallbackRoute = routes.find(elem => elem.id === "companyEntry");

    const { message } = App.useApp();

    useEffect(() => {

        if(!state[Scopes.CompanyHouse]?.connectedDID) {
            message.open({
                type: 'info',
                content: 'Please reconnect your digital identity', //TODO: translate
            });
            return navigate(fallbackRoute!.path.replace(":lng?", i18n.language.toString()));
        }

        dispatch?.({type: Actions.RESET_QR_CONTENT, scope: Scopes.CompanyHouse});

        dispatch?.({
            type: Actions.REQUEST_PRESENTATION,
            provider: Providers.Impierce,
            presentationDefinition: {
                id: uuidv4(),
                input_descriptors: CitizenCredentialConfig.input_descriptors
            },
            scope: Scopes.CompanyHouse,

        })

    }, []);

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
                    <h2>{t("pages.company.provideData.title")}</h2>
                    <p>
                        <Trans i18nKey="pages.company.provideData.subTitle" />
                    </p>
                    <div className='qr-wrapper'>
                        <QRCode text={state[Scopes.CompanyHouse]?.QRcontent} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProvideData;
