import {
    Credential,
    GenerateECDSAKeypair,
    GenerateSeed,
    CreateRandomDID,
    DID,
    Schema,
    SchemaManager,
    ProofTypeManager,
    VerifiableCredential,
    VerifiablePresentation,
    VerifiableCredentialDataModel,
    VerifiablePresentationDataModel,
    SignDIDAuthentication,
    Presentation,
    DIDPublisher,
    DIDDocument
} from "@iota/identity";
import { KEY_ID, IOTA_NODE_URL } from '~/lib/config';
import Keychain from '~/lib/keychain';
import { Schemas, SchemaNames, BankAccountSchema } from '~/lib/identity/schemas';

export type Identity = {
    seed: string;
    root: string;
    keyId: string;
    privateKey: string;
    mamState: any;
};

export type SchemaNamesWithCredentials = {
    [key in SchemaNames]: VerifiableCredentialDataModel;
};

/**
 * Parses serialised data
 *
 * @method parse
 *
 * @param {string} data
 * @returns {object}
 */
export const parse = (data: string): any => {
    try {
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
};

/**
 * Creates new identity
 * 
 * @method createIdentity
 * 
 * @returns {Promise<Identity>}
 */
export const createIdentity = (): Promise<Identity> => {
    const seed = GenerateSeed();
    const userDIDDocument = CreateRandomDID(seed);

    return GenerateECDSAKeypair().then((keypair) => {
        const privateKey = keypair.GetPrivateKey();
        userDIDDocument.AddKeypair(keypair, KEY_ID);

        const publisher = new DIDPublisher(IOTA_NODE_URL, seed);

        return publisher.PublishDIDDocument(userDIDDocument).then((root) => {
            const mamState = publisher.ExportMAMChannelState();

            return { keyId: KEY_ID, seed, root, privateKey, mamState };
        });
    });
}

/**
 * Stores identity in keychain
 * 
 * @method storeIdentity
 * 
 * @param {string} identifier 
 * @param {Identity} identity 
 * 
 * @returns {Promise}
 */
export const storeIdentity = (identifier: string, identity: Identity): Promise<{ value: boolean }> => {
    return Keychain.set(identifier, JSON.stringify(identity));
};

/**
 * Stores identity in keychain
 * 
 * @method storeIdentity
 * 
 * @param {string} identifier 
 * @param {Identity} identity 
 * 
 * @returns {Promise}
 */
export const retrieveIdentity = (identifier: string): Promise<Identity> => {
    return Keychain.get(identifier).then((data) => parse(data.value));
};

/**
 * Creates credentials
 * 
 * @method createCredentials
 * 
 * @param {Identity} issuer 
 * @param {SchemaNames} schemaName 
 * @param {any} data 
 * @param {string} revocationAddress 
 * 
 * @returns {Promise<VerifiableCredentialDataModel>}
 */
export const createCredentials = (
    issuer: Identity,
    schemaName: SchemaNames,
    data: any,
    revocationAddress: string
): Promise<VerifiableCredentialDataModel> => {
    return DIDDocument.readDIDDocument(
        IOTA_NODE_URL,
        issuer.root
    ).then((issuerDID) => {
        const keypair = issuerDID.GetKeypair(issuer.keyId).GetEncryptionKeypair();

        // Set the private key, this enables the keypair to sign. 
        keypair.SetPrivateKey(issuer.privateKey);

        const credentialsData = {
            did: issuerDID.GetDID().GetDID(),
            ...data
        };

        const credentials = Credential.Create(
            new Schema(schemaName, BankAccountSchema),
            issuerDID.GetDID(),
            credentialsData,
            revocationAddress
        );

        // Sign the schema
        const proof = ProofTypeManager.GetInstance()
            .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', {
                issuer: issuerDID,
                issuerKeyId: issuer.keyId
            });

        proof.Sign(credentials.EncodeToJSON()) // Signs the JSON document

        const verifiableCredential = VerifiableCredential.Create(credentials, proof)

        return verifiableCredential.EncodeToJSON();

    })
};

/**
 * Stores credentials in keychain
 * 
 * @method storeCredentials
 * 
 * @param {string} credentialId 
 * @param {VerifiableCredentialDataModel} credentials
 * 
 * @returns {Promise<{ value: boolean }>}
 */
export const storeCredentials = (credentialId: string, credentials: VerifiableCredentialDataModel): Promise<{ value: boolean }> => {
    return Keychain.set(credentialId, JSON.stringify(credentials));
}

/**
 * Retrieves credentials from keychain
 * 
 * @method retrieveCredentials
 * 
 * @param {string} credentialId 
 * 
 * @returns {Promise<VerifiableCredentialDataModel>}
 */
export const retrieveCredentials = (credentialId: string): Promise<VerifiableCredentialDataModel> => {
    return Keychain.get(credentialId).then((data) => parse(data.value));
}

/**
 * Creates verifiable presentations for provided schema names
 * 
 * @method createVerifiablePresentations
 * 
 * @param {Identity} issuer 
 * @param {SchemaNamesWithCredentials} schemaNamesWithCredentials 
 * @param {string} challengeNonce 
 * 
 * @returns {Promise<VerifiablePresentationDataModel>}
 */
export const createVerifiablePresentations = (
    issuer: Identity,
    schemaNamesWithCredentials: SchemaNamesWithCredentials,
    challengeNonce: string
): Promise<VerifiablePresentationDataModel> => {
    return DIDDocument.readDIDDocument(
        IOTA_NODE_URL,
        issuer.root
    ).then((issuerDID) => {
        const keypair = issuerDID.GetKeypair(issuer.keyId).GetEncryptionKeypair();

        // Set the private key, this enables the keypair to sign. 
        keypair.SetPrivateKey(issuer.privateKey);

        SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(issuerDID.GetDID());

        const verifiableCredentials = SignDIDAuthentication(issuerDID, issuer.keyId, challengeNonce);
        const restCredentials = Object.keys(schemaNamesWithCredentials)
            .reduce((acc: VerifiableCredential[], schemaName: SchemaNames) => {
                const credentials: VerifiableCredentialDataModel = schemaNamesWithCredentials[schemaName];

                const proofParameters = {
                    issuer: issuerDID,
                    issuerKeyId: new DID(credentials.proof.verificationMethod).GetFragment()
                }

                SchemaManager.GetInstance().AddSchema(schemaName, Schemas[schemaName])
                SchemaManager.GetInstance().GetSchema(schemaName).AddTrustedDID(issuerDID.GetDID())

                acc.push(VerifiableCredential.DecodeFromJSON(credentials, proofParameters))

                return acc;

            }, [] as VerifiableCredential[]);


        // Create presentation
        const presentation = Presentation.Create([verifiableCredentials, ...restCredentials])
        const presentationProof = ProofTypeManager.GetInstance()
            .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', {
                issuer: issuerDID,
                issuerKeyId: issuer.keyId,
                challengeNonce
            });

        presentationProof.Sign(presentation.EncodeToJSON())

        const verifiablePresentation = VerifiablePresentation.Create(presentation, presentationProof)

        return verifiablePresentation.EncodeToJSON();
    });
}
