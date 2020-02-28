import React from 'react';
import { RandomGraphicElement } from '../'
import selv from '../../assets/selv.svg' 
import howItWorks1 from '../../assets/landing/howItWorks1.png' 
import howItWorks1Mobile from '../../assets/landing/howItWorks1-mobile.png' 
import howItWorks2 from '../../assets/landing/howItWorks2.png' 
import howItWorks2Mobile from '../../assets/landing/howItWorks2-mobile.png' 

export default ({ }) => (
    <RandomGraphicElement elements={10}>
        <div className="how-it-works-section" id="how-it-works">
            <h4 data-aos="fade-up">In brief</h4>
            <h2 data-aos="fade-up">How it works</h2>
            <div className="content-wrapper">
                <div className="desktop">
                    <div className="column">
                        <Create />
                        <Share />
                        <img data-aos="fade-up" src={howItWorks2} alt="how It Works" className="howItWorks2" />
                    </div>
                    <div className="column">
                        <img data-aos="fade-up" src={howItWorks1} alt="how It Works" className="howItWorks1" />
                        <Grow />
                        <Accept />
                    </div>
                </div>
                <div className="mobile">
                    <Create />
                    <Grow />
                    <img data-aos="fade-up" src={howItWorks1Mobile} alt="how It Works" className="howItWorks1" />
                    <Share />
                    <Accept />
                    <img data-aos="fade-up" src={howItWorks2Mobile} alt="how It Works" className="howItWorks2" />
                </div>
            </div>
        </div>
    </RandomGraphicElement>
);

const Create = () => (
    <div className="info" data-aos="fade-up">
        <span className="content-header-wrapper">
            <img src={selv} alt="" className="logo" />
            <h5>Create</h5>
        </span>
        <p>Download a SSI app and create a unique identifier, representing you online. This profile remains in your control and doesn’t leave the app without your consent.</p>
    </div>
);

const Share = () => (
    <div className="info" data-aos="fade-up">
        <span className="content-header-wrapper">
            <img src={selv} alt="" className="logo" />
            <h5>Share</h5>
        </span>
        <p>Decide who and what others get to see from your personal profile. You can share your data peer-to-peer or on request. Controlled data flow allows you to always get something in return for your data.</p>
    </div>
);

const Grow = () => (
    <div className="info" data-aos="fade-up">
        <span className="content-header-wrapper">
            <img src={selv} alt="" className="logo" />
            <h5>Grow</h5>
        </span>
        <p>Gather statements, or credentials, about yourself, verified by others, to grow your personal identity. Fully under your control and not stored in any database.</p>
    </div>
);

const Accept = () => (
    <div className="info" data-aos="fade-up">
        <span className="content-header-wrapper">
            <img src={selv} alt="" className="logo" />
            <h5>Accept</h5>
        </span>
        <p>By accepting BYOI, companies can verify customer data, instantly and for free. This allows you to speed up processes such as onboarding and reduce the amount of typing your customers have to do.</p>
    </div>
);