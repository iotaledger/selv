import React, { useEffect, useState } from "react";
import randomstring from "randomstring";
import useStep from "../utils/useStep";
import { Steps, Sidebar, QRCode } from "../components";
import logo from '../assets/companyHouse.svg'
import appStore from '../assets/appStore.png'
import googlePlay from '../assets/googlePlay.png'

/**
 * Component which will display a IntroShowQR.
 */
const IntroShowQR: React.FC = ({ match }: any) => {
    const [qrContent, setQrContent] = useState({});
    const { step, subStep, subSteps, mainSteps } = useStep(match);
    
    useEffect(() => {
        async function setQR() {
            setQrContent({ 
                channelId: randomstring.generate(12), 
                encryptionKey: randomstring.generate() 
            });
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
                    <QRCode text={JSON.stringify(qrContent)} />
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