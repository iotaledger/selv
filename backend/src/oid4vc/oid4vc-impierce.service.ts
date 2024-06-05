import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SIOPV2RequestConfig } from './siopv2';
import { OID4VPRequestConfig } from './oid4vp';
import { OfferConfig } from './oid4vci';

@Injectable()
export class OID4VCImpierceService {
  private readonly logger = new Logger(OID4VCImpierceService.name);

  constructor(private readonly httpService: HttpService) {}

  async createSIOPInvite(request: SIOPV2RequestConfig): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .post<string>(
          'http://oid4vc-impierce:3033/v1/authorization_requests',
          {
            nonce: 'test', // TODO: remove or replace with proper nonce
            state: request.state,
          },
          {
            responseType: 'formdata',
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return response.data;
  }

  async createOID4VPInvite(request: OID4VPRequestConfig): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .post<string>(
          'http://oid4vc-impierce:3033/v1/authorization_requests',
          {
            nonce: 'test', // TODO: remove or replace with proper nonce
            state: request.state,
            presentation_definition_id: 'selv_presentation_definition', // TODO: request.presentationDefinition
          },
          {
            responseType: 'formdata',
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return response.data;
  }

  async createOID4VCIInvite(request: OfferConfig): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .post<string>(
          'http://oid4vc-impierce:3033/v1/offers',
          {
            offerId: request.state,
          },
          {
            responseType: 'formdata',
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return response.data;
  }

  async submitSignedCredential(
    offer_id: string,
    credential: string,
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .post<string>('http://oid4vc-impierce:3033/v1/credentials', {
          offerId: offer_id,
          credential: credential,
          isSigned: true,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    return response.data;
  }
}
