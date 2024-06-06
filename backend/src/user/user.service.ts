import { Injectable, Logger } from '@nestjs/common';
import { WebAppService } from 'src/webapp/webapp.service';

import {
  CredentialPresentation,
  CredentialRequest,
  CredentialResponse,
  User,
} from './user';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly webAppService: WebAppService) {}

  async connectUser(user: User): Promise<User> {
    this.logger.debug(
      `User with did:${user.did} and code:${user.code} connected`,
    );

    await this.webAppService.connectUser(user);
    return user;
  }

  async presentCredential(
    presentation: CredentialPresentation,
  ): Promise<CredentialPresentation> {
    this.logger.debug(
      `User with did:${presentation.user.did} and code:${presentation.user.code} presented`,
      presentation.vp,
    );

    await this.webAppService.presentCredential(
      presentation.user,
      presentation.vp,
    );
    return presentation;
  }

  async requestCredential(
    request: CredentialRequest,
  ): Promise<CredentialResponse> {
    this.logger.debug(
      `User with did:${request.user.did} and code:${request.user.code} requested`,
      request.credentialDefinition,
    );

    const signedCredentials = await this.webAppService.requestCredential(
      request.user,
      request.credentialDefinition,
    );

    const response = {
      signedCredentials,
    };
    this.logger.debug(
      `preparing response for user with did:${request.user.did} and code:${request.user.code}`,
      response,
    );

    return response;
  }
}
