import React from "react";
import useStep from "../utils/useStep";
import Steps from "../components/Steps";
/**
 * Component which will display a IntroShowCTA.
 */

const IntroShowCTA = ({ match }: any) => {
    const { step, subStep, nextStep, subSteps, mainSteps } = useStep(match);  

    return (
        <div className="">
            IntroShowCTA
            <Steps 
                steps={mainSteps} 
                stepId={step} 
                subSteps={<Steps steps={subSteps} stepId={subStep} />}
            />
        </div>
    );
}

export default IntroShowCTA;