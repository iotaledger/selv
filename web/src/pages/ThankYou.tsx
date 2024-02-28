import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { RandomGraphicElement } from '../components';
import image1 from '../assets/thankYou/image1.svg';
import image2 from '../assets/thankYou/image2.svg';
import image3 from '../assets/thankYou/image3.svg';
import checkmark from '../assets/checkmark.svg';
import dots from '../assets/backgrounds/dots.png';
import { Footer, Header } from '../components/landing';
import { useTranslation } from 'react-i18next';

/**
 * Component which will display a ThankYou.
 */
const ThankYou: React.FC = () => {
    const { t } = useTranslation();

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <div className='thank-you-page-wrapper'>
                    <Header />
                    <div className='thank-you-wrapper'>
                        <h2>{t("pages.demo.thankYou.thanksForTryingSelv")}</h2>
                        <div className='great-success-content-wrapper'>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image1} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>{t("pages.demo.thankYou.improvedExperience")}</h3>
                                    </span>
                                    <p>{t("pages.demo.thankYou.savedTime")}</p>
                                </div>
                            </div>
                            <div className='great-success-content' id='middle-item'>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>{t("general.selfSovereignity")}</h3>
                                    </span>
                                    <p>{t("pages.demo.thankYou.sovereignityText")}</p>
                                </div>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image2} alt='Received new Credentials' />
                                </div>
                            </div>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image3} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>{t("pages.demo.thankYou.moreTrust")}</h3>
                                    </span>
                                    <p>{t("pages.demo.thankYou.trustText")}</p>
                                </div>
                            </div>
                        </div>
                        <div className='cta-wrapper'>
                            <Link to={'/'}>
                                <Button className='cta'>
                                    {t("pages.demo.thankYou.returnHome")}
                                </Button>
                            </Link>
                        </div>
                        <img src={dots} alt='' className='dots-bottom' />
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <Footer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default ThankYou;
