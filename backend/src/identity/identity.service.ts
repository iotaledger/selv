import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import {
  CREDENTIALS_PACKAGE_NAME,
  JWT_SERVICE_NAME,
  JwtClient,
  JwtCreationRequest,
  JwtCreationResponse,
} from './credentials';
import { ConfigService } from '@nestjs/config';
import { Issuers } from '../../../shared/types/Issuers';
import {
  CredentialPresentationClient,
  CREDENTIAL_PRESENTATION_SERVICE_NAME,
  JwtPresentationResponse,
} from './presentation';
import {
  DOMAIN_LINKAGE_SERVICE_NAME,
  DomainLinkageClient,
  ValidateDidResponse,
} from './domain_linkage';
import {
  IOTA_UTILS_SERVICE_NAME,
  IotaDidToAliasAddressResponse,
  IotaUtilsClient,
} from './utils';

@Injectable()
export class IdentityService implements OnModuleInit {
  private identityService: JwtClient;
  private presentationService: CredentialPresentationClient;
  private domainLinkageService: DomainLinkageClient;
  private utilsService: IotaUtilsClient;

  private readonly logger = new Logger(IdentityService.name);

  constructor(
    @Inject(CREDENTIALS_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.identityService = this.client.getService<JwtClient>(JWT_SERVICE_NAME);
    this.presentationService =
      this.client.getService<CredentialPresentationClient>(
        CREDENTIAL_PRESENTATION_SERVICE_NAME,
      );
    this.domainLinkageService = this.client.getService<DomainLinkageClient>(
      DOMAIN_LINKAGE_SERVICE_NAME,
    );
    this.utilsService = this.client.getService<IotaUtilsClient>(
      IOTA_UTILS_SERVICE_NAME,
    );
  }

  async create(
    issuer: Issuers,
    credential: string,
  ): Promise<JwtCreationResponse> {
    this.logger.debug('Received JWTCreation request', issuer, credential);

    try {
      console.log(
        issuer,
        this.configService.get<string>(`ISSUERS_${issuer}_DID`),
      );
      const issuerDid = this.configService.get<string>(`ISSUERS_${issuer}_DID`);
      const issuerFragment = this.configService.get<string>(
        `ISSUERS_${issuer}_FRAGMENT`,
      );
      const credentialJson = JSON.stringify({
        ...JSON.parse(credential),
        issuer: issuerDid,
      });

      const jwt = await lastValueFrom(
        this.identityService
          .create({
            credentialJson,
            issuerFragment,
          })
          .pipe(
            timeout(this.configService.get<number>('grpc_service_timeout')),
          ),
      );
      this.logger.debug('created credential', jwt);
      return jwt;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async validatePresentation(
    presentation: string,
  ): Promise<JwtPresentationResponse> {
    this.logger.debug('Received Presentation validation request', presentation);

    try {
      const response = await lastValueFrom(
        this.presentationService
          .validate({
            jwt: presentation,
          })
          .pipe(
            timeout(this.configService.get<number>('grpc_service_timeout')),
          ),
      );
      this.logger.debug('validation response', response);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async validateDIDDomainLinkage(did: string): Promise<ValidateDidResponse> {
    this.logger.debug('Received Domain Linkage validation request', did);

    try {
      const response = await lastValueFrom(
        this.domainLinkageService
          .validateDid({
            did,
          })
          .pipe(
            timeout(this.configService.get<number>('grpc_service_timeout')),
          ),
      );
      this.logger.debug('validation response', response);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async parseDID(did: string): Promise<IotaDidToAliasAddressResponse> {
    this.logger.debug('Received DID parsing request', did);

    try {
      const response = await lastValueFrom(
        this.utilsService
          .didIotaToAliasAddress({
            did,
          })
          .pipe(
            timeout(this.configService.get<number>('grpc_service_timeout')),
          ),
      );
      this.logger.debug('parsing response', response);
      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
