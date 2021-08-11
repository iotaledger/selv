import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SocketIOClient from 'socket.io-client';
import { notification } from 'antd';
import useStep from '../utils/useStep';
import useInterval from '../utils/useInterval';
import evaluateCredential from '../utils/did';
import { getCompanyId, encrypt, decrypt } from '../utils/helper';
import { serverAPI, websocketURL } from '../config.json';
import { useTranslation } from 'react-i18next';

// const messages = {
//     waiting: 'Waiting for Selv app...',
//     connectionError: 'Connection error. Please try again!',
//     missing: 'Credentials missing or not trusted'
// };

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

const WebSocket = ({ history, match, schemaName, setStatus, setLoading, fields, messages, generatedChannelId }: {
    history: any;
    match: any;
    schemaName?: string;
    setStatus: (status: string) => void;
    setLoading?: (status: boolean) => void;
    messages: { [ key: string ]: string; };
    fields: any;
    generatedChannelId?: string;
}) => {
    const { nextStep } = useStep(match);
    const [password, setPassword] = useState('');
    const [channelId, setChannelId] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [counter, setCounter] = useState(0);

    const { t } = useTranslation();

    let ioClient: any;

    useEffect(() => {
        async function connect() {
            if (channelId) {
                await connectWebSocket(channelId, fields);
            }
        }

        async function getData() {
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
        if (schemaName) { // Case of Company/Bank/Insurance data
            getData();
        } else { // Case of ProveIdentity
            setChannelId(generatedChannelId || '');
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
                notify('error', t("general.messages.connectionError"), t("components.websocket.connectionErrorDescription"));
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
                setStatus(messages.verifying);

                notify('info', t("components.websocket.verification"), t("general.messages.verifying"));
                let verifiablePresentation = await decrypt(fields?.password, payload);
                verifiablePresentation = JSON.parse(verifiablePresentation);
                const evaluationResult: any = await evaluateCredential(verifiablePresentation, fields?.requestedCredentials, fields?.challenge);

                setStatus("components.websocket.didLibraryResults." +evaluationResult.message);
                notify(evaluationResult.type, t("components.websocket.verificationResult"), t("components.websocket.didLibraryResults." +evaluationResult.message));
                setLoading && setLoading(false);

                if (evaluationResult?.status === 2) { // DID_TRUSTED
                    await localStorage.setItem('credentials', JSON.stringify(evaluationResult));
                    history.push(nextStep);
                }
            } catch (e) {
                console.error(e);
                setLoading && setLoading(false);
            }
        });

        ioClient.on('createCredentialConfirmation', async (encryptedPayload: any) => {
            clearTimeout(timeout);
            setIsRunning(false);
            let payload = await decrypt(password, encryptedPayload);
            payload = JSON.parse(payload);
            if (payload?.status === 'success') {
                switch (schemaName) {
                    case 'Insurance':
                        await localStorage.setItem('insurance', 'completed');
                        await localStorage.setItem('insuranceDetails', JSON.stringify({ ...data, ...payload?.payload }));
                        await updateCompanyStatus();
                        break;
                    case 'BankAccount':
                        await localStorage.setItem('bank', 'completed');
                        await localStorage.setItem('bankDetails', JSON.stringify({ ...data, ...payload?.payload }));
                        break;
                    case 'Company':
                        await localStorage.setItem('companyHouse', 'completed');
                        await localStorage.setItem('companyDetails', JSON.stringify({ ...data, ...payload?.payload }));
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
                notify('warning', t("components.websocket.warningInfo"), t("components.websocket.warningDescription"));
            }
        } else {
            notify('error', t("components.websocket.errorInfo"), t("components.websocket.warningDescription"));
        }
    }

    async function updateCompanyStatus () {
        const companyId = await getCompanyId();
        await axios.get(`${serverAPI}/activate?company=${companyId}`);
    }

    useInterval(async () => {
        const isMobileConnected = await checkConnectedStatus(channelId);
        if (isMobileConnected) {
            setIsRunning(false);
        } else {
            if (counter === 7) {
                notify('warning', t("components.websocket.warningInfo"), t("components.websocket.warningDescription"));
                setCounter(0);
            } else {
                setCounter(counter => counter + 1);
            }
        }
    }, isRunning ? 3000 : null);

    return (
        <React.Fragment></React.Fragment>
    );
};

export default WebSocket;
