// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.176.1
//   protoc               v3.12.4
// source: identity/utils.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "utils";

export interface DataSigningRequest {
  /** Raw data that will be signed. */
  data: Uint8Array;
  /** Signing key's ID. */
  keyId: string;
  /** Key type of the key with id `key_id`. Valid values are: Ed25519, ES256, ES256K. */
  keyType: string;
}

export interface DataSigningResponse {
  /** Raw data signature. */
  signature: Uint8Array;
}

export interface DidJwkResolutionRequest {
  /** did:jwk string */
  did: string;
}

export interface DidJwkResolutionResponse {
  /** JSON DID Document */
  doc: string;
}

export interface IotaDidToAliasAddressRequest {
  did: string;
}

export interface IotaDidToAliasAddressResponse {
  aliasAddress: string;
  network: string;
}

export const UTILS_PACKAGE_NAME = "utils";

/** Service that handles signing operations on raw data. */

export interface SigningClient {
  sign(request: DataSigningRequest): Observable<DataSigningResponse>;
}

/** Service that handles signing operations on raw data. */

export interface SigningController {
  sign(
    request: DataSigningRequest,
  ): Promise<DataSigningResponse> | Observable<DataSigningResponse> | DataSigningResponse;
}

export function SigningControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["sign"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Signing", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Signing", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SIGNING_SERVICE_NAME = "Signing";

export interface DidJwkClient {
  resolve(request: DidJwkResolutionRequest): Observable<DidJwkResolutionResponse>;
}

export interface DidJwkController {
  resolve(
    request: DidJwkResolutionRequest,
  ): Promise<DidJwkResolutionResponse> | Observable<DidJwkResolutionResponse> | DidJwkResolutionResponse;
}

export function DidJwkControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["resolve"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("DidJwk", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("DidJwk", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const DID_JWK_SERVICE_NAME = "DidJwk";

export interface IotaUtilsClient {
  didIotaToAliasAddress(request: IotaDidToAliasAddressRequest): Observable<IotaDidToAliasAddressResponse>;
}

export interface IotaUtilsController {
  didIotaToAliasAddress(
    request: IotaDidToAliasAddressRequest,
  ): Promise<IotaDidToAliasAddressResponse> | Observable<IotaDidToAliasAddressResponse> | IotaDidToAliasAddressResponse;
}

export function IotaUtilsControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["didIotaToAliasAddress"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("IotaUtils", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("IotaUtils", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const IOTA_UTILS_SERVICE_NAME = "IotaUtils";