import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import {
  OID4VC_PACKAGE_NAME,
  RequestConfig,
  Request,
  SIOPV2Client,
  S_IO_PV2_SERVICE_NAME,
} from './siopv2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SIOPV2Service implements OnModuleInit {
  private siopV2Service: SIOPV2Client;

  private readonly logger = new Logger(SIOPV2Service.name);

  constructor(
    @Inject(OID4VC_PACKAGE_NAME) private client: ClientGrpc,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    this.siopV2Service = this.client.getService<SIOPV2Client>(
      S_IO_PV2_SERVICE_NAME,
    );
  }

  async createRequest(request: RequestConfig): Promise<Request> {
    this.logger.debug('Received create request', request);
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
      return buildRequest;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
