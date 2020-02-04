import React, { useEffect, useState, useContext } from "react";
import randomstring from "randomstring";
import axios from 'axios';
import { toast } from 'react-toastify';
import { serverAPI } from '../config.json'
import AppContext from '../context/app-context';
import useStep from "../utils/useStep";
import useInterval from "../utils/useInterval";
import { Steps, Sidebar, QRCode } from "../components";
import logo from '../assets/companyHouse.svg'
import appStore from '../assets/appStore.png'
import googlePlay from '../assets/googlePlay.png'

/**
 * Component which will display a IntroShowQR.
 */
const IntroShowQR: React.FC = ({ match }: any) => {
    const [qrContent, setQrContent] = useState('');
    const [channel, setChannel] = useState('');
    const { step, subStep, subSteps, mainSteps } = useStep(match);
    const { connectWebSocket, ioClient }: any = useContext(AppContext)

    const [isRunning, setIsRunning] = useState(true);

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
            const newQrContent = JSON.stringify({ 
                channelId, 
                key: randomstring.generate() 
            })
            setQrContent(newQrContent);
            setChannel(channelId);
            await localStorage.setItem('WebSocket_DID', newQrContent);
            connectWebSocket();
        } 
        setQR();
    }, [])

    ioClient?.on('credential', async (payload: any) => {
        try {
            console.log('WebSocket credential', payload)
        } catch (error) {
            console.log('Error credential' + error.toString())
        }
    })

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