import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { RandomGraphicElement } from '../components';
import image1 from '../assets/thankYou/image1.svg';
import image2 from '../assets/thankYou/image2.svg';
import image3 from '../assets/thankYou/image3.svg';
import checkmark from '../assets/checkmark.svg';
import dots from '../assets/backgrounds/dots.png';
import { Footer } from '../components/landing';

/**
 * Component which will display a ThankYou.
 */
const ThankYou = () => {
    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <div className='thank-you-page-wrapper'>
                    <div className='thank-you-wrapper'>
                        <h2>Thanks for trying Selv!</h2>
                        <div className='great-success-content-wrapper'>
                            <div className='great-success-content'>
                                <div className='figure-wrapper'>
                                    <img className='figure' src={image1} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>Improved experience</h3>
                                    </span>
                                    <p>With Selv, powered by IOTA, you managed to set up an entire company, corporate bank account and insurance with very few clicks. Your data was reusable and this saved you x fields of form fields to fill in.</p>
                                </div>
                            </div>
                            <div className='great-success-content' id='middle-item'>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>Self Sovereignity</h3>
                                    </span>
                                    <p>You have taken full control of your data. You decided who you shared your data with. Did you know that you can share them with others manually via QR as well. Try so in the Selv app!</p>
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
                                        <h3>More Trust</h3>
                                    </span>
                                    <p>The data you shared with the Company House and the SNS Bank was verifiable. This allows to verify your data instantly and freely using IOTA as the trust layer.</p>
                                </div>
                            </div>
                        </div>
                        <div className='cta-wrapper'>
                            <Link to={'/'}>
                                <Button className='cta'>
                                    Return home
                                </Button>
                            </Link>
                        </div>
                        <img src={dots} alt='' className='dots-bottom' />
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <Footer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default ThankYou;
