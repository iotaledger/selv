/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "presentation";

export interface JwtPresentationRequest {
  /** Presentation's compact JWT serialization. */
  jwt: string;
}

export interface CredentialValidationResult {
  credential?: string | undefined;
  error?: string | undefined;
}

export interface JwtPresentationResponse {
  credentials: CredentialValidationResult[];
}

export const PRESENTATION_PACKAGE_NAME = "presentation";

export interface CredentialPresentationClient {
  validate(request: JwtPresentationRequest): Observable<JwtPresentationResponse>;
}

export interface CredentialPresentationController {
  validate(
    request: JwtPresentationRequest,
  ): Promise<JwtPresentationResponse> | Observable<JwtPresentationResponse> | JwtPresentationResponse;
}

export function CredentialPresentationControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["validate"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("CredentialPresentation", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("CredentialPresentation", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const CREDENTIAL_PRESENTATION_SERVICE_NAME = "CredentialPresentation";
