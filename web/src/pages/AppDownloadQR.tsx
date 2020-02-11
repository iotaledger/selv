import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Layout, QRCode } from "../components";
import useStep from "../utils/useStep";
import appStore from '../assets/appStore.svg'
import googlePlay from '../assets/googlePlay.svg'

/**
 * Component which will display a AppDownloadQR.
 */
const AppDownloadQR: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    const link = 'https://trinity.iota.org/'
    const [qrContent] = useState(link);

    return (
        <Layout match={match} step={2}>
            <div className="scan-qr-page-wrapper">
                <h1>Download the Selv app</h1>
                <p>Scan this QR code with you camera app to download the app</p>
                <QRCode text={qrContent} />

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

                <p>Press <strong>Continue</strong> when you have the Selv app on your phone</p>
                <Link to={nextStep} className="cta">
                    <Button>
                        Continue
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default AppDownloadQR;