import React from 'react';
import { Sidenav } from 'rsuite';
import { Link } from 'react-router-dom';
import logo from '../assets/landing/logoHeader.svg';
import frame from '../assets/backgrounds/circleFrame5.svg';
import DropSelector from './DropSelector';
import { useTranslation } from 'react-i18next';
import IOTA from './powerdBy/IOTA';
import StepsInstance from './Steps';

// https://rsuitejs.com/en/components/sidenav

const externalPages = [
    { url: '/', title: 'Home' },
    { url: '/#faq', title: 'FAQ' },
    { url: 'https://iota.org', title: 'IOTA.org' }
];

const SidebarInstance = ({ mainSteps, poweredBy, processes }: {
    mainSteps?: JSX.Element;
    poweredBy?: JSX.Element;
    processes?: JSX.Element;
}) => {
    const { t } = useTranslation();

    return (
        <div className='sidebar-wrapper'>
            <Link to='/demo/todos'>
                <img src={logo} alt='Selv logo' className='sidebar-logo' />
            </Link>
            <div className="sidebar-drop-selector">
                <DropSelector />
            </div>
            <StepsInstance title={t("components.sideBar.yourTodoList")} steps={ mainSteps } stepId={1}/>
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
