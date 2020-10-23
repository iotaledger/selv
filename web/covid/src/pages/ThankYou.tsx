import React from 'react';
import { Link } from 'react-router-dom';
import { RandomGraphicElement } from '../components';
import image1 from '../assets/greatSuccess/image1.png';
import image2 from '../assets/greatSuccess/image2.png';
import image3 from '../assets/greatSuccess/image3.png';
import checkmark from '../assets/checkmark.svg';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';
import { Footer, Benefits } from '../components/landing';

/**
 * Component which will display a ThankYou.
 */
const ThankYou: React.FC = () => {
    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className='thank-you-page-wrapper'>
                    <div className='thank-you-wrapper'>
                        <h2 className="no-underline">Demo complete</h2>
                        <div className='great-success-content-wrapper'>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image1} alt='You signed in with your Digital Identity' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You signed in with your Digital Identity</h3>
                                    </span>
                                    <p>You signed into the National Health Authority website without needing to create an account or password. You saved time by verifying your identity with your Selv app.</p>
                                </div>
                            </div>
                            <div className='great-success-content' id='middle-item'>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You Acquired Your Health Credential</h3>
                                    </span>
                                    <p>From this point onwards, you would be able to prove your Covid-19 health status when needed. Over time you can grow your Selv profile by gathering additional credentials from trusted parties.</p>
                                </div>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image2} alt='Received new Credentials' />
                                </div>
                            </div>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image3} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You Obtained a Travel Visa</h3>
                                    </span>
                                    <p>By verifiying your health status you were granted a travel visa credential. Selv empowers individuals by giving them ownership of their data and improved privacy.</p>
                                </div>
                            </div>
                        </div>
                        <img src={dots} alt='' className='dots-bottom' />
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <Benefits />
                    <Footer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default ThankYou;
