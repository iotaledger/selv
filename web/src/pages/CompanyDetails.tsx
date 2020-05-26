import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'rsuite';
import useStep from '../utils/useStep';
import useFetch from '../utils/useFetch';
import { Layout, Loading, NextStepDrawer } from '../components';
import back from '../assets/back.svg';
import { serverAPI } from '../config.json';

interface CompanyData {
    'CompanyNumber': string;
    'CompanyName': string;
    'CompanyCreationDate': string;
    'CompanyType': string;
    'CompanyStatus': string;
    'CompanyOwner': string;
    'CompanyAddress': string;
    'CompanyBusiness': string;
    'CompanyOwners': string[];
}

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ match }: any) => {
    const companyId = match?.params?.companyId;
    const [activeTab, setActiveTab] = useState('overview');
    const { nextStep } = useStep(match);
    const { response, loading } = useFetch(`${serverAPI}/company?company=${companyId}`);

    function handleSelect (activeKey: string) {
        setActiveTab(activeKey);
    }

    function renderActiveComponent () {
        switch (activeTab) {
        case 'people':
            return <People details={response?.data} />
        case 'overview':
        default:
            return <CompanyDetails details={response?.data} />
        }
    }

    return (
        <Layout match={match}>
            <React.Fragment>
                <div className='company-details-wrapper'>
                    {
                        loading ? <Loading /> : (
                            <React.Fragment>
                                <Link
                                    to={{
                                        pathname: `${match.url.replace(companyId, '').replace('details', 'list')}`,
                                        state: { nextStep }
                                    }}
                                    className='company-details-back bold'
                                >
                                    <img src={back} alt='' />&nbsp;&nbsp;&nbsp;Back
                                </Link>
                                <h2>{response?.data?.CompanyName}</h2>
                                <p className='company-number-wrapper'>
                                    Company number <span className='company-number'>{response?.data?.CompanyNumber}</span>
                                </p>
                                <CustomNav active={activeTab} onSelect={handleSelect} />
                                <div className='company-details'>
                                    {renderActiveComponent()}
                                </div>
                            </React.Fragment>
                        )
                    }
                </div>
                <NextStepDrawer link={nextStep} />
            </React.Fragment>
        </Layout>
    );
};

const CustomNav = ({ active, onSelect, ...props }: {
    active: string;
    onSelect: (activeKey: string) => void;
}) => {
    const styles = {
        marginBottom: 50
    };

    return (
        <Nav {...props} appearance='subtle' activeKey={active} onSelect={onSelect} style={styles}>
            <Nav.Item eventKey='overview'>Overview</Nav.Item>
            <Nav.Item eventKey='people'>People</Nav.Item>
        </Nav>
    );
};

const CompanyDetails = ({ details }: { details: CompanyData | undefined }) => {
    return (
        <React.Fragment>
            <div className='company-details-item'>
                <p>Registered office address</p>
                <p className='bold'>{details?.CompanyAddress}</p>
            </div>
            <div className='company-details-item'>
                <p>Company Type</p>
                <p className='bold'>{details?.CompanyType}</p>
            </div>
            <div className='company-details-item'>
                <p>Incorporated on</p>
                <p className='bold'>{details?.CompanyCreationDate}</p>
            </div>
            <div className='company-details-item'>
                <p>Company status</p>
                <p className={`status ${details?.CompanyStatus.toLowerCase()}`}>{details?.CompanyStatus}</p>
            </div>
            <div className='company-details-item'>
                <p>Nature of business</p>
                <p className='bold'>{details?.CompanyBusiness}</p>
            </div>
        </React.Fragment>
    );
};

const People = ({ details }: { details: CompanyData | undefined }) => {
    return (
        <React.Fragment>
            {
                details?.CompanyOwners?.length
                    ? details?.CompanyOwners?.map(person =>
                        <div key={person} className='company-details-item'>
                            <p className='bold'>{person}</p>
                        </div>)
                    : (<div className='company-details-item'>
                        <p className='bold'>{details?.CompanyOwner}</p>
                    </div>)
            }
        </React.Fragment>
    );
};

export default CompanyData;
