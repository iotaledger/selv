import React from 'react';
import { Disclaimer } from '..';
import logo from '../../assets/landing/logoFooter.svg';

export default () => (
    <div className='footer-section' id='footer'>
        <img src={logo} alt='Selv logo' />
        <h1>Contact us</h1>
        <p>Would you like to know how Self Sovereign Identity can benefit<br className='line-break' />your organisation?</p>
        <p className='bold'>To learn more contact us at <a href='mailto:selv@iota.org' className='bold'>selv@iota.org</a></p>
        <div className='footer-links'>
            <a
                className='footer-link'
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.iota.org'
            >
                Visit iota.org
            </a>
            <a
                className='footer-link'
                target='_blank'
                rel='noopener noreferrer'
                href='https://www.iota.org/research/privacy-policy'
            >
                Privacy Policy
            </a>
        </div>
        <Disclaimer />
    </div>
);
