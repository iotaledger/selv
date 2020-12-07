import React from 'react';
import registry from '../assets/registry.svg'
import future from '../assets/futureFoundation.svg'
import present from '../assets/presentFoundation.svg'

const Header = ({ children, theme }) => {
    return (
        <div className='header-wrapper'>
                { theme === 'registry' && <span className='logo-bg-registry'> <img src={registry} alt='Good Ancestor Registry' /></span> }
                { theme === 'future' && <span className='logo-bg-future'> <img src={future} alt='Far Future Foundation' /></span> }
                { theme === 'present' && <img src={present} alt='Act Right Now Foundation' /> }
            { children }
        </div>
    );
};

export default Header;
