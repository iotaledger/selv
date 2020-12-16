import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvSuccessBordered.svg';

/**
 * Component which will display a Confirmation.
 */
const Confirmation = ({ match }) => {
    const { nextStep, theme } = useStep(match);
    const [title, setTitle] = useState('');

    useEffect(() => {
        switch (theme) {
            case 'future':
                setTitle('Your future commitment is created');
                break;
            case 'present':
                setTitle('Your present commitment is created');
                break;
            default:
                setTitle('Congratulations');
                break;
            }
    }, [theme]);

    return (
        <Layout match={match} noFooter>
            <div className='confirmation-page'>
                <RandomGraphicElement elements={5}>
                    <div className='confirmation-content-wrapper'>
                        <h2>{title}</h2>
                        <p>Thank you for your pledge</p>
                        
                        <div className='selv-wrapper'>
                            <img src={selv} alt='Selv app logo' />
                            <h4>Your new credential is sent to Selv</h4>
                        </div>

                        <Link to={nextStep}>
                            <Button>
                                Continue
                            </Button>
                        </Link>
                    </div>
                </RandomGraphicElement>
            </div>
        </Layout>
    );
};

export default Confirmation;
