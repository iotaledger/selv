import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import Steps from "../components/Steps";

/**
 * Component which will display a IntroShowQR.
 */
const IntroShowQR: React.FC = ({ match }: any) => {
    const { step, subStep, nextStep, subSteps, mainSteps } = useStep(match); 
    
    return (
        <div className="">
            IntroShowQR
            <Link to={nextStep}>
                <Button size="lg">
                    Next Page
                </Button> 
            </Link>
            <Steps 
                steps={mainSteps} 
                stepId={step} 
                subSteps={<Steps steps={subSteps} stepId={subStep} />}
            />
        </div>
    );
}

export default IntroShowQR;