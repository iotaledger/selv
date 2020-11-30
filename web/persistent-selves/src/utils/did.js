import {
    DecodeProofDocument,
    SchemaManager,
    VerifiablePresentation
} from 'identity';
import { provider } from '../config.json';
import Address from '../schemas/Address.json';
import ContactDetails from '../schemas/ContactDetails.json';
import PersonalData from '../schemas/PersonalData.json';
import FutureCommitments from '../schemas/FutureCommitments.json';
import PresentCommitments from '../schemas/PresentCommitments.json';

const schemas = {
    Address,
    ContactDetails,
    PersonalData,
    FutureCommitments,
    PresentCommitments
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

export default (presentationData, requestedCredentials, challengeNonce) => {
    return new Promise(async resolve => {
        try {
        // Check if the credential fits to the request
            if (presentationData?.proof && presentationData?.verifiableCredential.length > 1) {
                requestedCredentials.forEach(schemaName => {
                    SchemaManager.GetInstance().AddSchema(schemaName, schemas[schemaName]);
                });

                const proofParameters = await DecodeProofDocument(presentationData?.proof, provider);
                const verifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);

                requestedCredentials.forEach(schemaName => {
                    SchemaManager.GetInstance().GetSchema(schemaName).AddTrustedDID(proofParameters.issuer.GetDID());
                });

                SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());

                verifiablePresentation.Verify(provider)
                    .then(() => {
                        // Determine level of trust
                        let type = verificationType.notVerified;
                        let message = verificationStatus.notVerified;
                        let verificationLevel = VERIFICATION_LEVEL.UNVERIFIED;
                        if (presentationData?.proof?.nonce === challengeNonce) {
                            type = verificationType.trusted;
                            message = verificationStatus.trusted;
                            verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED;
                            requestedCredentials.forEach(schemaName => {
                                if (!verifiablePresentation.GetVerifiedTypes().includes(schemaName)) {
                                    type = verificationType.missing;
                                    message = `${verificationStatus.missing} ${schemaName}`;
                                    verificationLevel = VERIFICATION_LEVEL.DID_OWNER;
                                }
                            });
                        }
                        const subjects = presentationData.verifiableCredential.map(credential => credential?.credentialSubject);
                        resolve({
                            status: verificationLevel,
                            message,
                            type,
                            data: subjects.reduce((a, b) => ({ ...a, ...b }))
                        });
                    })
                    .catch((error) => {
                        console.error('Error 1', error);
                        resolve({
                            status: VERIFICATION_LEVEL.UNVERIFIED,
                            message: verificationStatus.notVerified,
                            type: verificationType.notVerified
                        });
                    })
                    .finally(() => {
                        SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').RemoveTrustedDID(proofParameters.issuer.GetDID());
                    });
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
