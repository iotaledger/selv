import React from 'react';

const Header = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string;
}) => {
    return (
        <div className="header-wrapper">
          header
          { children }
        </div>
    );
};

export default Header