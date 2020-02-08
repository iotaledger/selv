import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";

/**
 * Component which will display a SingInConfirmation.
 */
const SingInConfirmation: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="sign-in-confirmation">
                <h3>Hello, Bob!</h3>
                <Link to={nextStep}>
                    <Button>
                        Set up a new company
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default SingInConfirmation;