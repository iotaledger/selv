const {
  GenerateRSAKeypair,
  GenerateSeed,
  CreateRandomDID,
  DIDPublisher,
} = require('identity_ts')

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
