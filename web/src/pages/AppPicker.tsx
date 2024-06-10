import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'antd';
import { Layout, RandomGraphicElement } from '../components';
import { QRCode } from 'antd';
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
import UniMeImage from '../assets/apps/unime-image.png';
import ViraImage from '../assets/apps/vira-image.png';
import TangleLabs from '../components/powerdBy/TangleLabs';
import Vira from '../components/apps/Vira';


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
        logo: <UniMe/>,
        by: <Impierce/>,
        image: UniMeImage,
        description: "An Identity Wallet to manage Decentralized Identities and Verifiable Credentials",
        storeLinks: {
            android: "https://play.google.com/store/apps/details?id=com.impierce.identity_wallet",
            apple: ""
        }
    },
    {
        name: "Vira",
        logo: <Vira/>,
        by: <TangleLabs/>,
        image: ViraImage,
        description: "Vira Identity Wallet is a digital identity wallet for the future. Giving you back control of your data and providing you with extended privacy throughout the web 3.0 space.",
        storeLinks: {
            android: "https://play.google.com/store/apps/details?id=io.tanglelabs.vira",
            apple: "https://apps.apple.com/de/app/vira-wallet/id6466040524"
        }
    }
]

const AppPicker: React.FC = () => {
    const { nextStep } = useStep();

    const { t } = useTranslation();

    const [open, setOpen] = useState("");

    const randomOrderWallets = useMemo(() => {
        return wallets.sort( () => .5 - Math.random() )
    }, [])

    return (
        <Layout noHeader noFooter>
            <React.Fragment>
                <div className='app-picker'>
                    <RandomGraphicElement elements={5}>
                        <React.Fragment>
                            <div className='app-picker__scroller'>

                                <h1 className='title'>{t("actions.downloadApp")}</h1>
                                <div className='apps'>
                                    {randomOrderWallets.map(wallet => (
                                        <div className="app">
                                            <section className="app__wrapper">
                                                <div className='app__column'>
                                                    {wallet.logo}
                                                    <div className='app__content'>
                                                        <span>
                                                            by &nbsp;
                                                            {wallet.by}
                                                        </span>            
                                        
                                                        <Button onClick={() => setOpen(wallet.name)}>
                                                            {t("actions.continue")}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <img className="app__image" src={wallet.image}></img>
                                            </section>
                                            <Modal
                                                open={open === wallet.name}
                                                footer={null}
                                                closable={true}
                                                maskClosable={true}
                                                onCancel={() => setOpen("")}
                                            >
                                                <section className='wallet-modal'>
                                                    {wallet.logo}
                                                    <div className='wallet-modal__by'>
                                                        <span>
                                                            by &nbsp;
                                                            {wallet.by}
                                                        </span>
                                                    </div>
                                                    <p>{wallet.description}</p>
                                                    
                                                    <div className='wallet-modal__qr'>
                                                        <QRCode type="svg" bordered={false} errorLevel='H' size={200} value={wallet.storeLinks?.android ?? ""} />
                                                    </div>
                                                </section>
                                            </Modal>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        </React.Fragment>
                    </RandomGraphicElement>
                    <img src={dots} alt='' className='dots' />
                    <img src={circle} alt='' className='circle' />
                    <img src={avatar1} alt='' className='avatar1' />
                    <img src={avatar2} alt='' className='avatar2' />
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
