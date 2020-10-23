import React from 'react';
import { Link } from 'react-router-dom';
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
    const { nextStep } = useStep(match);
    const { response, loading } = useFetch(`${serverAPI}/company?company=${companyId}`);

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
                                <div className='company-details'>
                                    <CompanyDetails details={response?.data} />
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
                <p>Company owner</p>
                <p className='bold'>{details?.CompanyOwner}</p>
            </div>
            <div className='company-details-item'>
                <p>Nature of business</p>
                <p className='bold'>{details?.CompanyBusiness}</p>
            </div>
            <div className='company-details-item'>
                <p>Company status</p>
                <p className={`status ${details?.CompanyStatus.toLowerCase()}`}>{details?.CompanyStatus}</p>
            </div>
        </React.Fragment>
    );
};

export default CompanyData;
