import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import { Layout } from "../components";
import checkmark from '../assets/checkmark.svg'
import selv from '../assets/selv.svg'

/**
 * Component which will display a CompanyConfirmation.
 */
const CompanyConfirmation: React.FC = ({ match }: any) => {
    const [companyId, setCompanyId] = useState(null)

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
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="company-confirmation-page">
                <img src={checkmark} alt="Success checkmark" />
                <h2>Congratulations,<br/>your company is now set up!</h2>
                <div className="selv-wrapper">
                    <img src={selv} alt="Selv app logo" />
                    <h3>Your new credentials are sent to Selv app</h3>
                </div>
                <Link to={`/details/company/${companyId}`}>
                    <Button>
                        Continue
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default CompanyConfirmation;
