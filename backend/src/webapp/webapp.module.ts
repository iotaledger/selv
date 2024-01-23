import { Module, forwardRef } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { WebAppService } from './webapp.service';
import { IdentityModule } from 'src/identity/identity.module';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 0, //no expiry
      // Store-specific configuration:
      url: 'redis://redis:6379',
    }),
    IdentityModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [],
  providers: [WebAppGateway, WebAppService],
  exports: [WebAppService],
})
export class WebAppModule {}
