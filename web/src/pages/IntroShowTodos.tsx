import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout, Steps } from "../components";

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { step, nextStep, mainSteps } = useStep(match); 
    
    return (
        <Layout theme="demo" match={match}>
            <React.Fragment>
                <h2>You are now Bob<br />and this is your to-do list</h2>
                <Steps 
                    steps={mainSteps} 
                    stepId={step} 
                />
                <Link to={nextStep}>
                    <Button type="primary">
                        Get things done
                    </Button> 
                </Link>
            </React.Fragment>
        </Layout>
    );
}

export default IntroShowTodos;