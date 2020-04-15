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
                        <h2>Demo complete</h2>
                        <div className='great-success-content-wrapper'>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image1} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You signed in with DID</h3>
                                    </span>
                                    <p>You managed to sign into a website that didn’t require registration. Account creation has been skipped saving you time and effort. The National Health Provider has safely restricted access to your credential and is also not burdened with saving your password.</p>
                                </div>
                            </div>
                            <div className='great-success-content' id='middle-item'>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>Received immunity Credentials</h3>
                                    </span>
                                    <p>From this point onwards, you would be able to prove your immunity online, allowing you to choose how you share this status. Over time you can grow your Selv profile by gathering multiple credentials from trusted third parties.</p>
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
                                        <h3>Received a foreign Visa</h3>
                                    </span>
                                    <p>By providing your current immunity status, you are able to minimise the risk posed to others and yourself. Your private medical records are not shared and kept on a separate data layer from your passport information. Selv provides data ownership, trust and improved privacy to the individual.</p>
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
