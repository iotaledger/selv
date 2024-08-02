import React, { useMemo, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
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
import { wallets } from '../wallets';
import { utilityRoutes } from '../steps';

const AppPicker: React.FC = () => {
    const { nextStep } = useStep();

    const { t } = useTranslation();

    const [open, setOpen] = useState("");

    const walletDownloadRoute = utilityRoutes.find(elem => elem.path.includes('/wallets/:wallet'));

    const randomOrderWallets = useMemo(() => {
        return wallets.sort(() => .5 - Math.random())
    }, [])

    return (
        <Layout noHeader noFooter>
            <React.Fragment>
                <div className='app-picker'>
                    <RandomGraphicElement elements={5}>
                        <React.Fragment>
                            <div className='app-picker__scroller'>

                                <h1 className='title'>{t("pages.walletSelect.title")}</h1>
                                <h2 className='subTitle'>{t("pages.walletSelect.subTitle")}</h2>
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
                                                        <QRCode type="svg" bordered={false} errorLevel='H' size={200} value={window.location.origin + generatePath(walletDownloadRoute!.path, { wallet: wallet.name })} />
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
                    <p className='subtitle'>{t("pages.walletSelect.onceDownloaded")}</p>
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
