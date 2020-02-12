import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";
import checkmark from '../assets/companyCheckmark.svg'
import selv from '../assets/selv.svg'

/**
 * Component which will display a Confirmation.
 */
const Confirmation: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match);
    const [companyId, setCompanyId] = useState('')

    useEffect(() => {
        async function getCompanyId() {
            const companyDetails = await localStorage.getItem('companyDetails')
            if (companyDetails) {
                setCompanyId((JSON.parse(companyDetails))?.CompanyNumber)
            }
        } 
        getCompanyId();
    }, [])

    return (
        <Layout match={match}>
            <div className="company-confirmation-page">
                <img src={checkmark} alt="Success checkmark" />
                <h2>Congratulations, your company is now set up!</h2>
                <p>You are now the proud owner of your new company. From now on you’ll be able to prove that you have a directorship position at your newly found company. Open up Selv in order to receive a signed credential you can use to act on behalf of your company.</p>
                <div className="selv-wrapper">
                    <img src={selv} alt="Selv app logo" />
                    <h3>Your new credential is sent to Selv</h3>
                </div>
                <Link to={nextStep.replace(':companyId', companyId)}>
                    <Button>
                        Continue
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default Confirmation;
