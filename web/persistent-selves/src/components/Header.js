import React from 'react';
import registry from '../assets/registry.svg'
import future from '../assets/futureFoundation.svg'
import present from '../assets/presentFoundation.svg'

const Header = ({ children, theme }) => {
    return (
        <div className='header-wrapper'>
            <div className='logo'>
                { theme === 'registry' && <img src={registry} alt='Good Ancestor Registry' /> }
                { theme === 'future' && <img src={future} alt='Far Future Foundation' /> }
                { theme === 'present' && <img src={present} alt='Act Right Now Foundation' /> }
            </div>
            { children }
        </div>
    );
};

export default Header;
