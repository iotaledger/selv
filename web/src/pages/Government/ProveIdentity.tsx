import React, { useCallback, useEffect } from 'react';
import { Layout, Loading, QRCode, RandomGraphicElement } from '../../components';
import useStep from '../../utils/useStep';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Actions, useCredentialsDispatch, useGlobalState } from '../../context/globalState';
import { Providers } from '@shared/types/Providers';
import { Scopes } from '@shared/types/Scopes';

const ProveIdentity: React.FC = () => {
    const { t } = useTranslation();

    const { nextStep } = useStep();
    const navigate = useNavigate();
    const dispatch = useCredentialsDispatch();
    const { state } = useGlobalState();

    const goToNextStep = useCallback(() => {
        navigate(nextStep);
    }, [nextStep, navigate]);

    useEffect(() => {
        dispatch?.({type: Actions.RESET_QR_CONTENT, scope: Scopes.Government});
        dispatch?.({type: Actions.REQUEST_INVITE, provider: Providers.TangleLabs, scope: Scopes.Government});
    }, [dispatch]);

    useEffect(() => {
        if(state[Scopes.Government]?.connectedDID) {
            goToNextStep();
        }
    }, [state, goToNextStep])

    return (
        <Layout>
            <RandomGraphicElement elements={5}>
                <div className='scan-qr-page-wrapper'>
                    <h2>{t("pages.general.proveIdentity.proveIdentity")}</h2>
                    <p>
                        <Trans i18nKey="pages.government.signIn.subtitle" />
                    </p>
                    <div className='qr-wrapper'>
                        <QRCode text={state[Scopes.Government]?.QRcontent} />
                    </div>
                    <p className='bold'>{t("pages.general.proveIdentity.waitingForLogin")}</p>
                    <Loading />
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProveIdentity;
