import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Layout, QRCode, RandomGraphicElement } from '../components';
import useStep from '../utils/useStep';
import appStore from '../assets/appStore.svg';
import googlePlay from '../assets/googlePlay.svg';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import dots from '../assets/backgrounds/dots.png';
import circle from '../assets/backgrounds/circleFrame6.svg';
import { covidDemo } from '../config.json';

/**
 * Component which will display a AppDownloadQR.
 */
const AppDownloadQR = ({ match }) => {
    const { nextStep } = useStep(match);

    return (
        <Layout match={match} noHeader noFooter>
            <React.Fragment>
                <div className='scan-qr-page-wrapper app-download' id='app'>
                    <RandomGraphicElement elements={5}>
                        <div className='scan-qr-content-wrapper'>
                            <h1 className='title'>Download the Selv app</h1>
                            <div className='app-cta-wrapper'>
                                <a
                                    href='https://testflight.apple.com/join/3FCosIcj'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <img src={appStore} alt='Apple AppStore' />
                                </a>
                                <a
                                    href='https://play.google.com/apps/testing/com.iota.selv.demo'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <img src={googlePlay} alt='Google Play Market' />
                                </a>
                            </div>
                            <div className='scan-wrapper'>
                                <div className='qr-content-wrapper'>
                                    <p className='scan-note'>Or scan this QR code<br />to download</p>
                                    <div className='qr-wrapper'>
                                        <QRCode text={`${covidDemo}//qr-redirect`} size={200} />
                                    </div>
                                </div>
                                <img src={avatar1} alt='' className='avatar1' />
                                <img src={avatar2} alt='' className='avatar2' />
                            </div>
                        </div>
                    </RandomGraphicElement>
                    <img src={dots} alt='' className='dots' />
                    <img src={circle} alt='' className='circle' />
                </div>
                <div className="cta-section">
                    <p className='subtitle'>Once you’ve downloaded and installed the app, click the button below.</p>
                    <Link to={nextStep} className='cta'>
                        <Button>
                            Continue
                        </Button>
                    </Link>
                </div>
            </React.Fragment>
        </Layout>
    );
};

export default AppDownloadQR;
