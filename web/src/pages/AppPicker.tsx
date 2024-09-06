import React, { useEffect, useMemo, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { Button, Flex, Modal } from 'antd';
import { Layout, RandomGraphicElement } from '../components';
import { QRCode } from 'antd';
import useStep from '../utils/useStep';
import avatar1 from '../assets/avatar1.png';
import avatar2 from '../assets/avatar2.png';
import dots from '../assets/backgrounds/dots.png';
import circle from '../assets/backgrounds/circleFrame6.svg';
import { useTranslation } from 'react-i18next';
import { wallets } from '../wallets';
import { utilityRoutes } from '../steps';
import { Actions, useCredentialsDispatch } from '../context/globalState';

const AppPicker: React.FC = () => {
    const { nextStep } = useStep();

    const { t } = useTranslation();

    const [open, setOpen] = useState("");

    const dispatch = useCredentialsDispatch();

    const walletDownloadRoute = utilityRoutes.find(elem => elem.id === "walletDownload");

    const randomOrderWallets = useMemo(() => {
        return wallets.sort(() => .5 - Math.random())
    }, [])

    useEffect(() => {
        dispatch?.({
            type: Actions.RESET_STATE,
        })
    }, []);

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
                                        <div className="app" key={wallet.name}>
                                            <section className="app__wrapper">
                                                <div className='app__column'>
                                                    {wallet.logo}
                                                    <div className='app__content'>
                                                        <Flex align='center'>
                                                            by &nbsp;
                                                            {wallet.by}
                                                        </Flex>

                                                        <Button onClick={() => setOpen(wallet.name)}>
                                                            {t("actions.select")}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <img className="app__image" alt={wallet.name} src={wallet.image}></img>
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
                                                        <Flex align='center'>
                                                            by &nbsp;
                                                            {wallet.by}
                                                        </Flex>
                                                    </div>
                                                    <p>{wallet.description}</p>

                                                    {wallet.storeLinks && 
                                                        <>
                                                            <p><b>Scan QR code to download:</b></p> {/* TODO: translate */}
                                                            <div className='wallet-modal__qr'>
                                                                <QRCode type="svg" bordered={false} errorLevel='H' size={200} value={window.location.origin + generatePath(walletDownloadRoute!.path, { wallet: wallet.name })} />
                                                            </div>
                                                        </>
                                                    }
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
