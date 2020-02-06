import React from 'react';

const Footer = ({ children, theme }: {
    children?: JSX.Element | null | undefined;
    theme: string;
}) => {
    return (
        <div className="footer-wrapper">
          footer
          { children }
        </div>
    );
};

export default Footer