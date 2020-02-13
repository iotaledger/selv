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
    const [message, setMessage] = useState('Waiting for login...')
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    // const [ioClient, setIoClient] = useState({})
    // const { connectWebSocket, ioClient }: any = useContext(AppContext)

    let ioClient: any

    const [isRunning, setIsRunning] = useState(false);

    async function connectWebSocket({ channelId, challenge, password, requestedCredentials }: IChannelDetails) {
        ioClient = SocketIOClient(websocketURL, {
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        })

        ioClient.emit('registerDesktopClient', { channelId })
    
        ioClient.on('error', async (error: any) => {
            console.error('WebSocket error', error)
            setMessage('Mobile application connection error')
        })

        ioClient.on('verifiablePresentation', async (payload: any) => {
            try {
                console.log('password', password)
                setMessage('Verifying credentials...')
                let verifiablePresentation = await decrypt(password, payload)
                verifiablePresentation = JSON.parse(verifiablePresentation)
                console.log('verifiablePresentation', verifiablePresentation)
                const evaluationResult: any = await evaluateCredential(verifiablePresentation, requestedCredentials, challenge )
                console.log('evaluationResult', evaluationResult)
                const flattenData = flattenObject(evaluationResult)
                console.log('flattenData', flattenData)
                if (evaluationResult?.status === 2) { // DID_TRUSTED
                    console.log('Verification completed, redirecting to', nextStep)
                    await localStorage.setItem('credentials', JSON.stringify(evaluationResult))
                    history.push(nextStep)
                }
            } catch (e) {
                console.error(e)
            }
        })
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
            const companyHouseStatus = await localStorage.getItem('companyHouse')
            const bankStatus = await localStorage.getItem('bank')
            const requestedCredentials = ['Address', 'PersonalData', 'ContactDetails']

            if (companyHouseStatus && companyHouseStatus === 'completed') {
                if (bankStatus && bankStatus === 'completed') {
                    await localStorage.setItem('insurance', 'pending')
                    requestedCredentials.push('Company', 'Bank')
                } else {
                    await localStorage.setItem('bank', 'pending')
                    requestedCredentials.push('Company')
                }
            } else {
                await localStorage.setItem('companyHouse', 'pending')
            }

            const channelId = randomstring.generate(7)
            await setChannel(channelId);

            const challenge = randomstring.generate(10) 

            const payloadPassword = randomstring.generate() 
            const channelDetails: IChannelDetails = {
                channelId, 
                challenge,
                password: payloadPassword,
                requestedCredentials, 
            }

            const newQrContent = JSON.stringify(channelDetails)
            await setQrContent(newQrContent);
            await localStorage.setItem('WebSocket_DID', newQrContent);
    
            console.log('channelDetails', channelDetails)
            await connectWebSocket(channelDetails);
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
        <Layout match={match}>
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