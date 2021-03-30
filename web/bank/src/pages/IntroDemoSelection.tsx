import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import VB from '../assets/VB.jpg'
import dentons from '../assets/dentons.jpg'
import climateKIC from '../assets/climateKIC.png'
import dm from '../assets/dm.png'
import useStep from '../utils/useStep';
import covid from '../assets/demos/covid.png';
import selv from '../assets/demos/selv.png';
import persistent_selv from '../assets/demos/persistent_selv.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import DropSelector from '../components/DropSelector';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';
import { covidDemo, persistentSelvDemo } from '../config.json';
import { useTranslation } from 'react-i18next';

/**
 * Component which will display a IntroDemoSelection.
 */
const IntroDemoSelection: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo demo-page">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className="demo-select-page-drop-selector">
                    <DropSelector />
                </div>
                <div className='demo-selector demo-intro app' id='app'>
                    <div className='demo-select-wrapper'>
                        <div className='demo-card-wrapper'>
                            <img src={selv} alt="Selv demo" />
                            <div className="demo-card-content">
                                <h3>{t("general.digitalIdentityManagement")}</h3>
                                <p>{t("general.claimControlReuse")}</p>

                                <div><i>{t("pages.demo.introDemoSelection.collab")}</i></div>
                                <div className="partners">
                                    <a href={`https://www.devolksbank.nl/`}>
                                        <img src={VB} alt='Volksbank'></img>
                                    </a>
                                </div>
                                <div>
                                    <div className="bottom">
                                        <Link to={nextStep}>
                                            <Button className='cta'>
                                                {t("actions.tryTheDemo")}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='demo-card-wrapper'>
                            <img src={covid} alt="Covid-19 demo" />
                            <div className="demo-card-content">
                                <h3>{t("pages.demo.introDemoSelection.healthStatusManagement")}</h3>
                                <p>{t("pages.demo.introDemoSelection.shareTrustedCredentials")}</p>
                                <div><i>{t("pages.demo.introDemoSelection.collab")}</i></div>
                                <div className="partners">
                                    <a href={`https://www.dentons.com/`}>
                                        <img src={dentons} alt='Dentons'></img>
                                    </a>
                                </div>
                                <div className="bottom">
                                    <a href={`${covidDemo}/demo/app`}>
                                        <Button className="cta">
                                            {t("actions.tryTheDemo")}
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className='demo-card-wrapper'>
                            <img src={persistent_selv} alt="Persistent Selv" />
                            <div className="demo-card-content">
                                <h3>{t("pages.demo.introDemoSelection.longtermIdentityManagement")}</h3>
                                <p>{t("pages.demo.introDemoSelection.LearnAboutFutures")}</p>
                                <div><i>{t("pages.demo.introDemoSelection.collab")}</i></div>
                                <div className="partners">
                                    <a href={`https://www.climate-kic.org/`}>
                                        <img src={climateKIC} alt='Climate KIC'></img>
                                    </a>
                                    <a href={`https://darkmatterlabs.org/`}>
                                        <img src={dm} alt='Dark Matter Labs'></img>
                                    </a>
                                </div>
                                <div className="bottom">
                                    <a href={`${persistentSelvDemo}/demo/welcome`} rel='noopener noreferrer'>
                                        <Button className='cta'>
                                            {t("actions.tryTheDemo")}
                                        </Button>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <img src={ellipse} alt='' className='ellipse' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroDemoSelection;
