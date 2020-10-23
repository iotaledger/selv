import React from 'react';
import { Sidenav } from 'rsuite';
import { Link } from 'react-router-dom';
import poweredByIota from '../assets/poweredByIota.svg';
import logo from '../assets/landing/logoHeader.svg';
import frame from '../assets/backgrounds/circleFrame5.svg';

// https://rsuitejs.com/en/components/sidenav

const externalPages = [
    { url: '/', title: 'Home' },
    { url: 'https://selv.vercel.app/#faq', title: 'FAQ' },
    { url: 'https://iota.org', title: 'IOTA.org' }
];

const SidebarInstance = ({ children }: {
    children?: JSX.Element | null | undefined;
}) => {
    return (
        <div className='sidebar-wrapper'>
            <Link to='/demo/app'>
                <img src={logo} alt='Selv logo' className='sidebar-logo' />
            </Link>
            <Sidenav activeKey='0'>
                <Sidenav.Body>
                    <h2 className='todo-list'>
                        Your to-do list
                    </h2>
                    { children }
                </Sidenav.Body>
            </Sidenav>
            <div className='sidebar-footer'>
                <div className='sidebar-links'>
                    {externalPages.map(page => (
                        <a
                            href={page.url}
                            key={page.title}
                            className='external-menu-link'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            {page.title}
                        </a>
                    ))}
                </div>
                <a
                    href='https://iota.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <img src={poweredByIota} alt='powered by Iota' />
                </a>
            </div>
            <img src={frame} alt='' className='frame' />
        </div>
    );
};

export default SidebarInstance;
