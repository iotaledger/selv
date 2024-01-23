import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';
import { Cache } from 'cache-manager';

import { RedisCache } from 'cache-manager-redis-yet';
import { User } from 'src/users/interfaces/User';
import { WebAppGateway } from './webapp.gateway';
// import { User } from 'src/users/interfaces/User';

@Injectable()
export class WebAppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: RedisCache,
    @Inject(forwardRef(() => WebAppGateway))
    private webAppGateway: WebAppGateway,
  ) {}

  private readonly logger = new Logger(WebAppService.name);

  async requestOffer(session_id: string): Promise<string> {
    this.logger.debug(`receiving offer request for session_id:${session_id}`);

    const token = await this.requestTokenForSessionId(session_id);

    return token;
  }

  async requestTokenForSessionId(sessionId: string): Promise<string> {
    this.logger.debug(`request token for session_id:${sessionId}`);

    const token = uuidv4();

    await this.cache.set(`token:${token}`, sessionId);

    this.logger.debug(`generated token:${token} for session_id:${sessionId}`);

    return token;
  }

  async consumeToken(token: string): Promise<string> {
    this.logger.debug(`consuming token:${token}`);

    const session_id = await this.cache.get(`token:${token}`);

    this.logger.debug(`found session_id:${session_id} for token:${token}`);

    await this.cache.del(`token:${token}`);

    this.logger.debug(`cleared token:${token} for session_id:${session_id}`);

    return String(session_id);
  }

  async connectUser(user: User): Promise<void> {
    this.logger.debug(
      `connect user with did:${user.did} and code:${user.code}`,
    );
    const session_id = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${session_id} for code:${user.code}`);

    await this.cache.set(`user:${session_id}`, { did: user.did });
    this.logger.debug(`connected session_id:${session_id} with :${user.did}`);

    await this.webAppGateway.connectDid(session_id, user.did);
  }
}
