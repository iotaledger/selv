import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from '../components';
import useStep from '../utils/useStep';
import config from '../config.json';

interface IChannelDetails {
    channelId :string;
    challenge :string;
    password :string;
    requestedCredentials :string[];
    shareWith?: string;
    url: string;
}

const content: any = {
    health: {
        title: 'Log in with your Digital Identity credentials',
    },
    hr: {
        title: 'Log in with your Digital Identity credentials',
    },
    agency: {
        title: 'Share your Health Credential',
    }
}

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity: React.FC = ({ history, match }: any) => {
    const { nextStep, theme } = useStep(match);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Waiting for login...');
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const [channelDetails, setChannelDetails] = useState({});

    useEffect(() => {
        async function setQR () {
            const healthAuthorityStatus = await localStorage.getItem('healthAuthority');
            const employerStatus = await localStorage.getItem('employer');
            const requestedCredentials = ['PersonalData', 'Address'];
            let shareWith = 'healthAuthority';

            if (healthAuthorityStatus && healthAuthorityStatus === 'completed') {
                shareWith = 'employer';
                if (employerStatus && employerStatus === 'completed') {
                    shareWith = 'agency';
                }
                requestedCredentials.push('TestResult');
            } else {
                await localStorage.setItem('healthAuthority', 'pending');
            }

            const channelId = randomstring.generate(7);
            const challenge = randomstring.generate(10);
            const password = randomstring.generate();

            const channelDetails: IChannelDetails = {
                channelId,
                challenge,
                password,
                shareWith,
                requestedCredentials,
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
                    <h2>{theme && content[theme].title}</h2>
                    <p>Scan this QR code with the <strong>Selv</strong> app to continue</p>
                    <div className='qr-wrapper'>
                        <QRCode text={qrContent} />
                    </div>
                    <p className='bold'>{status}</p>
                    { loading && <Loading /> }
                    {
                        channel && <WebSocket
                            history={history}
                            match={match}
                            generatedChannelId={channel}
                            setStatus={status => setStatus(status)}
                            setLoading={status => setLoading(status)}
                            fields={channelDetails}
                            warningMessage="Scan the QR code with your Selv app"
                        />
                    }
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProveIdentity;
