import { provider } from '../config.json';
import Address from '../schemas/Address.json';
import TestResult from '../schemas/TestResult.json';
import PersonalData from '../schemas/PersonalData.json';

import * as identity from '@iota/identity-wasm/web';

const schemas: any = {
    Address,
    TestResult,
    PersonalData
};

const VERIFICATION_LEVEL = {
    UNVERIFIED: 0,
    DID_OWNER: 1,
    DID_TRUSTED: 2
};

const verificationStatus = {
    notVerified: 'Credentials could not be verified',
    missing: 'Missing credential of type',
    trusted: 'Credentials successfully verified'
};

const verificationType = {
    notVerified: 'error',
    missing: 'warning',
    trusted: 'success'
};

export default async (presentationData: {proof: any, verifiableCredential: {credentialSubject: any}[]}, requestedCredentials: string[], challengeNonce: string) => {
    return new Promise(async resolve => {
        try {
        // Check if the credential fits to the request
            if (presentationData?.proof && presentationData?.verifiableCredential.length > 1) {
                
                await identity.init('/identity_wasm_bg.wasm');

                const mainNet = identity.Network.mainnet();
                    
                const config = identity.Config.fromNetwork(mainNet);
                config.setPermanode('https://chrysalis-chronicle.iota.org/api/mainnet/');

                // Create a client instance to publish messages to the Tangle.
                const client = identity.Client.fromConfig(config);
                client.checkPresentation(JSON.stringify(presentationData))
                    .then(() => {
                        // Determine level of trust
                        let type = verificationType.notVerified;
                        let message = verificationStatus.notVerified;
                        let verificationLevel = VERIFICATION_LEVEL.UNVERIFIED;

                        type = verificationType.trusted;
                        message = verificationStatus.trusted;
                        verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;

                        requestedCredentials.forEach(schemaName => {
                            if (!Object.keys(schemas).includes(schemaName)) {
                                type = verificationType.missing;
                                message = `${verificationStatus.missing} ${schemaName}`;
                                verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                            }
                        });
                        
                        const subjects = presentationData.verifiableCredential.map(credential => credential?.credentialSubject);
                        resolve({
                            status: verificationLevel,
                            message,
                            type,
                            data: subjects.reduce((a, b) => ({ ...a, ...b }))
                        });
                    })
                    .catch((error: Error) => {
                        resolve({
                            status: VERIFICATION_LEVEL.UNVERIFIED,
                            message: verificationStatus.notVerified,
                            type: verificationType.notVerified
                        });
                    })
            } else {
                resolve({
                    status: VERIFICATION_LEVEL.UNVERIFIED,
                    message: verificationStatus.notVerified,
                    type: verificationType.notVerified
                });
            }
        } catch (error) {
            console.error('Error 2', error);
            return {
                status: VERIFICATION_LEVEL.UNVERIFIED,
                message: verificationStatus.notVerified,
                type: verificationType.notVerified,
                error
            };
        }
    });
};
