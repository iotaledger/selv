import React from 'react';
import { RandomGraphicElement } from '../'
import connected from '../../assets/landing/connected.svg' 

export default ({ }) => (
    <RandomGraphicElement elements={5}>
        <div className="control-identity-section">
            <div className="content-wrapper">
                <div className="text-content-wrapper">
                    <h2>You control your<br />own identity.</h2>
                    <p>Through Self Sovereign Identity (SSI), people, organisations and things are empowered to collect and share their own verified data and digital identity. This increased privacy and control enables a “Bring Your Own Identity” (BYOI) style of engagement with corporations, removing the need to perform expensive data collection.</p>
                </div>
                <img src={connected} alt="Connected" />
            </div>
        </div>
    </RandomGraphicElement>
);