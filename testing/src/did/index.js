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
import { 
  decrypt, 
  encrypt, 
  storeCredential, 
  storeIdentity, 
  retrieveIdentity, 
  retrieveCredential 
} from './helper'
import UserDataSchema from './UserDataCredential.json'
import { keyId, provider } from '../config.json'

export const createIdentity = async (password = '') => {
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

      if (password) {
        // Encrypt the identity
        const encryptedIdentity = await encrypt(password, JSON.stringify(identity))
        await storeIdentity(encryptedIdentity)
      } else {
        await storeIdentity(identity)
      }
      return { status: 'success' }
    } catch (error) {
      console.log('Enroll error', error)
    }
}

export const createCredential = async (credentialId, userData, password = '') => {
  try {
    let issuer = await retrieveIdentity()
    if (password) {
      // FIXME: doesn't work with password
      // Decrypt the identity
      issuer = await decrypt(password, issuer)
    }

    // Retrieves the latest DID Document from the Tangle
    const issuerDID = await DIDDocument.readDIDDocument(provider, issuer.root)
    // Set the private key, this enables the keypair to sign. The privatekey should be loaded from the secured location.
    const signatureKeypair = issuerDID.GetKeypair(issuer.keyId).GetEncryptionKeypair()
    signatureKeypair.SetPrivateKey(issuer.privateKey)

    const subjectDID = await DIDDocument.readDIDDocument(provider, issuer.root)

    // This loads a standard schema
    SchemaManager.GetInstance().AddSchema('UserData', UserDataSchema)
    const schema = SchemaManager.GetInstance().GetSchema('UserData')

    // Fill in the schema
    const schemaData = {
      DID: subjectDID.GetDID().GetDID(),
      ...userData
    } // Make an object, conform to the schema, which contains the data about the subject.

    const revocationAddress = GenerateSeed()
    const credential = Credential.Create(schema, issuerDID.GetDID(), schemaData, revocationAddress)
    console.log('credential', schemaData)
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

    if (password) {
      // Encrypt the credential
      const encryptedCredential = await encrypt(password, JSON.stringify(verifiableCredentialJSON))
      await storeCredential(credentialId, { userData, credential: encryptedCredential })
    } else {
      await storeCredential(credentialId, { userData, credential: verifiableCredentialJSON })
    }
    return { status: 'success' }
  } catch (error) {
    console.log('Error', error)
    return error
  }
}

export const createPresentation = async (credentialId, challengeNonce, password = '') => {
    try {
      let did = await retrieveIdentity()
      if (password) {
        // FIXME: doesn't work with password
        // Decrypt the identity
        did = await decrypt(password, did)
      }

      let credentialData = await retrieveCredential(credentialId)
      if (password) {
        // FIXME: doesn't work with password
        // Decrypt the identity
        credentialData = await decrypt(password, credentialData)
      }
      const credential = credentialData.credential

      console.log(111)
      console.log(did)
      console.log(credential)
      // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
      const issuerDID = await DIDDocument.readDIDDocument(provider, did.root);

      console.log(222)
      console.log(issuerDID)
      issuerDID.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey)

      SchemaManager.GetInstance().AddSchema('UserData', UserDataSchema)
      SchemaManager.GetInstance().GetSchema('UserData').AddTrustedDID(new DID(did.root))
      SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(new DID(did.root))
      
      const verifiableCredential = SignDIDAuthentication(issuerDID, did.keyId, challengeNonce)
      console.log(333)
      console.log(verifiableCredential)

      const credentialsArray = [verifiableCredential]
      // const proofResponse = await axios.post(`${apiURL}/mam`, { root: (new DID(credential.proof.creator)).uuid })
      // if (proofResponse && proofResponse.data) {
      //   const issuerDID = await readDIDDocument(proofResponse.data)
      const proofParameters = {
        issuer: issuerDID,
        issuerKeyId: new DID(credential.proof.verificationMethod).GetFragment(),
        challengeNonce
      }
      console.log(444)
      console.log(proofParameters)

      // credentialsArray.push(VerifiableCredential.DecodeFromJSON(credential, proofParameters))
      console.log(555)
      console.log(credentialsArray)

      // Create the presentation
      const presentation = Presentation.Create(credentialsArray)
      console.log(666)
      console.log(presentation)
      // const presentationProof = BuildRSAProof({
      //   issuer: userDIDDocument,
      //   issuerKeyId: keyId,
      //   challengeNonce
      // })
      const presentationProof = ProofTypeManager.GetInstance()
        .CreateProofWithBuilder('EcdsaSecp256k1VerificationKey2019', { 
          issuer: issuerDID, 
          issuerKeyId: did.keyId, 
          challengeNonce
        });

      console.log(777)
      console.log(presentationProof)
      
      presentationProof.Sign(presentation.EncodeToJSON())
      console.log(888)
      console.log(presentationProof)
      
      const verifiablePresentation = VerifiablePresentation.Create(presentation, presentationProof)
      console.log(999)
      console.log(verifiablePresentation)

      return verifiablePresentation.EncodeToJSON()
    } catch (error) {
      console.log('createPresentation generic' + error.toString())
      return error
    }
}
