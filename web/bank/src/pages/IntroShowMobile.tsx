import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import mobile from '../assets/mobile.png';
import { Disclaimer, RandomGraphicElement } from '../components';
import DropSelector from '../components/DropSelector';
import dots from '../assets/backgrounds/dots.png';
import ellipse from '../assets/backgrounds/ellipse1.svg';
import logo from '../assets/landing/logoHeader.svg';
import { useTranslation, Trans } from 'react-i18next';
/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
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
                <div className="demo-drop-selector">
                    <DropSelector/>
                </div>
                <div className='demo-intro app' id='app'>
                    <div className='app-content-wrapper'>
                        <h2>{t("pages.demo.introShowMobile.looksLikeWork")}</h2>
                        <Trans i18nKey="pages.demo.introShowMobile.advantage">
                            <h3>But using IOTA’s Unified Identity Protocol and the Selv app, it will be <strong>​quick and easy​.</strong></h3>
                        </Trans>
                        <p className='note'>{t("pages.demo.introShowMobile.noteDesktop")}</p>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                {t("actions.letsDoIt")}
                            </Button>
                        </Link>
                    </div>
                    <img className='phone' src={mobile} alt='Mobile phone' />
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <img src={ellipse} alt='' className='ellipse' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroShowTodos;
