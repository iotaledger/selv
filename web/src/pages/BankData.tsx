import React, { useState , useEffect } from "react";
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { Button, Collapse } from 'antd';
import { serverAPI, websocketURL } from '../config.json'
import useStep from "../utils/useStep";
import { flattenObject, encrypt, decrypt } from "../utils/helper";
import { Layout, AccountType, PrefilledForm, Checkbox } from "../components";
import checkmark from '../assets/bankCheckmark.svg'

const personalDataFields = [
    'FirstName',
    'LastName',
    'Date',
    'Nationality',
    'Birthplace',
    'Country',
    'Phone',
]

const companyFields = [
    'CompanyName',
    'CompanyAddress',
    'CompanyType',
    'CompanyBusiness',
]

/**
 * Component which will display a BankData.
 */
const BankData: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [password, setPassword] = useState();
    const [accountStep, setAccountStep] = useState(1)
    const [prefilledPersonalData, setPrefilledPersonalData] = useState({})
    const [prefilledCompanyData, setPrefilledCompanyData] = useState({})

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
            const personalData = personalDataFields.reduce((acc: any, entry: string) => 
                ({ ...acc, [entry]: flattenData[entry] }), {})
            setPrefilledPersonalData({ ...personalData, ...address })
            
            const companyData = companyFields.reduce((acc: any, entry: string) => 
                ({ ...acc, [entry]: flattenData[entry] }), {})
            setPrefilledCompanyData({ ...companyData })
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
            schemaName: 'BankAccount', 
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
                console.log('Bank account data setup completed, redirecting to', nextStep)
                await localStorage.setItem('companyHouse', 'completed')
                await localStorage.setItem('companyDetails', JSON.stringify({ ...data, ...payload }))
                history.push(nextStep)
            }
        })
    } 

    async function getChannelId() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
        setPassword(channelDetails?.password)
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

    function continueNextStep(params: any) {
        accountStep < 4 && setAccountStep(accountStep => accountStep + 1)
    }

    function onChange(step: any) {
        accountStep > step && setAccountStep(Number(step))
    }

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData }
    const prefilledCompanyFormData: any = { dataFields: prefilledCompanyData }
    const formData: any = { onSubmit: continueNextStep }

    return (
        <Layout match={match}>
            <div className="bank-data-page-wrapper">
                <h1>Open an account</h1>
                <Collapse 
                    onChange={onChange}
                    bordered={false} 
                    defaultActiveKey={[1]} 
                    activeKey={accountStep} 
                    accordion
                >
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                {
                                    accountStep > 1 ? <img src={checkmark} alt="" /> : <span>1</span>
                                }
                                <h3>Account type</h3>
                            </div>
                        )} 
                        showArrow={false}
                        key={1}
                    >
                        <AccountType { ...formData } />
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                {
                                    accountStep > 2 ? <img src={checkmark} alt="" /> : <span>2</span>
                                }
                                <h3>Business owner</h3>
                            </div>
                        )} 
                        showArrow={false}
                        disabled={accountStep < 2}
                        key={2}
                    >
                        {
                            Object.keys(prefilledPersonalFormData.dataFields).length && 
                            <PrefilledForm { ...prefilledPersonalFormData } />
                        }
                        <Button onClick={continueNextStep}>
                            Continue
                        </Button> 
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                {
                                    accountStep > 3 ? <img src={checkmark} alt="" /> : <span>3</span>
                                }
                                <h3>Company Details</h3>
                            </div>
                        )} 
                        showArrow={false}
                        disabled={accountStep < 3}
                        key={3}
                    >
                        {
                            Object.keys(prefilledCompanyFormData.dataFields).length && 
                            <PrefilledForm { ...prefilledCompanyFormData } />
                        }
                        <Button onClick={continueNextStep}>
                            Continue
                        </Button> 
                    </Collapse.Panel>
                    <Collapse.Panel
                        header={(
                            <div className="section-header">
                                <span>4</span>
                                <h3>Confirm</h3>
                            </div>
                        )} 
                        showArrow={false}
                        disabled={accountStep < 4}
                        key={4}
                    >
                        <Checkbox { ...formData } />
                    </Collapse.Panel>
                </Collapse>
            </div>
        </Layout>
    );
}

export default BankData;