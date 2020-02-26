import React from 'react';
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
    function onAnchorClick(anchor: string) {
        const target: Element | null = document.querySelector(anchor);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    return (
        <div className="header-section">
            <img src={logo} alt="Selv logo" />
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
        </div>
    );
}