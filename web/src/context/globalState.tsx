import React, { Dispatch, Provider, useEffect, useState } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { routes, mainSteps } from '../steps';
import SocketIOClient, { Socket } from 'socket.io-client';

import config from '../config.json';
import { Issuers } from '@sharedTypes/Issuers';
import { Scopes } from '@sharedTypes/Scopes';
import { Providers } from '@sharedTypes/Providers';

export enum Actions {
    ADD_CREDENTIAL,
    REQUEST_INVITE,
    REQUEST_PRESENTATION,
    REQUEST_ISSUANCE,
    CONNECT_DID,
    SET_QR_CONTENT,
    COMPLETE_ISSUANCE,
}

interface ReducerBaseAction {
    type: Actions,
    scope: Scopes,
}

interface AddCredentialAction extends ReducerBaseAction {
    type: Actions.ADD_CREDENTIAL,
    credential: any,
}

interface ConnectDIDAction extends ReducerBaseAction {
    type: Actions.CONNECT_DID,
    DID: string,
}

interface RequestInviteAction extends ReducerBaseAction {
    type: Actions.REQUEST_INVITE,
    provider: Providers,
}

interface RequestPresentationAction extends ReducerBaseAction {
    type: Actions.REQUEST_PRESENTATION,
    provider: Providers,
    presentationDefinition: any,
}

interface RequestIssuanceAction extends ReducerBaseAction {
    type: Actions.REQUEST_ISSUANCE,
    provider: Providers,
    credentials: string[],
    issuer: Issuers,
}

interface SetQRContentAction extends ReducerBaseAction {
    type: Actions.SET_QR_CONTENT,
    QRContent: string,
}

interface SetCompleteIssuanceAction extends ReducerBaseAction {
    type: Actions.COMPLETE_ISSUANCE,
}


interface StoredCredential {
    credential: any;
};

type State = {
    [scope in Scopes]?: {
        credentials: StoredCredential[];
        connectedDID: string;
        QRcontent: string;
        issuanceComplete: boolean;
    };
};

type ReducerAction = AddCredentialAction | ConnectDIDAction | RequestInviteAction | RequestInviteAction | RequestIssuanceAction | RequestPresentationAction | SetQRContentAction | SetCompleteIssuanceAction;

const socket = SocketIOClient("/", {
    autoConnect: true,
    transports: ['websocket'],
    secure: true,
});

// SIOPV2
type RequestSIOPInvite = (provider: Providers, scope: Scopes) => void
const requestSIOPInvite: RequestSIOPInvite = (provider, scope) => {
    socket.emit('requestSiopInvite', {provider, scope});
}

// OIDC4VP
type RequestPresentation = (provider: Providers, scope: Scopes, presentationDefinition: any) => void
const requestPresentation: RequestPresentation = (provider, scope, presentationDefinition) => {
    socket.emit('requestPresentation', {provider, scope, presentationDefinition});
}

// OIDC4VCI
// TODO: Issuers.Bank
type RequestIssuance = (provider: Providers, scope: Scopes, credentials: any, issuer: Issuers) => void
const requestIssuance: RequestIssuance = (provider, scope, credentials, issuer) => {
    socket.emit('requestIssuance',
        {
            credentials,
            provider,
            issuer,
            scope
        });
}

export function GlobalStateProvider({ children }: any) {

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [state, dispatch] = useReducer(
        stateReducer,
        {}
    );

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // SIOPV2
        socket.on('siopInvite', (data, cb) => {
            dispatch({
                type: Actions.SET_QR_CONTENT,
                scope: data.scope,
                QRContent: data.url
            });
            cb();
        })

        socket.on('connectDid', (data, cb) => {
            dispatch({
                type: Actions.CONNECT_DID,
                scope: data.scope,
                DID: data.did
            });
            cb();
        })

        // OIDC4VCI
        socket.on('presentationOffer', (data, cb) => {
            dispatch({
                type: Actions.SET_QR_CONTENT,
                scope: data.scope,
                QRContent: data.url
            });
            cb();
        })

        socket.on('presentation', (data, cb) => {
            dispatch({
                type: Actions.ADD_CREDENTIAL,
                scope: data.scope,
                credential: data.credential
            });
            cb();
        })

        // OIDC4VP
        socket.on('issuanceOffer', (data, cb) => {
            dispatch({
                type: Actions.SET_QR_CONTENT,
                scope: data.scope,
                QRContent: data.url
            });
            cb();
        })


        socket.on('issuance', (data, cb) => {
            dispatch({
                type: Actions.COMPLETE_ISSUANCE,
                scope: data.scope,
            });
            cb();
        })


        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.removeAllListeners();
        };
    }, []);

    function stateReducer(state: State, action: ReducerAction): State {
        const scope = action.scope;
        console.log(action);
        switch (action.type) {
            case Actions.ADD_CREDENTIAL: {
                return {
                    ...state, 
                    [scope]: {
                        ...state[scope],
                        credentials: [
                            // ...state?.[scope]?.credentials,
                            { credential: action.credential }
                        ]
                    }
                };
            }

            case Actions.REQUEST_INVITE: {
                requestSIOPInvite(action.provider, action.scope);
                return state;
            }

            case Actions.REQUEST_PRESENTATION: {
                requestPresentation(action.provider, action.scope, action.presentationDefinition);
                return state;
            }

            case Actions.REQUEST_ISSUANCE: {
                requestIssuance(action.provider, action.scope, action.credentials, action.issuer);
                return state;
            }

            case Actions.CONNECT_DID: {
                return {
                    ...state, [scope]: {
                        ...state[scope],
                        connectedDID: action.DID
                    }
                };
            }

            case Actions.SET_QR_CONTENT: {
                return {
                    ...state, [scope]: {
                        ...state[scope],
                        QRcontent: action.QRContent
                    }
                };
            }

            case Actions.COMPLETE_ISSUANCE: {
                return {
                    ...state, [scope]: {
                        ...state[scope],
                        issuanceComplete: true,
                    }
                };
            }

            default: {
                throw Error('Unknown action: ' + JSON.stringify(action));
            }
        }
    }


    return (
        <GlobalStateContext.Provider value={{
            mainSteps,
            routes,
            state
        }}>
            <CredentialDispatchContext.Provider
                value={dispatch}
            >
                {children}
            </CredentialDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

export const GlobalStateContext = createContext<{ mainSteps: any, routes: any, state: State }>({ mainSteps: null, routes: null, state: {} });
const CredentialDispatchContext = createContext<Dispatch<ReducerAction> | null>(null);

export function useGlobalState() {
    return useContext(GlobalStateContext);
}

export function useCredentialsDispatch() {
    return useContext(CredentialDispatchContext);
}
