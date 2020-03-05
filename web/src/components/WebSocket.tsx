import React, { useState , useEffect } from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
import { notification, message } from 'antd';
import { getCompanyId } from '../utils/helper'
import useStep from "../utils/useStep";
import useInterval from "../utils/useInterval";
import { flattenObject, encrypt, decrypt } from "../utils/helper";
import { serverAPI, websocketURL } from '../config.json'

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

const WebSocket = ({ history, match, schemaName, setStatus, fields }: {
    history: any;
    match: any;
    schemaName: string;
    setStatus: (status: string) => void;
    fields: object;
}) => {
    const { nextStep } = useStep(match); 
    const [password, setPassword] = useState();
    const [channelId, setChannelId] = useState();
    const [isRunning, setIsRunning] = useState(false);

    let ioClient: any

    useEffect(() => {
        async function getData() {
            if (channelId) {
                const isMobileConnected = await checkConnectedStatus(channelId)
                if (isMobileConnected) {
                    setStatus(messages.waiting)
                    message.loading({ content: messages.waiting, key: 'status', duration: 0 });
                    await connectWebSocket(channelId, fields);
                }
            } else {
                await setChannel()
            }
        } 
        getData()

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            setIsRunning(false);
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('createCredentialConfirmation');
            ioClient?.off('error');
            ioClient?.disconnect();
        }
    }, [channelId]) // eslint-disable-line react-hooks/exhaustive-deps

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
            schemaName: schemaName, 
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
            setIsRunning(false);
            setStatus(messages.connectionError)
            message.error({ content: messages.connectionError, key: 'status' });
            notify('error', 'Mobile client error', error)
        })

        ioClient.on('createCredentialConfirmation', async (encryptedPayload: any) => {
            clearTimeout(timeout)
            setIsRunning(false);
            let payload = await decrypt(password, encryptedPayload)
            payload = JSON.parse(payload)
            console.log('createCredentialConfirmation', payload)
            if (payload?.status === 'success') {
                console.log(`${schemaName} data setup completed, redirecting to ${nextStep}`)
                message.destroy()

                switch (schemaName) {
                    case 'Insurance':
                        await localStorage.setItem('insurance', 'completed')
                        await updateCompanyStatus()
                    case 'BankAccount':
                        await localStorage.setItem('bank', 'completed')
                        await localStorage.setItem('bankDetails', JSON.stringify({ ...data, ...payload }))
                    case 'Company':
                        await localStorage.setItem('companyHouse', 'completed')
                        await localStorage.setItem('companyDetails', JSON.stringify({ ...data, ...payload.payload }))
                    default:
                        break;
                }
                history.push(nextStep)
            }
        })
    }

    async function checkConnectedStatus(channelId: string) {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channelId}`)
        return response && response?.data?.status === 'success'
    }

    async function setChannel() {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
        setPassword(channelDetails?.password)
        setChannelId(channelDetails?.channelId)
        if (channelDetails?.channelId) {
            const isMobileConnected = await checkConnectedStatus(channelDetails?.channelId)
            if (!isMobileConnected) {
                setIsRunning(true)
                notify('warning', 'Mobile app not connected', 'Please return to the previous page and scan the QR code with your Selv app')
            }
        } else {
            notify('error', 'No connection details', 'Please return to the previous page and scan the QR code with your Selv app')
        }
    }

    async function updateCompanyStatus() {
        const companyId = await getCompanyId()
        const response = await axios.get(`${serverAPI}/activate?company=${companyId}`)
        console.log(`Company ${companyId} activated. Status: ${response?.data?.status}`)
    }

    useInterval(async () => {
        const isMobileConnected = await checkConnectedStatus(channelId)
        console.log('checkConnectedStatus', channelId, isMobileConnected)
        if (isMobileConnected) {
            setIsRunning(false)
            await connectWebSocket(channelId, fields);
        } else {
            notify('warning', 'Mobile app not connected', 'Please return to the previous page and scan the QR code with your Selv app')
        }
    }, isRunning ? 7000 : null);

    return (
        <React.Fragment></React.Fragment>
    );
};

export default WebSocket