import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout, Table, NextStepDrawer } from "../components";
import { serverAPI } from '../config.json'

/**
 * Component which will display a IncorporatedCompanies.
 */
const IncorporatedCompanies: React.FC = ({ history, match, ...props }: any) => {
    const { nextStep } = useStep(match); 
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        async function setNextStepCTA() {
            const response = await axios.get(`${serverAPI}/company`)

            if (response && response?.data?.status === 'success') {
                const data = response?.data?.companies
                setCompanyData(data)
            }
        } 
        setNextStepCTA()
    }, [])

    function onRowClick(data: any) {
        history.push(`/progress/company/details/${match?.params?.step || 2}/${data.CompanyNumber}`)
    }

    return (
        <Layout match={match}>
            <React.Fragment>
                <div className="companies-page-wrapper">
                    <div className="companies-cta-wrapper">
                        <h2>Newly Incorporated Companies</h2>
                        {
                            props?.location?.state?.nextStep ? (
                                <Link to={props?.location?.state?.nextStep}>
                                    <Button>
                                        Continue to next step
                                    </Button> 
                                </Link>
                            ) : (
                                <Link to={nextStep}>
                                    <Button>
                                        Register new Company
                                    </Button> 
                                </Link>
                            ) 
                        }
                    </div>
                    <Table 
                        data={companyData} 
                        onRowClick={onRowClick} 
                        loading={companyData.length === 0}
                    />
                </div>
                <NextStepDrawer link={props?.location?.state?.nextStep} />
            </React.Fragment>
        </Layout>
    );
}

export default IncorporatedCompanies;