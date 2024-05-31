import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { SIOPV2RequestConfig } from './siopv2';

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
}
