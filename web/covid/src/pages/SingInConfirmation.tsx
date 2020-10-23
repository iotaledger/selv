import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvBordered.svg';

/**
 * Component which will display a SingInConfirmation.
 */
const SingInConfirmation: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match);

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
                    <h2>Access Authorised</h2>
                    <p>
                        You don't need to create an account or choose a password. You have signed in to the National Health Authority website with the identity stored in your Selv app.
                    </p>
                    <Link to={nextStep}>
                        <Button>
                            Continue
                        </Button>
                    </Link>
                </div>
            </RandomGraphicElement>
        </Layout>
    );
};

export default SingInConfirmation;
