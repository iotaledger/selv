import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import { Layout, Loading, QRCode, RandomGraphicElement, WebSocket } from "../components";
import useStep from "../utils/useStep";

interface IChannelDetails {
    channelId :string;
    challenge :string;
    password :string;
    requestedCredentials :string[];
}

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('Waiting for login...')
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const [channelDetails, setChannelDetails] = useState()
    
    useEffect(() => {
        async function setQR() {
            const companyHouseStatus = await localStorage.getItem('companyHouse')
            const bankStatus = await localStorage.getItem('bank')
            const requestedCredentials = ['Address', 'PersonalData', 'ContactDetails']

            if (companyHouseStatus && companyHouseStatus === 'completed') {
                if (bankStatus && bankStatus === 'completed') {
                    await localStorage.setItem('insurance', 'pending')
                    requestedCredentials.push('Company', 'BankAccount')
                } else {
                    await localStorage.setItem('bank', 'pending')
                    requestedCredentials.push('Company')
                }
            } else {
                await localStorage.setItem('companyHouse', 'pending')
            }

            const channelId = randomstring.generate(7)
            const challenge = randomstring.generate(10) 
            const payloadPassword = randomstring.generate() 

            const channelDetails: IChannelDetails = {
                channelId, 
                challenge,
                password: payloadPassword,
                requestedCredentials, 
            }
            setChannelDetails(channelDetails)
            console.log('channelDetails', channelDetails)

            const newQrContent = JSON.stringify(channelDetails)
            setQrContent(newQrContent);
            setChannel(channelId);
            await localStorage.setItem('WebSocket_DID', newQrContent);
        } 
        if (nextStep) {
            setQR();
        }
    }, [nextStep]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className="scan-qr-page-wrapper">
                    <h2>Provide your Digital Identity credentials</h2>
                    <p>Scan this QR code with <strong>Selv App</strong> to continue</p>
                    <div className="qr-wrapper">
                        <QRCode text={qrContent} />
                    </div>
                    <p className="bold">{status}</p>
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
}

export default ProveIdentity;