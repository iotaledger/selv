import { Module } from '@nestjs/common';

import { join } from 'path';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { IdentityService } from './identity.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IDENTITY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'credentials',
          url: 'identity:50051',
          protoPath: join(
            __dirname,
            '..',
            '..',
            '..',
            'proto',
            'identity/credentials.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [],
  providers: [IdentityService],
  exports: [IdentityService],
})
export class IdentityModule {}
