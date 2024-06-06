import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';

import { RedisCache } from 'cache-manager-redis-yet';
import { WebAppGateway } from './webapp.gateway';
import { PresentationDefinitionV2 } from '../../../shared/types/PresentationExchange';
import { IdentityService } from 'src/identity/identity.service';
import { Issuers } from '../../../shared/types/Issuers';
import { Scopes } from '../../../shared/types/Scopes';
import {
  OID4VCIService,
  OID4VPService,
  SIOPV2Service,
} from 'src/oid4vc/oid4vc.service';
import { User } from 'src/user/user';

import * as CitizenCredentialConfig from '../../../shared/credentials/CitizenCredential.json';
import * as CompanyCredentialConfig from '../../../shared/credentials/CompanyCredential.json';
import { Providers } from '../../../shared/types/Providers';

type Token = {
  sessionId: string;
  scope: Scopes;
};

@Injectable()
export class WebAppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: RedisCache,
    private readonly siopV2Service: SIOPV2Service,
    private readonly oid4vpService: OID4VPService,
    private readonly oid4vciService: OID4VCIService,
    @Inject(forwardRef(() => WebAppGateway))
    private webAppGateway: WebAppGateway,
    @Inject(IdentityService) private readonly identityService: IdentityService,
  ) {}

  private readonly logger = new Logger(WebAppService.name);

  async requestSiopInvite(
    session_id: string,
    scope: Scopes,
    provider: Providers,
  ): Promise<string> {
    this.logger.debug(
      `receiving SIOP invite request for scope:${scope}, session_id:${session_id} via provider:${provider}`,
    );

    const token = await this.requestTokenForSessionId(session_id, scope);

    const siopResponse = await this.siopV2Service.createSIOPV2Request({
      state: token,
      provider,
    });

    return siopResponse;
  }

  async requestPresentation(
    session_id: string,
    presentationDefinition: PresentationDefinitionV2,
    scope: Scopes,
    provider: Providers,
  ): Promise<string> {
    this.logger.debug(
      `receiving presentation request for scope:${scope}, session_id:${session_id} via provider:${provider}`,
      presentationDefinition,
    );

    const token = await this.requestTokenForSessionId(session_id, scope);

    const siopResponse = await this.oid4vpService.createOID4VPRequest({
      state: token,
      presentationDefinition: presentationDefinition,
      provider,
    });

    return siopResponse;
  }

  async requestIssuance(
    session_id: string,
    issuer: Issuers,
    credentials: string[],
    scope: Scopes,
    provider: Providers,
  ): Promise<string> {
    this.logger.debug(
      `receiving issuance request for scope:${scope}, session_id:${session_id} with issuer:${issuer} via provider:${provider}`,
      credentials,
    );

    //TODO: handle issuer

    const token = await this.requestTokenForSessionId(session_id, scope);

    const offer = await this.oid4vciService.createOID4VCIRequest({
      state: token,
      credentials,
      provider,
    });

    this.logger.debug(`created offer for:${session_id}`, offer);

    return offer;
  }

  async connectUser(user: User): Promise<void> {
    this.logger.debug(
      `connect user with did:${user.did} and code:${user.code}`,
    );
    const { sessionId, scope } = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${sessionId} for code:${user.code}`);

    await this.cache.set(`user:${user.did}`, { sessionId });
    this.logger.debug(`connected session_id:${sessionId} with :${user.did}`);

    await this.webAppGateway.connectDid(sessionId, user.did, scope);
  }

  async presentCredential(user: User, presentation: string): Promise<void> {
    this.logger.debug(
      `user with did:${user.did} and code:${user.code} presented`,
      presentation,
    );

    const { sessionId, scope } = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${sessionId} for code:${user.code}`);

    this.logger.debug(
      `presented credential for session_id:${sessionId} with :${user.did}`,
      presentation,
    );

    const validationResponse =
      await this.identityService.validatePresentation(presentation);

    this.logger.debug(`validation response`, validationResponse);

    // TODO check validation response

    await this.webAppGateway.presentation(
      sessionId,
      JSON.parse(validationResponse.credentials[0].credential), //TODO handle multiple credentials
      scope,
    );
  }

  async requestCredential(
    user: User,
    credentialDefinition: any,
  ): Promise<[string]> {
    this.logger.debug(
      `user with did:${user.did} and code:${user.code} requested`,
      credentialDefinition,
    );

    const { sessionId, scope } = await this.consumeToken(user.code);
    this.logger.debug(`found session_id:${sessionId} for code:${user.code}`);

    //TODO: get issuer (from session token, maybe?)
    const issuer = Issuers.Bank;

    //TODO: get credential (from TBD config via credential definition)
    const credential_template =
      credentialDefinition === 'company'
        ? CompanyCredentialConfig.template
        : CitizenCredentialConfig.template;

    credential_template.credentialSubject.id = user.did;

    await this.webAppGateway.issuance(sessionId, user.did, scope);

    try {
      const signed_credential = await this.identityService.create(
        issuer,
        JSON.stringify(credential_template),
      );
      this.logger.debug('created credential', signed_credential.jwt);
      return [signed_credential.jwt];
    } catch (error) {
      this.logger.error(error);
    }
  }

  async requestTokenForSessionId(
    sessionId: string,
    scope: Scopes,
  ): Promise<string> {
    this.logger.debug(`request token for session_id:${sessionId}`);

    const token = uuidv4();

    await this.cache.set(`token:${token}`, { sessionId, scope });

    this.logger.debug(`generated token:${token} for session_id:${sessionId}`);

    return token;
  }

  async consumeToken(token: string): Promise<Token> {
    this.logger.debug(`consuming token:${token}`);

    const tokenVal = (await this.cache.get(`token:${token}`)) as Token;

    this.logger.debug(`found entry:${tokenVal} for token:${token}`);

    await this.cache.del(`token:${token}`);

    this.logger.debug(`cleared token:${token} for entry:${tokenVal.sessionId}`);

    return tokenVal;
  }
}
