import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout } from "../components";

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="scan-qr-page-wrapper">
                <h1>CompanyData</h1>
                <Link to={nextStep}>
                    <Button>
                        Next Page
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default CompanyData;