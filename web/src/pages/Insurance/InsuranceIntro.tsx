import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import useStep from '../../utils/useStep';
import { Steps, Sidebar } from '../../components';

/**
 * Component which will display a CompanyIntro.
 */
const CompanyIntro: React.FC = () => {
    const { step, nextStep, mainSteps } = useStep();

    return (
        <div className='page-wrapper'>
            <div className='main-section'>
                <h1>CompanyIntro</h1>
                <Link to={nextStep}>
                    <Button>
                        Next Page
                    </Button>
                </Link>
            </div>
            <Sidebar>
                <Steps
                    steps={mainSteps}
                    stepId={step}
                />
            </Sidebar>
        </div>
    );
};

export default CompanyIntro;
