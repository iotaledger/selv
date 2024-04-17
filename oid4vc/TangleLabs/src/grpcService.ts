import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import {
  AuthResponse,
  RelyingParty,
  SiopRequestResult,
} from "@tanglelabs/oid4vc";
import { PresentationDefinitionV2 } from "@sphereon/pex-models";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const protoPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "proto/oid4vc/siopv2.proto"
);
const packageDefinition = loadSync(protoPath);
const protoPackage = grpc.loadPackageDefinition(packageDefinition);

export const createService = async (rp: RelyingParty) => {

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
    (err, port) => {
      if(err){
        throw err;
      }
      console.log(`gRPC server listening on port ${port}`);
    }
  );


};
