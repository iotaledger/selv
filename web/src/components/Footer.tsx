import React from 'react';
import companyHouse from '../assets/companyHouseCrone.svg'

const Footer = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string;
}) => {
    return (
        <div className="footer-wrapper">
            {children}
            { theme === 'companyHouse' && <img src={companyHouse} alt="Company House Logo" /> }
        </div>
    );
};

export default Footer