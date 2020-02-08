import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { serverAPI, websocketURL } from '../config.json'
// import AppContext from '../context/app-context';
import { flattenObject, decrypt } from "../utils/helper";
import evaluateCredential from "../utils/did";
import useInterval from "../utils/useInterval";
import { Layout, Loading, QRCode } from "../components";
import useStep from "../utils/useStep";

/**
 * Component which will display a ProveIdentity.
 */
const ProveIdentity: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [challengeNonce, setChallengeNonce] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('Waiting for login...')
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    // const [ioClient, setIoClient] = useState({})
    const [requestedCredentials] = useState(['Address', 'PersonalData', 'ContactDetails'])
    // const { connectWebSocket, ioClient }: any = useContext(AppContext)

    let ioClient: any

    const [isRunning, setIsRunning] = useState(false);

    async function connectWebSocket() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
    
        if (channelDetails?.channelId) {
          ioClient = SocketIOClient(websocketURL, {
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
          })
    
          ioClient.emit('registerDesktopClient', { channelId: channelDetails?.channelId })
        
          ioClient.on('error', async (error: any) => {
            console.error('WebSocket error', error)
            setMessage('Mobile application connection error')
          })

          ioClient.on('verifiablePresentation', async (payload: any) => {
            setMessage('Verifying credentials...')
            let verifiablePresentation = await decrypt('HerpaDerperDerpaHerpaDerperDerpa', payload)
            verifiablePresentation = JSON.parse(verifiablePresentation)
            console.log('verifiablePresentation', verifiablePresentation)
            const evaluationResult: any = await evaluateCredential(verifiablePresentation, requestedCredentials, 'HerpaDerperDerp' )
            console.log('evaluationResult', evaluationResult)
            const flattenData = flattenObject(evaluationResult)
            console.log('flattenData', flattenData)
            if (evaluationResult?.status === 2) { // DID_TRUSTED
                console.log('Verification completed, redirecting to', nextStep)
                await localStorage.setItem('credentials', JSON.stringify(evaluationResult))
                history.push(nextStep)
            }
          })
        } else {
          console.log('No websocket connection details')
        }
    } 

    async function checkConnectedStatus() {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channel}`)

        if (response && response?.data?.status === 'success') {
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
    }

    useInterval(() => {
        checkConnectedStatus()
    }, isRunning ? 3000 : null);
    
    useEffect(() => {
        async function setQR() {
            const channelId = randomstring.generate(7)
            await setChannel(channelId);

            const challenge = randomstring.generate(30) 
            await setChallengeNonce(challenge)

            const payloadPassword = randomstring.generate() 
            await setPassword(payloadPassword)

            const newQrContent = JSON.stringify({ 
                channelId, 
                challenge,
                password: payloadPassword,
                requestedCredentials,
            })
            await setQrContent(newQrContent);
            await localStorage.setItem('companyHouse', 'pending')
            await localStorage.setItem('WebSocket_DID', newQrContent);
            await connectWebSocket();
        } 
        if (nextStep) {
            setQR();
        }
        
        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('verifiablePresentation');
            ioClient?.off('error');
            ioClient?.disconnect();
        }
    }, [nextStep])

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="scan-qr-page-wrapper">
                <h2>Provide your Digital Identity credentials</h2>
                <p>Scan this QR code with <strong>Selv App</strong> to continue</p>
                <QRCode text={qrContent} />
                <p className="bold">{message}</p>
                <Loading />
            </div>
        </Layout>
    );
}

export default ProveIdentity;