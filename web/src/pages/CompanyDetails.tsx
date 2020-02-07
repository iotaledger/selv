import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Nav } from 'rsuite';
import useStep from "../utils/useStep";
import { Layout } from "../components";
import companies from "../incorporatedCompanies.json"
import back from '../assets/back.svg';

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
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="company-details-wrapper">
                <Link to={'/progress/companies/2'} className="company-details-back bold">
                    <img src={back} alt="" />&nbsp;&nbsp;&nbsp;Back
                </Link>
                <h2>{companyData?.name}</h2>
                <p className="company-number-wrapper">
                    Company number <span className="company-number">{companyData?.companyNumber}</span>
                </p>
                <CustomNav active={activeTab} onSelect={handleSelect} />
                <div className="company-details">
                    {renderActiveComponent()}
                </div>
            </div>
        </Layout>
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