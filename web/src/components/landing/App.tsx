import React from 'react';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { RandomGraphicElement } from '../'
import app from '../../assets/landing/app.png' 
import appMobile from '../../assets/landing/app-mobile.png' 

export default ({ }) => (
    <RandomGraphicElement elements={5}>
        <div className="app-section" id="the-app">
            <h4>Demo</h4>
            <h2>The App</h2>

            <div className="content-wrapper">
                <img src={app} alt="App" className="desktop" />
                <img src={appMobile} alt="App" className="mobile" />
                <div className="content-list">
                    <div className="content-item">
                        <h5>Self Sovereign Identity</h5>
                        <p>Through Self Sovereign Identity, people, organisations and things are empowered to collect and share their own verified data and digital identity.</p>
                    </div>
                    <div className="content-item">
                        <h5>One App – One Protocol</h5>
                        <p>This solution provides an easy and cheap way to comply with GDPR and similar privacy laws.</p>
                    </div>
                    <div className="content-item">
                        <h5>A Unified Identity</h5>
                        <p>The Unified Identity Protocol not only enables people and organisations to have the benefits of identity, but devices, opening up a whole new world of business models and use cases.</p>
                    </div>
                </div>
            </div>

            <Link to={'/progress/demo/todos'}>
                <Button className="cta">
                    Try the demo
                </Button> 
            </Link>
        </div>
    </RandomGraphicElement>
);