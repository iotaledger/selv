import {
  RelyingParty,
  SigningAlgs,
  VcIssuer,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";

import { readFile } from 'fs/promises';

import {
  getDidJwkResolver
} from "@sphereon/did-resolver-jwk";
import * as IOTADIDResolver from "./IOTADIDResolver";
import * as didJWT from "did-jwt";

import { remoteSigner } from "./remoteSigner";
import { createService } from "./grpcService";
import { createServer } from "./httpServer";
import { createStore } from "./store";
import { UserService } from "./userService";

import {Cache} from './cache';

(async () => {
  
  const CitizenCredentialConfig = JSON.parse(
    (await readFile(new URL('../../../shared/credentials/CitizenCredential.json', import.meta.url))).toString()
  );

  
  const keyDidResolver = KeyDIDResolver.getResolver();
  const iotaDidResolver = IOTADIDResolver.getResolver();
  let resolver = new Resolver({
    ...keyDidResolver,
    ...iotaDidResolver,
    ...getDidJwkResolver()
  });
  
  // TODO: remove only for testing
  const { signer, payload } = await didJWT
  .verifyJWT('eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDppb3RhOnJtczoweDgwM2M2NmNjZDMzNGFhNDE5NjYxOGY2NmJhZWNmMGM1NGFiMWQzMjY3NjMzZmU5NzVhZWY1NGYzZDRkMTYxZWQjaFFFY1lDNWFYZ0hVelpEdk9GYVRaLTE3cHdZV2Y4cFlNcmRMUWhoYzNnTSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTg3MTI4NDIsImV4cCI6MTcxODc5OTI0MiwiaWQiOiI5dm85LUEyYmhXZjFFRUVtZkJFRmciLCJzdGF0ZSI6ImQ1Y2IzOGZjLTI5N2QtNGQxYS05MmI2LTdlYWRjOGVjYmVkZCIsImlzcyI6ImRpZDppb3RhOnJtczoweDgwM2M2NmNjZDMzNGFhNDE5NjYxOGY2NmJhZWNmMGM1NGFiMWQzMjY3NjMzZmU5NzVhZWY1NGYzZDRkMTYxZWQifQ.f2KgOWSR95ZX7li56AF1O28v2h2FsxNWz6PvtgyuRcyy2biVRhs8M6lvZQdRRgK6N24KDXJ4gZ_yjdLGWGJ-Dw', {
    resolver: resolver,
    policies: { aud: false },
  })
  .catch((e) => {
    console.error("ERROR", e);
    throw new Error("invalid_request");
  });
  // end remove

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
      CitizenCredentialConfig.issuer_config,
  ],
  });

  const userService = new UserService();
  const tokenCache = await Cache.init<string, string>();
  const credentialCache = await Cache.init<string, any>();

  createService(rp, issuer, tokenCache, credentialCache);
  createServer(rp, issuer, userService, tokenCache, credentialCache);

})();
