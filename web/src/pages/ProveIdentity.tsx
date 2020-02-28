import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { notification, message } from 'antd';
import { serverAPI, websocketURL } from '../config.json'
import { flattenObject, decrypt } from "../utils/helper";
import evaluateCredential from "../utils/did";
import useInterval from "../utils/useInterval";
import { Layout, Loading, QRCode } from "../components";
import useStep from "../utils/useStep";

interface IChannelDetails {
    channelId :string;
    challenge :string;
    password :string;
    requestedCredentials :string[];
}

const notify = (type: string, message: string, description: string) => {
    switch (type) {
        case 'success':
            notification.success({ message, description })
            break;
        case 'warning':
            notification.warning({ message, description })
            break;
        case 'info':
            notification.info({ message, description })
            break;
        case 'error':
        default:
            notification.error({ message, description })
            break;
    }
};

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState('Waiting for login...')
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');

    let ioClient: any

    const [isRunning, setIsRunning] = useState(false);

    async function connectWebSocket({ channelId, challenge, password, requestedCredentials }: IChannelDetails) {
        ioClient = SocketIOClient(websocketURL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            secure: true,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        })

        ioClient.emit('registerDesktopClient', { channelId })
    
        ioClient.on('errorMessage', async (error: any) => {
            console.error('WebSocket error', error)
            setIsRunning(false);
            setStatus('Mobile application connection error')
            setLoading(false)
            message.error({ content: 'Mobile application connection error' });
            notify('error', 'Mobile client error', error)

        })

        ioClient.on('verifiablePresentation', async (payload: any) => {
            try {
                console.log('password', password)
                setIsRunning(false);
                setStatus('Verifying credentials...')
                message.loading({ content: 'Verifying credentials...', duration: 0 });
                notify('info', 'Verification', 'Verifying credentials...')
                let verifiablePresentation = await decrypt(password, payload)
                console.log('verifiablePresentation 1 ', verifiablePresentation)
                verifiablePresentation = JSON.parse(verifiablePresentation)
                console.log('verifiablePresentation 2 ', verifiablePresentation)
                const evaluationResult: any = await evaluateCredential(verifiablePresentation, requestedCredentials, challenge )
                console.log('evaluationResult', evaluationResult)
                const flattenData = flattenObject(evaluationResult)
                console.log('flattenData', flattenData)

                setStatus(evaluationResult.message)
                notify(evaluationResult.type, 'Verification result', evaluationResult.message)
                setLoading(false)

                if (evaluationResult?.status === 2) { // DID_TRUSTED
                    message.destroy()
                    console.log('Verification completed, redirecting to', nextStep)
                    await localStorage.setItem('credentials', JSON.stringify(evaluationResult))
                    history.push(nextStep)
                }
            } catch (e) {
                console.error(e)
                setLoading(false)
                message.destroy()
            }
        })
    } 

    async function checkConnectedStatus() {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channel}`)

        if (response && response?.data?.status === 'success') {
            setIsRunning(false);
        } else {
            setIsRunning(true);
            notify('warning', 'Selv App not connected', 'Scan the QR code with Selv App to continue')
        }
    }

    useInterval(() => {
        checkConnectedStatus()
    }, isRunning ? 10000 : null);
    
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
            console.log('channelDetails', channelDetails)

            const newQrContent = JSON.stringify(channelDetails)
            setQrContent(newQrContent);
            setChannel(channelId);
            setIsRunning(true);
            await localStorage.setItem('WebSocket_DID', newQrContent);
    
            await connectWebSocket(channelDetails);
        } 
        if (nextStep) {
            setQR();
        }
        
        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            ioClient?.off('verifiablePresentation');
            ioClient?.off('error');
            ioClient?.disconnect();
        }
    }, [nextStep]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>
            <div className="scan-qr-page-wrapper">
                <h2>Provide your Digital Identity credentials</h2>
                <p>Scan this QR code with <strong>Selv App</strong> to continue</p>
                <QRCode text={qrContent} />
                <p className="bold">{status}</p>
                { loading && <Loading /> }
            </div>
        </Layout>
    );
}

export default ProveIdentity;