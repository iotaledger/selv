import React from 'react';
import { Disclaimer } from '..';
import logo from '../../assets/landing/logoFooter.svg';
import { Translation } from 'react-i18next';

export default () => (
    <Translation>
        {
            (t) =>

                <div className='footer-section' id='footer'>
                    <img src={logo} alt='Selv logo' />
                    <h1>{t("landing.footer.contactUs")}</h1>
                    <p>{t("landing.footer.contactUsLowerText1")}<br className='line-break' />{t("landing.footer.contactUsLowerText2")}</p>
                    <p className='bold'>{t("landing.footer.contactUsAt")} <a href='mailto:selv@iota.org' className='bold'>selv@iota.org</a></p>
                    <div className='footer-links'>
                        <a
                            className='footer-link'
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.iota.org'
                        >
                            {t("landing.footer.visit")} iota.org
                        </a>
                        <a
                            className='footer-link'
                            target='_blank'
                            rel='noopener noreferrer'
                            href='https://www.iota.org/research/privacy-policy'
                        >
                            {t("landing.footer.privacyPolicy")}
            </a>
                    </div>
                    <Disclaimer />
                </div>
        }
    </Translation>
);
