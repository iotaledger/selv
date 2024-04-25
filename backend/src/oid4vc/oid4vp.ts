/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Any } from "../google/protobuf/any";

export const protobufPackage = "oid4vc";

export interface OID4VPRequestConfig {
  presentationDefinition: Any | undefined;
  nonce?: string | undefined;
  state?: string | undefined;
}

export interface OID4VPRequest {
  uri: string;
  request: string;
}

export const OID4VC_PACKAGE_NAME = "oid4vc";

export interface OID4VPClient {
  createRequest(request: OID4VPRequestConfig): Observable<OID4VPRequest>;
}

export interface OID4VPController {
  createRequest(request: OID4VPRequestConfig): Promise<OID4VPRequest> | Observable<OID4VPRequest> | OID4VPRequest;
}

export function OID4VPControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createRequest"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OID4VP", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OID4VP", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const O_ID4_VP_SERVICE_NAME = "OID4VP";
