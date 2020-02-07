import React from 'react';
import companyHouse from '../assets/companyHouseCrone.svg'
import snsBank from '../assets/snsBank.svg'

const Footer = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string;
}) => {
    return (
        <div className="footer-wrapper">
            {children}
            <div className="logo">
                { theme === 'companyHouse' && <img src={companyHouse} alt="Company House Logo" /> }
                { theme === 'snsBank' && <img src={snsBank} alt="SNS Bank Logo" /> }
            </div>
        </div>
    );
};

export default Footer