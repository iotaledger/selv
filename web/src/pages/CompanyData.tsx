import React, { useState , useEffect } from "react";
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { notification, message } from 'antd';
import { serverAPI, websocketURL } from '../config.json'
import useStep from "../utils/useStep";
import { flattenObject, encrypt, decrypt } from "../utils/helper";
import { Layout, Loading, Form, PrefilledForm } from "../components";

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

const labels = {
    CompanyName: 'Company name',
    CompanyAddress: 'Company address',
    CompanyType: 'Company type',
    CompanyBusiness: 'Nature of business'
}

const messages = {
    waiting: 'Waiting for Selv app...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted'
}

const notify = (type: string, message: string, description: string) => {
    return type === 'error' 
        ? notification.error({ message, description })
        : notification.warning({ message, description });
};

/**
 * Component which will display a CompanyData.
 */
const CompanyData: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [status, setStatus] = useState('')
    const [prefilledData, setPrefilledData] = useState({})
    const [password, setPassword] = useState();
    const [channelId, setChannelId] = useState();

    let ioClient: any

    useEffect(() => {
        async function getData() {
            const credentialsString: string | null = await localStorage.getItem('credentials')
            const credentials = credentialsString && await JSON.parse(credentialsString)
            const status = credentials?.status
            if (!status || Number(status) !== 2) {
                console.log(messages.missing)
                message.error({ content: messages.connectionError, key: 'status', duration: 10 });
                notify('error', 'Error', messages.connectionError)
                history.goBack()
            }
            const flattenData = flattenObject(credentials?.data)
            const address = { Address: `${flattenData.Street} ${flattenData.House}, ${flattenData.City}, ${flattenData.Country}, ${flattenData.Postcode}` }
            const result = prefilledFields.reduce((acc: any, entry: string) => 
                ({ ...acc, [entry]: flattenData[entry] }), {})
            
            setPrefilledData({ ...result, ...address })

            await setChannel()
        } 
        getData()

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('createCredentialConfirmation');
            ioClient?.off('error');
            ioClient?.disconnect();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    async function connectWebSocket(channelId: string, data: object) {
        ioClient = SocketIOClient(websocketURL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            secure: true,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        })

        ioClient.emit('registerDesktopClient', { channelId })

        const payload = {
            schemaName: 'Company', 
            data: await encrypt(password, JSON.stringify(data))
        }
        ioClient.emit('createCredential', { channelId, payload })
        
        const timeout = setTimeout(() => { 
            setStatus(messages.connectionError)
            message.error({ content: messages.connectionError, key: 'status' });
            notify('error', 'Connection error', 'Please try again!')
        }, 10000)
    
        ioClient.on('errorMessage', async (error: any) => {
            clearTimeout(timeout)
            console.error('Mobile client', error)
            setStatus(messages.connectionError)
            message.error({ content: messages.connectionError, key: 'status' });
            notify('error', 'Mobile client error', error)
        })

        ioClient.on('createCredentialConfirmation', async (encryptedPayload: any) => {
            clearTimeout(timeout)
            let payload = await decrypt(password, encryptedPayload)
            payload = JSON.parse(payload)
            console.log('createCredentialConfirmation', payload)
            if (payload?.status === 'success') {
                console.log('Company data setup completed, redirecting to', nextStep)
                message.destroy()
                await localStorage.setItem('companyHouse', 'completed')
                await localStorage.setItem('companyDetails', JSON.stringify({ ...data, ...payload }))
                history.push(nextStep)
            }
        })
    } 

    async function setChannel() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
        setPassword(channelDetails?.password)
        setChannelId(channelDetails?.channelId)
        if (channelDetails?.channelId) {
            const isMobileConnected = await checkConnectedStatus(channelDetails?.channelId)
            if (!isMobileConnected) {
                notify('warning', 'Mobile app not connected', 'Please return to the previous page and scan the QR code with your Selv app')
            }
        } else {
            notify('error', 'No connection details', 'Please return to the previous page and scan the QR code with your Selv app')
        }
    }

    async function checkConnectedStatus(channelId: string) {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channelId}`)
        return response && response?.data?.status === 'success'
    }

    async function processValues(fields: object) {
        await setChannel()
        if (channelId) {
            const isMobileConnected = await checkConnectedStatus(channelId)
            if (isMobileConnected) {
                setStatus(messages.waiting)
                message.loading({ content: messages.waiting, key: 'status', duration: 0 });
                await connectWebSocket(channelId, fields);
            }
        }
    }

    const prefilledFormData: any = { dataFields: prefilledData }
    const emptyFormData: any = { dataFields: emptyFields, labels, processValues, status, messages }

    return (
        <Layout match={match}>
            <div className="company-data-page-wrapper">
                <h2>Set up a private limited company</h2>
                <h3 className="section-header">Business owner</h3>
                {
                    Object.keys(prefilledFormData.dataFields).length && 
                    <PrefilledForm { ...prefilledFormData } />
                }

                <h3 className="section-header">Company Details</h3>
                <Form { ...emptyFormData } />
                {
                    status && (
                        <div className="loading">
                            <p className="bold">{status}</p>
                            {
                                status === messages.waiting && <Loading />
                            }
                        </div>
                    )
                }
            </div>
        </Layout>
    );
}

export default CompanyData;