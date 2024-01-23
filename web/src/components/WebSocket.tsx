import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SocketIOClient, { Socket } from 'socket.io-client';
import { notification } from 'antd';
import useStep from '../utils/useStep';
import useInterval from '../utils/useInterval';
import evaluateCredential from '../utils/did';
import { getCompanyId, encrypt, decrypt } from '../utils/helper';
import config from '../config.json';
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

const WebSocket = ({ history, schemaName, setStatus, setLoading, fields, messages, generatedChannelId }: {
    history: any;
    schemaName?: string;
    setStatus: (status: string) => void;
    setLoading?: (status: boolean) => void;
    messages: { [ key: string ]: string; };
    fields: any;
    generatedChannelId?: string;
}) => {
    const { nextStep } = useStep();
    const [password, setPassword] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [counter, setCounter] = useState(0);

    const { t } = useTranslation();

    let ioClient: Socket;

    useEffect(() => {
        (async () => {
            await connectWebSocket();
            ioClient.emit('requestOffer');
        })();

        // Removing the listener before unmounting the component in order to avoid addition of multiple listener
        return () => {
            setIsRunning(false);
            ioClient && console.log('WebSocket disconnected');
            ioClient?.off('error');
            ioClient?.disconnect();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function connectWebSocket () {
        ioClient = SocketIOClient(config.websocketURL, {
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 500,
            secure: true,
            reconnectionAttempts: Infinity,
            transports: ['websocket']
        });

        ioClient.on('offer', (data, cb) => {
            console.log(data);
            cb();
        })

        ioClient.on('connectDid', (data, cb) => {
            console.log(data);
            cb();
        })
    }
    
    return (
        <React.Fragment></React.Fragment>
    );
};

export default WebSocket;