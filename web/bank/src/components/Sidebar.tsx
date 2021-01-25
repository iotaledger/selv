import React from 'react';
import { Sidenav } from 'rsuite';
import { Link } from 'react-router-dom';
import poweredByIota from '../assets/poweredByIota.svg';
import logo from '../assets/landing/logoHeader.svg';
import frame from '../assets/backgrounds/circleFrame5.svg';
import DropSelector from '../components/DropSelector';
import { useTranslation } from 'react-i18next';

// https://rsuitejs.com/en/components/sidenav

const externalPages = [
    { url: '/', title: 'Home' },
    { url: '/#faq', title: 'FAQ' },
    { url: 'https://iota.org', title: 'IOTA.org' }
];

const SidebarInstance = ({ children }: {
    children?: JSX.Element | null | undefined;
}) => {
    const { t } = useTranslation();

    return (
        <div className='sidebar-wrapper'>
            <Link to='/demo/select'>
                <img src={logo} alt='Selv logo' className='sidebar-logo' />
            </Link>
            <div className="sidebar-drop-selector">
                <DropSelector />
            </div>

            <Sidenav activeKey='0'>
                <Sidenav.Body>
                    <h2 className='todo-list'>
                        {t("components.sideBar.yourTodoList")}
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
