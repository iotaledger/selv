import { IdcardOutlined, SolutionOutlined } from '@ant-design/icons';
import React from 'react';

const Footer = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string | undefined;
}) => {
    return (
        <div className='footer-wrapper' id='footer'>
            {children}
            <div className='logo'>
            { theme === 'government' && 
                    <IdcardOutlined/>
                }
                { theme === 'company' && 
                    <SolutionOutlined/>
                }
            </div>
        </div>
    );
};

export default Footer;
