import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvSuccessBordered.svg';

const content: any = {
    health: {
        logo: 'Certificate sent to Selv App',
        title: 'Immunity certificate shared',
        text: 'Check your Selv app to accept your new credential. The credential will be stored locally on your device.'
    },
    agency: {
        logo: 'Credential sent to Selv App',
        title: 'Travel Visa acquired!',
        text: 'Your Covid immunity test has been shared, analysed and as a result your visa application has been approved. You are now valid and ready to travel!'
    }
}

/**
 * Component which will display a Confirmation.
 */
const Confirmation: React.FC = ({ match }: any) => {
    const { nextStep, theme } = useStep(match);

    return (
        <Layout match={match}>
            <RandomGraphicElement elements={5}>
                <div className='confirmation-page'>
                    <div className='selv-wrapper'>
                        <img src={selv} alt='Selv app logo' />
                        <h4>{theme && content[theme].logo}</h4>
                    </div>
                    <h2>{theme && content[theme].title}</h2>
                    <p>{theme && content[theme].text}</p>
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

export default Confirmation;
