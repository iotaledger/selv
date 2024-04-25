import { Controller, Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { User } from './interfaces/User';
import { WebAppService } from 'src/webapp/webapp.service';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserService } from './user.service';

@Injectable()
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly usersService: UserService) {}

  @GrpcMethod('UsersService', 'ConnectUser')
  async connectUser(
    user: User,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<User> {
    return await this.usersService.connectUser(user);
  }
}
