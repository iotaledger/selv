import {
  RelyingParty,
  SigningAlgs,
  SimpleStore,
  VcIssuer,
  bytesToString,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";

//@ts-ignore
import { driver } from "@digitalbazaar/did-method-key";
//@ts-ignore
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";


import { remoteSigner } from "./remoteSigner";
import { createService } from "./grpcService";
import { createServer } from "./httpServer";
import { createStore } from "./store";
import { UserService } from "./userService";

(async () => {

  // const didKeyDriver = driver();

  // didKeyDriver.use({
  //   multibaseMultikeyHeader: "z6Mk",
  //   fromMultibase: Ed25519VerificationKey2020.from,
  // });

  // const verificationKeyPair = await Ed25519VerificationKey2020.generate();

  // console.log(bytesToString(verificationKeyPair._publicKeyBuffer));
  // console.log(bytesToString(verificationKeyPair._privateKeyBuffer));

  const keyDidResolver = KeyDIDResolver.getResolver();
  let resolver = new Resolver(keyDidResolver);

  const rp = new RelyingParty({
    clientId: process.env.RP_DID, //could also be URL (bank.selv.iota.org)
    clientMetadata: {
      subjectSyntaxTypesSupported: [
        "did:iota"
      ],
      idTokenSigningAlgValuesSupported: [
        SigningAlgs.EdDSA
      ],
    },
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    redirectUri: `http://${process.env.PUBLIC_URL}/api/auth`,
    resolver,
  });

  const issuer = new VcIssuer({
    batchCredentialEndpoint: `http://${process.env.PUBLIC_URL}/api/credentials`,
    credentialEndpoint: `http://${process.env.PUBLIC_URL}/api/credential`,
    credentialIssuer: `http://${process.env.PUBLIC_URL}/`,
    proofTypesSupported: ["jwt"],
    cryptographicBindingMethodsSupported: ["did:key"],
    resolver,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    cryptographicSuitesSupported: [SigningAlgs.EdDSA],
    store: createStore(),
    tokenEndpoint: `http://${process.env.PUBLIC_URL}/token`,
    supportedCredentials: [
      {
          name: "wa_driving_license",
          type: "wa_driving_license",
      },
  ],
  });

  const userService = new UserService();

  createService(rp, issuer);
  createServer(rp, userService);

})();
