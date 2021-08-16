import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';

export default ({ link }: { link: string }) => {
    const [nextStep, setNextStep] = useState('');

    const { t } = useTranslation();

    useEffect(() => {
        async function setInfo() {
            const companyHouse = await localStorage.getItem('companyHouse');
            const bank = await localStorage.getItem('bank');
            const insurance = await localStorage.getItem('insurance');
            if (insurance && insurance === 'completed') {
                setNextStep('completed');
            } else if (bank && bank === 'completed') {
                setNextStep('insurance');
            } else if (companyHouse && companyHouse === 'completed') {
                setNextStep('bank');
            }
        }
        setInfo();
    }, []);

    if (!link) {
        return <React.Fragment />;
    }

    switch (nextStep) {
        case 'completed':
            return (
                <div className='next-step-drawer completed'>
                    <h3>{t("components.nextStepDrawer.companyNowActive")}</h3>
                    <p>
                        {t("components.nextStepDrawer.businessSetUp")}
                    </p>
                    <Link to={link}>
                        <Button>
                            {t("actions.finishDemo")}
                        </Button>
                    </Link>
                </div>
            );
        case 'insurance':
            return (
                <div className='next-step-drawer'>
                    <h3>{t("components.nextStepDrawer.companyNotActive")}</h3>
                    <p>
                        {t("components.nextStepDrawer.needLiabilityInsurance")}
                    </p>
                    <Link to={link}>
                        <Button>
                            {t("actions.getInsurance")}
                        </Button>
                    </Link>
                </div>
            );
        case 'bank':
            return (
                <div className='next-step-drawer'>
                    <h3>{t("components.nextStepDrawer.companyNotActive")}</h3>
                    <p>
                        {t("components.nextStepDrawer.needBankAndInsurance")}
                    </p>
                    <Link to={link}>
                        <Button>
                        {t("actions.openBankAccount")}
                        </Button>
                    </Link>
                </div>
            );
        default:
            return <React.Fragment />;
    }
};
