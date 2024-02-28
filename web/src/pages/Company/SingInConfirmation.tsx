import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../../utils/useStep';
import { Layout, RandomGraphicElement } from '../../components';
import selv from '../../assets/selvBordered.svg';
import { useTranslation } from 'react-i18next';

/**
 * Component which will display a SingInConfirmation.
 */
const SingInConfirmation: React.FC = () => {
    const { nextStep } = useStep();
    const { t } = useTranslation();

    return (
        <Layout>
            <RandomGraphicElement elements={5}>
                <div className='sign-in-confirmation'>
                    <img src={selv} alt='Selv app logo' />
                    <h2>{t("general.hello")}</h2>
                    <p>
                        {t("pages.company.signInConfirmation.signInSuccess")}
                    </p>
                    <Link to={nextStep}>
                        <Button>
                            {t("actions.continue")}
                        </Button>
                    </Link>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default SingInConfirmation;
