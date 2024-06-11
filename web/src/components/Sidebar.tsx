import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/landing/logoHeader.svg';
import frame from '../assets/backgrounds/circleFrame5.svg';
import DropSelector from './DropSelector';
import { useTranslation } from 'react-i18next';
import IOTA from './powerdBy/IOTA';

const externalPages = [
    { url: '/', title: 'Home' },
    { url: '/#faq', title: 'FAQ' },
    { url: 'https://iota.org', title: 'IOTA.org' }
];

const SidebarInstance = ({ children, poweredBy }: {
    children?: JSX.Element | null | undefined;
    poweredBy?: JSX.Element;
}) => {
    const { t } = useTranslation();

    return (
        <div className='sidebar-wrapper'>
            <div>
                <div className='sidebar-wrapper__header'>

                    <Link to='/demo/todos'>
                        <img src={logo} alt='Selv logo' className='sidebar-logo' />
                    </Link>
                    <div className="sidebar-drop-selector">
                        <DropSelector />
                    </div>
                </div>
                <div>
                    <h2 className='todo-list'>
                        {t("components.sideBar.yourTodoList")}
                    </h2>
                    { children }
                </div>

            </div>
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
               <IOTA/>
                {poweredBy && (
                    <>
                        <span style={{paddingLeft: '25px', paddingTop: '5px', paddingBottom: '5px'}}>and</span>
                        { poweredBy }
                    </>
                )}
            </div>
            <img src={frame} alt='' className='frame' />
        </div>
    );
};

export default SidebarInstance;
