import React, { useState , useEffect } from "react";
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { serverAPI, websocketURL } from '../config.json'
import useStep from "../utils/useStep";
import { flattenObject, encrypt, decrypt } from "../utils/helper";
import { Layout, Form, PrefilledForm } from "../components";

const password = 'HerpaDerperDerpaHerpaDerperDerpa'

interface ICompanyData {
    "CompanyNumber": string;
    "CompanyName": string;
    "CompanyCreationDate": string;
    "CompanyType": string;
    "CompanyStatus": string;
    "CompanyOwner": string;
    "CompanyAddress": string;
    "CompanyBusiness": string;
    "CompanyOwners": string[];
}

const prefilledFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone',
]

const emptyFields = [
    'CompanyName',
    'CompanyAddress',
    'CompanyType',
    'CompanyBusiness',
]

const shortFields = ['Date', 'Nationality']

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
    CompanyName: 'Company name',
    CompanyAddress: 'Company address',
    CompanyType: 'Company type',
    CompanyBusiness: 'Nature of business'
}

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [prefilledData, setPrefilledData] = useState({})

    let ioClient: any

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials')
            const credentials = credentialsString && await JSON.parse(credentialsString)
            const status = credentials?.status
            if (!status || Number(status) !== 2) {
                console.log('Credentials missing or not trusted')
                history.goBack()
            }
            const flattenData = flattenObject(credentials?.data)
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` }
            const result = prefilledFields.reduce((acc: any, entry: string) => 
                ({ ...acc, [entry]: flattenData[entry] }), {})
            
            setPrefilledData({ ...result, ...address })
        } 
        getData()

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('createCredentialConfirmation');
            ioClient?.off('error');
            ioClient?.disconnect();
        }
    }, [])


    async function connectWebSocket(channelId: string, data: object) {
        ioClient = SocketIOClient(websocketURL, {
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        })

        ioClient.emit('registerDesktopClient', { channelId })

        console.log('emit createCredential')
        const payload = {
            schemaName: 'Company', 
            data: await encrypt(password, JSON.stringify(data))
        }
        ioClient.emit('createCredential', { channelId, payload })
    
        ioClient.on('error', async (error: any) => {
            console.error('WebSocket error', error)
        })

        ioClient.on('createCredentialConfirmation', async (encryptedPayload: any) => {
            let payload = await decrypt(password, encryptedPayload)
            payload = JSON.parse(payload)
            console.log('createCredentialConfirmation', payload)
            if (payload?.status === 'success') {
                console.log('Company data setup completed, redirecting to', nextStep)
                await localStorage.setItem('companyHouse', 'completed')
                await localStorage.setItem('companyDetails', JSON.stringify({ ...data, ...payload }))
                history.push(nextStep)
            }
        })
    } 

    async function getChannelId() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
        return channelDetails?.channelId
    }

    async function checkConnectedStatus(channelId: string) {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channelId}`)
        return response && response?.data?.status === 'success'
    }

    async function processValues(fields: object) {
        console.log('page got data', fields)
        const channelId = await getChannelId()
        console.log('got channelId', channelId)
        if (channelId) {
            const isMobileConnected = await checkConnectedStatus(channelId)
            console.log('isMobileConnected', isMobileConnected)
            if (isMobileConnected) {
                await connectWebSocket(channelId, fields);
            }
        } else {
            console.log('No websocket connection details')
        }
    }

    const prefilledFormData: any = { dataFields: prefilledData, labels, shortFields }
    const emptyFormData: any = { dataFields: emptyFields, labels, processValues }

    return (
        <Layout theme="companyHouse" match={match} step={2}>
            <div className="company-data-page-wrapper">
                <h2>Set up a private limited company</h2>
                <h3 className="section-header">Business owner</h3>
                {
                    Object.keys(prefilledFormData.dataFields).length && 
                    <PrefilledForm { ...prefilledFormData } />
                }
                <p className="notice bold small">Credentials provided by Selv ID</p>

                <h3 className="section-header">Company Details</h3>
                <Form { ...emptyFormData } />
            </div>
        </Layout>
    );
}

export default CompanyData;