import React from 'react';
import { RandomGraphicElement } from '../';
import connected from '../../assets/landing/connected.svg';
import { Translation } from 'react-i18next';

export default () => (
    <Translation>
        {
            (t) =>

                <RandomGraphicElement elements={5}>
                    <div className='control-identity-section'>
                        <div className='content-wrapper'>
                            <div className='text-content-wrapper' data-aos='fade-up' data-aos-duration='1000'>
                                <div className='heading-wrapper'>
                                    <h2>{t("landing.controlIdentity.youControlYour")}</h2>
                                    <h2>{t("landing.controlIdentity.ownIdentity")}</h2>
                                </div>
                                <p>{t("landing.controlIdentity.whatItIsDetailed")}</p>
                            </div>
                            <img data-aos='fade-up' data-aos-duration='1000' src={connected} alt='Connected' className='illustration' />
                        </div>
                    </div>
                </RandomGraphicElement>
        }
    </Translation>
);
