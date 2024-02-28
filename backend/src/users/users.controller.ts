import { Controller, Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from './interfaces/User';
import { WebAppService } from 'src/webapp/webapp.service';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UsersService } from './users.service';

@Injectable()
@Controller('user')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'ConnectUser')
  async connectUser(
    user: User,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<User> {
    return await this.usersService.connectUser(user);
  }
}
