import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import {
  AuthResponse,
  RelyingParty,
  SigningAlgs,
  SiopRequestResult,
  bytesToString,
} from "@tanglelabs/oid4vc";
import * as KeyDIDResolver from "key-did-resolver";
import { Resolver } from "did-resolver";
import { PresentationDefinitionV2 } from "@sphereon/pex-models";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import express from "express";
import asyncHandler from "express-async-handler";

//@ts-ignore
import { driver } from "@digitalbazaar/did-method-key";
//@ts-ignore
import { Ed25519VerificationKey2020 } from "@digitalbazaar/ed25519-verification-key-2020";


import { Signer } from 'did-jwt';

const remoteSigner: Signer = async (data) => {
    console.log(data);
    return "test";
};

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
    signer: remoteSigner,
    redirectUri: "http://192.168.0.234:8080/api/auth",
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

  const gRPCServer = new grpc.Server();
  //@ts-ignore
  gRPCServer.addService(protoPackage.oid4vc.SIOPV2.service, {
    createRequest,
    verifyAuthResponse,
    createAuthToken,
  });
  gRPCServer.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      gRPCServer.start();
    }
  );

  
  const app = express();
  app.use(express.json());
  app.route("/api/health").get(
    asyncHandler(async (req, res) => {
        res.status(200).send();
    })
  );
  app.route("/api/auth").post(
    asyncHandler(async (req, res) => {
        console.log(req);
        await rp.verifyAuthResponse(req.body);
        res.status(204).send();
    })
  );
  const server = app.listen(3333, "0.0.0.0");

})();
