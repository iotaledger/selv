import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import {
  AuthResponse,
  RelyingParty,
  SiopRequestResult,
  bytesToString,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";
import { PresentationDefinitionV2 } from "@sphereon/pex-models";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

//@ts-ignore
import { driver } from "@digitalbazaar/did-method-key";
//@ts-ignore
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";

(async () => {

    const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

  const protoPath = path.join(
    __dirname,
    "..",
    "..",
    "proto/oid4vc/siopv2.proto"
  );
  const packageDefinition = loadSync(protoPath);
  const protoPackage = grpc.loadPackageDefinition(packageDefinition);

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
    clientId: "",
    clientMetadata: {
      subjectSyntaxTypesSupported: [],
      idTokenSigningAlgValuesSupported: [],
    },
    did: "",
    kid: "",
    privKeyHex: bytesToString(verificationKeyPair._privateKeyBuffer),
    redirectUri: "",
    resolver: resolver,
  });

  async function createRequest(
    call: grpc.ServerUnaryCall<
      { presentationDefinition: any; state: any; nonce: string },
      any
    >,
    callback: grpc.sendUnaryData<SiopRequestResult>
  ): Promise<void> {
    const request = await rp.createRequest({
      //presentationDefinition: call.request.presentationDefinition,
      requestBy: "value",
      responseType: "id_token",
      //clientMetadata: "",
      state: call.request.state,
      nonce: call.request.nonce,
    });
    if (request) {
      callback(null, request);
    } else {
      callback({
        message: "Could not create request",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }
  }

  async function verifyAuthResponse(
    call: grpc.ServerUnaryCall<
      {
        authResponse: AuthResponse;
        presentationDefinition?: PresentationDefinitionV2;
      },
      any
    >,
    callback: grpc.sendUnaryData<void>
  ): Promise<void> {
    try {
      await rp.verifyAuthResponse(
        call.request.authResponse,
        call.request.presentationDefinition
      );
      callback(null);
    } catch (e) {
      callback({
        message: e as string,
        code: grpc.status.INVALID_ARGUMENT,
      });
    }
  }

  async function createAuthToken(
    call: grpc.ServerUnaryCall<{ did: string }, any>,
    callback: grpc.sendUnaryData<{ token: string }>
  ): Promise<void> {
    const token = await rp.createAuthToken(call.request.did);
    if (token) {
      callback(null, { token });
    } else {
      callback({
        message: "Could not create token",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }
  }

  const server = new grpc.Server();
  //@ts-ignore
  server.addService(protoPackage.oid4vc.SIOPV2.service, {
    createRequest,
    verifyAuthResponse,
    createAuthToken,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    }
  );
})();
