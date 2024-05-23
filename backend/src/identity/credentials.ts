/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "credentials";

/** The States a credential can be in. */
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

export interface VcValidationRequest {
  /** JWT encoded credential. */
  credentialJwt: string;
  /**
   * JSON encoded `StatusList2021Credential`, used for status checking.
   * If missing, status checking will be performed with `RevocationBitmap2022`.
   */
  statusListCredentialJson?: string | undefined;
}

export interface VcValidationResponse {
  /** JSON encoded credential (extracted from request's JWT). */
  credentialJson: string;
}

export const CREDENTIALS_PACKAGE_NAME = "credentials";

export interface CredentialRevocationClient {
  /** Checks whether a credential has been revoked with `RevocationBitmap2022`. */

  check(request: RevocationCheckRequest): Observable<RevocationCheckResponse>;
}

export interface CredentialRevocationController {
  /** Checks whether a credential has been revoked with `RevocationBitmap2022`. */

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
  /** Encodes a given JSON credential into JWT, using the issuer's fragment to fetch the key from stronghold. */

  create(request: JwtCreationRequest): Observable<JwtCreationResponse>;
}

export interface JwtController {
  /** Encodes a given JSON credential into JWT, using the issuer's fragment to fetch the key from stronghold. */

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

export interface VcValidationClient {
  /** Performs encoding, syntax, signature, time constraints and status checking on the provided credential. */

  validate(request: VcValidationRequest): Observable<VcValidationResponse>;
}

export interface VcValidationController {
  /** Performs encoding, syntax, signature, time constraints and status checking on the provided credential. */

  validate(
    request: VcValidationRequest,
  ): Promise<VcValidationResponse> | Observable<VcValidationResponse> | VcValidationResponse;
}

export function VcValidationControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("VcValidation", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("VcValidation", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const VC_VALIDATION_SERVICE_NAME = "VcValidation";
