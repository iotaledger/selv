import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
import { notification } from 'antd';
import useStep from '../utils/useStep';
import useInterval from '../utils/useInterval';
import evaluateCredential from '../utils/did';
import { encrypt, decrypt } from '../utils/helper';
import { serverAPI, websocketURL } from '../config.json';

const messages = {
    waiting: 'Waiting for Selv app...',
    connectionError: 'Connection error. Please try again!',
    missing: 'Credentials missing or not trusted',
    rejectCredentials: 'Credentials rejected by the user'
};

notification.config({ duration: 4 });

const notify = (type: string, message: string, description: string) => {
    switch (type) {
    case 'success':
        notification.success({ message, description });
        break;
    case 'warning':
        notification.warning({ message, description });
        break;
    case 'info':
        notification.info({ message, description });
        break;
    case 'error':
    default:
        notification.error({ message, description });
        break;
    }
};

const WebSocket = ({ history, match, schemaName, setStatus, setLoading, fields, generatedChannelId, warningMessage }: {
    history: any;
    match: any;
    schemaName?: string;
    setStatus: (status: string) => void;
    setLoading?: (status: boolean) => void;
    fields: any;
    generatedChannelId?: string;
    warningMessage: string;
}) => {
    const { nextStep } = useStep(match);
    const [password, setPassword] = useState('');
    const [channelId, setChannelId] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    let ioClient: any;

    useEffect(() => {
        async function connect() {
            if (channelId) {
                await connectWebSocket(channelId, fields);
            }
        }

        async function getData () {
            if (channelId) {
                const isMobileConnected = await checkConnectedStatus(channelId);
                if (isMobileConnected) {
                    setStatus(messages.waiting);
                }
            } else {
                await setChannel();
            }
        }

        connect();
        if (schemaName) { // Case of HealthAuthority/HR/ForeignBorder data
            getData();
        } else { // Case of ProveIdentity
            generatedChannelId && setChannelId(generatedChannelId);
            setIsRunning(true);
        }

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            setIsRunning(false);
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('createCredentialConfirmation');
            ioClient?.off('error');
            ioClient?.disconnect();
        };
    }, [channelId]); // eslint-disable-line react-hooks/exhaustive-deps

    async function connectWebSocket (channelId: string, data: object) {
        ioClient = SocketIOClient(websocketURL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 500,
            jsonp: false,
            secure: true,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        });

        ioClient.emit('registerDesktopClient', { channelId });

        if (schemaName) {
            const payload = {
                schemaName: schemaName,
                data: await encrypt(password, JSON.stringify(data)),
                url: websocketURL
            };
            ioClient.emit('createCredential', { channelId, payload });
        }

        const timeout = setTimeout(() => {
            if (setStatus) {
                setStatus(messages.connectionError);
                notify('error', 'Connection error', 'Please try again!');
            }
        }, 180000);

        ioClient.on('errorMessage', async (error: any) => {
            clearTimeout(timeout);
            console.error('Mobile client', error);
            setIsRunning(false);
            setLoading && setLoading(false);
            setStatus(messages.connectionError);
            notify('error', 'Mobile client error', error);
        });

        ioClient.on('rejectCredentials', async (message: any) => {
            clearTimeout(timeout);
            console.error('Credentials rejected', message);
            setIsRunning(false);
            setLoading && setLoading(false);
            setStatus(messages.rejectCredentials);
            notify('error', 'Credentials rejected', message);
        });

        ioClient.on('minAppVersion', async (message: any) => {
            notification.error({
                duration: 0,
                message: 'Outdated App detected', description: 'Please update your Selv App and try again'
            });     
        });

        ioClient.on('verifiablePresentation', async (payload: any) => {
            try {
                setIsRunning(false);
                clearTimeout(timeout);
                setStatus('Verifying credentials...');
                notify('info', 'Verification', 'Verifying credentials...');
                let verifiablePresentation = await decrypt(fields?.password, payload);
                verifiablePresentation = JSON.parse(verifiablePresentation);
                const evaluationResult: any = await evaluateCredential(verifiablePresentation, fields?.requestedCredentials, fields?.challenge);

                setStatus(evaluationResult.message);
                notify(evaluationResult.type, 'Verification result', evaluationResult.message);
                setLoading && setLoading(false);
                if (evaluationResult?.status === 2) { // DID_TRUSTED
                    notification.destroy();
                    await localStorage.setItem('credentials', JSON.stringify(evaluationResult));
                    history.push(nextStep);
                }
            } catch (e) {
                console.error(e);
                setLoading && setLoading(false);
                notification.destroy();
            }
        });

        ioClient.on('createCredentialConfirmation', async (encryptedPayload: any) => {
            clearTimeout(timeout);
            setIsRunning(false);
            let payload = await decrypt(password, encryptedPayload);
            payload = JSON.parse(payload);
            if (payload?.status === 'success') {
                notification.destroy();

                switch (schemaName) {
                    case 'VisaApplication':
                        await localStorage.setItem('foreignBorderAgency', 'completed');
                        break;
                    case 'TestResult':
                        await localStorage.setItem('healthAuthority', 'completed');
                        await localStorage.setItem('testDetails', JSON.stringify({ ...data, ...payload?.payload }));
                        break;
                    default:
                        break;
                }
                history.push(nextStep);
            }
        });
    }

    async function checkConnectedStatus (channelId: string) {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channelId}`);
        return response && response?.data?.status === 'success';
    }

    async function setChannel () {
        const storedChannelDetails = await localStorage.getItem('WebSocket_DID') || null;
        const channelDetails = storedChannelDetails && JSON.parse(storedChannelDetails);
        setPassword(channelDetails?.password);
        setChannelId(channelDetails?.channelId);
        if (channelDetails?.channelId) {
            const isMobileConnected = await checkConnectedStatus(channelDetails?.channelId);
            if (!isMobileConnected) {
                setIsRunning(true);
                notify('warning', 'Mobile app not connected', warningMessage);
            }
        } else {
            notify('error', 'No connection details', warningMessage);
        }
    }

    useInterval(async () => {
        const isMobileConnected = await checkConnectedStatus(channelId);
        if (isMobileConnected) {
            setIsRunning(false);
        }
    }, isRunning ? 3000 : null);

    return (
        <React.Fragment></React.Fragment>
    );
};

export default WebSocket;
