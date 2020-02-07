import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import { Layout, Table } from "../components";
import companies from "../incorporatedCompanies.json"

/**
 * Component which will display a CompanyIntro.
 */
const IncorporatedCompanies: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 

    function onRowClick(data: any) {
        history.push(`/details/company/${data.id}`)
    }

    return (
        <Layout theme="companyHouse" match={match} step={2} >
            <div className="companies-page-wrapper">
                <div className="companies-cta-wrapper">
                    <h2>Newly Incorporated Companies</h2>
                    <Link to={nextStep}>
                        <Button size="lg" appearance="subtle" active>
                            Register new Company
                        </Button> 
                    </Link>
                </div>
                <Table data={companies} onRowClick={onRowClick} />
            </div>
        </Layout>
    );
}

export default IncorporatedCompanies;