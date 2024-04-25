import { v4 as uuidv4 } from 'uuid';
import { Logger, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebAppService } from './webapp.service';
import type { PresentationDefinitionV2 } from '../../../types/PresentationExchange';
import { Issuers } from '../../../types/Issuers';
import { Scopes } from '../../../types/Scopes';
import { Providers } from '../../../types/Providers';

@Injectable()
@WebSocketGateway()
export class WebAppGateway {
  constructor(private readonly webAppService: WebAppService) {}

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

    const url = await this.webAppService.requestSiopInvite(session_id);
    await client.emitWithAck('siopInvite', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send SIOPV2 invite for session_id:${session_id}`);

    // //TODO remove once OID4VCI component can call back
    // setTimeout(() => {
    //   this.connectDid(session_id, 'did:web:example.com', payload.scope);
    // }, 10000);
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
      `receiving presentation request for session_id:${session_id}, provider:${payload.provider} and scope:${payload.scope}`,
    );

    const url = await this.webAppService.requestPresentation(
      session_id,
      payload.presentationDefinition,
    );

    await client.emitWithAck('presentationOffer', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send presentation offer for session_id:${session_id}`);

    //TODO remove once OID4VCI component can call back
    setTimeout(() => {
      this.presentation(
        session_id,
        {
          vc: {
            '@context': [
              'https://www.w3.org/2018/credentials/v1',
              'https://www.w3.org/2018/credentials/examples/v1',
            ],
            id: 'http://example.edu/credentials/3732',
            type: ['VerifiableCredential', 'UniversityDegreeCredential'],
            issuer: 'https://example.edu/issuers/14',
            issuanceDate: '2010-01-01T19:23:24Z',
            credentialSubject: {
              id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
              degree: {
                type: 'BachelorDegree',
                name: 'Bachelor of Science and Arts',
              },
              firstName: 'Ben',
              lastName: 'Utzer',
              date: Date.now(),
              nationality: 'german',
              birthplace: 'Musterstadt',
              country: 'Germany',
              phone: '00-0000',
            },
            credentialSchema: {
              id: 'https://example.org/examples/degree.json',
              type: 'JsonSchemaValidator2018',
            },
          },
          iss: 'https://example.edu/issuers/14',
          nbf: 1262373804,
          jti: 'http://example.edu/credentials/3732',
          sub: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
        },
        payload.scope,
      );
    }, 10000);
  }

  @SubscribeMessage('requestIssuance')
  async requestIssuance(
    @MessageBody()
    payload: {
      issuer: Issuers;
      scope: Scopes;
      credential: string;
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
      payload.credential,
    );

    await client.emitWithAck('issuanceOffer', {
      url,
      scope: payload.scope,
    });

    this.logger.debug(`send issuance offer for session_id:${session_id}`);

    setTimeout(() => {
      this.issuance(session_id, {}, payload.scope);
    }, 10000);
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
