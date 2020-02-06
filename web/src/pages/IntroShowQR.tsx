import React, { useEffect, useState } from 'react';
import randomstring from 'randomstring';
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverAPI, websocketURL } from '../config.json'
// import AppContext from '../context/app-context';
import useStep from "../utils/useStep";
import decrypt from "../utils/decrypt";
import evaluateCredential from "../utils/did";
import useInterval from "../utils/useInterval";
import { Steps, Sidebar, QRCode } from "../components";
import logo from '../assets/companyHouse.svg'
import appStore from '../assets/appStore.png'
import googlePlay from '../assets/googlePlay.png'

/**
 * Component which will display a IntroShowQR.
 */
const IntroShowQR: React.FC = ({ match }: any) => {
    const [challengeNonce, setChallengeNonce] = useState('')
    const [password, setPassword] = useState('')
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const { step, subStep, subSteps, mainSteps } = useStep(match);
    const [ioClient, setIoClient] = useState({})
    // const { connectWebSocket, ioClient }: any = useContext(AppContext)

    const [isRunning, setIsRunning] = useState(true);

    async function connectWebSocket() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
    
        if (channelDetails?.channelId) {
        //   ioClient?.disconnect()
          const newIoClient = SocketIOClient(websocketURL, {
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
          })
          setIoClient(newIoClient)
    
          newIoClient?.emit('registerDesktopClient', { channelId: channelDetails?.channelId })
        
          newIoClient.on('error', async (error: any) => {
            console.error('WebSocket error', error)
          })

          newIoClient.on('verifiablePresentation', async (payload: any) => {
            console.log('challengeNonce', challengeNonce)
            console.log('WebSocket payload', password, payload)
            let verifiablePresentation = await decrypt('HerpaDerperDerpaHerpaDerperDerpa', payload)
            verifiablePresentation = JSON.parse(verifiablePresentation)
            console.log('verifiablePresentation', verifiablePresentation)
            const evaluationResult = await evaluateCredential(verifiablePresentation, 'PersonalData', 'HerpaDerperDerp' )
            console.log('evaluationResult', evaluationResult)
          })
        } else {
          console.log('No websocket connection details')
        }
    } 

    function notify(type: string) {
        if (type === 'success') {
            toast.success('Mobile app connected', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            toast.warn('Please scan the QR code to connect the mobile app', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }

    async function checkConnectedStatus() {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channel}`)
        console.log('checkConnected', response?.data);

        if (response && response?.data?.status === 'success') {
            setIsRunning(false);
        } else {
            setIsRunning(true);
        }
        notify(response?.data?.status)
    }

    useInterval(() => {
        checkConnectedStatus()
    }, isRunning ? 10000 : null);
    
    useEffect(() => {
        async function setQR() {
            const channelId = randomstring.generate(7)
            await setChannel(channelId);

            const challenge = randomstring.generate(30) 
            console.log('generated challenge', challenge)
            await setChallengeNonce(challenge)
            console.log('stored challenge', challengeNonce)

            const payloadPassword = randomstring.generate() 
            await setPassword(payloadPassword)

            const newQrContent = JSON.stringify({ 
                channelId, 
                challenge,
                password: payloadPassword,
                requestedCredentials: ['UserPersonalData', 'UserContacts'],
            })
            await setQrContent(newQrContent);
            
            await localStorage.setItem('WebSocket_DID', newQrContent);
            await connectWebSocket();
        } 
        setQR();
    }, [])

    return (
        <div className="page-wrapper">
            <div className="main-section">
                <div className="prove-identity-page-wrapper">
                    <img src={logo} alt="Company House Logo" />
                    <h2>Prove Your Identity</h2>
                    <p>Scan this QR code with <strong>DIDI App</strong> to continue</p>
                    <QRCode text={qrContent} />
                    <p>Download DIDI app on your phone</p>
                    <div className="app-cta-wrapper">
                        <a 
                            href='https://apps.apple.com/us/app/trinity-wallet/id1385929472?ls=1'
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={appStore} alt="Apple AppStore" />
                        </a>
                        <a 
                            href='https://play.google.com/store/apps/details?id=com.iota.trinity'
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={googlePlay} alt="Google Play Market" />
                        </a>
                    </div>
                </div>
            </div>
            <Sidebar>
                <Steps 
                    steps={mainSteps} 
                    stepId={step} 
                    subSteps={<Steps steps={subSteps} stepId={subStep} />}
                />
            </Sidebar>
        </div>
    );
}

export default IntroShowQR;