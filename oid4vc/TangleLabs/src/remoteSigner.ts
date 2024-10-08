import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { Signer } from 'did-jwt';
import { KeyType } from "@sphereon/did-resolver-jwk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const identityProtoPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "shared/proto/identity/utils.proto"
);

const identityPackageDefinition = loadSync(identityProtoPath);
const identityPackage = grpc.loadPackageDefinition(identityPackageDefinition).utils;

export const remoteSigner: (keyId: string) => Signer = (keyId) => async (data) => {

    //@ts-ignore
    const identityClient = new identityPackage.Signing(
      'identity:50051', grpc.credentials.createInsecure()
    );
  
    const response = await new Promise((resolve, reject) => identityClient.sign({
      keyId,
      keyType: "ES256",
      data: Uint8Array.from(Buffer.from(data)),
    }, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response);
    }));

    return (response as {
      signature: Buffer
    }).signature.toString("base64url");
    
};