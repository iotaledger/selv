import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';

import { RedisCache } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { PresentationDefinitionV2 } from '../../../types/PresentationExchange';
import { IdentityService } from 'src/identity/identity.service';
import type { Issuers } from '../../../types/Issuers';
import { Scopes } from '../../../types/Scopes';
import {
  OID4VCIService,
  OID4VPService,
  SIOPV2Service,
} from 'src/oid4vc/oid4vc.service';
import { User } from 'src/user/user';

@Injectable()
export class WebAppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: RedisCache,
    private readonly siopV2Service: SIOPV2Service,
    private readonly oid4vpService: OID4VPService,
    private readonly oid4vciService: OID4VCIService,
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

    const token = await this.requestTokenForSessionId(session_id);

    const siopResponse = await this.oid4vpService.createOID4VPRequest({
      state: token,
      presentationDefinition: presentationDefinition,
    });

    return siopResponse.uri;
  }

  async requestIssuance(
    session_id: string,
    issuer: Issuers,
    credentials: string[],
  ): Promise<string> {
    this.logger.debug(
      `receiving issuance request for session_id:${session_id}`,
      issuer,
      credentials,
    );

    const token = await this.requestTokenForSessionId(session_id);

    const offer = await this.oid4vciService.createOID4VPRequest({
      state: token,
      credentials,
    });

    // try {
    //   const signed_credential = await this.identityService.create(
    //     issuer,
    //     credential,
    //   );
    //   this.logger.debug('created credential', signed_credential);
    // } catch (error) {
    //   this.logger.error(error);
    // }

    this.logger.debug(`created offfer for:${session_id}`, offer);

    return offer.uri;
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

    const session_id = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${session_id} for code:${user.code}`);

    this.logger.debug(
      `presented credential for session_id:${session_id} with :${user.did}`,
      presentation,
    );

    const validationResponse =
      await this.identityService.validatePresentation(presentation);

    this.logger.debug(`validation response`, validationResponse);

    await this.webAppGateway.presentation(session_id, presentation, scope);
  }

  async requestCredential(
    user: User,
    credentialIdentifier: string,
    scope: Scopes,
  ): Promise<void> {
    this.logger.debug(
      `user with did:${user.did} and code:${user.code} requested`,
      credentialIdentifier,
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
