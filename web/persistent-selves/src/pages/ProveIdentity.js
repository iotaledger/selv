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

            let shareWith = 'ancestorRegistry';
            const ancestorRegistry = await localStorage.getItem('ancestorRegistry');
            const futureCommitment = await localStorage.getItem('futureCommitment');
            
            if (ancestorRegistry && ancestorRegistry === 'completed') {
                if (futureCommitment && futureCommitment === 'completed') {
                    shareWith = 'presentCommitment';
                } else {
                    shareWith = 'futureCommitment';
                }
            } else {
                await localStorage.setItem('ancestorRegistry', 'pending');
            }

            const channelDetails = {
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
        <Layout match={match} noFooter>
            <div className='scan-qr-page-wrapper'>
            <RandomGraphicElement elements={5}>
                    <div className='scan-qr-content-wrapper'>
                    
                        <h2>Log in with your Identity Credentials</h2>
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
            </div>
        </Layout>
    );
};

export default ProveIdentity;