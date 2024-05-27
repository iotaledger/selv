/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { wrappers } from "protobufjs";
import { Observable } from "rxjs";
import { Struct } from "../google/protobuf/struct";

export const protobufPackage = "user";

/** user/user.proto */

export interface User {
  did: string;
  code: string;
}

export interface CredentialPresentation {
  user: User | undefined;
  vp: string;
}

export interface CredentialRequest {
  user: User | undefined;
  credentialIdentifier: string;
}

export interface CredentialResponse {
  signedCredentials: { [key: string]: any }[];
}

export const USER_PACKAGE_NAME = "user";

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

export interface UsersServiceClient {
  connectUser(request: User): Observable<User>;

  presentCredential(request: CredentialPresentation): Observable<CredentialPresentation>;

  requestCredential(request: CredentialRequest): Observable<CredentialResponse>;
}

export interface UsersServiceController {
  connectUser(request: User): Promise<User> | Observable<User> | User;

  presentCredential(
    request: CredentialPresentation,
  ): Promise<CredentialPresentation> | Observable<CredentialPresentation> | CredentialPresentation;

  requestCredential(
    request: CredentialRequest,
  ): Promise<CredentialResponse> | Observable<CredentialResponse> | CredentialResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["connectUser", "presentCredential", "requestCredential"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";
