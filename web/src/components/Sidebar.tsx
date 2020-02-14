import React from 'react';
import { Sidenav } from 'rsuite';
import { Link } from 'react-router-dom'
import reset from '../assets/reset.svg'
import poweredByIota from '../assets/poweredByIota.svg'

// https://rsuitejs.com/en/components/sidenav

const externalPages = [
    { url: 'https://iota.org', title: 'Home' },
    { url: 'https://iota.org', title: 'FAQ' },
    { url: 'https://iota.org', title: 'IOTA.org' },
]

const SidebarInstance = ({ children }: {
    children?: JSX.Element | null | undefined;
}) => {
    return (
        <div className="sidebar-wrapper">
          <Sidenav defaultOpenKeys={['3', '4']} activeKey="1">
                <Sidenav.Body>
                    <h2 className="todo-list">
                        Your to-do list
                        <Link to="/progress/demo/todos">
                            <img src={reset} alt="Reset" />
                        </Link>
                    </h2>
                    { children }
                </Sidenav.Body>
                <div className="sidebar-footer">
                    <a 
                        href='https://iota.org' 
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={poweredByIota} alt="powered by Iota" />
                    </a>
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
                </div>
            </Sidenav>
        </div>
    );
};

export default SidebarInstance