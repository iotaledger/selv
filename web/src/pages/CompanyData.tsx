import React, { useState , useEffect } from "react";
import { Link } from 'react-router-dom'
import { Button } from 'antd';
import useStep from "../utils/useStep";
import { flattenObject } from "../utils/helper";
import { Layout, PrefilledUserDataForm } from "../components";

const prefilledFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone',
]

const labels = {
    FirstName: 'First Name',
    LastName: 'Last Name',
    Date: 'Date of birth',
    Nationality: 'Nationality',
    Gender: 'Gender',
    Birthplace: 'Birthplace',
    Country: 'Country of residence',
    Phone: 'Phone number',
    Address: 'Address',
}

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ match }: any) => {
    const { nextStep } = useStep(match); 
    const [prefilledData, setPrefilledData] = useState({})

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials')
            const credentials = credentialsString && await JSON.parse(credentialsString)
            const flattenData = flattenObject(credentials?.data)
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` }
            const result = prefilledFields.reduce((acc: any, entry: string) => 
                ({ ...acc, [entry]: flattenData[entry] }), {})
            
            setPrefilledData({ ...result, ...address })
        } 
        getData()
    }, [])

    const data: any = { dataFields: prefilledData, labels }

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="scan-qr-page-wrapper">
                <h1>CompanyData</h1>
                {
                    Object.keys(data.dataFields).length && <PrefilledUserDataForm { ...data } />
                }
                <Link to={nextStep}>
                    <Button>
                        Next Page
                    </Button> 
                </Link>
            </div>
        </Layout>
    );
}

export default CompanyData;