import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../utils/useStep';
import { Layout, RandomGraphicElement } from '../components';
import selv from '../assets/selvSuccessBordered.svg';

const content: any = {
    health: {
        logo: 'Credential sent to Selv App',
        title: 'Health credential shared',
        text: 'Your new credential has been added to the Selv app. The credential is stored locally on your device.'
    },
    agency: {
        logo: 'Credential sent to Selv App',
        title: 'Travel Visa acquired',
        text: 'Your health credential has been verified and your visa has been granted. You are now ready to travel!'
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
