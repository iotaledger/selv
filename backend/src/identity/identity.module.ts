import { Module } from '@nestjs/common';

import { join } from 'path';

import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { IdentityService } from './identity.service';
import { CREDENTIALS_PACKAGE_NAME } from './credentials';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  controllers: [],
  providers: [
    IdentityService,
    {
      provide: CREDENTIALS_PACKAGE_NAME,
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: ['credentials', 'presentation', 'domain_linkage', 'utils'],
            url: configService.getOrThrow('grpc_service_url'),
            protoPath: [
              join(
                configService.getOrThrow('grpc_service_protopath'),
                'presentation.proto',
              ),
              join(
                configService.getOrThrow('grpc_service_protopath'),
                'credentials.proto',
              ),
              join(
                configService.getOrThrow('grpc_service_protopath'),
                'domain_linkage.proto',
              ),
              join(
                configService.getOrThrow('grpc_service_protopath'),
                'utils.proto',
              ),
            ],
          },
        }),
      inject: [ConfigService],
    },
  ],
  exports: [IdentityService],
})
export class IdentityModule {}
