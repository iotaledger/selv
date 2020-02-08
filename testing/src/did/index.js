import {
  DIDPublisher,
  GenerateECDSAKeypair,
  GenerateSeed,
  CreateRandomDID,
  Credential,
  DIDDocument,
  Presentation,
  SchemaManager,
  ProofTypeManager,
  VerifiableCredential,
  VerifiablePresentation,
  SignDIDAuthentication,
  DID
} from 'identity'
import { storeCredential, storeIdentity, retrieveIdentity, retrieveCredential } from '../helper'
import { keyId, provider } from '../config.json'
import Address from './schemas/Address.json'
import BankAccount from './schemas/BankAccount.json'
import Company from './schemas/Company.json'
import ContactDetails from './schemas/ContactDetails.json'
import Insurance from './schemas/Insurance.json'
import PersonalData from './schemas/PersonalData.json'

const schemas = {
  Address,
  BankAccount,
  Company,
  ContactDetails,
  Insurance,
  PersonalData
}

export const createIdentity = async () => {
  try {
    const seed = GenerateSeed()
    const userDIDDocument = CreateRandomDID(seed)
    const keypair = await GenerateECDSAKeypair()
    const privateKey = keypair.GetPrivateKey()
    userDIDDocument.AddKeypair(keypair, keyId)

    const publisher = new DIDPublisher(provider, seed)
    const root = await publisher.PublishDIDDocument(userDIDDocument)
    const mamState = publisher.ExportMAMChannelState()
    const identity = { seed, root, keyId, privateKey, mamState }

    await storeIdentity(identity)
    return { status: 'success' }
  } catch (error) {
    console.log('Enroll error', error)
  }
}

export const createCredential = async (schemaName, data) => {
  try {
    const issuer = await retrieveIdentity()

    // Retrieves the latest DID Document from the Tangle
    const issuerDID = await DIDDocument.readDIDDocument(provider, issuer.root)
    
    // Set the private key, this enables the keypair to sign. The privatekey should be loaded from the secured location.
    const signatureKeypair = issuerDID.GetKeypair(issuer.keyId).GetEncryptionKeypair()
    signatureKeypair.SetPrivateKey(issuer.privateKey)

    // This loads a standard schema
    SchemaManager.GetInstance().AddSchema(schemaName, schemas[schemaName])
    const schema = SchemaManager.GetInstance().GetSchema(schemaName)

    // Fill in the schema
    const schemaData = {
      DID: issuerDID.GetDID().GetDID(),
      ...data
    } // Make an object conform to the schema, which contains the data about the subject.

    const revocationAddress = GenerateSeed()
    const credential = Credential.Create(schema, issuerDID.GetDID(), schemaData, revocationAddress)
    console.log(credential)

    // Sign the schema
    const proof = ProofTypeManager.GetInstance()
      .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', { 
        issuer: issuerDID, 
        issuerKeyId: issuer.keyId 
      });
    proof.Sign(credential.EncodeToJSON()) // Signs the JSON document
    
    const verifiableCredential = VerifiableCredential.Create(credential, proof)
    const verifiableCredentialJSON = verifiableCredential.EncodeToJSON()

    await storeCredential(schemaName, { data, credential: verifiableCredentialJSON })
    return { status: 'success' }
  } catch (error) {
    console.log('Error', error)
    return error
  }
}

export const createPresentations = async (requestedSchemas, challengeNonce) => {
    try {
      const did = await retrieveIdentity()
      
      const issuerDID = await DIDDocument.readDIDDocument(provider, did.root);
      issuerDID.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey)
      SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(issuerDID.GetDID())
      
      const credentials = await getPresentationCredentials(requestedSchemas, issuerDID)
      const verifiableCredential = SignDIDAuthentication(issuerDID, did.keyId, challengeNonce)
      
      // Create presentation
      const presentation = Presentation.Create([verifiableCredential, ...credentials])
      const presentationProof = ProofTypeManager.GetInstance()
        .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', { 
          issuer: issuerDID, 
          issuerKeyId: did.keyId, 
          challengeNonce
        });
      presentationProof.Sign(presentation.EncodeToJSON())
      
      const verifiablePresentation = VerifiablePresentation.Create(presentation, presentationProof)

      return verifiablePresentation.EncodeToJSON()
    } catch (error) {
      console.log('createPresentation generic' + error.toString())
      return error
    }
}

const getPresentationCredential = async (schemaName, issuerDID) => {
  try {
    const credentialData = await retrieveCredential(schemaName)
    const proofParameters = {
      issuer: issuerDID,
      issuerKeyId: new DID(credentialData.credential.proof.verificationMethod).GetFragment()
    }

    SchemaManager.GetInstance().AddSchema(schemaName, schemas[schemaName])
    SchemaManager.GetInstance().GetSchema(schemaName).AddTrustedDID(issuerDID.GetDID())

    return await VerifiableCredential.DecodeFromJSON(credentialData.credential, proofParameters)
  } catch (error) {
    console.error(error)
  }
}

const getPresentationCredentials = async (requestedSchemas, issuerDID) => {
  return new Promise(resolve => {
    try {
      const promises = requestedSchemas.map(async schemaName =>
        await getPresentationCredential(schemaName, issuerDID)
      );
      Promise.all(promises).then(resolve)
    } catch (error) {
      console.error(error)
    }
  })
}