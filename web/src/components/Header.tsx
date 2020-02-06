import React from 'react';
import companyHouse from '../assets/companyHouse.svg'
import snsBank from '../assets/snsBank.svg'

const Header = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string;
}) => {
    return (
        <div className="header-wrapper">
            { theme === 'companyHouse' && <img src={companyHouse} alt="Company House Logo" /> }
            { theme === 'snsBank' && <img src={snsBank} alt="SNS Bank Logo" /> }
            { children }
        </div>
    );
};

export default Header