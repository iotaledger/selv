import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { getCompanyId } from '../utils/helper';
import { Disclaimer, RandomGraphicElement } from '../components';
import image1 from '../assets/greatSuccess/image1.png';
import image2 from '../assets/greatSuccess/image2.png';
import image3 from '../assets/greatSuccess/image3.png';
import checkmark from '../assets/checkmark.svg';
import dots from '../assets/backgrounds/dots.png';
import { useTranslation } from 'react-i18next';

/**
 * Component which will display a GreatSuccess.
 */
const GreatSuccess: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);
    const [companyId, setCompanyId] = useState('');

    const { t } = useTranslation();

    useEffect(() => {
        async function determineCompanyId() {
            setCompanyId(await getCompanyId());
        }
        determineCompanyId();
    }, [companyId]);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <div className='great-success' id='app'>
                    <h2>{t("general.greatSuccess")}</h2>
                    <div className='great-success-content-wrapper'>
                        <div className='great-success-content'>
                            <div className='figure-wrapper'>
                                <img className='figure' src={image1} alt='You signed in with DID' />
                            </div>
                            <div className='great-success-text-wrapper'>
                                <span>
                                    <img src={checkmark} alt='' />
                                    <h3>{t("general.signedInDID")}</h3>
                                </span>
                                <p>{t("pages.demo.greatSuccess.signedInDIDText")}</p>
                            </div>
                        </div>
                        <div className='great-success-content' id='middle-item'>
                            <div className='great-success-text-wrapper'>
                                <span>
                                    <img src={checkmark} alt='' />
                                    <h3>{t("general.receivedNewCredentials")}</h3>
                                </span>
                                <p>{t("pages.demo.greatSuccess.receivedNewCredentialsText")}</p>
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
                                    <h3>{t("general.reusedSelvCredentials")}</h3>
                                </span>
                                <p>{t("pages.demo.greatSuccess.reusedSelvCredentialsText")}</p>
                            </div>
                        </div>
                    </div>
                    <div className='cta-wrapper'>
                        <Link to={nextStep.replace(':companyId', companyId)}>
                            <Button className='cta'>
                                {t("actions.continue")}
                            </Button>
                        </Link>
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default GreatSuccess;
