import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { Layout, Table, NextStepDrawer } from "../components";
import companies from "../incorporatedCompanies.json"

/**
 * Component which will display a CompanyIntro.
 */
const IncorporatedCompanies: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [nextStepCTA, setNextStep] = useState(true);

    useEffect(() => {
        async function setNextStepCTA() {
            const companyHouse = await localStorage.getItem('companyHouse')
            console.log('companyHouse', companyHouse)
            if (companyHouse && companyHouse === 'completed') {
                setNextStep(true)
            }
        } 
        setNextStepCTA()
    }, [])

    function onRowClick(data: any) {
        history.push(`/details/company/${data.id}`)
    }

    return (
        <Layout theme="companyHouse" match={match} step={2}>
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
                    <Table data={companies} onRowClick={onRowClick} />
                </div>
                {
                    nextStepCTA ? <NextStepDrawer link={'/progress/bank/prove/3'} /> : null
                }
            </React.Fragment>
        </Layout>
    );
}

export default IncorporatedCompanies;