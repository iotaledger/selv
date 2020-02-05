import {
    DecodeProofDocument,
    SchemaManager,
    VerifiablePresentation,
    VerifiablePresentationDataModel,
    ProofParameters,
} from 'identity'
import UserDataCredential from './UserDataCredential.json'
import { provider } from '../config.json'

const VERIFICATION_LEVEL = {
    UNVERIFIED: 0,
    DID_OWNER: 1,
    DID_TRUSTED: 2
}
  
export default (presentationData: VerifiablePresentationDataModel, challengeNonce: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the credential fits to the request
        if (presentationData
            && presentationData.proof
            && presentationData.verifiableCredential.length > 0  // > 1
            && presentationData.verifiableCredential[0].credentialSubject // [1]
            // && presentationData.verifiableCredential[1].credentialSubject.Name === name
            ) {
          SchemaManager.GetInstance().AddSchema('UserData', UserDataCredential)
  
          const proofParameters: ProofParameters = await DecodeProofDocument(presentationData.proof, provider);
          const verifiablePresentation: VerifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);
          SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());
          verifiablePresentation.Verify(provider)
            .then(() => {
                // Determine level of trust
                let verificationLevel = VERIFICATION_LEVEL.UNVERIFIED
                console.log('Check nonce', challengeNonce, '|', presentationData?.proof?.nonce)
                if (presentationData.proof && presentationData.proof.nonce === challengeNonce) {
                    verificationLevel = VERIFICATION_LEVEL.DID_OWNER
                    console.log('Check trust', verifiablePresentation.GetVerifiedTypes())
                    if (verifiablePresentation.GetVerifiedTypes().includes('UserData')) {
                        verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED
                    }
                }
                console.log('Verify', verificationLevel)
                resolve({
                    status: verificationLevel,
                    data: presentationData.verifiableCredential[0].credentialSubject // [1]
                })
            })
            .catch((error: Error) => {
                console.error('Error 1', error)
                resolve({
                    status: VERIFICATION_LEVEL.UNVERIFIED,
                })
            })
            .finally(() => {
                SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').RemoveTrustedDID(proofParameters.issuer.GetDID());
            })
        } else {
          console.error('Got here 2')
          console.log(11, presentationData)

          resolve({
            status: VERIFICATION_LEVEL.UNVERIFIED,
          })
        }
      } catch (error) {
        console.error('Error 2', error)
        reject(error)
      }
    })
}
