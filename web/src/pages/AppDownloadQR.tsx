import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Layout, QRCode, RandomGraphicElement } from "../components";
import useStep from "../utils/useStep";
import appStore from '../assets/appStore.svg'
import googlePlay from '../assets/googlePlay.svg'
import avatar1 from '../assets/avatar1.png'
import avatar2 from '../assets/avatar2.png'
import dots from '../assets/backgrounds/dots.png'
import circle from '../assets/backgrounds/circleFrame6.svg'

/**
 * Component which will display a AppDownloadQR.
 */
const AppDownloadQR: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    const link = 'https://trinity.iota.org/'
    const [qrContent] = useState(link);

    return (
        <Layout match={match} noHeader noFooter>
            <div className="scan-qr-page-wrapper app-download">
                <RandomGraphicElement elements={5}>
                    <React.Fragment>
                        <h1 className="title">Download the Selv app</h1>
                        <p className="subtitle">Press continue below when the Selv app is installed on your phone</p>

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
                        <div className="scan-wrapper">
                            <div className="qr-content-wrapper">
                                <p className="scan-note">Scan this QR code<br />to download</p>
                                <div className="qr-wrapper">
                                    <QRCode text={qrContent} size={200} />
                                </div>
                                <Link to={nextStep} className="cta">
                                    <Button>
                                        Continue
                                    </Button> 
                                </Link>
                            </div>
                            <img src={avatar1} alt="" className="avatar1" />
                            <img src={avatar2} alt="" className="avatar2" />
                            <img src={circle} alt="" className="circle" />
                        </div>
                    </React.Fragment>
                </RandomGraphicElement>
                <img src={dots} alt="" className="dots" />
            </div>
        </Layout>
    );
}

export default AppDownloadQR;