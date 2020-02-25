import React, { useState , useEffect } from "react";
import SocketIOClient from 'socket.io-client';
import axios from 'axios';
import { Button, Collapse, notification, message } from 'antd';
import { serverAPI, websocketURL } from '../config.json'
import useStep from "../utils/useStep";
import { flattenObject, encrypt, decrypt } from "../utils/helper";
import { Layout, Loading, AccountType, PrefilledForm, Checkbox } from "../components";
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
    'CompanyCreationDate',
    'CompanyNumber',
    'CompanyOwner'
]

const accountTypes = {
    label: 'Choose bank account type',
    error: 'Please choose an account type',
    accounts: ['Business checking account', 'Business savings account'],
    special: 'Brokerage account'
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
 * Component which will display a BankData.
 */
const BankData: React.FC = ({ history, match }: any) => {
    const { nextStep } = useStep(match); 
    const [accountType, setAccountType] = useState()
    const [status, setStatus] = useState('')
    const [channelId, setChannelId] = useState();
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
                console.log(messages.missing)
                message.error({ content: messages.connectionError, key: 'status', duration: 10 });
                notify('error', 'Error', messages.connectionError)
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
                console.log('Bank account data setup completed, redirecting to', nextStep)
                message.destroy()
                await localStorage.setItem('bank', 'completed')
                await localStorage.setItem('bankDetails', JSON.stringify({ ...data, ...payload }))
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

    async function continueNextStep(params: any) {
        if (accountStep < 4) {
            setAccountStep(accountStep => accountStep + 1)
            if (params.accountType) {
                setAccountType(params.accountType)
            }
        } else {
            const fields = {
                AccountType: accountType,
                BankName: 'SNS Bank'
            }
            await processValues(fields)
        }
    }

    function onChange(step: any) {
        accountStep > step && setAccountStep(Number(step))
    }

    const prefilledPersonalFormData: any = { dataFields: prefilledPersonalData }
    const prefilledCompanyFormData: any = { dataFields: prefilledCompanyData }
    const formData: any = { onSubmit: continueNextStep, status, messages, accountTypes, buttonText: 'Open bank account' }

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

export default BankData;