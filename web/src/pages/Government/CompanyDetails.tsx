import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStep from '../../utils/useStep';
import useFetch from '../../utils/useFetch';
import { Layout, Loading, NextStepDrawer } from '../../components';
import back from '../../assets/back.svg';
import config from '../../config.json';
import { useTranslation } from 'react-i18next';

interface ICompanyData {
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
const CompanyData: React.FC = () => {
    const location = useLocation();
    const companyId = new URLSearchParams(location.search).get('companyId');
    const { nextStep } = useStep();
    const { response, loading } = useFetch(`${config.serverAPI}/company?company=${companyId}`);

    const { t } = useTranslation();

    return (
        <Layout>
            <React.Fragment>
                <div className='company-details-wrapper'>
                    {
                        loading ? <Loading /> : (
                            <React.Fragment>
                                <Link
                                    to={{
                                        pathname: `${location.pathname.replace(companyId ?? '', '').replace('details', 'list')}`,
                                    }}
                                    state={{ nextStep }}
                                    className='company-details-back bold'
                                >
                                    <img src={back} alt='' />&nbsp;&nbsp;&nbsp;{t("actions.back")} 
                                </Link>
                                <h2>{response?.data?.CompanyName}</h2>
                                <p className='company-number-wrapper'>
                                    {t("pages.general.companyDetails.companyNumber")} <span className='company-number'>{response?.data?.CompanyNumber}</span>
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

const CompanyDetails = ({ details }: { details: ICompanyData | undefined }) => {

    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.officeAddress")}</p>
                <p className='bold'>{details?.CompanyAddress}</p>
            </div>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.companyType")}</p>
                <p className='bold'>{details?.CompanyType}</p>
            </div>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.incorporatedOn")}</p>
                <p className='bold'>{details?.CompanyCreationDate}</p>
            </div>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.companyOwner")}</p>
                <p className='bold'>{details?.CompanyOwner}</p>
            </div>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.natureOfBusiness")}</p>
                <p className='bold'>{details?.CompanyBusiness}</p>
            </div>
            <div className='company-details-item'>
                <p>{t("pages.general.companyDetails.companyStatus")}</p>
                <p className={`status ${details?.CompanyStatus.toLowerCase()}`}>{t("general." + details?.CompanyStatus.toLocaleLowerCase())}</p>
            </div>
        </React.Fragment>
    );
};

export default CompanyData;
