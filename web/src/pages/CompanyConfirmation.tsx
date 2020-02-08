import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";
import checkmark from '../assets/checkmark.svg'
import selv from '../assets/selv.svg'

/**
 * Component which will display a CompanyConfirmation.
 */
const CompanyConfirmation: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="company-confirmation-page">
                <img src={checkmark} alt="Success checkmark" />
                <h2>Congratulations,<br/>your company is now set up!</h2>
                <div className="selv-wrapper">
                    <img src={selv} alt="Selv app logo" />
                    <h3>Your new credentials are sent to Selv app</h3>
                </div>
                <Link to={nextStep}>
                    <Button>
                        Continue
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default CompanyConfirmation;
