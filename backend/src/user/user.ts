/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Any } from "../google/protobuf/any";

export const protobufPackage = "user";

/** user/user.proto */

export interface User {
  did: string;
  code: string;
}

export interface CredentialPresentation {
  user: User | undefined;
  vp: Any | undefined;
}

export const USER_PACKAGE_NAME = "user";

export interface UsersServiceClient {
  connectUser(request: User): Observable<User>;

  presentCredential(request: CredentialPresentation): Observable<CredentialPresentation>;
}

export interface UsersServiceController {
  connectUser(request: User): Promise<User> | Observable<User> | User;

  presentCredential(
    request: CredentialPresentation,
  ): Promise<CredentialPresentation> | Observable<CredentialPresentation> | CredentialPresentation;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["connectUser", "presentCredential"];
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
