import React from 'react';
import { RandomGraphicElement } from '..';
import control from '../../assets/landing/benefits/control.svg';
import privacy from '../../assets/landing/benefits/privacy.svg';
import reusability from '../../assets/landing/benefits/reusability.svg';
import laws from '../../assets/landing/benefits/laws.svg';
import responsibility from '../../assets/landing/benefits/responsibility.svg';
import user from '../../assets/landing/benefits/user.svg';
import { Translation } from 'react-i18next';

export default () => (
    <Translation>
        {
            (t) =>
                <RandomGraphicElement elements={10}>
                    <div className='benefits-section' id='benefits'>
                        <h4 data-aos='fade-up' data-aos-duration='1000'>{t("landing.benefits.benefits")}</h4>
                        <h2 data-aos='fade-up' data-aos-duration='1000'>{t("landing.benefits.forUsers")}</h2>
                        <div className='benefits-wrapper'>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={control} alt='Control' />
                                <h5>{t("landing.benefits.control")}</h5>
                                <p>{t("landing.benefits.benefitsControl")}</p>
                            </div>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={privacy} alt='Privacy' />
                                <h5>{t("landing.benefits.privacy")}</h5>
                                <p>{t("landing.benefits.benefitsPrivacy")}</p>
                            </div>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={reusability} alt='Reusability' />
                                <h5>{t("landing.benefits.reusability")}</h5>
                                <p>{t("landing.benefits.benefitsReusability")}</p>
                            </div>
                        </div>

                        <h4 data-aos='fade-up' data-aos-duration='1000'>{t("landing.benefits.benefits")}</h4>
                        <h2 data-aos='fade-up' data-aos-duration='1000'>{t("landing.benefits.forBusiness")}</h2>
                        <div className='benefits-wrapper'>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={laws} alt='Privacy Laws' />
                                <h5>{t("landing.benefits.privacyLaws")}</h5>
                                <p>{t("landing.benefits.benefitsPrivacyLaws")}</p>
                            </div>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={responsibility} alt=' Data Responsibility' />
                                <h5>{t("landing.benefits.dataResponsibility")}</h5>
                                <p>{t("landing.benefits.benefitsDataResponsibility")}</p>
                            </div>
                            <div className='benefit' data-aos='fade-up' data-aos-duration='1000'>
                                <img src={user} alt='User Experience' />
                                <h5>{t("landing.benefits.userExperience")}</h5>
                                <p>{t("landing.benefits.benefitsUserExperience")}</p>
                            </div>
                        </div>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);
