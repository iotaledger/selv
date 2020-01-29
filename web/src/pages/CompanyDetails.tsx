import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button, Nav } from 'rsuite';
import useStep from "../utils/useStep";
import { Steps, Sidebar } from "../components";
import companies from "../incorporatedCompanies.json"
import logo from '../assets/companyHouse.svg'

interface CompanyData {
    "id": string;
    "name": string;
    "date": string;
    "type": string;
    "status": string;
    "companyNumber": string;
    "registeredAddress": string;
    "natureOfBusiness": string;
    "people": string[];
    "tangle": {
        "root": string;
    };
}

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ match }: any) => {
    const [companyData, setCompanyData] = useState();
    const [activeTab, setActiveTab] = useState('overview');
    const { mainSteps } = useStep(match); 
    const companyId = match?.params?.companyId;

    useEffect(() => {
        async function setCompanyInfo(companyId: string) {
            const data: CompanyData | undefined = await companies.find(company => company.id === companyId)
            setCompanyData(data)
        } 
        setCompanyInfo(companyId)
    }, [companyId])

    function handleSelect(activeKey: string) {
        setActiveTab(activeKey);
    }

    function renderActiveComponent() {
        switch (activeTab) {
            case 'people':
                return <People details={companyData} />;
            case 'tangle':
                return <TangleData details={companyData} />;
            case 'overview':
            default:
                return <CompanyDetails details={companyData} />;
        }
    }

    return (
        <div className="page-wrapper">
            <div className="main-section">
                <div className="company-details-page-wrapper">
                    <img src={logo} alt="Company House Logo" />
                    <Link to={'/progress/companies/2'}>
                        <Button size="lg" appearance="subtle" active>
                            Back
                        </Button> 
                    </Link>
                    <div className="company-details-wrapper">
                        <h2>{companyData?.name}</h2>
                        <p>Company number <strong>{companyData?.companyNumber}</strong></p>
                        <CustomNav active={activeTab} onSelect={handleSelect} />
                        <div className="company-details">
                            {renderActiveComponent()}
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar>
                <Steps 
                    steps={mainSteps} 
                    stepId={2} 
                />
            </Sidebar>
        </div>
    );
}

const CustomNav = ({ active, onSelect, ...props }: {
    active: string;
    onSelect: (activeKey: string) => void;
}) => {
    const styles = {
        marginBottom: 50
    };

    return (
        <Nav {...props} appearance="subtle" activeKey={active} onSelect={onSelect} style={styles}>
            <Nav.Item eventKey="overview">Overview</Nav.Item>
            <Nav.Item eventKey="people">People</Nav.Item>
            <Nav.Item eventKey="tangle">Tangle</Nav.Item>
        </Nav>
    );
};

const CompanyDetails = ({ details }: { details: CompanyData | undefined }) => {
    return (
        <React.Fragment>
            <div className="company-details-item">
                <p>Registered office address</p>
                <p><strong>{details?.registeredAddress}</strong></p>
            </div>
            <div className="company-details-item">
                <p>Incorporated on</p>
                <p><strong>{details?.date}</strong></p>
            </div>
            <div className="company-details-item">
                <p>Nature of business</p>
                <p><strong>{details?.natureOfBusiness}</strong></p>
            </div>
            <div className="company-details-item">
                <p>Company Type</p>
                <p><strong>{details?.type}</strong></p>
            </div>
            <div className="company-details-item">
                <p>Company status</p>
                <p><strong>{details?.status}</strong></p>
            </div>
        </React.Fragment>
    )
} 

const People = ({ details }: { details: CompanyData | undefined }) => {
    return (
        <React.Fragment>
            {
                details?.people?.map(person => 
                    <div key={person} className="company-details-item">
                        <p>{person}</p>
                    </div>
                )
            }
        </React.Fragment>
    )
} 

const TangleData = ({ details }: { details: CompanyData | undefined }) => {
    return (
        <React.Fragment>
            <div className="company-details-item">
                <p>{details?.tangle?.root}</p>
            </div>
        </React.Fragment>
    )
} 

export default CompanyData;