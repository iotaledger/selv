/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Any } from "../google/protobuf/any";
import { Empty } from "../google/protobuf/empty";

export const protobufPackage = "oid4vc";

export interface RequestConfig {
  presentationDefinition: Any | undefined;
  nonce?: string | undefined;
  state?: string | undefined;
}

export interface Request {
  uri: string;
  request: string;
}

export interface AuthRequest {
  idToken?: string | undefined;
  vpToken?: string | undefined;
  issuerState?: string | undefined;
  presentationSubmission?: Any | undefined;
}

export interface AuthTokenRequest {
  did: string;
}

export interface Token {
  token: string;
}

export const OID4VC_PACKAGE_NAME = "oid4vc";

export interface SIOPV2Client {
  createRequest(request: RequestConfig): Observable<Request>;

  verifyAuthResponse(request: AuthRequest): Observable<Empty>;

  createAuthToken(request: AuthTokenRequest): Observable<Token>;
}

export interface SIOPV2Controller {
  createRequest(request: RequestConfig): Promise<Request> | Observable<Request> | Request;

  verifyAuthResponse(request: AuthRequest): void;

  createAuthToken(request: AuthTokenRequest): Promise<Token> | Observable<Token> | Token;
}

export function SIOPV2ControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createRequest", "verifyAuthResponse", "createAuthToken"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SIOPV2", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SIOPV2", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const S_IO_PV2_SERVICE_NAME = "SIOPV2";
