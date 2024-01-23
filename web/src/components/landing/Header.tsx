import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import DropSelector from '../DropSelector';
import logo from '../../assets/landing/logoHeader.svg'
import { useTranslation } from 'react-i18next';


const links = [
    {
        anchor: '#how-it-works',
        title: 'How it works'
    },
    {
        anchor: '#benefits',
        title: 'Benefits'
    },
    {
        anchor: '#the-app',
        title: 'The App'
    },
    {
        anchor: '#faq',
        title: 'FAQs'
    },
]
export default () => {
    const { t } = useTranslation();
    const [menuOpenState, setMenuState] = useState(false);

    function onAnchorClick(anchor: string) {
        setMenuState(false)
        const root = document.getElementById('root');
        root?.classList.remove('no-scroll');
        const target: Element | null = document.querySelector(anchor);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleMenu() {
        setMenuState(menuOpenState => !menuOpenState)
        const root = document.getElementById('root');
        if (root?.classList.contains('no-scroll')) {
            root?.classList.remove('no-scroll');
        } else {
            root?.classList.add('no-scroll');
        }
    }

    return (
        <div className="header-section">
            <img src={logo} alt="Selv logo" className="logo" />
            <div className="menu-links">

                {/* <img className="cta" alt="USA" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg" onClick={() => setLanguage('en')} style={{ borderWidth: 100, borderColor: '#FFF' }} /> */}
                {/* <Button className='cta' onClick={}>
                </Button> */}
                {
                    links.map(link => (
                        <Link to={link.anchor} key={link.title} className="menu-link" onClick={() => onAnchorClick(link.anchor)}>
                            { t("landing.header." + link.title)}
                        </Link>
                    ))
                }
                <Link to={'/demo/select'}>
                    <Button className="cta">
                        {t("landing.app.tryTheDemo")}
                    </Button>
                </Link>
                <DropSelector />
            </div>
            <MobileMenu menuOpenState={menuOpenState} onAnchorClick={onAnchorClick} />
            <div className="burger-icon-wrapper">
                <span
                    className={`mobile-menu-icon ${menuOpenState ? 'toggled' : ''}`}
                    onClick={handleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </div>
        </div>
    );
}

const MobileMenu = ({ onAnchorClick, menuOpenState }: { onAnchorClick: (anchor: string) => void; menuOpenState: boolean; }) => {
    const { t } = useTranslation();
    return (
        <div className={`mobile-menu-wrapper ${menuOpenState ? 'open' : ''}`}>
            <div className="header-section">
                <h1>{t("landing.header.menu")}</h1>
                <div className="drop-selector">
                    <DropSelector />
                </div>
            </div>
            <div className="mobile-menu-links">
                {
                    links.map(link => (
                        <Link to={link.anchor} key={link.title} className="menu-link" onClick={() => onAnchorClick(link.anchor)}>
                            { t("landing.header." + link.title)}
                        </Link>
                    ))
                }
                <Link to={'/demo/select'}>
                    <Button className="cta">
                        {t("landing.app.tryTheDemo")}
                    </Button>
                </Link>
            </div>
        </div>
    )
}