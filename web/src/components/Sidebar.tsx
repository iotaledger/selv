import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css'
import { Sidenav } from 'rsuite';

// https://rsuitejs.com/en/components/sidenav

const SidebarInstance = ({ children }: {
    children?: JSX.Element | null | undefined;
}) => {
    return (
        <div className="sidebar-wrapper">
          <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
            <Sidenav.Header>
                <div className="sidebar-header">
                    Bob
                </div>
            </Sidenav.Header>
            <Sidenav.Body>
                { children }
            </Sidenav.Body>
                <div className="sidebar-links">
                    <a 
                        href="https://www.iota.org/" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        What's this?
                    </a>
                    <a 
                        href="https://www.iota.org/" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        FAQ
                    </a>
                    <a 
                        href="https://www.iota.org/" 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Get involved
                    </a>
                </div>
            </Sidenav>
        </div>
    );
};

export default SidebarInstance