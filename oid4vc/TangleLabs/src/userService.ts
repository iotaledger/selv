import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as grpc from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userProtoPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "shared/proto/user/user.proto"
);

const userPackageDefinition = loadSync(userProtoPath);
const userPackage = grpc.loadPackageDefinition(userPackageDefinition).user;

export class UserService {
  userClient;

  constructor() {

    //@ts-ignore
    this.userClient = new userPackage.UsersService(
      'backend:50051', grpc.credentials.createInsecure()
    );
  }
  
  connectUser (did: string, code: string) {
    return new Promise<void>((resolve, reject) => this.userClient.connectUser({
      did,
      code,
    }, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response);
    }));
  }

  presentCredential (did: string, code: string, presentation: string) {
    return new Promise<void>((resolve, reject) => this.userClient.presentCredential({
      user : {
        did,
        code,
      },
      vp: presentation
    }, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve(response);
    }));
  }

  credentialRequest (did: string, code: string, credentialDefinition: any): Promise<{signedCredentials: string[]}> {
    return new Promise((resolve, reject) => this.userClient.requestCredential({
      user : {
        did,
        code,
      },
      credentialDefinition,
    }, (err, response) => {
      if (err) {
        reject(err);
      }
      console.debug(response);
      resolve(response);
    }));
  }
    
};