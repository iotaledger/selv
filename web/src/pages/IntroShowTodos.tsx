import React, { useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout, Steps } from "../components";

/**
 * Component which will display a IntroShowTodos.
 */
const IntroShowTodos: React.FC = ({ match }: any) => {
    const { nextStep, mainSteps } = useStep(match); 
    
    useEffect(() => {
        const reset = async () => await localStorage.clear()
        reset()
    }, [])

    return (
        <Layout match={match}>
            <div className="demo-intro">
                <div className="todos">
                    <h1>Welcome to the Selv demo for setting up your own company.</h1>
                    <h3>Here is your to-do list for today:</h3>
                    <Steps 
                        steps={mainSteps} 
                        stepId={2} 
                    />
                    <Link to={nextStep}>
                        <Button type="primary">
                            Get things done
                        </Button> 
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default IntroShowTodos;