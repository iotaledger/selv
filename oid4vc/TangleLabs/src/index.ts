import {
  RelyingParty,
  SigningAlgs,
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

(async () => {

  const didKeyDriver = driver();

  didKeyDriver.use({
    multibaseMultikeyHeader: "z6Mk",
    fromMultibase: Ed25519VerificationKey2020.from,
  });

  const verificationKeyPair = await Ed25519VerificationKey2020.generate();

  console.log(bytesToString(verificationKeyPair._publicKeyBuffer));
  console.log(bytesToString(verificationKeyPair._privateKeyBuffer));

  const keyDidResolver = KeyDIDResolver.getResolver();
  let resolver = new Resolver(keyDidResolver);

  const rp = new RelyingParty({
    clientId: "did:iota:0x",
    clientMetadata: {
      subjectSyntaxTypesSupported: [
        "did:iota"
      ],
      idTokenSigningAlgValuesSupported: [
        SigningAlgs.EdDSA
      ],
    },
    did: "did:iota:0x",
    kid: "did:iota:0x#my_key",
    signer: remoteSigner(process.env.SIGNER_KEYID),
    redirectUri: "http://192.168.0.234:8080/api/auth",
    resolver: resolver,
  });

  createService(rp);
  createServer(rp);

})();
