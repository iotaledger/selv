import { Injectable, Logger } from '@nestjs/common';
import { User } from './interfaces/User';
import { WebAppService } from 'src/webapp/webapp.service';
import { Scopes } from '../../../types/Scopes';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly webAppService: WebAppService) {}

  async connectUser(user: User): Promise<User> {
    this.logger.debug(
      `User with did:${user.did} and code:${user.code} connected`,
    );
    //TODO: manage scope
    await this.webAppService.connectUser(user, Scopes.CompanyHouse);
    return user;
  }
}
