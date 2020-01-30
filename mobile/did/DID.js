import { AsyncStorage } from 'react-native'
import crypto from 'crypto'
import axios from 'axios'
import {
  DIDPublisher,
  GenerateRSAKeypair,
  GenerateSeed,
  CreateRandomDID,
  BuildRSAProof,
  DIDDocument,
  Presentation,
  RSAKeypair,
  SchemaManager,
  VerifiableCredential,
  VerifiablePresentation,
  DID,
  Service,
  SignDIDAuthentication
} from 'identity'
import AccessCredentialSchema from './AccessCredential.json'
import { apiURL, keyId, provider } from '../app.json'

export const enroll = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const seed = GenerateSeed()
      const userDIDDocument = CreateRandomDID(seed)
      const keypair = await GenerateRSAKeypair()
      const privateKey = keypair.GetPrivateKey()
      userDIDDocument.AddKeypair(keypair, keyId)

      const publisher = new DIDPublisher(provider, seed)
      const root = await publisher.PublishDIDDocument(userDIDDocument)
      const state = publisher.ExportMAMChannelState()

      resolve({ root, privateKey, keyId, seed, next_root: state.nextRoot, start: state.channelStart })
    } catch (error) {
      alert(error.toString())
      console.log('Error', error)
      reject(error)
    }
  })
}

export const process_credential = async (payload) => {
  try {
    const savedDid = await AsyncStorage.getItem('did')
    const serverRoot = await AsyncStorage.getItem('serverRoot')
    const did = JSON.parse(savedDid)

    // Filter out incorrectly structured transactions
    if (!payload || !payload.key || !payload.iv || !payload.data) {
      return
    }
    const { key, iv, data } = payload

    const encryptionKeypair = new RSAKeypair(null, did.privateKey)

    const decryptkey = await encryptionKeypair.PrivateDecrypt(Buffer.from(key, 'hex'))

    const credentialString = decryptCipher({
      key: Buffer.from(decryptkey, 'hex'),
      iv: Buffer.from(iv, 'hex'),
      encoded: Buffer.from(data, 'hex')
    }).toString('utf8')

    const credential = JSON.parse(credentialString)

    // This loads a standard schema
    SchemaManager.GetInstance().AddSchema('AccessCredential', AccessCredentialSchema)

    // trust the Server DID
    SchemaManager.GetInstance().GetSchema('AccessCredential').AddTrustedDID(new DID(serverRoot))

    let proofParameters
    const proofResponse = await axios.post(`${apiURL}/mam`, { root: (new DID(credential.proof.creator)).uuid })
    if (proofResponse && proofResponse.data) {
      const issuerDID = await readDIDDocument(proofResponse.data)
      proofParameters = {
        issuer: issuerDID,
        issuerKeyId: new DID(credential.proof.verificationMethod).GetFragment(),
        challengeNonce: credential.proof.nonce
      }
    }

    const importVerifiableCredential = await VerifiableCredential.DecodeFromJSON(credential, proofParameters)

    let ownDID
    const didResponse = await axios.post(`${apiURL}/mam`, { root: did.root })
    if (didResponse && didResponse.data) {
      ownDID = new DID((await readDIDDocument(didResponse.data)).GetDID().uuid)
    }

    // Verify
    await importVerifiableCredential.Verify(provider)
      .then(async () => {
        if (importVerifiableCredential.EncodeToJSON().credentialSubject.DID === ownDID.GetDID()) {
          await AsyncStorage.setItem(`${credential.credentialSubject.Lock}`, credentialString)
          return console.log('Stored credential for', credential.credentialSubject.Lock)
        }
      })
      .catch(error => {
        console.log('process_credential verification error', error)
        console.log('Credential Target:', importVerifiableCredential.EncodeToJSON().credentialSubject.DID)
        return null
      })
  } catch (error) {
    console.log('process_credential', error)
    return null
  }
}

