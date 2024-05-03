/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "oid4vc";

export interface OfferConfig {
  credentials: string[];
  nonce?: string | undefined;
  state?: string | undefined;
}

export interface Offer {
  uri: string;
  offer: string;
}

export const OID4VC_PACKAGE_NAME = "oid4vc";

export interface OID4VCIClient {
  createOffer(request: OfferConfig): Observable<Offer>;
}

export interface OID4VCIController {
  createOffer(request: OfferConfig): Promise<Offer> | Observable<Offer> | Offer;
}

export function OID4VCIControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createOffer"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OID4VCI", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OID4VCI", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const O_ID4_VC_I_SERVICE_NAME = "OID4VCI";
