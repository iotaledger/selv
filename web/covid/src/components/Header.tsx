import React from 'react';
import healthAuthorityLogo from '../assets/healthAuthorityLogo.svg';
import hrAdminLogo from '../assets/hrAdminLogo.svg';
import foreignBorderAgencyLogo from '../assets/foreignBorderAgencyLogo.svg';

const Header = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string | undefined;
}) => {
    return (
        <div className='header-wrapper'>
            <div className='logo'>
                { theme === 'health' && <img src={healthAuthorityLogo} alt='National Health Authority' /> }
                { theme === 'hr' && <img src={hrAdminLogo} alt='Aid Agency HR Portal' /> }
                { theme === 'agency' && <img src={foreignBorderAgencyLogo} alt='Foreign Border Agency' /> }
            </div>
            { children }
        </div>
    );
};

export default Header;
