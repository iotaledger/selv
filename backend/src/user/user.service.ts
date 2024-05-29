import { Injectable, Logger } from '@nestjs/common';
import { WebAppService } from 'src/webapp/webapp.service';
import { Scopes } from '../../../shared/types/Scopes';
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
    //TODO: manage scope
    await this.webAppService.connectUser(user, Scopes.CompanyHouse);
    return user;
  }

  async presentCredential(
    presentation: CredentialPresentation,
  ): Promise<CredentialPresentation> {
    this.logger.debug(
      `User with did:${presentation.user.did} and code:${presentation.user.code} presented`,
      presentation.vp,
    );
    //TODO: manage scope
    await this.webAppService.presentCredential(
      presentation.user,
      presentation.vp,
      Scopes.CompanyHouse,
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
    //TODO: manage scope
    const signedCredentials = await this.webAppService.requestCredential(
      request.user,
      request.credentialDefinition,
      Scopes.CompanyHouse,
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
