import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from '../components';
import useStep from '../utils/useStep';
import config from '../config.json';

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity = ({ history, match }) => {
    const { nextStep } = useStep(match);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Waiting for login...');
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const [channelDetails, setChannelDetails] = useState();

    useEffect(() => {
        async function setQR () {
            const requestedCredentials = ['Address', 'PersonalData', 'ContactDetails'];
            const channelId = randomstring.generate(7);
            const challenge = randomstring.generate(10);
            const payloadPassword = randomstring.generate();

            const channelDetails = {
                channelId,
                challenge,
                password: payloadPassword,
                requestedCredentials,
                shareWith: '',
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

    console.log(qrContent);
    
    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className='scan-qr-page-wrapper'>
                    <h2>Provide your Digital Identity credentials</h2>
                    <p>Scan this QR code with <strong>Selv App</strong> to continue</p>
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
                        />
                    }
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default ProveIdentity;
