import {
  RelyingParty,
  SigningAlgs,
  VcIssuer,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";

import {
  getDidJwkResolver
} from "@sphereon/did-resolver-jwk";
import * as IOTADIDResolver from "./IOTADIDResolver";

import { remoteSigner } from "./remoteSigner";
import { createService } from "./grpcService";
import { createServer } from "./httpServer";
import { createStore } from "./store";
import { UserService } from "./userService";

import {Cache} from './cache';

(async () => {

  const keyDidResolver = KeyDIDResolver.getResolver();
  const iotaDidResolver = IOTADIDResolver.getResolver();
  let resolver = new Resolver({
      ...keyDidResolver,
      ...iotaDidResolver,
      ...getDidJwkResolver()
  });

  const rp = new RelyingParty({
    clientId: process.env.RP_DID, //could also be URL (bank.selv.iota.org)
    clientMetadata: {
      subjectSyntaxTypesSupported: [
        "did:key",
        "did:jwk",
      ],
      idTokenSigningAlgValuesSupported: [
        SigningAlgs.EdDSA
      ],
    },
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    redirectUri: new URL('/api/auth', process.env.PUBLIC_URL).toString(),
    resolver,
  });

  const issuer = new VcIssuer({
    batchCredentialEndpoint: new URL('api/credential', process.env.PUBLIC_URL).toString(),
    credentialEndpoint: new URL('api/credential', process.env.PUBLIC_URL).toString(),
    credentialIssuer: new URL(process.env.PUBLIC_URL).toString(), // should be DID?
    proofTypesSupported: ["jwt"],
    cryptographicBindingMethodsSupported: ["did:key"], //TODO: did:jwk?
    resolver,
    signer: remoteSigner(process.env.SIGNER_KEYID),
    did: process.env.RP_DID,
    kid: `${process.env.RP_DID}#${process.env.KEY_FRAGMENT}`,
    credentialSigningAlgValuesSupported: [SigningAlgs.EdDSA],
    store: createStore(),
    tokenEndpoint: new URL('/api/token', process.env.PUBLIC_URL).toString(),
    supportedCredentials: [
      {
          name: "wa_driving_license",
          type: ["wa_driving_license"],
      },
      {
          name: "CitizenCredential",
          type: ["CitizenCredential"],
          display: [{
            name: "National Citizen Credential",
            locale: "en"
          }]
      },
  ],
  });

  const userService = new UserService();
  const tokenCache = await Cache.init<string, string>();
  const credentialCache = await Cache.init<string, any>();

  createService(rp, issuer, tokenCache, credentialCache);
  createServer(rp, issuer, userService, tokenCache, credentialCache);

})();
