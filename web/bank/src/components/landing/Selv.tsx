import React from 'react';
import logo from '../../assets/landing/logoBody.svg';
import { Translation, Trans } from 'react-i18next';


//TODO: https://react.i18next.com/latest/trans-component ->Alternative usage (v11.6.0)
export default () => (
    <Translation>
        {
            (t) =>
                <div className='selv-section'>
                    <img data-aos='fade-up' data-aos-duration='1000' src={logo} alt='Selv logo' />
                    <p data-aos='fade-up' data-aos-duration='1000'>
                        <Trans i18nKey="landing.selv.selvText">
                            Your data shouldn’t be public, but it shouldn’t be locked up either.<br />We promise a solution that <strong>enables data flow</strong>, completely in your <strong>control</strong>.
                        </Trans>
                    </p>
                </div>
        }
    </Translation>
);
