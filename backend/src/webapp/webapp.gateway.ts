import { v4 as uuidv4 } from 'uuid';
import { Logger, Injectable, Inject, forwardRef } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebAppService } from './webapp.service';
import type { PresentationDefinitionV2 } from '../../../shared/types/PresentationExchange';
import { Issuers } from '../../../shared/types/Issuers';
import { Scopes } from '../../../shared/types/Scopes';
import { Providers } from '../../../shared/types/Providers';

@Injectable()
@WebSocketGateway()
export class WebAppGateway {
  constructor(
    @Inject(forwardRef(() => WebAppService))
    private webAppService: WebAppService,
  ) {}

  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebAppGateway.name);
  private connectedClients = new Map<string, { client: Socket }>();

  async handleConnection(client: any) {
    this.logger.debug('new connection received');

    const session_id = uuidv4();
    this.logger.debug(`generated session_id:${session_id}`);

    this.connectedClients.set(session_id, {
      client,
    });

    this.logger.debug(`added session_id:${session_id} to connected clients`);
  }

  handleDisconnect(client: any) {
    this.logger.debug(client);

    const connectedClient = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];
    this.connectedClients.delete(connectedClient);
  }

  findClient(session_id: string): Socket {
    const connectedClient = this.connectedClients.get(session_id);
    if (connectedClient) {
      return connectedClient.client;
    } else {
      this.logger.error(`could not find client for ${session_id}`);
    }
  }

  @SubscribeMessage('requestSiopInvite')
  async requestSignIn(
    @MessageBody()
    payload: {
      provider: Providers;
      scope: Scopes;
    },
    @ConnectedSocket() client: Socket,
  ) {
    // TODO: handle provider

    const session_id = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];

    this.logger.debug(
      `receiving SIOPV2 invite request for session_id:${session_id}, provider:${payload.provider} and scope:${payload.scope}`,
    );

    const url = await this.webAppService.requestSiopInvite(
      session_id,
      payload.scope,
      payload.provider,
    );
    await client.emitWithAck('siopInvite', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send SIOPV2 invite for session_id:${session_id}`);
  }

  @SubscribeMessage('requestPresentation')
  async requestPresentation(
    @MessageBody()
    payload: {
      scope: Scopes;
      presentationDefinition: PresentationDefinitionV2;
      provider: Providers;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const session_id = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];

    this.logger.debug(
      `receiving presentation request for session_id:${session_id}, provider:${payload.provider}, scope:${payload.scope} and presentationDefinition`,
      payload.presentationDefinition,
    );

    const url = await this.webAppService.requestPresentation(
      session_id,
      payload.presentationDefinition,
      payload.scope,
      payload.provider,
    );

    await client.emitWithAck('presentationOffer', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send presentation offer for session_id:${session_id}`);
  }

  @SubscribeMessage('requestIssuance')
  async requestIssuance(
    @MessageBody()
    payload: {
      issuer: Issuers;
      scope: Scopes;
      credentials: { type: string; data?: any }[];
      provider: Providers;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const session_id = [...this.connectedClients].find(
      ([key, value]) => value.client === client,
    )[0];

    this.logger.debug(
      `receiving issuance request for session_id:${session_id}, provider:${payload.provider} and scope:${payload.scope}`,
      payload,
    );

    const url = await this.webAppService.requestIssuance(
      session_id,
      payload.issuer,
      payload.credentials,
      payload.scope,
      payload.provider,
    );

    await client.emitWithAck('issuanceOffer', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send issuance offer for session_id:${session_id}`);
  }

  @SubscribeMessage('requestDomainLinkageValidation')
  async requestDomainLinkageValidation(
    @MessageBody()
    payload: {
      did: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(
      `receiving DomainLinkageValidation request for did :${payload.did}`,
      payload,
    );

    const validation = await this.webAppService.requestDomainLinkageValidation(
      payload.did,
    );

    await client.emitWithAck('didDomainLinkageValidation', {
      did: payload.did,
      result: validation.domains,
    });

    this.logger.debug(`send validation response for did:${payload.did}`);
  }

  @SubscribeMessage('requestDIDParsing')
  async requestDIDParsing(
    @MessageBody()
    payload: {
      did: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug(
      `receiving DIDParsing request for did :${payload.did}`,
      payload,
    );

    const result = await this.webAppService.requestDIDParsing(payload.did);

    await client.emitWithAck('parsedDID', {
      did: payload.did,
      result,
    });

    this.logger.debug(`send parsing response for did:${payload.did}`);
  }

  async connectDid(session_id: string, did: string, scope: Scopes) {
    const connectedClient = this.findClient(session_id);

    if (!connectedClient) {
      return;
    }

    connectedClient.emitWithAck('connectDid', {
      did,
      scope,
    });
  }

  async presentation(session_id: string, credential: any, scope: Scopes) {
    const connectedClient = this.findClient(session_id);

    if (!connectedClient) {
      return;
    }

    connectedClient.emitWithAck('presentation', { credential, scope });
  }

  async issuance(session_id: string, data: any, scope: Scopes) {
    const connectedClient = this.findClient(session_id);

    if (!connectedClient) {
      return;
    }

    connectedClient.emitWithAck('issuance', { data, scope });
  }
}
