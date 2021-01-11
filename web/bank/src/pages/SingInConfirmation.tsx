import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvBordered.svg';
import { useTranslation, Trans } from 'react-i18next';

/**
 * Component which will display a SingInConfirmation.
 */
const SingInConfirmation: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        async function getData () {
            const credentialsString: string | null = await localStorage.getItem('credentials');
            const credentials = credentialsString && await JSON.parse(credentialsString);
            const status = credentials?.status;
            if (!status || Number(status) !== 2) {
                history.goBack();
            }
        }
        getData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className='sign-in-confirmation'>
                    <img src={selv} alt='Selv app logo' />
                    <h2>{t("general.hello")}</h2>
                    <p>
                        You have now signed in without ever creating an account. No more need for endless account and password creations. In addition, you provided trustable information, which [business] can use without an expensive verification process. Verifying your data is nearly instant and completely free.
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
