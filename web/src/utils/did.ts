import {
    DecodeProofDocument,
    SchemaManager,
    VerifiablePresentation,
    VerifiablePresentationDataModel,
    ProofParameters,
} from 'identity'
import { provider } from '../config.json'
import Address from '../schemas/Address.json'
import BankAccount from '../schemas/BankAccount.json'
import Company from '../schemas/Company.json'
import ContactDetails from '../schemas/ContactDetails.json'
import Insurance from '../schemas/Insurance.json'
import PersonalData from '../schemas/PersonalData.json'

const schemas: any = {
  Address,
  BankAccount,
  Company,
  ContactDetails,
  Insurance,
  PersonalData
}

const VERIFICATION_LEVEL = {
    UNVERIFIED: 0,
    DID_OWNER: 1,
    DID_TRUSTED: 2
}
  
export default (presentationData: VerifiablePresentationDataModel, schemaName: string, challengeNonce: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if the credential fits to the request
        if (presentationData
            && presentationData.proof
            && presentationData.verifiableCredential.length > 1
            && presentationData.verifiableCredential[1].credentialSubject
            // && presentationData.verifiableCredential[1].credentialSubject.Name === name
            ) {
          SchemaManager.GetInstance().AddSchema(schemaName, schemas[schemaName])
  
          const proofParameters: ProofParameters = await DecodeProofDocument(presentationData.proof, provider);
          const verifiablePresentation: VerifiablePresentation = await VerifiablePresentation.DecodeFromJSON(presentationData, provider, proofParameters);
          SchemaManager.GetInstance().GetSchema(schemaName).AddTrustedDID(proofParameters.issuer.GetDID());
          SchemaManager.GetInstance().GetSchema('DIDAuthenticationCredential').AddTrustedDID(proofParameters.issuer.GetDID());

          
          verifiablePresentation.Verify(provider)
            .then(() => {
                // Determine level of trust
                let verificationLevel = VERIFICATION_LEVEL.UNVERIFIED
                if (presentationData.proof && presentationData.proof.nonce === challengeNonce) {
                    verificationLevel = VERIFICATION_LEVEL.DID_OWNER
                    if (verifiablePresentation.GetVerifiedTypes().includes(schemaName)) {
                        verificationLevel = VERIFICATION_LEVEL.DID_TRUSTED
                    }
                }
                resolve({
                    status: verificationLevel,
                    data: presentationData.verifiableCredential[1].credentialSubject
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
                resolve({
                  data: presentationData.verifiableCredential[1].credentialSubject
                })
            })
        } else {
          resolve({
            status: VERIFICATION_LEVEL.UNVERIFIED,
          })
        }
      } catch (error) {
        console.error('Error 2', error)
        return error
      }
    })
}
