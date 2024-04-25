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
  "proto/user/user.proto"
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
    
    
    //@ts-ignore
    return new Promise<void>((resolve, reject) => this.userClient.connectUser({
      did,
      code,
    }, (err, response) => {
      if (err) {
        reject(err);
      }
      resolve();
    }));
  }
    
};