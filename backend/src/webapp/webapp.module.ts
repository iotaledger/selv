import { Module, forwardRef } from '@nestjs/common';

import { CacheModule } from '@nestjs/cache-manager';

import { redisStore } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { WebAppService } from './webapp.service';
import { IdentityModule } from 'src/identity/identity.module';
import { UserModule } from 'src/user/user.module';
import { OID4VCModule } from 'src/oid4vc/oid4vc.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 0, //no expiry
      // Store-specific configuration:
      url: 'redis://valkey:6379',
    }),
    IdentityModule,
    OID4VCModule,
    forwardRef(() => UserModule),
  ],
  controllers: [],
  providers: [WebAppGateway, WebAppService],
  exports: [WebAppService],
})
export class WebAppModule {}
