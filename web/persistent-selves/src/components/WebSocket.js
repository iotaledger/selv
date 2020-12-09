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
    missing: 'Credentials missing or not trusted'
};

const notify = (type, message, description) => {
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

const WebSocket = ({ history, match, schemaName, setStatus, setLoading, fields, generatedChannelId }) => {
    const { nextStep } = useStep(match);
    const [password, setPassword] = useState('');
    const [channelId, setChannelId] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [counter, setCounter] = useState(0);

    let ioClient;

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
        if (schemaName) { // Case of Commitment
            getData();
        } else { // Case of ProveIdentity
            setChannelId(generatedChannelId || '');
            setIsRunning(true);
        }

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            setIsRunning(false);
            if (ioClient) {
                console.log('WebSocket disconnected');
                ioClient.off('createCredentialConfirmation');
                ioClient.off('error');
                ioClient.disconnect();
            }
        };
    }, [channelId]); // eslint-disable-line react-hooks/exhaustive-deps

    async function connectWebSocket (channelId, data) {
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

        ioClient.on('errorMessage', async (error) => {
            clearTimeout(timeout);
            console.error('Mobile client', error);
            setIsRunning(false);
            setLoading && setLoading(false);
            setStatus(messages.connectionError);
            notify('error', 'Mobile client error', error);
        });

        ioClient.on('verifiablePresentation', async (payload) => {
            try {
                setIsRunning(false);
                clearTimeout(timeout);
                setStatus('Verifying credentials...');

                notify('info', 'Verification', 'Verifying credentials...');
                let verifiablePresentation = await decrypt(fields?.password, payload);
                verifiablePresentation = JSON.parse(verifiablePresentation);
                const evaluationResult = await evaluateCredential(verifiablePresentation, fields?.requestedCredentials, fields?.challenge);

                setStatus(evaluationResult.message);
                notify(evaluationResult.type, 'Verification result', evaluationResult.message);
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

        ioClient.on('createCredentialConfirmation', async (encryptedPayload) => {
            try {
                clearTimeout(timeout);
                setIsRunning(false);
                let payload = await decrypt(password, encryptedPayload);
                payload = JSON.parse(payload);
                if (payload?.status === 'success') {
                    switch (schemaName) {
                        case 'FutureCommitments':
                            await localStorage.setItem('futureCommitment', 'completed');
                            break;
                        case 'PresentCommitments':
                            await localStorage.setItem('presentCommitment', 'completed');
                            break;
                        default:
                            break;
                    }
                    await localStorage.setItem(schemaName, JSON.stringify({ ...data, ...payload?.payload }));
                    await shareCommitment(payload?.payload?.Commitments, schemaName);
                    history.push(nextStep);
                }
            } catch (e) {
                console.error(e);
                setLoading && setLoading(false);
            }
        });
    }

    async function checkConnectedStatus (channelId) {
        const response = await axios.get(`${serverAPI}/connection?channelId=${channelId}`);
        return response && response?.data?.status === 'success';
    }

    async function shareCommitment (commitments, type) {
        try {
            await axios.post(`${serverAPI}/commitment`, { commitments, type });
        } catch (e) {
            console.error(e);
        }
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
                notify('warning', 'Mobile app not connected', 'Please return to the previous page and scan the QR code with your Selv app');
            }
        } else {
            notify('error', 'No connection details', 'Please return to the previous page and scan the QR code with your Selv app');
        }
    }

    useInterval(async () => {
        const isMobileConnected = await checkConnectedStatus(channelId);
        if (isMobileConnected) {
            setIsRunning(false);
        } else {
            if (counter === 7) {
                notify('warning', 'Mobile app not connected', 'Please return to the previous page and scan the QR code with your Selv app');
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
