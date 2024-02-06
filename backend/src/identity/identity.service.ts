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

@Injectable()
export class IdentityService implements OnModuleInit {
  private identityService: JwtClient;

  private readonly logger = new Logger(IdentityService.name);

  constructor(
    @Inject(CREDENTIALS_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.identityService = this.client.getService<JwtClient>(JWT_SERVICE_NAME);
  }

  async create(request: JwtCreationRequest): Promise<JwtCreationResponse> {
    this.logger.debug('Received JWTCreation request', request);

    try {
      const jwt = await lastValueFrom(
        this.identityService
          .create(request)
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
}
