import {
  RelyingParty,
  SigningAlgs,
  VcIssuer,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";

import { remoteSigner } from "./remoteSigner";
import { createService } from "./grpcService";
import { createServer } from "./httpServer";
import { createStore } from "./store";
import { UserService } from "./userService";

import {Cache} from './cache';

(async () => {

  const keyDidResolver = KeyDIDResolver.getResolver();
  let resolver = new Resolver(keyDidResolver);

  const rp = new RelyingParty({
    clientId: process.env.RP_DID, //could also be URL (bank.selv.iota.org)
    clientMetadata: {
      subjectSyntaxTypesSupported: [
        "did:key"
      ],
      idTokenSigningAlgValuesSupported: [
        SigningAlgs.EdDSA
      ],
    },
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    redirectUri: `${process.env.PUBLIC_URL}/api/auth`,
    resolver,
  });

  const issuer = new VcIssuer({
    batchCredentialEndpoint: `${process.env.PUBLIC_URL}/api/credential`,
    credentialEndpoint: `${process.env.PUBLIC_URL}/api/credential`,
    credentialIssuer: `${process.env.PUBLIC_URL}/`, // should be DID?
    proofTypesSupported: ["jwt"],
    cryptographicBindingMethodsSupported: ["did:key"],
    resolver,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    cryptographicSuitesSupported: [SigningAlgs.EdDSA],
    store: createStore(),
    tokenEndpoint: `${process.env.PUBLIC_URL}/api/token`,
    supportedCredentials: [
      {
          name: "wa_driving_license",
          type: "wa_driving_license",
      },
  ],
  });

  const userService = new UserService();
  const tokenCache = await Cache.init<string, string>();
  const credentialCache = await Cache.init<string, any>();


  createService(rp, issuer, tokenCache, credentialCache);
  createServer(rp, issuer, userService, tokenCache, credentialCache);

})();