const readDIDDocument = async (messages) => {
  return new Promise((resolve, reject) => {
    try {
      const latestDIDDocument = messages[messages.length - 1]
      const JSONDocument = JSON.parse(latestDIDDocument)

      // Parse the DID Document
      const document = new DIDDocument(JSONDocument['@context'], new DID(JSONDocument.id))

      // Public keys
      const publicKeys = JSONDocument.publicKey
      if (publicKeys) {
        for (let i = 0; i < publicKeys.length; i++) {
          let keypair
          if (publicKeys[i].type === 'RsaVerificationKey2018') {
            keypair = new RSAKeypair(publicKeys[i].publicKeyPem)
          }
          document.AddKeypair(
            keypair,
            publicKeys[i].id.substr(publicKeys[i].id.lastIndexOf('#') + 1),
            new DID(publicKeys[i].id.substr(0, publicKeys[i].id.lastIndexOf('#'))),
            new DID(publicKeys[i].controller)
          )
        }
      }
      // Service Endpoints
      const services = JSONDocument.service
      if (services) {
        for (let i = 0; i < services.length; i++) {
          const service = services[i]
          const did = new DID(service.id)
          document.AddServiceEndpoint(new Service(did, did.GetFragment(), service.type, service.serviceEndpoint))
        }
      }
      resolve(document)
    } catch (error) {
      alert('custom readDIDDocument'+error.toString())
      reject(error)
    }
  })
}

export const present_credential = async lockId => {
  return new Promise(async (resolve, reject) => {
    try {
      const savedDid = await AsyncStorage.getItem('did')
      const savedCredential = await AsyncStorage.getItem(lockId)
      const serverRoot = await AsyncStorage.getItem('serverRoot')
      const did = JSON.parse(savedDid)
      const credential = JSON.parse(savedCredential)
      const challengeNonce = Date.now().toString()

      // Read DID Document might fail when no DID is actually located at the root - Unlikely as it is the DID of this instance
      let userDIDDocument
      const didResponse = await axios.post(`${apiURL}/mam`, { root: did.root })
      if (didResponse && didResponse.data) {
        userDIDDocument = await readDIDDocument(didResponse.data)

        userDIDDocument.GetKeypair(did.keyId).GetEncryptionKeypair().SetPrivateKey(did.privateKey)

        // This loads a standard schema
        SchemaManager.GetInstance().AddSchema('AccessCredential', AccessCredentialSchema)

        // trust the Server DID
        SchemaManager.GetInstance().GetSchema('AccessCredential').AddTrustedDID(new DID(serverRoot))

        const didAuthCredential = SignDIDAuthentication(userDIDDocument, did.keyId, challengeNonce)
        const credentialsArray = [didAuthCredential]
        const proofResponse = await axios.post(`${apiURL}/mam`, { root: (new DID(credential.proof.creator)).uuid })
        if (proofResponse && proofResponse.data) {
          const issuerDID = await readDIDDocument(proofResponse.data)
          const proofParameters = {
            issuer: issuerDID,
            issuerKeyId: new DID(credential.proof.verificationMethod).GetFragment(),
            challengeNonce: credential.proof.nonce
          }
          credentialsArray.push(VerifiableCredential.DecodeFromJSON(credential, proofParameters))
        }

        // Create the presentation
        const presentation = Presentation.Create(credentialsArray)
        const presentationProof = BuildRSAProof({
          issuer: userDIDDocument,
          issuerKeyId: keyId,
          challengeNonce
        })
        presentationProof.Sign(presentation.EncodeToJSON())
        const verifiablePresentation = VerifiablePresentation.Create(presentation, presentationProof)
        return resolve(verifiablePresentation.EncodeToJSON())
      }
      reject("very unkown error")
    } catch (error) {
      alert('present_credential generic' + error.toString())
      reject(error)
    }
  })
}

const decryptCipher = data => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', data.key, data.iv)
  const decoded = decipher.update(data.encoded)
  return Buffer.concat([decoded, decipher.final()])
}
