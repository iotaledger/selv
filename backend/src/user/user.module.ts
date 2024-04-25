import { Module, forwardRef } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { WebAppModule } from 'src/webapp/webapp.module';

@Module({
  imports: [forwardRef(() => WebAppModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
