import { Controller, Injectable, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { UserService } from './user.service';
import {
  CredentialPresentation,
  CredentialRequest,
  CredentialResponse,
  User,
} from './user';

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

  @GrpcMethod('UsersService', 'PresentCredential')
  async presentCredential(
    request: CredentialPresentation,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<CredentialPresentation> {
    return await this.usersService.presentCredential(request);
  }

  @GrpcMethod('UsersService', 'RequestCredential')
  async requestCredential(
    request: CredentialRequest,
    metadata: Metadata,
    call: ServerUnaryCall<any, any>,
  ): Promise<CredentialResponse> {
    return await this.usersService.requestCredential(request);
  }
}
