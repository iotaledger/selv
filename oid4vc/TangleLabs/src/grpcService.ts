import path from "path";
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import {
  AuthResponse,
  RelyingParty,
  SiopRequestResult,
  VcIssuer,
} from "@tanglelabs/oid4vc";
import { PresentationDefinitionV2 } from "@sphereon/pex-models";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPackageDefinition = (protoFile: string): grpc.GrpcObject => {
  const protoPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    protoFile
  );
  const packageDefinition = loadSync(protoPath);
  return grpc.loadPackageDefinition(packageDefinition);
}

export const createService = async (rp: RelyingParty, issuer: VcIssuer) => {

  async function createSIOPRequest(
    call: grpc.ServerUnaryCall<
      { state: any; nonce: string },
      any
    >,
    callback: grpc.sendUnaryData<SiopRequestResult>
  ): Promise<void> {
    const request = await rp.createRequest({
      requestBy: "value",
      responseType: "id_token",
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
  
  async function createOID4VPRequest(
    call: grpc.ServerUnaryCall<
      { presentationDefinition: any; state: any; nonce: string },
      any
    >,
    callback: grpc.sendUnaryData<SiopRequestResult>
  ): Promise<void> {
    const request = await rp.createRequest({
      presentationDefinition: call.request.presentationDefinition,
      requestBy: "value",
      responseType: "vp_token",
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

  async function createOID4VCIOffer(
    call: grpc.ServerUnaryCall<
      { credentials: string[] },
      any
    >,
    callback: grpc.sendUnaryData<{uri: string, offer: any}>
  ): Promise<void> {
    const offer = await issuer.createCredentialOffer({
      credentials: call.request.credentials,
      requestBy: "value",
    });
    if (offer) {
      console.log(JSON.stringify(offer.offer));
      callback(null, {uri: offer.uri, offer: JSON.stringify(offer.offer)});
    } else {
      callback({
        message: "Could not create offer",
        code: grpc.status.INVALID_ARGUMENT,
      });
    }
  }


  const gRPCServer = new grpc.Server();
  //@ts-ignore
  gRPCServer.addService(getPackageDefinition("proto/oid4vc/siopv2.proto").oid4vc.SIOPV2.service, {
    createRequest: createSIOPRequest,
  });
  //@ts-ignore
  gRPCServer.addService(getPackageDefinition("proto/oid4vc/oid4vp.proto").oid4vc.OID4VP.service, {
    createRequest: createOID4VPRequest,
  });
  //@ts-ignore
  gRPCServer.addService(getPackageDefinition("proto/oid4vc/oid4vci.proto").oid4vc.OID4VCI.service, {
    createOffer: createOID4VCIOffer,
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