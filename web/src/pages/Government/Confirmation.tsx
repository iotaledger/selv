import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { getCompanyId } from '../../utils/helper';
import useStep from '../../utils/useStep';
import { Layout, RandomGraphicElement } from '../../components';
import selv from '../../assets/selvSuccessBordered.svg';
import { useTranslation } from 'react-i18next';

/**
 * Component which will display a Confirmation.
 */
const Confirmation: React.FC = () => {
    const { nextStep, theme } = useStep();

    const { t } = useTranslation();

    return (
        <Layout>
            <RandomGraphicElement elements={5}>
                <div className='confirmation-page'>
                    <div className='selv-wrapper'>
                        <img src={selv} alt='Selv app logo' />
                        <h4>{t("pages.government.confirmation.confirmation")}</h4>
                    </div>
                    <h2>{t("pages.government.confirmation.title")}</h2>
                    <p>{t("pages.government.confirmation.success")}</p>
                    <Link to={nextStep}>
                        <Button>
                            {t("pages.government.confirmation.nextStep") }
                        </Button>
                    </Link>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default Confirmation;
