import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from '../components';
import useStep from '../utils/useStep';
import config from '../config.json';
import { useTranslation, Trans } from 'react-i18next';

interface IChannelDetails {
    channelId: string;
    challenge: string;
    password: string;
    requestedCredentials: string[];
    url: string;
    shareWith: string;
}

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity: React.FC = ({ history, match }: any) => {
    const { t } = useTranslation();

    const { nextStep } = useStep(match);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("pages.general.proveIdentity.waitingForLogin");
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const [channelDetails, setChannelDetails] = useState<IChannelDetails>();

    const messages = {
        waiting: 'general.messages.waiting',
        connectionError: 'general.messages.connectionError',
        missing: 'general.messages.missing',
        verifying: 'general.messages.verifying'
    };

    function setStatusMessage(message: string) {
        setStatus(message);
    }

    useEffect(() => {
        async function setQR() {
            const companyHouseStatus = await localStorage.getItem('companyHouse');
            const bankStatus = await localStorage.getItem('bank');
            const requestedCredentials = ['Address', 'PersonalData', 'ContactDetails'];
            let shareWith = 'company';

            if (companyHouseStatus && companyHouseStatus === 'completed') {
                if (bankStatus && bankStatus === 'completed') {
                    await localStorage.setItem('insurance', 'pending');
                    requestedCredentials.push('Company', 'BankAccount');
                    shareWith = 'insurance';
                } else {
                    await localStorage.setItem('bank', 'pending');
                    requestedCredentials.push('Company');
                    shareWith = 'bank';
                }
            } else {
                await localStorage.setItem('companyHouse', 'pending');
            }

            const channelId = randomstring.generate(7);
            const challenge = randomstring.generate(10);
            const payloadPassword = randomstring.generate();

            const channelDetails: IChannelDetails = {
                channelId,
                challenge,
                password: payloadPassword,
                requestedCredentials,
                shareWith,
                url: config.websocketURL
            };
            setChannelDetails(channelDetails);

            const newQrContent = JSON.stringify(channelDetails);
            setQrContent(newQrContent);
            setChannel(channelId);
            await localStorage.setItem('WebSocket_DID', newQrContent);
        }
        if (nextStep) {
            setQR();
        }
    }, [nextStep]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className='scan-qr-page-wrapper'>
                    <h2>{t("pages.general.proveIdentity.provideCredentials")}</h2>
                    <p>
                        <Trans i18nKey="pages.general.proveIdentity.scanToContinue">
                            Scan this QR code with <strong>Selv App</strong> to continue
                        </Trans>
                    </p>
                    <div className='qr-wrapper'>
                        <QRCode text={qrContent} />
                    </div>
                    <p className='bold'>{t(status)}</p>
                    {loading && <Loading />}
                    {
                        channel && <WebSocket
                            history={history}
                            match={match}
                            generatedChannelId={channel}
                            setStatus={status => setStatusMessage(status)}
                            setLoading={status => setLoading(status)}
                            fields={channelDetails}
                            messages={messages}
                        />
                    }
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProveIdentity;
