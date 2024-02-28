/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "credentials";

export enum RevocationStatus {
  REVOKED = 0,
  SUSPENDED = 1,
  VALID = 2,
  UNRECOGNIZED = -1,
}

export interface RevocationCheckRequest {
  type: string;
  url: string;
  properties: { [key: string]: string };
}

export interface RevocationCheckRequest_PropertiesEntry {
  key: string;
  value: string;
}

export interface RevocationCheckResponse {
  status: RevocationStatus;
}

export interface JwtCreationRequest {
  credentialJson: string;
  issuerFragment: string;
}

export interface JwtCreationResponse {
  jwt: string;
}

export const CREDENTIALS_PACKAGE_NAME = "credentials";

export interface CredentialRevocationClient {
  check(request: RevocationCheckRequest): Observable<RevocationCheckResponse>;
}

export interface CredentialRevocationController {
  check(
    request: RevocationCheckRequest,
  ): Promise<RevocationCheckResponse> | Observable<RevocationCheckResponse> | RevocationCheckResponse;
}

export function CredentialRevocationControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["check"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CredentialRevocation", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CredentialRevocation", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CREDENTIAL_REVOCATION_SERVICE_NAME = "CredentialRevocation";

export interface JwtClient {
  create(request: JwtCreationRequest): Observable<JwtCreationResponse>;
}

export interface JwtController {
  create(
    request: JwtCreationRequest,
  ): Promise<JwtCreationResponse> | Observable<JwtCreationResponse> | JwtCreationResponse;
}

export function JwtControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["create"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Jwt", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Jwt", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const JWT_SERVICE_NAME = "Jwt";
