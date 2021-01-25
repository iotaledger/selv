import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { Disclaimer, RandomGraphicElement } from '../components';
import DropSelector from '../components/DropSelector';
import useStep from '../utils/useStep';
import howItWorks from '../assets/landing/howItWorks1.png';
import dots from '../assets/backgrounds/dots.png';
import logo from '../assets/landing/logoHeader.svg';
import { useTranslation, Trans } from 'react-i18next';

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);

    const { t } = useTranslation();

    useEffect(() => {
        const reset = async () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
            await localStorage.clear();
        };
        reset();
    }, []);

    return (
        <RandomGraphicElement elements={7}>
            <div className='theme-demo'>
                <Link to={'/'} className="logo demo-page">
                    <img src={logo} alt="Selv logo" />
                </Link>
                <div className="demo-drop-selector">
                    <DropSelector />
                </div>
                <div className='demo-intro' id='app'>
                    <div className='todos'>
                        <span className='heading'><h2>{t("pages.demo.introShowTodos.welcomeToThe")}</h2>&nbsp;&nbsp;&nbsp;<h2 className='highlight'>{t("pages.demo.introShowTodos.selvDemo")}</h2></span>
                        <Trans i18nKey="pages.demo.introShowTodos.hereIsTodo">
                            <h3>Here is <strong>your to-do list</strong> for today:</h3>
                        </Trans>
                        <ul className='todos'>
                            <li>{t("pages.demo.introShowTodos.setUpCompany")}</li>
                            <li>{t("pages.demo.introShowTodos.getBankAccount")}</li>
                            <li>{t("pages.demo.introShowTodos.getLiabilityInsurance")}</li>
                        </ul>
                        <Link to={nextStep}>
                            <Button className='cta'>
                                {t("actions.continue")}
                            </Button>
                        </Link>
                    </div>
                    <div className='image-wrapper'>
                        <img src={howItWorks} alt='how It Works' className='howItWorks' />
                    </div>
                    <img src={dots} alt='' className='dots-top' />
                    <img src={dots} alt='' className='dots-bottom' />
                    <Disclaimer />
                </div>
            </div>
        </RandomGraphicElement>
    );
};

export default IntroShowTodos;
