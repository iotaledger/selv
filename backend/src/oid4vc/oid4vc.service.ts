import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import {
  OID4VC_PACKAGE_NAME,
  SIOPV2RequestConfig,
  SIOPV2Request,
  SIOPV2Client,
  S_IO_PV2_SERVICE_NAME,
} from './siopv2';
import { ConfigService } from '@nestjs/config';
import {
  OID4VPClient,
  OID4VPRequest,
  OID4VPRequestConfig,
  O_ID4_VP_SERVICE_NAME,
} from './oid4vp';
import {
  OID4VCIClient,
  O_ID4_VC_I_SERVICE_NAME,
  Offer,
  OfferConfig,
} from './oid4vci';
import { Providers } from '../../../shared/types/Providers';
import { OID4VCImpierceService } from './oid4vc-impierce.service';

//
// SIOP
//
@Injectable()
export class SIOPV2Service implements OnModuleInit {
  private siopV2Service: SIOPV2Client;

  private readonly logger = new Logger(SIOPV2Service.name);

  constructor(
    @Inject(OID4VC_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
    private readonly impierceService: OID4VCImpierceService,
  ) {}

  onModuleInit() {
    this.siopV2Service = this.client.getService<SIOPV2Client>(
      S_IO_PV2_SERVICE_NAME,
    );
  }

  async createSIOPV2Request(
    request: SIOPV2RequestConfig & { provider: Providers },
  ): Promise<string> {
    this.logger.debug('Received createSIOPV2Request request', request);

    switch (request.provider) {
      case Providers.TangleLabs:
        try {
          const buildRequest = await lastValueFrom(
            this.siopV2Service
              .createRequest(request)
              .pipe(
                timeout(
                  this.configService.get<number>('oid4vc_grpc_service_timeout'),
                ),
              ),
          );
          this.logger.debug('build request', buildRequest);
          return buildRequest.uri;
        } catch (error) {
          this.logger.error(error);
          throw error;
        }
      case Providers.Impierce:
        return await this.impierceService.createSIOPInvite(request);
    }
  }
}

//
// OID4VP
//
@Injectable()
export class OID4VPService implements OnModuleInit {
  private oid4vpService: OID4VPClient;

  private readonly logger = new Logger(OID4VPService.name);

  constructor(
    @Inject(OID4VC_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.oid4vpService = this.client.getService<OID4VPClient>(
      O_ID4_VP_SERVICE_NAME,
    );
  }

  async createOID4VPRequest(
    request: OID4VPRequestConfig & { provider: Providers },
  ): Promise<OID4VPRequest> {
    this.logger.debug('Received createOID4VPRequest request', request);

    switch (request.provider) {
      case Providers.TangleLabs:
        try {
          const buildRequest = await lastValueFrom(
            this.oid4vpService
              .createRequest(request)
              .pipe(
                timeout(
                  this.configService.get<number>('oid4vc_grpc_service_timeout'),
                ),
              ),
          );
          this.logger.debug('build request', buildRequest);
          return buildRequest;
        } catch (error) {
          this.logger.error(error);
          throw error;
        }
      case Providers.Impierce:
    }
  }
}

//
// OID4VCI
//
@Injectable()
export class OID4VCIService implements OnModuleInit {
  private oid4vciService: OID4VCIClient;

  private readonly logger = new Logger(OID4VCIService.name);

  constructor(
    @Inject(OID4VC_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.oid4vciService = this.client.getService<OID4VCIClient>(
      O_ID4_VC_I_SERVICE_NAME,
    );
  }

  async createOID4VCIRequest(
    request: OfferConfig & { provider: Providers },
  ): Promise<Offer> {
    this.logger.debug('Received createOID4VCIRequest request', request);
    switch (request.provider) {
      case Providers.TangleLabs:
        try {
          const buildRequest = await lastValueFrom(
            this.oid4vciService
              .createOffer(request)
              .pipe(
                timeout(
                  this.configService.get<number>('oid4vc_grpc_service_timeout'),
                ),
              ),
          );
          this.logger.debug('build request', buildRequest);
          return buildRequest;
        } catch (error) {
          this.logger.error(error);
          throw error;
        }
      case Providers.Impierce:
    }
  }
}
