import React from 'react';
import { RandomGraphicElement } from '..';
import control from '../../assets/landing/benefits/control.svg';
import privacy from '../../assets/landing/benefits/privacy.svg';
import reusability from '../../assets/landing/benefits/reusability.svg';
import laws from '../../assets/landing/benefits/laws.svg';
import responsibility from '../../assets/landing/benefits/responsibility.svg';
import user from '../../assets/landing/benefits/user.svg';

export default () => (
    <RandomGraphicElement elements={10}>
        <div className='benefits-section' id='benefits'>
            <h4 data-aos='fade-up' data-aos-duration='2000'>Benefits</h4>
            <h2 data-aos='fade-up' data-aos-duration='2000'>For Individuals</h2>
            <div className='benefits-wrapper'>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={control} alt='Control' />
                    <h5>Control</h5>
                    <p>Anything related to your identity and your personal data remains in your control.</p>
                </div>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={privacy} alt='Privacy' />
                    <h5>Privacy</h5>
                    <p>Revealing only the minimum required information improves privacy.</p>
                </div>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={reusability} alt='Portability' />
                    <h5>Portability</h5>
                    <p>Share as often as you like. No more repeatedly entering the same information online.</p>
                </div>
            </div>

            <h4 data-aos='fade-up' data-aos-duration='2000'>Benefits</h4>
            <h2 data-aos='fade-up' data-aos-duration='2000'>For Organisations</h2>
            <div className='benefits-wrapper'>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={laws} alt='Privacy Laws' />
                    <h5>Privacy Laws</h5>
                    <p>Complies with the General Data Protection Act (GDPR).</p>
                </div>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={responsibility} alt=' Data Responsibility' />
                    <h5>Data Responsibility</h5>
                    <p>Users control their data, reducing data protection responsibilities for organisations.</p>
                </div>
                <div className='benefit' data-aos='fade-up' data-aos-duration='2000'>
                    <img src={user} alt='User Experience' />
                    <h5>User Experience</h5>
                    <p>Gain and retain more customers with an enhanced user experience.</p>
                </div>
            </div>
        </div>
    </RandomGraphicElement>
);
