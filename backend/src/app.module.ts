import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import * as cors from 'cors';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WebAppModule } from './webapp/webapp.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', '..', 'web', 'build'),
    }),
    WebAppModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
@Module({ controllers: [AppController] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors())
      //This one route will have its cors config overriden with the custom implementation
      .forRoutes({
        path: '.well-known/did-configuration.json',
        method: RequestMethod.GET,
      });
  }
}
