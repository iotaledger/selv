import React from 'react';
import companyHouse from '../assets/companyHouse.svg'
import snsBank from '../assets/snsBank.svg'

const Header = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string | undefined;
}) => {
    return (
        <div className='header-wrapper'>
            <div className='logo'>
                { theme === 'company' && <img src={companyHouse} alt='Company House Logo' /> }
                { theme === 'bank' && <img src={snsBank} alt='SNS Bank Logo' /> }
                { theme === 'insurance' && <img src={snsBank} alt='SNS Bank Logo' /> }
            </div>
            { children }
        </div>
    );
};

export default Header;
