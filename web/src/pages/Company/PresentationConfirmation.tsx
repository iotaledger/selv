import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../../utils/useStep';
import { Layout, RandomGraphicElement } from '../../components';
import selv from '../../assets/selvBordered.svg';
import { Trans, useTranslation } from 'react-i18next';
import { useGlobalState } from '../../context/globalState';

/**
 * Component which will display a PresentationConfirmation.
 */
const PresentationConfirmation: React.FC = () => {
    const { nextStep } = useStep();
    const { t } = useTranslation();
    const { state } = useGlobalState();

    return (
        <Layout>
            <RandomGraphicElement elements={5}>
                <div className='sign-in-confirmation'>
                    <img src={selv} alt='Selv app logo' />
                    <h2>{t("pages.company.presentationConfirmation.title")}</h2>
                    <p>
                        <Trans 
                            i18nKey="pages.company.presentationConfirmation.signInSuccess"
                            values={{
                                DID: state.COMPANY_HOUSE?.connectedDID
                            }}
                            components={{ bold: <strong /> }}    
                        />
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

export default PresentationConfirmation;
