import React, { Dispatch, useEffect, useState } from 'react';
import { createContext, useContext, useReducer } from 'react';
import { routes, mainSteps } from '../steps';
import SocketIOClient from 'socket.io-client';

import { Issuers } from '@shared/types/Issuers';
import { Scopes } from '@shared/types/Scopes';
import { Providers } from '@shared/types/Providers';

export enum Actions {
    ADD_CREDENTIAL,
    REQUEST_INVITE,
    REQUEST_PRESENTATION,
    REQUEST_ISSUANCE,
    CONNECT_DID,
    SET_QR_CONTENT,
    COMPLETE_ISSUANCE,
    REQUEST_DOMAIN_LINKAGE_VALIDATION,
    SET_DOMAIN_LINKAGE_VALIDATION,
    SET_ISSUANCE_DATA,
    RESET_STATE,
    REQUEST_PARSED_DID,
    SET_PARSED_DID,
}

export type ValidationResult = {
    valid: {
        url: string;
        credential: string;
        serviceId: string;
    }[], invalid: {
        url: string;
        credential?: string | undefined;
        serviceId: string;
        error: string;
    }[]
};

export type ParsedDIDResult = {
    aliasAddress: string,
    network: string,
};

interface ReducerBaseAction {
    type: Actions,
}

interface ScopedReducerAction extends ReducerBaseAction {
    type: Actions,
    scope: Scopes,
}

interface AddCredentialAction extends ScopedReducerAction {
    type: Actions.ADD_CREDENTIAL,
    credential: any,
}

interface ConnectDIDAction extends ScopedReducerAction {
    type: Actions.CONNECT_DID,
    DID: string,
}

interface RequestInviteAction extends ScopedReducerAction {
    type: Actions.REQUEST_INVITE,
    provider: Providers,
}

interface RequestPresentationAction extends ScopedReducerAction {
    type: Actions.REQUEST_PRESENTATION,
    provider: Providers,
    presentationDefinition: any,
}

interface RequestIssuanceAction extends ScopedReducerAction {
    type: Actions.REQUEST_ISSUANCE,
    provider: Providers,
    credentials: {
        type: string,
        data?: any,
    }[],
    issuer: Issuers,
}

interface SetQRContentAction extends ScopedReducerAction {
    type: Actions.SET_QR_CONTENT,
    QRContent: string,
}

interface SetCompleteIssuanceAction extends ScopedReducerAction {
    type: Actions.COMPLETE_ISSUANCE,
}
interface SetIssuanceDataAction extends ScopedReducerAction {
    type: Actions.SET_ISSUANCE_DATA,
    issuanceData: any,
}

interface RequestDomainLinkageValidationAction extends ReducerBaseAction {
    type: Actions.REQUEST_DOMAIN_LINKAGE_VALIDATION,
    did: string,
}


interface SetDomainLinkageValidationAction extends ReducerBaseAction {
    type: Actions.SET_DOMAIN_LINKAGE_VALIDATION,
    did: string,
    result: ValidationResult,
}

interface ResetStateAction extends ReducerBaseAction {
    type: Actions.RESET_STATE,
}
interface RequestParsedDIDAction extends ReducerBaseAction {
    type: Actions.REQUEST_PARSED_DID,
    did: string,
}

interface SetParsedDIDAction extends ReducerBaseAction {
    type: Actions.SET_PARSED_DID,
    did: string,
    result: ParsedDIDResult,
}

interface StoredCredential {
    credential: any;
};

export type State = {
    [scope in Scopes]?: {
        credentials: StoredCredential[];
        connectedDID: string;
        QRcontent: string;
        issuanceComplete: boolean;
        issuanceData: any;
    }
} & {
    validatedDomains: {
        [did: string]: ValidationResult | "in-flight";
    },
    parsedDID: {
        [did: string]: ParsedDIDResult | "in-flight";
    }
};

type ReducerAction = AddCredentialAction | ConnectDIDAction | RequestInviteAction | RequestInviteAction | RequestIssuanceAction | RequestPresentationAction | SetQRContentAction | SetCompleteIssuanceAction | SetIssuanceDataAction | RequestDomainLinkageValidationAction | SetDomainLinkageValidationAction | ResetStateAction | RequestParsedDIDAction | SetParsedDIDAction;

const socket = SocketIOClient("/", {
    autoConnect: true,
    transports: ['websocket'],
    secure: true,
});

