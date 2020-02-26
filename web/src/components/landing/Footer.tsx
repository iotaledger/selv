import React from 'react';
import logo from '../../assets/landing/logoFooter.svg' 

export default ({ }) => (
    <div className="footer-section">
        <img src={logo} alt="Selv logo" />
        <h1>Contact us</h1>
        <p>Would you like to know how Self Sovereign Identity can positively influence<br />your business or would you like to experiment with the technology?</p>
        <p className="bold">Contact us at <a href="mailto:UIP@iota.org" className="bold">UIP@iota.org</a></p>
        <div className="footer-links">
            <a
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.iota.org"
            >
                Visit iota.org
            </a>
            <a
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.iota.org/research/privacy-policy"
            >
                Privacy Policy
            </a>
        </div>
    </div>
);