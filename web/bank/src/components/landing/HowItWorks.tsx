import React from 'react';
import { RandomGraphicElement } from '../';
import selv from '../../assets/selv.svg';
import howItWorks1 from '../../assets/landing/howItWorks1.png';
import howItWorks1Mobile from '../../assets/landing/howItWorks1-mobile.png';
import howItWorks2 from '../../assets/landing/howItWorks2.png';
import howItWorks2Mobile from '../../assets/landing/howItWorks2-mobile.png';
import circle from '../../assets/backgrounds/circleFrame1.svg';
import { Translation } from 'react-i18next';

export default () => (
    <Translation>
        {
            (t) =>

                <RandomGraphicElement elements={10}>
                    <div className='how-it-works-section' id='how-it-works'>
                        <img src={circle} alt='' className='circle' />
                        <h4 data-aos='fade-up' data-aos-duration='1000'>{t("landing.howItWorks.inBrief")}</h4>
                        <h2 data-aos='fade-up' data-aos-duration='1000'>{t("landing.howItWorks.howItWorks")}</h2>
                        <div className='content-wrapper'>
                            <div className='desktop'>
                                <div className='column'>
                                    <Create />
                                    <Share />
                                    <img data-aos='fade-left' data-aos-duration='1000' src={howItWorks2} alt='how It Works' className='howItWorks2' />
                                </div>
                                <div className='column'>
                                    <img data-aos='fade-up' data-aos-duration='1000' src={howItWorks1} alt='how It Works' className='howItWorks1' />
                                    <Grow />
                                    <Accept />
                                </div>
                            </div>
                            <div className='mobile'>
                                <Create />
                                <Grow />
                                <img data-aos='fade-up' data-aos-duration='1000' src={howItWorks1Mobile} alt='how It Works' className='howItWorks1' />
                                <Share />
                                <Accept />
                                <img data-aos='fade-up' data-aos-duration='1000' src={howItWorks2Mobile} alt='how It Works' className='howItWorks2' />
                            </div>
                        </div>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);

const Create = () => (
    <Translation>
        {
            (t) =>
                <div className='info' data-aos='fade-left' data-aos-duration='1000'>
                    <span className='content-header-wrapper'>
                        <img src={selv} alt='' className='logo' />
                        <h5>{t("landing.howItWorks.create")}</h5>
                    </span>
                    <p>{t("landing.howItWorks.createText")}</p>
                </div>
        }
    </Translation>
);

const Share = () => (
    <Translation>
        {
            (t) =>
                <div className='info' data-aos='fade-left' data-aos-duration='1000'>
                    <span className='content-header-wrapper'>
                        <img src={selv} alt='' className='logo' />
                        <h5>{t("landing.howItWorks.share")}</h5>
                    </span>
                    <p>{t("landing.howItWorks.shareText")}</p>
                </div>
        }
    </Translation>
);

const Grow = () => (
    <Translation>
        {
            (t) =>
                <div className='info' data-aos='fade-right' data-aos-duration='1000'>
                    <span className='content-header-wrapper'>
                        <img src={selv} alt='' className='logo' />
                        <h5>{t("landing.howItWorks.grow")}</h5>
                    </span>
                    <p>{t("landing.howItWorks.growText")}</p>
                </div>
        }
    </Translation>
);

const Accept = () => (
    <Translation>
        {
            (t) =>
                <div className='info' data-aos='fade-right' data-aos-duration='1000'>
                    <span className='content-header-wrapper'>
                        <img src={selv} alt='' className='logo' />
                        <h5>{t("landing.howItWorks.accept")}</h5>
                    </span>
                    <p>{t("landing.howItWorks.acceptText")}</p>
                </div>
        }
    </Translation>
);
