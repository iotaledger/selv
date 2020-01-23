import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import { Steps } from "../components";

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { step, nextStep, mainSteps } = useStep(match); 
    
    return (
        <div className="page-wrapper">
            <div className="main-section">
                <h2>You are now Bob<br />and this is your to-do list</h2>
                <Steps 
                    steps={mainSteps} 
                    stepId={step} 
                />
                <Link to={nextStep}>
                    <Button size="lg">
                        Get things done
                    </Button> 
                </Link>
            </div>
        </div>
    );
}

export default IntroShowTodos;