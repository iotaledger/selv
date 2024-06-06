import { Module } from '@nestjs/common';

import { join } from 'path';

import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { OID4VCIService, OID4VPService, SIOPV2Service } from './oid4vc.service';
import { OID_4_VC_PACKAGE_NAME } from './siopv2';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';
import { OID4VCImpierceService } from './oid4vc-impierce.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forFeature(configuration), HttpModule], //TODO: figure out https://docs.nestjs.com/fundamentals/dynamic-modules#config-module-example
  controllers: [],
  providers: [
    SIOPV2Service,
    OID4VPService,
    OID4VCIService,
    {
      provide: OID_4_VC_PACKAGE_NAME,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['oid4vc'],
            url: configService.getOrThrow('oid4vc_grpc_service_url'),
            protoPath: [
              join(
                configService.getOrThrow('oid4vc_grpc_service_protopath'),
                'siopv2.proto',
              ),
              join(
                configService.getOrThrow('oid4vc_grpc_service_protopath'),
                'oid4vp.proto',
              ),
              join(
                configService.getOrThrow('oid4vc_grpc_service_protopath'),
                'oid4vci.proto',
              ),
            ],
          },
        }),
      inject: [ConfigService],
    },
    OID4VCImpierceService,
  ],
  exports: [
    SIOPV2Service,
    OID4VPService,
    OID4VCIService,
    OID4VCImpierceService,
  ],
})
export class OID4VCModule {}