// SIOPV2
type RequestSIOPInvite = (provider: Providers, scope: Scopes) => void
const requestSIOPInvite: RequestSIOPInvite = (provider, scope) => {
    socket.emit('requestSiopInvite', { provider, scope });
}

// OIDC4VP
type RequestPresentation = (provider: Providers, scope: Scopes, presentationDefinition: any) => void
const requestPresentation: RequestPresentation = (provider, scope, presentationDefinition) => {
    socket.emit('requestPresentation', { provider, scope, presentationDefinition });
}

// OIDC4VCI
type RequestIssuance = (provider: Providers, scope: Scopes, credentials: {type: string, data?: any}[], issuer: Issuers) => void
const requestIssuance: RequestIssuance = (provider, scope, credentials, issuer) => {
    socket.emit('requestIssuance',
        {
            credentials,
            provider,
            issuer,
            scope
        });
}

// DomainLinkage
type RequestDomainLinkage = (did: string) => void
const requestDomainLinkageValidation: RequestDomainLinkage = (did) => {
    socket.emit('requestDomainLinkageValidation', { did });
}

// DomainLinkage
type RequestParsedDID = (did: string) => void
const RequestDIDParsing: RequestParsedDID = (did) => {
    socket.emit('requestDIDParsing', { did });
}


export function GlobalStateProvider({ children }: any) {

    const [isConnected, setIsConnected] = useState(socket.connected);

    const [state, dispatch] = useReducer(
        stateReducer,
        { validatedDomains: {}, parsedDID: {} }
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
                type: Actions.REQUEST_DOMAIN_LINKAGE_VALIDATION,
                did: data.credential.issuer
            });

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

        socket.on('didDomainLinkageValidation', (data, cb) => {
            dispatch({
                type: Actions.SET_DOMAIN_LINKAGE_VALIDATION,
                did: data.did,
                result: data.result,
            });
            cb();
        })

        socket.on('parsedDID', (data, cb) => {
            dispatch({
                type: Actions.SET_PARSED_DID,
                did: data.did,
                result: data.result,
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

        console.debug(action);

        switch (action.type) {
            case Actions.ADD_CREDENTIAL: {
                return {
                    ...state,
                    [action.scope]: {
                        ...state[action.scope],
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

            case Actions.REQUEST_PARSED_DID: {
                RequestDIDParsing(action.did);
                return state;
            }

            case Actions.REQUEST_DOMAIN_LINKAGE_VALIDATION: {

                if(state.validatedDomains[action.did]){
                    return state;
                }

                requestDomainLinkageValidation(action.did);

                return {
                    ...state,
                    validatedDomains: {
                        ...state.validatedDomains,
                        [action.did]: 'in-flight',

                    }
                };
            }

            case Actions.CONNECT_DID: {
                return {
                    ...state, [action.scope]: {
                        ...state[action.scope],
                        connectedDID: action.DID
                    }
                };
            }

            case Actions.SET_QR_CONTENT: {
                return {
                    ...state, [action.scope]: {
                        ...state[action.scope],
                        QRcontent: action.QRContent
                    }
                };
            }

            case Actions.SET_ISSUANCE_DATA: {
                return {
                    ...state, [action.scope]: {
                        ...state[action.scope],
                        issuanceData: action.issuanceData,
                    }
                };
            }

            case Actions.COMPLETE_ISSUANCE: {
                return {
                    ...state, [action.scope]: {
                        ...state[action.scope],
                        issuanceComplete: true,
                    }
                };
            }

            case Actions.SET_DOMAIN_LINKAGE_VALIDATION: {
                return {
                    ...state,
                    validatedDomains: {
                        ...state.validatedDomains,
                        [action.did]: action.result

                    }
                };
            }

            case Actions.SET_PARSED_DID: {
                return {
                    ...state,
                    parsedDID: {
                        ...state.parsedDID,
                        [action.did]: action.result

                    }
                };
            }

            case Actions.RESET_STATE: {
                return ({
                    validatedDomains: state.validatedDomains,
                    parsedDID: state.parsedDID
                });
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
            <DispatchContext.Provider
                value={dispatch}
            >
                {children}
            </DispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
};

const GlobalStateContext = createContext<{ mainSteps: any, routes: any, state: State }>({ mainSteps: null, routes: null, state: { validatedDomains: {}, parsedDID: {} } });
const DispatchContext = createContext<Dispatch<ReducerAction> | null>(null);

export function useGlobalState() {
    return useContext(GlobalStateContext);
}

export function useCredentialsDispatch() {
    return useContext(DispatchContext);
}
