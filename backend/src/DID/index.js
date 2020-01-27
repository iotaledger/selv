const crypto = require('crypto')
const {
  BuildRSAProof,
  Credential,
  GenerateRSAKeypair,
  GenerateSeed,
  CreateRandomDID,
  DIDPublisher,
  DIDDocument,
  SchemaManager,
  VerifiableCredential,
} = require('identity_ts')
const { getOwnIdentity } = require('../helper')
const AccessCredentialSchema = require('./AccessCredential.json')

const { provider, did: { keyId } } = require('../../config.js')

exports.createIdentity = async function () {
  return new Promise(async (resolve, reject) => {
    try {
      const seed = GenerateSeed()
      const userDIDDocument = CreateRandomDID(seed)
      const keypair = await GenerateRSAKeypair()
      const privateKey = keypair.GetPrivateKey()
      userDIDDocument.AddKeypair(keypair, keyId)
      const publisher = new DIDPublisher(provider, seed)
      const root = await publisher.PublishDIDDocument(userDIDDocument, 'DID', 9)
      const state = publisher.ExportMAMChannelState()
      resolve({ root, privateKey, keyId, seed, next_root: state.nextRoot, start: state.channelStart })
    } catch (error) {
      console.log('Error', error)
      reject(error)
    }
  })
}

exports.createAccessCredential = async function (userId, lockId) {
  try {
    const issuer = await getOwnIdentity()

    // Retrieves the latest DID Document from the Tangle
    const issuerDID = await DIDDocument.readDIDDocument(provider, issuer.root)

    // Set the private key, this enables the keypair to sign. The privatekey should be loaded from the secured location.
    const signatureKeypair = issuerDID.GetKeypair(issuer.keyId).GetEncryptionKeypair()
    signatureKeypair.SetPrivateKey(issuer.privateKey)

    const subjectDID = await DIDDocument.readDIDDocument(provider, userId)
    // console.log('subjectDID', subjectDID)

    // This loads a standard schema
    SchemaManager.GetInstance().AddSchema('AccessCredential', AccessCredentialSchema)

    // trust the Client DID that it is able to sign those credentials
    const schema = SchemaManager.GetInstance().GetSchema('AccessCredential')
    schema.AddTrustedDID(issuerDID.GetDID())

    // console.log(schema)

    // Fill in the schema
    const schemaData = {
      DID: subjectDID.GetDID().GetDID(),
      Lock: lockId
    } // Make an object, conform to the schema, which contains the data about the subject.

    const revocationAddress = generateRandomAddress()
    const credential = Credential.Create(schema, issuerDID.GetDID(), schemaData, revocationAddress)

    // Sign the schema
    const proof = BuildRSAProof({ issuer: issuerDID, issuerKeyId: issuer.keyId })
    proof.Sign(credential.EncodeToJSON()) // Signs the JSON document
    const verifiableCredential = VerifiableCredential.Create(credential, proof)

    // Encrypt the credential - Watch out, Keypair name hardcoded to 'keys-1'
    const encryptionKey = subjectDID.GetKeypair(keyId).GetEncryptionKeypair()
    const dataToEncode = JSON.stringify(verifiableCredential.EncodeToJSON())
    const encryptedData = encryptWithCipher(dataToEncode)
    const transactionData = {
      key: encryptionKey.PublicEncrypt(encryptedData.key.toString('hex')).toString('hex'),
      iv: encryptedData.iv.toString('hex'),
      data: encryptedData.encoded.toString('hex')
    }

    return {
      credential: transactionData,
      serverRoot: issuerDID.GetDID().GetUUID()
    }
  } catch (error) {
    console.log('Error', error)
    return null
  }
}

const encryptWithCipher = text => {
  const iv = crypto.randomBytes(16)
  const key = crypto.randomBytes(32)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
  const encrypted = cipher.update(text)
  return { key: key, iv: iv, encoded: Buffer.concat([encrypted, cipher.final()]) }
}

const generateRandomAddress = () => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9'
  let address = ''
  while (address.length < 81) {
    const byte = crypto.randomBytes(1)
    if (byte[0] < 243) {
      address += charset.charAt(byte[0] % 27)
    }
  }
  return address
}
