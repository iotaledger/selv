import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '..', '..', 'proto', 'user/user.proto'),
      url: '0.0.0.0:5000',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
