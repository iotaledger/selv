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
                setTitle('You have created a Future Commitment');
                break;
            case 'present':
                setTitle('You have created a Present Commitment');
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
                        <p>Thank you.</p>
                        
                        <div className='selv-wrapper'>
                            <img src={selv} alt='Selv app logo' />
                            <h4>Your credential has been sent to Selv.</h4>
                        </div>

                        <Link to={nextStep}>
                            <Button>
                                <h4>Continue</h4>
                            </Button>
                        </Link>
                    </div>
                </RandomGraphicElement>
            </div>
        </Layout>
    );
};

export default Confirmation;
