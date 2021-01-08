import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { RandomGraphicElement } from '../';
import selv from '../../assets/selv.svg';
import app from '../../assets/landing/app.png';
import appMobile from '../../assets/landing/app-mobile.png';
import circle from '../../assets/backgrounds/circleFrame2.svg';
import { Translation } from 'react-i18next';


export default () => (
    <Translation>
        {
            (t, { i18n }) =>

                <RandomGraphicElement elements={5}>
                    <div className='app-section' id='the-app'>
                        <img src={circle} alt='' className='circle' />
                        <h4 data-aos='fade-up' data-aos-duration='1000'>{t("general.Demo")}</h4>
                        <h2 data-aos='fade-up' data-aos-duration='1000'>{t("general.The App")}</h2>

                        <div className='content-wrapper'>
                            <img data-aos='fade-right' data-aos-duration='1000' src={app} alt='App' className='desktop' />
                            <img data-aos='fade-right' data-aos-duration='1000' src={appMobile} alt='App' className='mobile' />
                            <div className='content-list'>
                                <div className='content-item' data-aos='fade-left' data-aos-duration='1000'>
                                    <span className='content-header-wrapper'>
                                        <img src={selv} alt='' className='logo' />
                                        <h5>{t("general.Self Sovereign Identity")}</h5>
                                    </span>
                                    <p>{t("general.What it is")}</p>
                                </div>
                                <div className='content-item' data-aos='fade-left' data-aos-duration='1000'>
                                    <span className='content-header-wrapper'>
                                        <img src={selv} alt='' className='logo' />
                                        <h5>{t("views.landing.app.One App – One Protocol")}</h5>
                                    </span>
                                    <p>{t("views.landing.app.Easy GDPR compliance")}</p>
                                </div>
                                <div className='content-item' data-aos='fade-left' data-aos-duration='1000'>
                                    <span className='content-header-wrapper'>
                                        <img src={selv} alt='' className='logo' />
                                        <h5>{t("general.A Unified Identity")}</h5>
                                    </span>
                                    <p>{t("views.landing.app.Unified Identity Protocol enables devices")}</p>
                                </div>
                            </div>
                        </div>

                        <Link to='/demo/select'>
                            <Button className='cta' data-aos='fade-up' data-aos-duration='1000'>
                                {t("actions.Try the demo")}
                </Button>
                        </Link>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);
