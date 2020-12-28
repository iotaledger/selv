import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Disclaimer, RandomGraphicElement } from '../components';
import image1 from '../assets/greatSuccess/image1.svg';
import image2 from '../assets/greatSuccess/image2.svg';
import image3 from '../assets/greatSuccess/image3.svg';
import checkmark from '../assets/checkmark.svg';
import dots from '../assets/backgrounds/dots.png';

/**
 * Component which will display a GreatSuccess.
 */
const GreatSuccess = ({ history, match }) => {
    const { nextStep } = useStep(match);

    useEffect(() => {
        async function getData () {
            const credentialsString = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                history.goBack();
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
            <div className='theme-demo'>
                <div className='great-success' id='app'>
                    <RandomGraphicElement elements={7}>
                        <div className='great-success-content-wrapper'>
                            <h2>Great Success!</h2>
                            <div className='great-success-content'>
                            <div className='figure-wrapper'>
                                    <img className='figure' src={image1} alt='You signed in with DID' />
                                </div>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You created your future commitment</h3>
                                    </span>
                                    <p>You imagined future possibilities and created a commitment to support future generations. Your donation is an important promise for generations to come. Your legacy will be stored in your Selv wallet and will be passed on to the next generation to support their decisions.</p>
                                </div>
                            </div>
                            <div className='great-success-content' id='middle-item'>
                                <div className='great-success-text-wrapper'>
                                    <span>
                                        <img src={checkmark} alt='' />
                                        <h3>You received your legacy credential</h3>
                                    </span>
                                    <p>You became the owner of a commitment and created a new legacy. From this point onward, you will be able to prove your commitments. Over time you can grow your Selv profile by gathering more credentials from trusted third parties.</p>
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
                                        <h3>You signed in with DID</h3>
                                    </span>
                                    <p>You managed to sign in to a website without needing to create an account saving you time and effort. Far Future Foundation is also not burdened with saving your password and personal information.</p>
                                </div>
                            </div>
                        </div>
                        <img src={dots} alt='' className='dots-top' />
                        <Disclaimer />
                        <div className='cta-wrapper'>
                            <Link to={nextStep}>
                                <Button className='cta'>
                                    Continue
                                </Button>
                            </Link>
                        </div>
                    </RandomGraphicElement>
                </div>
            </div>
        
    );
};

export default GreatSuccess;
