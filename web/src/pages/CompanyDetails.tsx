import React from "react";
import { Link } from 'react-router-dom'
import { Button, Nav } from 'rsuite';
import useStep from "../utils/useStep";
import { Steps, Sidebar } from "../components";
import companies from "../incorporatedCompanies.json"
import logo from '../assets/companyHouse.svg'

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ match }: any) => {
    const { step, subStep, nextStep, subSteps, mainSteps } = useStep(match); 
    const companyData = companies.find(company => company.id === match?.params?.companyId)
    console.log('companyData', companyData)

    return (
        <div className="page-wrapper">
            <div className="main-section">
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
                </div>
            </div>
            <Sidebar>
                <Steps 
                    steps={mainSteps} 
                    stepId={step} 
                    subSteps={<Steps steps={subSteps} stepId={subStep} />}
                />
            </Sidebar>
        </div>
    );
}

export default CompanyData;