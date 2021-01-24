import React from 'react';
import companyHouse from '../assets/companyHouseCrone.svg'
import snsBank from '../assets/snsBank.svg'

const Footer = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string | undefined;
}) => {
    return (
        <div className='footer-wrapper' id='footer'>
            {children}
            <div className='logo'>
                { theme === 'company' && <img src={companyHouse} alt='Company House Logo' /> }
                { theme === 'bank' && <img src={snsBank} alt='SNS Bank Logo' /> }
                { theme === 'insurance' && <img src={snsBank} alt='SNS Bank Logo' /> }
            </div>
        </div>
    );
};

export default Footer;
