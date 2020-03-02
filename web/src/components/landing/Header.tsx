import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import logo from '../../assets/landing/logoHeader.svg' 

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
    const [menuOpenState, setMenuState] = useState(false);

    function onAnchorClick(anchor: string) {
        setMenuState(false)
        const target: Element | null = document.querySelector(anchor);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleMenu() {
        setMenuState(menuOpenState => !menuOpenState)
    }

    return (
        <div className="header-section">
            <img src={logo} alt="Selv logo" className="logo" />
            <div className="menu-links">
                {
                    links.map(link => (
                        <Link to={link.anchor} key={link.title} className="menu-link" onClick={() => onAnchorClick(link.anchor)}>
                            { link.title }
                        </Link>
                    ))
                }
                <Link to={'/progress/demo/todos'}>
                    <Button className="cta">
                        Try the demo
                    </Button> 
                </Link>
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
    return (
        <div className={`mobile-menu-wrapper ${menuOpenState ? 'open' : ''}`}>
            <h1>Menu</h1>
            <div className="mobile-menu-links">
                {
                    links.map(link => (
                        <Link to={link.anchor} key={link.title} className="menu-link" onClick={() => onAnchorClick(link.anchor)}>
                            { link.title }
                        </Link>
                    ))
                }
                <Link to={'/progress/demo/todos'}>
                    <Button className="cta">
                        Try the demo
                    </Button> 
                </Link>
            </div>
        </div>
    )
}