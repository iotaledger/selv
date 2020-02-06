import React from "react";
import { Link } from 'react-router-dom'
import { Button } from 'rsuite';
import useStep from "../utils/useStep";
import { Layout, Table } from "../components";
import companies from "../incorporatedCompanies.json"
import logo from '../assets/companyHouse.svg'

/**
 * Component which will display a CompanyIntro.
 */
const IncorporatedCompanies: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 

    function onRowClick(data: any) {
        history.push(`/details/company/${data.id}`)
    }

    return (
        <Layout theme="companyHouse" match={match}>
            <div className="companies-page-wrapper">
                <img src={logo} alt="Company House Logo" />
                <div className="companies-cta-wrapper">
                    <h4>Newly Incorporated Companies</h4>
                    <Link to={nextStep}>
                        <Button size="lg" appearance="subtle" active>
                            Register New Company
                        </Button> 
                    </Link>
                </div>
                <Table data={companies} onRowClick={onRowClick} />
            </div>
        </Layout>
    );
}

export default IncorporatedCompanies;