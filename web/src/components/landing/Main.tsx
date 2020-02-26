import React from 'react';
import { RandomGraphicElement } from '../'
import main from '../../assets/landing/main.png' 
import mainMobile from '../../assets/landing/main-mobile.png' 
import appStore from '../../assets/appStore.svg'
import googlePlay from '../../assets/googlePlay.svg'

export default ({ }) => {
    return (
        <RandomGraphicElement elements={5}>
            <div className="heading-section">
                <div className="desktop">
                    <div className="content-wrapper">
                        <div className="content">
                            <Content />
                            <Buttons />
                        </div>
                    </div>
                    <img src={main} alt="Portrait" className="portrait" />
                </div>
                <div className="mobile">
                    <div className="content">
                        <Content />
                    </div>
                    <img src={mainMobile} alt="Portrait" />
                    <Buttons />
                </div>
            </div>
        </RandomGraphicElement>
    );
}

const Content = () => (
    <React.Fragment>
        <h1>Claim, Control & Reuse your new Digital Identity</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </React.Fragment>
);


const Buttons = () => (
    <div className="store-buttons">
        <a 
            href='https://apps.apple.com/us/app/trinity-wallet/id1385929472?ls=1'
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src={appStore} alt="Apple AppStore" />
        </a>
        <a 
            href='https://play.google.com/store/apps/details?id=com.iota.trinity'
            target="_blank"
            rel="noopener noreferrer"
        >
            <img src={googlePlay} alt="Google Play Market" />
        </a>
    </div>
);