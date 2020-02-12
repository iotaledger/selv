import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout, Table, NextStepDrawer } from "../components";
import { serverAPI } from '../config.json'

/**
 * Component which will display a CompanyIntro.
 */
const IncorporatedCompanies: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [nextStepCTA, setNextStep] = useState(false);
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        async function setNextStepCTA() {
            const response = await axios.get(`${serverAPI}/company`)

            if (response && response?.data?.status === 'success') {
                const data = response?.data?.companies
                setCompanyData(data)
            }

            const companyHouse = await localStorage.getItem('companyHouse')
            console.log('companyHouse', companyHouse)
            if (companyHouse && companyHouse === 'completed') {
                setNextStep(true)
            }
        } 
        setNextStepCTA()
    }, [])

    function onRowClick(data: any) {
        history.push(`/details/company/${data.CompanyNumber}`)
    }

    return (
        <Layout match={match}>
            <React.Fragment>
                <div className="companies-page-wrapper">
                    <div className="companies-cta-wrapper">
                        <h2>Newly Incorporated Companies</h2>
                        {
                            nextStepCTA ? null : (
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
                {
                    nextStepCTA ? <NextStepDrawer link={'/progress/bank/prove/3'} /> : null
                }
            </React.Fragment>
        </Layout>
    );
}

export default IncorporatedCompanies;