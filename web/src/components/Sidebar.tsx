import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Sidenav } from 'rsuite';

// https://rsuitejs.com/en/components/sidenav

const externalPages = [
    { url: 'https://iota.org', title: `What's this?` },
    { url: 'https://blog.iota.org', title: 'FAQ' },
    { url: 'https://docs.iota.org', title: 'Get involved' },
]

const SidebarInstance = ({ children }: {
    children?: JSX.Element | null | undefined;
}) => {
    return (
        <div className="sidebar-wrapper">
          <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
            <Sidenav.Header>
                <div className="sidebar-header">
                </div>
            </Sidenav.Header>
            <Sidenav.Body>
                { children }
            </Sidenav.Body>
                <div className="sidebar-links">
                    {externalPages.map(page => (
                        <a 
                            href={page.url} 
                            key={page.title} 
                            className="external-menu-link" 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {page.title}
                        </a>
                    ))}
                </div>
            </Sidenav>
        </div>
    );
};

export default SidebarInstance