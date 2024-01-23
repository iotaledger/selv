import { Module, forwardRef } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { WebAppModule } from 'src/webapp/webapp.module';

@Module({
  imports: [forwardRef(() => WebAppModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
