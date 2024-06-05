import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { Layout, QRCode, RandomGraphicElement } from '../components';
import useStep from '../utils/useStep';
import appStore from '../assets/appStore.svg';
import googlePlay from '../assets/googlePlay.svg';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import dots from '../assets/backgrounds/dots.png';
import circle from '../assets/backgrounds/circleFrame6.svg';
import config from '../config.json';
import { useTranslation, Trans } from 'react-i18next';
import Impierce from '../components/powerdBy/Impierce';
import UniMe from '../components/apps/UniMe';
import UniMeImage from '../assets/apps/image.png';


interface WalletInfo {
    name: string,
    logo: React.ReactElement,
    by: React.ReactElement,
    image: string,
    description: string,
    link?: string,
    storeLinks?: {
        android: string,
        apple: string,
    }
}

const wallets: WalletInfo[] = [
    {
        name: "UniMe",
        logo: <UniMe></UniMe>,
        by: <Impierce/>,
        image: UniMeImage,
        description: "An Identity Wallet to manage Decentralized Identities and Verifiable Credentials",
        storeLinks: {
            android: "https://play.google.com/store/apps/details?id=com.impierce.identity_wallet",
            apple: ""
        }
    }
]

const AppPicker: React.FC = () => {
    const { nextStep } = useStep();

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    return (
        <Layout noHeader noFooter>
            <React.Fragment>
                <div className='app-picker'>
                    <RandomGraphicElement elements={5}>
                        <React.Fragment>
                            <h1 className='title'>{t("actions.downloadApp")}</h1>
                            <div className='apps'>
                                {wallets.map(wallet => (
                                    <div className="app">
                                        <section className="app__wrapper">
                                            <div className='app__column'>
                                                {wallet.logo}
                                                <div className='app__content'>
                                                    <span>
                                                        by &nbsp;
                                                        {wallet.by}
                                                    </span>            
                                    
                                                    <Button onClick={() => setOpen(true)}>
                                                        {t("actions.continue")}
                                                    </Button>
                                                </div>
                                            </div>
                                            <img className="app__image" src={wallet.image}></img>
                                        </section>
                                        <Modal
                                            open={open}
                                            footer={null}
                                        >
                                            <h3>{wallet.name}</h3>
                                            by
                                            {wallet.by}
                                            <p>{wallet.description}</p>
                                            <a href={wallet.storeLinks?.android}>
                                                <img src=""></img>
                                            </a>
                                        </Modal>
                                    </div>

                                ))}

                            </div>
                            <img src={avatar1} alt='' className='avatar1' />
                            <img src={avatar2} alt='' className='avatar2' />
                        </React.Fragment>
                    </RandomGraphicElement>
                    <img src={dots} alt='' className='dots' />
                    <img src={circle} alt='' className='circle' />
                </div>
                    <div className="cta-section" id='app-download'>
                        <p className='subtitle'>{t("pages.demo.appDownloadQR.onceDownloaded")}</p>
                        <Link to={nextStep} className='cta'>
                            <Button>
                                {t("actions.continue")}
                            </Button>
                        </Link>
                    </div>
            </React.Fragment>
        </Layout>
    );
};

export default AppPicker;
