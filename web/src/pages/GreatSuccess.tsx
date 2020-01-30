import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import { Steps, Sidebar } from "../components";

/**
 * Component which will display a GreatSuccess.
 */
const GreatSuccess: React.FC = ({ match }: any) => {
    const { step, subStep, nextStep, subSteps, mainSteps } = useStep(match); 

    return (
        <div className="page-wrapper">
            <div className="main-section">
                <h1>GreatSuccess</h1>
                <Link to={nextStep}>
                    <Button size="lg">
                        Next Page
                    </Button> 
                </Link>
            </div>
            <Sidebar>
                <Steps 
                    steps={mainSteps} 
                    stepId={step} 
                    subSteps={<Steps steps={subSteps} stepId={subStep} />}
                />
            </Sidebar>
        </div>
    );
}

export default GreatSuccess;