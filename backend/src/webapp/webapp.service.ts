import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';

import { RedisCache } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { PresentationDefinitionV2 } from '../../../types/PresentationExchange';
import { IdentityService } from 'src/identity/identity.service';
import type { Issuers } from '../../../types/Issuers';
import { Scopes } from '../../../types/Scopes';
import { SIOPV2Service } from 'src/oid4vc/oid4vc.service';
import { User } from 'src/user/user';

@Injectable()
export class WebAppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: RedisCache,
    private readonly siopV2Service: SIOPV2Service,
    @Inject(forwardRef(() => WebAppGateway))
    private webAppGateway: WebAppGateway,
    @Inject(IdentityService)
    private readonly identityService: IdentityService,
  ) {}

  private readonly logger = new Logger(WebAppService.name);

  async requestSiopInvite(session_id: string): Promise<string> {
    this.logger.debug(
      `receiving SIOP invite request for session_id:${session_id}`,
    );

    const token = await this.requestTokenForSessionId(session_id);

    const siopResponse = await this.siopV2Service.createSIOPV2Request({
      state: token,
    });

    return siopResponse.uri;
  }

  async requestPresentation(
    session_id: string,
    presentationDefinition: PresentationDefinitionV2,
  ): Promise<string> {
    this.logger.debug(
      `receiving presentation request for session_id:${session_id}`,
      presentationDefinition,
    );

    //const token = await this.requestTokenForSessionId(session_id);
    //TODO replace with call against OID4VCI component using either a token or session_id
    const url = 'example.com';

    return url;
  }

  async requestIssuance(
    session_id: string,
    issuer: Issuers,
    credential: string,
  ): Promise<string> {
    this.logger.debug(
      `receiving issuance request for session_id:${session_id}`,
      issuer,
      credential,
    );

    //const token = await this.requestTokenForSessionId(session_id);

    //TODO replace with call against OID4VCI component using either a token or session_id
    const url = 'example.com';

    try {
      const signed_credential = await this.identityService.create(
        issuer,
        credential,
      );
      this.logger.debug('created credential', signed_credential);
    } catch (error) {
      this.logger.error(error);
    }

    return url;
  }

  async connectUser(user: User, scope: Scopes): Promise<void> {
    this.logger.debug(
      `connect user with did:${user.did} and code:${user.code}`,
    );
    const session_id = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${session_id} for code:${user.code}`);

    await this.cache.set(`user:${session_id}`, { did: user.did });
    this.logger.debug(`connected session_id:${session_id} with :${user.did}`);

    await this.webAppGateway.connectDid(session_id, user.did, scope);
  }

  async presentCredential(
    user: User,
    presentation: any,
    scope: Scopes,
  ): Promise<void> {
    this.logger.debug(
      `user with did:${user.did} and code:${user.code} presented`,
      presentation,
    );
    // TODO:
    // const session_id = await this.consumeToken(user.code);
    // this.logger.debug(`found session_id:${session_id} for code:${user.code}`);

    // await this.cache.set(`user:${session_id}`, { did: user.did });
    // this.logger.debug(`connected session_id:${session_id} with :${user.did}`);

    // await this.webAppGateway.connectDid(session_id, user.did, scope);
  }

  async requestCredential(
    user: User,
    credentials: any[],
    scope: Scopes,
  ): Promise<void> {
    this.logger.debug(
      `user with did:${user.did} and code:${user.code} requested`,
      credentials,
    );
    // TODO:
    // const session_id = await this.consumeToken(user.code);
    // this.logger.debug(`found session_id:${session_id} for code:${user.code}`);

    // await this.cache.set(`user:${session_id}`, { did: user.did });
    // this.logger.debug(`connected session_id:${session_id} with :${user.did}`);

    // await this.webAppGateway.connectDid(session_id, user.did, scope);
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
}
