import { Module, forwardRef } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { WebAppService } from './webapp.service';
import { IdentityModule } from 'src/identity/identity.module';
import { UsersModule } from 'src/users/user.module';
import { OID4VCModule } from 'src/oid4vc/oid4vc.module';

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
    OID4VCModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [],
  providers: [WebAppGateway, WebAppService],
  exports: [WebAppService],
})
export class WebAppModule {}
